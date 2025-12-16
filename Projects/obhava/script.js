// HTML elementlarini olib olamiz
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const statusElement = document.getElementById('status');
let model = null;
const modelParams = {
    flipHorizontal: true, // Agar kamerangiz o'ng/chapni teskari ko'rsatsa
    maxNumHands: 1,      // Bitta qo'lni kuzatish
    scoreThreshold: 0.7   // Qanchalik aniq bo'lsa, shuncha yaxshi
};

// Canvas o'lchamini videoga moslash
canvas.width = 640;
canvas.height = 480;

// --- Zarralar (Particles) mantig'i ---
const particles = [];
const PARTICLE_COUNT = 50;
const INFLUENCE_RADIUS = 80; // Qo'lning ta'sir doirasi

class Particle {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = { x: 0, y: 0 };
        this.friction = 0.95; // Silliqlash
        this.mass = 1;
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    }

    update(handX, handY) {
        // Zarrachani harakatlantirish
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;

        // Qo'l ta'siri (Tortishish effekti)
        if (handX !== null && handY !== null) {
            const dx = handX - this.x;
            const dy = handY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < INFLUENCE_RADIUS) {
                const angle = Math.atan2(dy, dx);
                const force = (INFLUENCE_RADIUS - distance) / INFLUENCE_RADIUS; // Yaqinroq bo'lsa, kuchliroq tortish
                const acceleration = force * 0.5 / this.mass; // Kuchlanishni massaga bo'lish

                this.velocity.x += Math.cos(angle) * acceleration;
                this.velocity.y += Math.sin(angle) * acceleration;
            }
        }

        this.draw();
    }
}

// Zarralarni boshlash
function initParticles() {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const radius = Math.random() * 3 + 1;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const color = `rgba(${Math.floor(Math.random() * 255)}, 150, 255, 0.8)`;
        particles.push(new Particle(x, y, radius, color));
    }
}

// --- Handtrack.js va Kamera Mantig'i ---

// Kamerani ishga tushirish
function startVideo() {
    handTrack.startVideo(video)
        .then(function(status) {
            if (status) {
                statusElement.innerText = "Kamera ishga tushdi. Qo'lingizni ko'rsating!";
                runDetection(); // Kuzatishni boshlash
            } else {
                statusElement.innerText = "Kamera ishga tushmadi. Ruxsatni tekshiring.";
            }
        });
}

// Modelni yuklash
handTrack.load(modelParams).then(lModel => {
    model = lModel;
    statusElement.innerText = "Model yuklandi. Kameraga ulanmoqda...";
    initParticles(); // Zarralarni yaratish
    startVideo();
});

// Qo'lni kuzatish funksiyasi
function runDetection() {
    model.detect(video).then(predictions => {
        // context.clearRect(0, 0, canvas.width, canvas.height); // Asosiy videoni o'chirish
        
        // Zarralar harakati uchun qo'l koordinatalari
        let handX = null;
        let handY = null;

        if (predictions.length > 0) {
            // Birinchi aniqlangan qo'lning bounding box (chegaraviy ramka) ni olamiz
            const bbox = predictions[0].bbox; 
            
            // Qo'lning markaziy koordinatasi (canvas o'lchamiga moslab)
            handX = bbox[0] + bbox[2] / 2;
            handY = bbox[1] + bbox[3] / 2;

            statusElement.innerText = `Qo'l aniqlandi! X: ${Math.round(handX)}, Y: ${Math.round(handY)}`;

            // Qo'lning chegaraviy ramkasini chizish (ixtiyoriy)
            // handTrack.renderPredictions(predictions, canvas, context, video);
        } else {
            statusElement.innerText = "Qo'l topilmadi...";
        }

        // Zarralarni yangilash va chizish
        context.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Orqa fonni tozalash (iz qoldirish uchun biroz shaffof qoldiramiz)
        context.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            // Handtrack.js video/canvas o'lchamini avtomatik moslaganligi sababli, 
            // to'g'ridan-to'g'ri HandX va HandY ni ishlatamiz.
            particle.update(handX, handY); 
        });

        requestAnimationFrame(runDetection); // Keyingi kadrni chaqirish
    });
}