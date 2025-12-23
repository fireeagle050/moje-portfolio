# Quantum Folio - Nowoczesne Portfolio Osobiste

Witaj w repozytorium mojego osobistego portfolio – projektu, który jest czymś więcej niż tylko wizytówką. To interaktywna podróż przez mój świat technologii, designu i kreatywności, zaprojektowana, aby inspirować, angażować i w pełni zaprezentować moje umiejętności.

**Zobacz na żywo:** [fireeagle050.github.io/moje-portfolio](https://fireeagle050.github.io/moje-portfolio/) *(zastąp linkiem do swojej strony na GitHub Pages)*

---

## 🚀 Założenia i Filozofia Projektu

Celem tego portfolio nie jest jedynie statyczne przedstawienie informacji. Zostało ono zbudowane w oparciu o kilka kluczowych założeń psychologicznych i projektowych:

1. **Efekt Pierwszego Wrażenia (Primacy Effect):** Strona główna została zaprojektowana tak, aby od pierwszych sekund budować wizerunek osoby nowoczesnej, ambitnej i zorientowanej na detale. Dynamiczne tło `particles.js` i animowany tekst `Typed.js` natychmiast przyciągają uwagę i komunikują biegłość w technologiach.

2. **Narracja i Storytelling:** Zamiast suchej listy umiejętności, strona "O mnie" prowadzi użytkownika przez moją historię – od edukacji, przez projekty, po kompetencje i hobby. Taka narracyjna struktura buduje głębszą relację i pozwala lepiej poznać mnie jako człowieka, a nie tylko jako programistę.

3. **Budowanie Zaufania (Social Proof):** Sekcje takie jak "Co mówią inni?" (opinie) oraz "Zaufali mi" (logotypy) wykorzystują psychologiczny mechanizm dowodu społecznego. Pokazują, że moje umiejętności zostały już zweryfikowane i docenione przez innych, co zwiększa moją wiarygodność.

4. **Mikrointerakcje i Zaangażowanie:** Każdy element interaktywny – od subtelnych efektów `:hover` na przyciskach, przez animacje `AOS.js` przy przewijaniu, po dynamiczne filtrowanie postów na blogu – ma na celu utrzymanie zaangażowania użytkownika i zachęcenie go do dalszej eksploracji.

## ✨ Design i Atmosfera

Każda podstrona została zaprojektowana tak, aby tworzyć unikalną, "magiczną" atmosferę, która odzwierciedla jej treść:

* **Strona Główna:** Futurystyczna i dynamiczna, z tłem inspirowanym siecią neuronową (`particles.js`), symbolizującym połączenia, dane i potencjał.
* **O Mnie:** Elegancka i profesjonalna, z subtelną animacją "cyfrowych ścieżek" w tle, które wizualizują moją drogę rozwoju.
* **Blog:** Kreatywna i inspirująca, z tłem "kinowych punktów świetlnych", które tworzą atmosferę skupienia i refleksji.
* **Materiały:** Klimat w stylu "Matrix", z ikonicznym deszczem cyfr, podkreślający techniczny i nieco tajemniczy charakter udostępnianych zasobów.
* **Kontakt:** Czysta i funkcjonalna, skupiona na budowaniu bezpośredniej relacji, z profesjonalnym zdjęciem i łatwym w obsłudze formularzem.

Spójność wizualną zapewnia centralnie zarządzana paleta kolorów w `:root` (`style.css`), która pozwala na łatwe modyfikacje globalnego wyglądu strony.

## 🛠️ Funkcjonalności i Zaawansowane Opcje

Projekt wykorzystuje szereg nowoczesnych rozwiązań, które świadczą o szerokich kompetencjach technicznych:

### Struktura i Wydajność

* **Modułowa Architektura:** Kod jest logicznie podzielony na pliki globalne (`style.css`, `main.js`) oraz dedykowane dla każdej podstrony, co zapewnia porządek i wysoką wydajność.
* **Optymalizacja Ładowania:**
  * **Asynchroniczne ładowanie CSS:** Font Awesome jest ładowany asynchronicznie, aby nie blokować renderowania strony.
  * **Odroczone ładowanie JS:** Wszystkie skrypty używają atrybutu `defer`, gwarantując, że strona staje się interaktywna najszybciej, jak to możliwe.
  * **Lazy Loading Obrazów:** Obrazy na blogu ładują się dopiero wtedy, gdy użytkownik przewinie stronę w ich pobliże.
* **Optymalizacja Mobilna:** Ciężkie animacje `canvas` i `particles.js` są automatycznie wyłączane na mniejszych ekranach, aby zapewnić płynne działanie na urządzeniach mobilnych.

### Interaktywność

* **Dynamiczny Blog:** W pełni funkcjonalny, po stronie klienta, system filtrowania postów według kategorii i tagów, zapewniający natychmiastowe rezultaty bez przeładowywania strony.
* **Inteligentny Formularz Kontaktowy:**
  * **Walidacja w czasie rzeczywistym:** Użytkownik otrzymuje natychmiastową informację o błędach w formularzu.
  * **Asynchroniczna Wysyłka:** Dane są wysyłane w tle do **Arkusza Google** za pomocą **Google Apps Script**, co jest idealnym rozwiązaniem dla stron statycznych.
  * **Profesjonalny Feedback:** Animowany stan ładowania oraz eleganckie powiadomienia o sukcesie lub błędzie (za pomocą biblioteki `Notyf`).

## 💻 Stos Technologiczny

* **Front-end:** HTML5, CSS3 (Flexbox, Grid, Zmienne CSS), JavaScript (ES6+)
* **Biblioteki JavaScript:**
  * `AOS.js` - do animacji przy przewijaniu
  * `Typed.js` - do efektu pisania na maszynie
  * `particles.js` - do interaktywnego tła
  * `Notyf` - do nienachalnych powiadomień
* **Backend (Serverless):** Google Apps Script - do obsługi formularza kontaktowego i zapisu danych w Arkuszu Google.
* **Narzędzia i Ikony:** Font Awesome.

## 🚀 Uruchomienie

Projekt jest w 100% statyczny i nie wymaga skomplikowanej konfiguracji.

1. Sklonuj repozytorium:

    ```bash
    git clone https://github.com/fireeagle050/moje-portfolio.git
    ```

2. Otwórz plik `index.html` w swojej ulubionej przeglądarce.

---

Dziękuję za zainteresowanie moim projektem! Jeśli masz jakiekolwiek pytania lub sugestie, zapraszam do kontaktu.
