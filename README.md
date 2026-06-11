# Feedbackovátko

Jednoduchý nástroj pro zanechávání komentářů přímo na webových stránkách. Komentáře se ukládají do Firebase Firestore a zobrazují se jako piny na stránce.

---

## Možnost A — Rychlý embed (sdílená databáze)

Přidej jeden řádek před `</body>` na každé stránce:

```html
<script src="https://feedback-tool.surge.sh/tool.iife.js"></script>
```

**To je vše.** Komentáře se automaticky ukládají odděleně pro každou stránku (podle domény + cesty).

### Autor mode

Pro zobrazení tlačítek export/archivace přidej do URL parametr:

```
https://mujweb.cz/stranka?author=viola2026
```

---

## Možnost B — Vlastní instance (vlastní databáze)

Pokud chceš plnou izolaci s vlastní Firebase databází.

### Co budeš potřebovat

- Node.js 18+
- Účet na [Firebase](https://firebase.google.com) (zdarma)
- Účet na [Surge](https://surge.sh) (zdarma) nebo jiný hosting statických souborů

### 1. Firebase projekt

1. Jdi na [console.firebase.google.com](https://console.firebase.google.com)
2. Vytvoř nový projekt
3. Přidej **Firestore Database** (Native mode, zvol region)
4. V nastavení projektu (ozubené kolo) → **Přidat aplikaci** → Web
5. Zkopíruj `firebaseConfig` objekt

### 2. Firestore pravidla

V Firebase konzoli → Firestore → Rules nastav:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 3. Konfigurace nástroje

Otevři `src/config.js` a vyplň:

```js
export const FIREBASE_CONFIG = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
}

// Tajný token pro autor mode — zvol si vlastní řetězec
export const AUTHOR_TOKEN = "mujtoken2024"

// Barva pinů (hex)
export const PIN_COLOR = "#6c47ff"
```

### 4. Build

```bash
npm install
npm run build
```

### 5. Deploy

```bash
npx surge dist mujweb-feedback.surge.sh
```

Nebo zkopíruj obsah složky `dist/` na jakýkoliv statický hosting.

### 6. Embed na web

```html
<script src="https://mujweb-feedback.surge.sh/tool.iife.js"></script>
```

---

## Struktura projektu

```
src/
  config.js          ← Firebase config + token + barva
  firebase.js        ← Firestore operace
  index.js           ← Hlavní logika
  selector.js        ← Detekce elementů
  export.js          ← Formátování pro Claude
  ui/
    bubble.js        ← Komentářová bublina
    dialog.js        ← Dialogy, compose, toast
    overlay.js       ← Překryvná vrstva + kurzor
    pin.js           ← Piny na stránce
    styles.js        ← CSS
    toolbar.js       ← Nástrojová lišta
public/
  index.html         ← Testovací stránka
```
