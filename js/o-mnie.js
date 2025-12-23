document.addEventListener('DOMContentLoaded', () => {
    // Inicjalizacja AOS, jeśli nie jest globalna
    if (typeof AOS !== 'undefined') {
        AOS.init({ once: true, duration: 800 });
    }

    const canvas = document.getElementById('omnie-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const mouse = {
        x: undefined,
        y: undefined,
        radius: 150 // Zwiększony promień interakcji
    };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });

    const primaryColor = '#6a11cb';
    const secondaryColor = '#2575fc';
    
    // Zmienne kolorów zależne od motywu
    let nodeColorRGB = '224, 224, 224';
    let lineColor = 'rgba(255, 255, 255, 0.05)';
    let isLightMode = document.body.classList.contains('light-mode');

    function updateThemeColors() {
        isLightMode = document.body.classList.contains('light-mode');
        nodeColorRGB = isLightMode ? '30, 30, 30' : '224, 224, 224';
        lineColor = isLightMode ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';
    }

    class Node {
        constructor(x, y, size) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.baseSize = size;
            this.brightness = 0; // Do efektu rozświetlenia
            this.decay = 0.02; // Szybkość zanikania blasku
        }

        draw() {
            let scale = 1;
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
                scale = 1 + (1 - distance / mouse.radius) * 2.5;
                this.brightness = Math.max(this.brightness, (1 - distance / mouse.radius));
            }

            const finalSize = this.size * scale;
            const colorBrightness = Math.min(1, this.brightness + 0.3);
            ctx.fillStyle = `rgba(${nodeColorRGB}, ${colorBrightness})`;

            ctx.beginPath();
            ctx.arc(this.x, this.y, finalSize, 0, Math.PI * 2);
            ctx.fill();
        }

        update() {
            if (this.brightness > 0) {
                this.brightness -= this.decay;
            } else {
                this.brightness = 0;
            }
        }
    }

    class Pulse {
        constructor(path) {
            this.path = path;
            this.progress = 0;
            this.speed = 0.015;
            this.color = Math.random() > 0.5 ? primaryColor : secondaryColor;
            this.tail = []; // Do przechowywania śladu
        }

        update() {
            this.progress += this.speed;
        }

        draw() {
            const { startNode, endNode } = this.path;
            const currentX = startNode.x + (endNode.x - startNode.x) * this.progress;
            const currentY = startNode.y + (endNode.y - startNode.y) * this.progress;
            
            // Dodaj pozycję do ogona
            this.tail.push({ x: currentX, y: currentY });
            if (this.tail.length > 15) {
                this.tail.shift();
            }

            // Rysuj ogon
            this.tail.forEach((pos, index) => {
                const opacity = (index / this.tail.length) * 0.5;
                ctx.fillStyle = `rgba(106, 27, 203, ${opacity})`;
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, index / 5, 0, Math.PI * 2);
                ctx.fill();
            });

            // Rysuj głowę impulsu
            const gradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, 8);
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(currentX, currentY, 8, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    let nodes = [];
    let paths = [];
    let pulses = [];

    function init() {
        nodes = [];
        paths = [];
        pulses = [];
        const gridSize = 60;
        for (let y = -gridSize; y < canvas.height + gridSize; y += gridSize) {
            for (let x = -gridSize; x < canvas.width + gridSize; x += gridSize) {
                const jitterX = (Math.random() - 0.5) * 30;
                const jitterY = (Math.random() - 0.5) * 30;
                nodes.push(new Node(x + jitterX, y + jitterY, 1.2));
            }
        }

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance > gridSize * 0.5 && distance < gridSize * 1.8) {
                    paths.push({ startNode: nodes[i], endNode: nodes[j] });
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Ustawienie mieszania kolorów dla lepszego efektu blasku
        if (isLightMode) {
            ctx.globalCompositeOperation = 'source-over';
        } else {
            ctx.globalCompositeOperation = 'lighter';
        }

        // Draw paths
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 0.5;
        paths.forEach(path => {
            ctx.beginPath();
            ctx.moveTo(path.startNode.x, path.startNode.y);
            ctx.lineTo(path.endNode.x, path.endNode.y);
            ctx.stroke();
        });

        // Draw nodes
        nodes.forEach(node => {
            node.update();
            node.draw();
        });

        // Update and draw pulses
        pulses.forEach((pulse, index) => {
            pulse.update();
            pulse.draw();
            if (pulse.progress >= 1) {
                pulse.path.endNode.brightness = 1; // Rozświetl węzeł docelowy
                pulses.splice(index, 1);
            }
        });

        // Create new pulses randomly
        if (paths.length > 0 && Math.random() < 0.3 && pulses.length < 40) {
            const randomPath = paths[Math.floor(Math.random() * paths.length)];
            pulses.push(new Pulse(randomPath));
        }

        requestAnimationFrame(animate);
    }

    init();
    animate();

    // Obserwator zmian klasy na body (dla przełączania motywu w czasie rzeczywistym)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') updateThemeColors();
        });
    });
    observer.observe(document.body, { attributes: true });

    // --- LOGIKA DLA ANIMOWANYCH STATYSTYK ---
    const statsSection = document.getElementById('liczby');
    if (statsSection) {
        const experienceSpan = document.getElementById('it-experience-years');
        if (experienceSpan) {
            const startYear = 2020;
            const currentYear = new Date().getFullYear();
            const experienceYears = currentYear - startYear;
            experienceSpan.setAttribute('data-target', experienceYears);
        }

        const counters = document.querySelectorAll('.stat-number');
        const speed = 200; // Prędkość animacji

        const animateCounter = (counter) => {
            const target = +counter.getAttribute('data-target');
            
            // Na urządzeniach mobilnych wyświetl od razu (optymalizacja i pewność działania)
            if (window.innerWidth <= 768) {
                counter.innerText = target.toLocaleString('pl-PL');
                return;
            }

            const inc = target / speed;

            let count = 0;

            const updateCount = () => {
                count += inc;
                if (count < target) {
                    counter.innerText = Math.ceil(count).toLocaleString('pl-PL');
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = target.toLocaleString('pl-PL');
                }
            };

            updateCount();
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    counters.forEach(animateCounter);
                    observer.unobserve(entry.target); // Obserwuj tylko raz
                }
            });
        }, {
            threshold: 0.1 // Zmniejszono próg, aby działało na wysokich sekcjach (mobile)
        });

        observer.observe(statsSection);
    }
});