document.addEventListener('DOMContentLoaded', function() {
    // Inicjalizacja AOS (Animate On Scroll) - globalna dla wszystkich stron
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000, // Czas trwania animacji
            once: true,     // Animacja uruchamia się tylko raz
        });
    }

    const header = document.querySelector('header');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('nav ul');
    const dropdowns = document.querySelectorAll('.dropdown');
    const themeToggle = document.getElementById('theme-checkbox');

    // --- LOGIKA PRZEŁĄCZANIA MOTYWU ---
    const applyTheme = (theme) => {
        if (theme === 'light') {
            document.body.setAttribute('data-theme', 'light');
            document.body.classList.add('light-mode');
            if (themeToggle) themeToggle.checked = true; // Zaznacz checkbox dla motywu jasnego
        } else {
            document.body.removeAttribute('data-theme');
            document.body.classList.remove('light-mode');
            if (themeToggle) themeToggle.checked = false; // Odznacz checkbox dla motywu ciemnego
        }
    };

    const toggleTheme = () => {
        const currentTheme = document.body.getAttribute('data-theme');
        if (currentTheme === 'light') {
            localStorage.setItem('theme', 'dark');
            applyTheme('dark');
        } else {
            localStorage.setItem('theme', 'light');
            applyTheme('light');
        }
    };

    if (themeToggle) {
        themeToggle.addEventListener('change', toggleTheme);
    }

    // Zastosuj zapisany motyw przy ładowaniu strony
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    applyTheme(savedTheme);

    // --- EFEKT PRZEWIJANIA NAGŁÓWKA ---
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    // Sprawdź stan na starcie
    handleScroll();

    // --- LOGIKA MOBILNEJ NAWIGACJI ---
    if (mobileNavToggle && navMenu) {
        mobileNavToggle.addEventListener('click', () => {
            navMenu.classList.toggle('nav-active');
            // Zmiana ikony hamburgera na "X" i z powrotem
            const icon = mobileNavToggle.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Zamykanie menu po kliknięciu w link (np. kotwice)
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                // Nie zamykaj menu, jeśli kliknięto w przełącznik dropdowna (obsługiwane osobno)
                if (window.innerWidth <= 992 && link.parentElement.classList.contains('dropdown')) return;

                navMenu.classList.remove('nav-active');
                const icon = mobileNavToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // --- LOGIKA ROZWIJANEGO MENU NA URZĄDZENIACH MOBILNYCH ---
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        link.addEventListener('click', function(e) {
            // Pozwól na kliknięcie tylko jeśli menu jest w trybie mobilnym
            if (window.innerWidth <= 992) {
                e.preventDefault();
                dropdown.classList.toggle('open');
            }
        });
    });

    // --- LOGIKA PASKA POSTĘPU CZYTANIA (TYLKO NA STRONACH WPISÓW) ---
    if (document.body.classList.contains('body-post')) {
        const progressBar = document.querySelector('.reading-progress-bar');
        const postContent = document.querySelector('.post-full-content');

        if (progressBar && postContent) {
            const updateProgressBar = () => {
                const contentRect = postContent.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                // Całkowita wysokość treści artykułu
                const totalHeight = contentRect.height;
                // Jak daleko od góry okna jest góra artykułu
                const topPosition = contentRect.top;

                // Obliczamy postęp tylko w obrębie artykułu
                const progress = ( (windowHeight - topPosition) / (totalHeight + windowHeight) ) * 100;
                
                // Ograniczamy wartość do przedziału 0-100
                const clampedProgress = Math.max(0, Math.min(100, progress));
                progressBar.style.width = `${clampedProgress}%`;
            };
            window.addEventListener('scroll', updateProgressBar);
        }
    }
});