document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const notyf = new Notyf({ duration: 4000, position: { x: 'right', y: 'top' } });
    const successMessage = document.getElementById('success-message');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    if (contactForm) {
        // --- FUNKCJE WALIDACYJNE ---

        const validateName = () => {
            const errorDiv = nameInput.closest('.form-group').querySelector('.error-message');
            if (nameInput.value.trim() === '') {
                nameInput.classList.add('invalid');
                errorDiv.textContent = 'Pole imię nie może być puste.';
                return false;
            }
            nameInput.classList.remove('invalid');
            errorDiv.textContent = '';
            return true;
        };

        const validateEmail = () => {
            const errorDiv = emailInput.closest('.form-group').querySelector('.error-message');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                emailInput.classList.add('invalid');
                errorDiv.textContent = 'Proszę podać poprawny adres e-mail.';
                return false;
            }
            emailInput.classList.remove('invalid');
            errorDiv.textContent = '';
            return true;
        };

        const validateMessage = () => {
            const errorDiv = messageInput.closest('.form-group').querySelector('.error-message');
            if (messageInput.value.trim().length < 10) {
                messageInput.classList.add('invalid');
                errorDiv.textContent = 'Wiadomość musi mieć co najmniej 10 znaków.';
                return false;
            }
            messageInput.classList.remove('invalid');
            errorDiv.textContent = '';
            return true;
        };

        // --- NASŁUCHIWANIE ZDARZEŃ (EVENT LISTENERS) ---

        nameInput.addEventListener('input', validateName);
        emailInput.addEventListener('input', validateEmail);
        messageInput.addEventListener('input', validateMessage);

        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Uruchom walidację dla wszystkich pól przed wysłaniem
            const isNameValid = validateName();
            const isEmailValid = validateEmail();
            const isMessageValid = validateMessage();

            // Jeśli którekolwiek pole jest niepoprawne, przerwij wysyłanie
            if (!isNameValid || !isEmailValid || !isMessageValid) {
                return;
            }

            // --- LOGIKA WYSYŁANIA FORMULARZA (jeśli walidacja przeszła pomyślnie) ---

            const submitButton = contactForm.querySelector('.btn-submit');

            // Dodajemy stan "ładowania" do przycisku
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Wysyłanie...';
            submitButton.disabled = true;

            // --- NOWA LOGIKA WYSYŁANIA DANYCH DO GOOGLE SHEETS ---
            const formData = new FormData(contactForm);
            const scriptURL = 'https://script.google.com/macros/s/AKfycbwB7UKxVGa4ahskLpTqiRoJd3F3cTYBRodyGpSMlb6Q5kllS3CIgiIjRq0Fl6ry11HB/exec';

            fetch(scriptURL, { method: 'POST', body: formData })
                .then(response => {
                    console.log('Success!', response);
                    // Pokaż komunikat o sukcesie
                    if (successMessage) {
                        contactForm.classList.add('form-hidden');
                        contactForm.addEventListener('transitionend', () => {
                            contactForm.style.display = 'none';
                            successMessage.style.display = 'flex';
                            successMessage.classList.add('visible');
                        }, { once: true });
                    }
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    // W przypadku błędu, przywróć przycisk i poinformuj użytkownika
                notyf.error('Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie.');
                    submitButton.innerHTML = 'Wyślij wiadomość <i class="fas fa-paper-plane"></i>';
                    submitButton.disabled = false;
                });
        });
    }
});