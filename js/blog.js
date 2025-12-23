document.addEventListener('DOMContentLoaded', function() {

    // Inicjalizacja AOS (Animate on Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800, // Czas trwania animacji
            once: true,    // Animacja uruchamia się tylko raz
            offset: 50,    // Przesunięcie względem widoku
        });
    }

    // --- LOGIKA DLA KINOWYCH PUNKTÓW ŚWIETLNYCH ---
    const orbsContainer = document.getElementById('light-orbs-container');
    if (orbsContainer) {
        const orbsCount = 5; // Ilość punktów świetlnych
        const colors = ['#6a11cb', '#2575fc', '#ff00ff', '#8e44ad'];

        for (let i = 0; i < orbsCount; i++) {
            const orb = document.createElement('div');
            orb.classList.add('light-orb');

            // Losowy rozmiar
            const size = Math.random() * 700 + 300; // od 700px do 1000px
            orb.style.width = `${size}px`;
            orb.style.height = `${size}px`;

            // Losowy kolor z palety
            const color = colors[Math.floor(Math.random() * colors.length)];
            orb.style.background = `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 70%)`;

            // Losowa pozycja na ekranie
            orb.style.top = `${Math.random() * 100 - 20}%`; // -20% do 80%
            orb.style.left = `${Math.random() * 100 - 20}%`; // -20% do 80%

            // Losowe opóźnienie animacji dla naturalnego efektu
            const animationDelay = Math.random() * 15; // opóźnienie do 15s
            orb.style.animationDelay = `${animationDelay}s`;

            orbsContainer.appendChild(orb);
        }
    }
    // --- KONIEC LOGIKI PUNKTÓW ŚWIETLNYCH ---

    const filterLinks = document.querySelectorAll('.categories-widget a, .tags-container a');
    const postCards = document.querySelectorAll('.post-card');
    const noResultsMsg = document.getElementById('no-results');

    // Zmienna do debouncingu odświeżania AOS
    let aosRefreshTimeout;

    const triggerAOSRefresh = () => {
        if (typeof AOS !== 'undefined') {
            clearTimeout(aosRefreshTimeout);
            aosRefreshTimeout = setTimeout(() => AOS.refresh(), 500); // Czekamy na koniec tranzycji CSS (0.4s)
        }
    };

    // Funkcja resetująca podświetlenia w tytułach
    const resetHighlights = () => {
        postCards.forEach(card => {
            const titleElement = card.querySelector('h3 a');
            if (titleElement) titleElement.innerHTML = titleElement.textContent;
        });
    };

    const filterPosts = (filter, activeElement = null) => {
        if (noResultsMsg) noResultsMsg.style.display = 'none'; // Ukryj komunikat przy zmianie filtra
        resetHighlights(); // Czyścimy podświetlenia przy zmianie filtra
        // Usuń klasę 'active-filter' ze wszystkich linków
        filterLinks.forEach(link => link.classList.remove('active-filter'));

        // Dodaj klasę 'active-filter'
        if (activeElement) {
            activeElement.classList.add('active-filter');
        } else {
            // Bezpieczne pobieranie elementu (unikanie błędów selektora)
            try {
                const activeLink = document.querySelector(`[data-filter="${filter}"]`);
                if (activeLink) activeLink.classList.add('active-filter');
            } catch (e) { console.warn('Invalid filter selector', e); }
        }

        let hasVisiblePosts = false;
        const safeFilter = (filter || '').trim().toLowerCase();

        postCards.forEach(card => {
            // Używamy getAttribute dla pewności i obsługujemy brak atrybutów
            const category = (card.getAttribute('data-category') || '').trim();
            const tagsAttr = card.getAttribute('data-tags') || '';
            const tags = tagsAttr.split(',').map(t => t.trim().toLowerCase());

            // Pokaż/ukryj karty z płynną animacją
            card.style.transition = 'transform 0.4s ease, opacity 0.4s ease, height 0.4s ease, padding 0.4s ease, margin 0.4s ease';

            if (safeFilter === 'all') {
                card.classList.remove('hidden');
                hasVisiblePosts = true;
            } else {
                // Sprawdź, czy kategoria pasuje lub czy tag jest zawarty w liście tagów
                const categoryMatch = category.toLowerCase() === safeFilter;
                const tagMatch = tags.includes(safeFilter);

                if (categoryMatch || tagMatch) {
                    card.classList.remove('hidden');
                    hasVisiblePosts = true;
                } else {
                    card.classList.add('hidden');
                }
            }
        });

        if (noResultsMsg) {
            noResultsMsg.style.display = hasVisiblePosts ? 'none' : 'block';
        }

        // Odśwież AOS po zmianie widoczności (naprawia problem znikających postów)
        triggerAOSRefresh();
    };

    filterLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            let filter = this.getAttribute('data-filter');
            let elementToActivate = this;

            // LOGIKA ODZNACZANIA (TOGGLE)
            if (this.classList.contains('active-filter')) {
                filter = 'all';
                elementToActivate = document.querySelector('[data-filter="all"]');
            }

            // Wyczyść pole wyszukiwania przy zmianie filtra
            if (searchInput) {
                searchInput.value = '';
                if (clearButton) clearButton.classList.remove('visible');
            }

            filterPosts(filter, elementToActivate);
        });
    });

    // Ustawienie stanu początkowego (pokaż wszystkie)
    filterPosts('all');

    // --- LOGIKA WYSZUKIWANIA ---
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.querySelector('.search-box .search-btn');
    const clearButton = document.getElementById('clearSearchBtn');

    const searchPosts = () => {
        const query = searchInput.value.toLowerCase().trim();

        // Obsługa widoczności przycisku czyszczenia
        if (clearButton) {
            if (query.length > 0) clearButton.classList.add('visible');
            else clearButton.classList.remove('visible');
        }

        // Jeśli pole jest puste, zresetuj do widoku "Wszystkie"
        if (!query) {
            filterPosts('all');
            return;
        }

        // Usuń aktywne klasy z filtrów kategorii/tagów
        filterLinks.forEach(link => link.classList.remove('active-filter'));

        let hasVisiblePosts = false;

        postCards.forEach(card => {
            const titleElement = card.querySelector('h3 a');
            if (!titleElement) return; // Zabezpieczenie przed błędem
            const titleText = titleElement.textContent;
            
            // Zastosuj te same style tranzycji co w filterPosts
            card.style.transition = 'transform 0.4s ease, opacity 0.4s ease, height 0.4s ease, padding 0.4s ease, margin 0.4s ease';

            if (titleText.toLowerCase().includes(query)) {
                card.classList.remove('hidden');
                hasVisiblePosts = true;
                // Podświetlanie frazy (zachowując oryginalną wielkość liter w tytule)
                const regex = new RegExp(`(${query})`, 'gi');
                titleElement.innerHTML = titleText.replace(regex, '<span class="highlight">$1</span>');
            } else {
                card.classList.add('hidden');
                titleElement.innerHTML = titleText; // Reset dla ukrytych
            }
        });

        if (noResultsMsg) {
            noResultsMsg.style.display = hasVisiblePosts ? 'none' : 'block';
        }

        // Odśwież AOS po wyszukiwaniu
        triggerAOSRefresh();
    };

    // Funkcja debounce dla optymalizacji wydajności (opóźnienie wyszukiwania)
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(null, args), delay);
        };
    };

    const debouncedSearch = debounce(searchPosts, 300);

    if (searchInput) {
        searchInput.addEventListener('input', debouncedSearch);
        // Obsługa klawisza Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchPosts();
        });
    }

    if (searchButton) {
        searchButton.addEventListener('click', searchPosts);
    }

    if (clearButton) {
        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            searchPosts(); // Resetuje wyszukiwanie i ukrywa przycisk
            searchInput.focus();
        });
    }

    // --- OBSŁUGA ZWIJANIA/ROZWIJANIA PANELU BOCZNEGO (MOBILNE) ---
    const widgetTitles = document.querySelectorAll('.sidebar .widget-title');

    // Domyślne rozwinięcie wyszukiwarki na urządzeniach mobilnych dla lepszego UX
    if (window.innerWidth <= 992) {
        const searchWidget = document.querySelector('.sidebar .search-widget');
        if (searchWidget) searchWidget.classList.add('active');
    }

    widgetTitles.forEach(title => {
        title.addEventListener('click', () => {
            // Logika działa tylko na mniejszych ekranach (zgodnie z CSS)
            if (window.innerWidth <= 992) {
                title.parentElement.classList.toggle('active');
            }
        });
    });

    // --- SCROLLSPY DLA SPISU TREŚCI (TYLKO DLA WPISÓW) ---
    const tocNav = document.querySelector('.toc-nav');
    if (tocNav) {
        const tocLinks = tocNav.querySelectorAll('a');
        const sections = Array.from(tocLinks).map(link => {
            const id = link.getAttribute('href');
            return document.querySelector(id);
        }).filter(section => section !== null);

        const highlightNav = () => {
            let currentSectionId = '';

            sections.forEach(section => {
                // Używamy getBoundingClientRect dla precyzyjnego określenia pozycji względem okna
                if (section.getBoundingClientRect().top <= 150) {
                    currentSectionId = section.getAttribute('id');
                }
            });

            // Obsługa końca strony - jeśli użytkownik przewinął na sam dół, zaznacz ostatnią sekcję
            if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50) {
                if (sections.length > 0) {
                    currentSectionId = sections[sections.length - 1].getAttribute('id');
                }
            }

            tocLinks.forEach(link => {
                link.parentElement.classList.remove('active');
                if (currentSectionId && link.getAttribute('href') === `#${currentSectionId}`) {
                    link.parentElement.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', highlightNav);
        highlightNav(); // Inicjalizacja na starcie

        // Płynne przewijanie z uwzględnieniem wysokości nagłówka
        tocLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const id = link.getAttribute('href');
                const section = document.querySelector(id);
                if (section) {
                    const headerOffset = 120;
                    const elementPosition = section.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerOffset;
        
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            });
        });
    }

    // --- GENEROWANIE PDF ---
    const savePdfBtn = document.getElementById('save-pdf-btn');
    if (savePdfBtn) {
        savePdfBtn.addEventListener('click', async () => {
            // Sprawdź czy biblioteki są załadowane
            if (!window.jspdf || !window.html2canvas) {
                alert('Biblioteki PDF nie zostały jeszcze załadowane. Spróbuj ponownie za chwilę.');
                return;
            }

            // Zapisz oryginalną zawartość i pokaż spinner
            const originalContent = savePdfBtn.innerHTML;
            savePdfBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            savePdfBtn.disabled = true;
            savePdfBtn.style.cursor = 'wait';

            const { jsPDF } = window.jspdf;
            const body = document.body;
            const postContainer = document.querySelector('.post-container');

            // 1. Włącz tryb przechwytywania (ukrywa zbędne elementy)
            window.scrollTo(0, 0);
            body.classList.add('pdf-capture-mode');
            
            // Krótkie opóźnienie, aby przeglądarka przeliczyła układ (layout)
            await new Promise(resolve => setTimeout(resolve, 500));

            try {
                // 2. Wygeneruj canvas z kontenera posta
                const canvas = await html2canvas(postContainer, {
                    scale: 2, // Wyższa jakość
                    useCORS: true, // Obsługa obrazków z innych domen (jeśli są)
                    logging: false,
                    backgroundColor: null, // Zachowaj tło z CSS
                    scrollY: 0
                });

                const imgData = canvas.toDataURL('image/png');
                
                // 3. Utwórz PDF (A4)
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgWidth = 210; // Szerokość A4 w mm
                const pageHeight = 297; // Wysokość A4 w mm
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                let heightLeft = imgHeight;
                let position = 0;

                // Dodawanie stron (obsługa długich artykułów)
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                pdf.save('artykul-genesis.pdf');

            } catch (err) {
                console.error('Błąd generowania PDF:', err);
                alert('Wystąpił błąd podczas generowania PDF: ' + err.message);
            } finally {
                // 4. Wyłącz tryb przechwytywania (przywróć normalny wygląd)
                body.classList.remove('pdf-capture-mode');
                
                // Przywróć przycisk do stanu pierwotnego
                savePdfBtn.innerHTML = originalContent;
                savePdfBtn.disabled = false;
                savePdfBtn.style.cursor = '';
            }
        });
    }

    // --- DRUKOWANIE ---
    const printBtn = document.getElementById('print-btn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // --- KOPIOWANIE LINKU ---
    const copyLinkBtn = document.getElementById('copy-link-btn');
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
                // Wizualne potwierdzenie skopiowania
                const originalContent = copyLinkBtn.innerHTML;
                copyLinkBtn.innerHTML = '<i class="fas fa-check"></i>';
                
                setTimeout(() => {
                    copyLinkBtn.innerHTML = originalContent;
                }, 2000);
            }).catch(err => {
                console.error('Błąd kopiowania:', err);
                alert('Nie udało się skopiować linku.');
            });
        });
    }
});