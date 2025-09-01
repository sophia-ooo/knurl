import knurl from "knurl";

// ============================================================================
// SIMPLE PARTICLE SYSTEM WITH IMMEDIATE FEEDBACK
// ============================================================================

const MAX_PARTICLES = 200; // Hard cap for performance
const PARTICLE_LIFETIME = 300; // Frames before auto-despawn (~5 seconds at 60fps)
const PARTICLE_TYPES = {
  slow: { color: "rgba(0, 0, 0, 1)", speed: 1, size: 8 },
  fast: { color: "rgba(255, 0, 110, 1)", speed: 3, size: 5 },
  heavy: { color: "rgba(0, 102, 255, 1)", speed: 0.5, size: 12 },
};

// System parameters
const params = {
  gravity: 0.1,
  bounce: 0.8,
  friction: 0.99,
  spawnRate: 2, // particles per frame while mouse/touch down
  burstSize: 50, // burst creates 50 particles at once
};

// Create panel
const panel = knurl.create({
  id: "particles",
  type: "group",
  nodes: [
    {
      id: "total",
      type: "graph",
      label: "total",
      min: 0,
      max: MAX_PARTICLES,
    },
    {
      id: "velocity",
      type: "graph",
      label: "avg velocity",
      min: 0,
      max: 10,
    },
    {
      id: "collisions",
      type: "graph",
      label: "collisions/s",
    },
    {
      type: "group",
      label: "physics",
      expanded: true,
      nodes: [
        {
          id: "gravity",
          type: "range",
          label: "gravity",
          min: -0.5,
          max: 0.5,
          step: 0.01,
          value: params.gravity,
        },
        {
          id: "bounce",
          type: "range",
          label: "bounce",
          min: 0,
          max: 1,
          step: 0.01,
          value: params.bounce,
        },
        {
          id: "friction",
          type: "range",
          label: "friction",
          min: 0.9,
          max: 1,
          step: 0.001,
          value: params.friction,
        },
      ],
    },
    {
      type: "group",
      label: "spawn",
      expanded: true,
      nodes: [
        {
          id: "spawnRate",
          type: "range",
          label: "flow rate",
          min: 1,
          max: 5,
          step: 1,
          value: params.spawnRate,
        },
        {
          id: "spawnType",
          type: "toggle-group",
          label: "type",
          value: "slow",
          options: ["slow", "fast", "heavy"],
        },
        { type: "button", id: "burst", text: "💥" },
        { type: "button", id: "reset", text: "reset" },
      ],
    },
  ],
});

// ============================================================================
// PARTICLE CLASS
// ============================================================================

class Particle {
  constructor(x, y, type) {
    const config = PARTICLE_TYPES[type];
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * config.speed * 4;
    this.vy = (Math.random() - 0.5) * config.speed * 4;
    this.type = type;
    this.size = config.size;
    this.color = config.color;
    this.collided = false;
    this.age = 0;
  }

  update(canvas) {
    this.age++;

    // Auto-despawn after lifetime
    if (this.age > PARTICLE_LIFETIME) {
      return false;
    }

    // Apply physics
    this.vy += params.gravity;
    this.vx *= params.friction;
    this.vy *= params.friction;

    this.x += this.vx;
    this.y += this.vy;

    // Bounce off walls
    if (this.x - this.size < 0 || this.x + this.size > canvas.width) {
      this.x = Math.max(this.size, Math.min(canvas.width - this.size, this.x));
      this.vx *= -params.bounce;
    }

    if (this.y - this.size < 0 || this.y + this.size > canvas.height) {
      this.y = Math.max(this.size, Math.min(canvas.height - this.size, this.y));
      this.vy *= -params.bounce;

      // Extra damping on ground
      if (this.y + this.size >= canvas.height) {
        this.vx *= 0.9;
      }
    }

    // Remove if too slow and on ground
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed < 0.1 && this.y + this.size >= canvas.height - 1) {
      return false;
    }

    this.collided = false;
    return true;
  }

  checkCollision(other) {
    const dx = other.x - this.x;
    const dy = other.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const minDist = this.size + other.size;

    if (dist < minDist && dist > 0) {
      // Simple elastic collision
      const angle = Math.atan2(dy, dx);
      const targetX = this.x + Math.cos(angle) * minDist;
      const targetY = this.y + Math.sin(angle) * minDist;

      const ax = (targetX - other.x) * 0.1;
      const ay = (targetY - other.y) * 0.1;

      this.vx -= ax;
      this.vy -= ay;
      other.vx += ax;
      other.vy += ay;

      this.collided = true;
      other.collided = true;

      return true;
    }
    return false;
  }

  draw(ctx) {
    // Fade out near end of life
    const lifeFade =
      this.age > PARTICLE_LIFETIME * 0.8
        ? (PARTICLE_LIFETIME - this.age) / (PARTICLE_LIFETIME * 0.2)
        : 1;

    ctx.fillStyle = this.color.replace("1)", `${lifeFade})`);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();

    // Collision flash
    if (this.collided) {
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.8 * lifeFade})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  getSpeed() {
    return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
  }
}

