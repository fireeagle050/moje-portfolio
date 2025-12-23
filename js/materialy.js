document.addEventListener('DOMContentLoaded', () => {
    const materialCards = document.querySelectorAll('.material-card');
    const modals = document.querySelectorAll('.modal-overlay');
    const closeButtons = document.querySelectorAll('.modal-close');

    // Otwieranie modala po kliknięciu na kartę
    materialCards.forEach(card => {
        card.addEventListener('click', () => {
            const modalId = card.dataset.modalTarget;
            const modal = document.querySelector(modalId);
            if (modal) {
                modal.classList.add('active');
            }
        });
    });

    // Zamykanie modala po kliknięciu przycisku "X"
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.modal-overlay').classList.remove('active');
        });
    });

    // Zamykanie modala po kliknięciu na tło (overlay)
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
});