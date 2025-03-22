'use client';
import { useEffect, useRef } from 'react';

export function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Particle configuration
        const particleCount = 50;
        const particles: Particle[] = [];

        class Particle {
            x: number;
            y: number;
            radius: number;
            color: string;
            speed: number;
            directionX: number;
            directionY: number;
            opacity: number;

            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.radius = Math.random() * 2 + 1;
                this.color = `hsl(${Math.random() * 60 + 160}, 80%, 50%)`;
                this.speed = Math.random() * 0.5 + 0.2;
                this.directionX = Math.random() * 2 - 1;
                this.directionY = Math.random() * 2 - 1;
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.directionX * this.speed;
                this.y += this.directionY * this.speed;

                if (this.x < 0 || this.x > canvas.width) {
                    this.directionX = -this.directionX;
                }

                if (this.y < 0 || this.y > canvas.height) {
                    this.directionY = -this.directionY;
                }
            }

            draw() {
                if (!ctx) return;

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color.replace(')', `, ${this.opacity})`);
                ctx.fill();
            }
        }

        // Create particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Connect particles with lines if they're close enough
        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        if (!ctx) return;

                        const opacity = 1 - distance / 120;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(150, 150, 240, ${opacity * 0.2})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Animation loop
        function animate() {
            if (!ctx) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles
            for (const particle of particles) {
                particle.update();
                particle.draw();
            }

            connectParticles();
            requestAnimationFrame(animate);
        }

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full -z-10 opacity-40 dark:opacity-30"
            style={{ pointerEvents: 'none' }}
        />
    );
}
