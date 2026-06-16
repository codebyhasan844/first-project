// ======================
// CANVAS SETUP
// ======================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);
window.addEventListener("mousemove", (e) => {

    mouse.x = e.x;
    mouse.y = e.y;

});


// ======================
// GLOBAL VARIABLES
// ======================

let particles = [];
let heartPoints = [];
let imagePoints = [];

let animationId;
let mouse = {
    x: null,
    y: null,
    radius: 120
};

// ======================
// PARTICLE CLASS
// ======================

class Particle {

    constructor(x, y, targetX, targetY) {

        this.x = x;
        this.y = y;

        this.targetX = targetX;
        this.targetY = targetY;

        this.size = Math.random() * 2.5 + 1.5;

        this.vx = 0;
        this.vy = 0;
    }
   update() {

    let dxTarget = this.targetX - this.x;
    let dyTarget = this.targetY - this.y;

    this.x += dxTarget * 0.03;
    this.y += dyTarget * 0.03;

    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > canvas.width) {
        this.vx *= -1;
    }

    if (this.y < 0 || this.y > canvas.height) {
        this.vy *= -1;
    }

    if (mouse.x && mouse.y) {

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;

        let distance = Math.sqrt(
            dx * dx + dy * dy
        );

        if (distance < mouse.radius) {

            this.x -= dx * 0.01;
            this.y -= dy * 0.01;

        }

    }

}

    draw() {

        ctx.beginPath();

        ctx.fillStyle = "#ff0033";

        ctx.shadowBlur = 25;
        ctx.shadowColor = "#ff0000";

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}


// ======================
// BACKGROUND
// ======================

function drawBackground() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ======================
// CREATE PARTICLES
// ======================

function createParticles() {

    particles = [];

    generateHeartPoints();

    const allPoints = [
        ...heartPoints,
        ...imagePoints
    ];

    allPoints.forEach(point => {

        particles.push(

            new Particle(

                Math.random() * canvas.width,
                Math.random() * canvas.height,

                point.x,
                point.y

            )

        );

    });

}

function generateHeartPoints() {

    heartPoints = [];

    const scale = 15;

    for (let t = 0; t < Math.PI * 2; t += 0.05) {

        const x =
            16 * Math.pow(Math.sin(t), 3);

        const y =
            13 * Math.cos(t)
            - 5 * Math.cos(2 * t)
            - 2 * Math.cos(3 * t)
            - Math.cos(4 * t);

   for (let offset = -8; offset <= 8; offset += 2) {

        heartPoints.push({

            x: canvas.width / 2 + x * scale + offset,

            y: canvas.height / 2 - y * scale

        });

    }

    }

}

function generateImagePoints() {

    const image = document.getElementById("coupleImage");

    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    const scale = 1.2;

    tempCanvas.width = image.width * scale;
    tempCanvas.height = image.height * scale;

    tempCtx.drawImage(
        image,
        0,
        0,
        tempCanvas.width,
        tempCanvas.height
    );

    const pixels = tempCtx.getImageData(
        0,
        0,
        tempCanvas.width,
        tempCanvas.height
    ).data;

    imagePoints = [];

    for (let y = 0; y < tempCanvas.height; y += 6) {

        for (let x = 0; x < tempCanvas.width; x += 6) {

            const index =
                (y * tempCanvas.width + x) * 4;

            const alpha = pixels[index + 3];

            if (alpha > 50) {

                imagePoints.push({

                    x:
                        canvas.width / 2 -
                        tempCanvas.width / 2 +
                        x,

                    y:
                        canvas.height / 2 -
                        tempCanvas.height / 2 +
                        y + 40

                });

            }

        }

    }

    console.log(
        "Image Points:",
        imagePoints.length
    );

}

// ======================
// ANIMATION LOOP
// ======================

function animate() {

    drawBackground();

    particles.forEach(particle => {

        particle.update();
        particle.draw();

    });

   ctx.save();

ctx.font = "bold 22px Arial";

ctx.textAlign = "center";

ctx.fillStyle = "rgba(255,255,255,0.9)";

ctx.shadowBlur = 15;
ctx.shadowColor = "#ff3366";

ctx.fillText(
    "Created by Hasan ✨",
    canvas.width / 2,
    canvas.height - 30
);

ctx.restore();

    requestAnimationFrame(animate);
}

window.onload = () => {

    console.log("Image Loaded");

    generateImagePoints();

    createParticles();

    animate();

};


// ======================
// DEBUG
// ======================

console.log("Canvas Initialized");
console.log("Width:", canvas.width);
console.log("Height:", canvas.height);