import React from "react";

import Header from "./header";

import "../home.css";

document.addEventListener('DOMContentLoaded', () => {
    // Particle network
    const particleNetwork = document.getElementById('particle-network');
    const ctx = particleNetwork.getContext('2d');
    let particlesArray;

    particleNetwork.width = window.innerWidth;
    particleNetwork.height = window.innerHeight;

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 5 + 1;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.size > 0.2) this.size -= 0.1;
        }
        draw() {
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.strokeStyle = 'rgba(255,255,255,0.8)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
    }

    function init() {
        particlesArray = [];
        let numberOfParticles = (particleNetwork.height * particleNetwork.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            let x = Math.random() * particleNetwork.width;
            let y = Math.random() * particleNetwork.height;
            particlesArray.push(new Particle(x, y));
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, particleNetwork.width, particleNetwork.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }

    init();
    animateParticles();

    // Text animation
    const animatedTexts = document.querySelectorAll('.animated-text');
    animatedTexts.forEach((text, index) => {
        text.style.animationDelay = `${index * 0.2}s`;
    });
});

const Home = () => {
    return (
        <section className="home" id="home" >

            <Header />
            <main class="main-home">
                <div class="container-first flex flex-center">
                    <div class="container-second flex-column">
                        <h2 class="text-center animated-text">Welcome to Solve-Ease.</h2>
                        <p class="animated-text">Start with Purpose, Solve with Innovation, Succeed with Impact. Building Solutions for Real-World Challenges</p>
                        <div class="cta-buttons flex-center">
                            <a rel="noopener noreferrer"  href="https://github.com/solve-ease" class="btn btn-primary text-decor-none">Get Started</a>
                            <a rel="noopener noreferrer" href="https://github.com/solve-ease"  class="btn btn-secondary text-decor-none">Learn More</a>
                        </div>
                    </div>
                </div>
                <div class="floating-shapes">
                    <div class="shape shape1"></div>
                    <div class="shape shape2"></div>
                    <div class="shape shape3"></div>
                </div>
                <div class="particle-network" id="particle-network"></div>
            </main>
        </section>
    );
}

export default Home;
