document.addEventListener('DOMContentLoaded', function() {
    // Inicjalizacja Typed.js (efekt pisania) - tylko dla strony głównej
    if (document.getElementById('typed-text')) {
        const typed = new Typed('#typed-text', {
            strings: [
                'Full-Stack Developerem',
                'Front-End Developerem',
                'Informatykiem',
                'Entuzjastą AI',
                'Projektantem UI/UX'
            ],
            typeSpeed: 70,   // Prędkość pisania
            backSpeed: 30,   // Prędkość usuwania
            loop: true,      // Pętla
            backDelay: 1000, // Opóźnienie przed usunięciem tekstu
        });
    }

    // Inicjalizacja Particles.js (efekt cząsteczek w tle) - tylko dla strony głównej
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 80, // Ilość cząsteczek
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": { "value": "#ffffff" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5, "random": false },
                "size": { "value": 3, "random": true },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#ffffff",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 4,
                    "direction": "none",
                    "out_mode": "out"
                }
            },
            "interactivity": {
                "events": { "onhover": { "enable": true, "mode": "repulse" } }
            }
        });
    }
});