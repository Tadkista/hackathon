# MójToruń - Aplikacja Miejska (React + Vite)

Nowoczesna aplikacja miejska **MójToruń** przepisana na **React 18** z użyciem **Vite** i **Tailwind CSS**.

---

## 🚀 Uruchomienie w sieci lokalnej (`moje_ip:port`)

Serwer deweloperski został skonfigurowany tak, aby nasłuchiwać na wszystkich interfejsach sieciowych (`0.0.0.0`), co pozwala na natychmiastowy dostęp z dowolnego urządzenia w tej samej sieci Wi-Fi (np. smartfona, tabletu czy innego komputera).

### 1. Uruchomienie aplikacji:
```bash
npm run dev
```

### 2. Adresy dostępowe:
- **Lokalnie na tym komputerze:** [http://localhost:5173](http://localhost:5173)
- **W sieci lokalnej Wi-Fi (telefon, inne urządzenia):**
  ```text
  http://10.10.236.40:5173
  ```
  *(Jeśli Twoje IP ulegnie zmianie po ponownym połączeniu z Wi-Fi, sprawdź aktualne IP wpisując `ipconfig` w terminalu)*.

---

## 🛠 Dostępne polecenia:

- `npm run dev` – Uruchamia serwer developerski z Hot-Module-Replacement dostępny w sieci (`--host 0.0.0.0`).
- `npm run build` – Buduje zoptymalizowaną wersję produkcyjną aplikacji w folderze `dist/`.
- `npm run preview` – Uruchamia podgląd wersji produkcyjnej dostępny w sieci (`--host 0.0.0.0`).

---

## 📱 Zawartość i moduły aplikacji:

1. **Główna (`HomeScreen`)**:
   - Status pogody i jakości powietrza (AQI) w Toruniu
   - Ważny komunikat drogowy (objazdy mostu)
   - Szybki dostęp (Bilety MZK, Karta Torunianina, Zgłoszenia, Parkowanie)
   - Harmonogram wywozu odpadów komunalnych
   - Wyróżniony projekt Budżetu Obywatelskiego 2025 ze statusem głosów
   - Aktualności miejskie i wydarzenia kulturalne

2. **Głos (`VotesScreen`)**:
   - Zakładki: *Głosowania*, *Konsultacje*, *Zgłoszenia*
   - Filtrowanie po dzielnicach (Bydgoskie, Mokre, Stare Miasto itd.) oraz kategoriach
   - Interaktywny modal potwierdzenia głosu z animacją konfetti i rejestracją
   - Formularz dodawania nowego zgłoszenia usterki / inicjatywy

3. **Bilety / Karta Torunianina (`TicketsScreen`)**:
   - Dynamiczny zegar weryfikacyjny kontrolera biletowego (odświeżany co sekundę)
   - Aktywny bilet MZK z odliczaniem czasu na żywo
   - Powiększenie kodu QR do kontroli
   - Błyskawiczny zakup biletów (30 min, 90 min, dobowy) z przełącznikiem taryfy Normalny / Ulgowy
   - Katalog korzyści i zniżek (Teatr Horzycy, Młyn Wiedzy) oraz historia biletów

4. **Odkrywaj (`ExploreScreen`)**:
   - Wyszukiwarka usług i wydarzeń
   - Licznik wolnych miejsc parkingowych na żywo w Strefie Płatnego Parkowania
   - Transparentny budżet i inwestycje miejskie 2025
   - Oferty pracy w samorządzie (BIP / ePUAP)
   - Zapisy na miejski wolontariat ekologiczny

5. **Profil (`ProfileScreen`)**:
   - Dane mieszkańca z weryfikacją mObywatel
   - Zmiana dzielnicy miejskiej
   - Statystyki aktywności obywatelskiej
   - Centrum preferencji powiadomień SMS / Push
   - Przełącznik logowania biometrycznego oraz kontakt do Toruńskiego Centrum Kontaktu (TCK)

---

## 🔒 Wskazówka dot. Zapory Windows (Firewall):
Jeśli telefon nie może połączyć się z adresem `http://10.10.236.40:5173`, upewnij się, że:
1. Telefon i komputer są podłączone do **tej samej sieci Wi-Fi**.
2. W Zaporze Windows (Windows Defender Firewall) aplikacja `Node.js` ma zezwolenie na ruch w sieciach prywatnych (Private Network).