// ============================================================================
// SIMULATION
// ============================================================================

let particles = [];
let collisionCount = 0;
let collisionHistory = [];
let isSpawning = false;
let spawnX = 0;
let spawnY = 0;

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const container = document.getElementById("canvas-container");
const prompt = document.getElementById("prompt");
container.appendChild(canvas);

const hidePrompt = () => prompt && prompt.remove();

const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

// Get coordinates from mouse or touch event
const getCoordinates = (e) => {
  const rect = canvas.getBoundingClientRect();

  if (e.touches && e.touches.length > 0) {
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
    };
  }

  // For mouse events, calculate position relative to canvas
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
};

const spawnParticles = (x, y, count, type) => {
  // Remove oldest particles if at cap
  while (particles.length + count > MAX_PARTICLES) {
    particles.shift();
  }

  // Spawn new particles with some spread
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const spread = Math.random() * 15;
    const px = x + Math.cos(angle) * spread;
    const py = y + Math.sin(angle) * spread;
    particles.push(new Particle(px, py, type));
  }
};

const animate = () => {
  // Clear completely - no trails
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Spawn particles while mouse/touch is down
  if (isSpawning) {
    const spawnType = panel.get().spawnType;
    spawnParticles(spawnX, spawnY, params.spawnRate, spawnType);
  }

  // Update particles
  particles = particles.filter((p) => p.update(canvas));

  // Check collisions
  let frameCollisions = 0;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      if (particles[i].checkCollision(particles[j])) {
        frameCollisions++;
      }
    }
  }

  // Track collision rate
  collisionHistory.push(frameCollisions);
  if (collisionHistory.length > 60) collisionHistory.shift(); // 1 second at 60fps
  const collisionsPerSecond = collisionHistory.reduce((a, b) => a + b, 0);

  // Draw particles
  particles.forEach((p) => p.draw(ctx));

  // Calculate average velocity
  const avgVelocity =
    particles.length > 0
      ? particles.reduce((sum, p) => sum + p.getSpeed(), 0) / particles.length
      : 0;

  // Update monitors
  panel.set(
    {
      total: particles.length,
      velocity: avgVelocity,
      collisions: collisionsPerSecond,
    },
    { silent: true }
  );

  requestAnimationFrame(animate);
};

// ============================================================================
// EVENT HANDLERS
// ============================================================================

// Update physics parameters
panel.subscribe((id, value) => {
  if (id in params) {
    params[id] = value;
  }
});

// Handle spawn type changes
let currentSpawnType = "slow";
panel.subscribe("spawnType", (value) => {
  currentSpawnType = value;
});

// Burst button - spawn many particles at once
panel.subscribe("burst", () => {
  hidePrompt();
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // Spawn a burst of all three types
  const burstPerType = Math.floor(params.burstSize / 3);
  spawnParticles(centerX, centerY, burstPerType, "slow");
  spawnParticles(centerX, centerY, burstPerType, "fast");
  spawnParticles(centerX, centerY, burstPerType, "heavy");
});

// Reset button - reset everything to initial state
panel.subscribe("reset", () => {
  particles = [];
  collisionHistory = [];

  // Reset ALL params to initial values
  params.gravity = 0.1;
  params.bounce = 0.8;
  params.friction = 0.99;
  params.spawnRate = 2;
  params.burstSize = 50;

  // Update panel to reflect reset values
  panel.set({
    gravity: 0.1,
    bounce: 0.8,
    friction: 0.99,
    spawnRate: 2,
    spawnType: "slow",
  });
});

// Mouse events
const startSpawning = (e) => {
  hidePrompt();
  isSpawning = true;
  const coords = getCoordinates(e);
  spawnX = coords.x;
  spawnY = coords.y;
};

const moveSpawn = (e) => {
  if (!isSpawning) return;
  e.preventDefault();
  const coords = getCoordinates(e);
  spawnX = coords.x;
  spawnY = coords.y;
};

const stopSpawning = () => {
  isSpawning = false;
};

// Mouse events
canvas.addEventListener("mousedown", startSpawning);
canvas.addEventListener("mousemove", moveSpawn);
canvas.addEventListener("mouseup", stopSpawning);
canvas.addEventListener("mouseout", stopSpawning);

// Touch events
canvas.addEventListener("touchstart", startSpawning, { passive: false });
canvas.addEventListener("touchmove", moveSpawn, { passive: false });
canvas.addEventListener("touchend", stopSpawning);
canvas.addEventListener("touchcancel", stopSpawning);

window.addEventListener("resize", resizeCanvas);

// Initialize
resizeCanvas();
animate();
