# LuxLibrary — Project Handoff Document

## 1. What Is LuxLibrary
A luxury, minimalist digital library web app that lets users borrow and read public domain books. Built with React + Vite, deployed on Vercel, books stored on Supabase.

---

## 2. Live URL
```
https://lux-library-web.vercel.app
```

---

## 3. Tech Stack
- **Frontend:** React + Vite (JavaScript)
- **Styling:** Inline CSS with CSS variables
- **Fonts:** Playfair Display, Lora, DM Sans (Google Fonts)
- **Book Storage:** Supabase Storage (public bucket called `books`)
- **Deployment:** Vercel (connected to GitHub, auto-deploys on push)
- **Code Editor:** VS Code

---

## 4. Project Location on Laptop
```
C:\Users\agent\Desktop\Doc Mustapha\Claud Playground\Dev app\LuxLibrary-Web
```

---

## 5. How to Start Working
Open VS Code, open the LuxLibrary-Web folder, then in the terminal:
```bash
npm run dev
```
Then open `http://localhost:5173` in Chrome.

---

## 6. How to Deploy Updates
After making any changes:
```bash
git add .
git commit -m "your message"
git push
```
Vercel auto-deploys within 30 seconds.

---

## 7. File Structure
```
LuxLibrary-Web/
├── api/
│   └── book.js              # Serverless function (not currently used)
├── public/
├── src/
│   ├── data/
│   │   └── books.js         # All book data (title, author, cover, textUrl, etc.)
│   ├── screens/
│   │   ├── EntranceScreen.jsx    # Home - Netflix layout, hero banner, shelves
│   │   ├── BookCardScreen.jsx    # Individual book page
│   │   ├── TableScreen.jsx       # My Table - active loans
│   │   ├── ReaderScreen.jsx      # In-app reader with Day/Paper/Night modes
│   │   ├── ReadLaterScreen.jsx   # Wishlist screen
│   │   └── OnboardingScreen.jsx  # First-time user flow (3 steps)
│   ├── App.jsx              # Main app - navigation, global theme state
│   ├── index.css            # Global CSS variables and reset
│   └── main.jsx
├── index.html               # Loads Google Fonts
├── vercel.json              # Vercel routing config
├── vite.config.js
└── package.json
```

---

## 8. Accounts & Services

### GitHub
- **Username:** mustaphaayadi-lang
- **Repo:** https://github.com/mustaphaayadi-lang/LuxLibrary-Web

### Vercel
- Connected to GitHub account
- Auto-deploys from main branch

### Supabase
- **Project:** LuxLibrary
- **URL:** https://fgaiyhazcoztorowtgmr.supabase.co
- **Storage bucket:** `books` (public)
- **Book URL pattern:** `https://fgaiyhazcoztorowtgmr.supabase.co/storage/v1/object/public/books/[filename]`

---

## 9. Current Books in the App
All stored in Supabase. Files are cleaned `.txt` versions from Project Gutenberg.

| # | Title | Author | Era | Language |
|---|-------|--------|-----|----------|
| 1 | The Great Gatsby | F. Scott Fitzgerald | Modern | English |
| 2 | Crime and Punishment | Fyodor Dostoevsky | Classic | Russian |
| 3 | Pride and Prejudice | Jane Austen | Classic | English |
| 4 | Madame Bovary | Gustave Flaubert | Classic | French |
| 5 | The Picture of Dorian Gray | Oscar Wilde | Victorian | English |
| 6 | Anna Karenina | Leo Tolstoy | Classic | Russian |

### How to Add a New Book
1. Download the `.txt` file
2. Clean it (remove header, footer, illustration tags)
3. Upload to Supabase `books` bucket
4. Add entry to `src/data/books.js`:
```js
{
  id: '7',
  title: 'Book Title',
  author: 'Author Name',
  year: 1900,
  era: 'Classic', // Classic, Victorian, Modern
  language: 'English',
  cover: 'https://cover-image-url.jpg',
  textUrl: 'https://fgaiyhazcoztorowtgmr.supabase.co/storage/v1/object/public/books/Book%20Title.txt',
  summary: 'Your custom summary here.',
  pages: 300,
}
```

---

## 10. App Features (Built)

### Screens
- **Library (Entrance):** Hero banner + Netflix-style horizontal shelves by era/language
- **Book Bottom Sheet:** Slides up on book tap — shows cover, summary, stats, borrow + save for later buttons
- **My Table:** Active loans with progress bar, days left, expiry lock
- **Read Later:** Wishlist — save books without borrowing
- **Reader:** Full in-app reader with:
  - Pagination (2000 chars/page)
  - Swipe left/right to turn pages
  - Page animation
  - Search inside book
  - Reading progress saved (localStorage)
  - Day / Paper / Night modes
  - Font size control
  - Brightness slider
- **Onboarding:** 3-step flow (language, era, reading time) shown on first launch

### Global Features
- Global theme switcher (Night ☽ / Paper ❧ / Day ◎) in top right of home screen
- All preferences saved in localStorage
- Loan mechanic: 21-day loan, expiry lock, renew with ad
- Bottom tab bar: Library / Read Later / My Table

---

## 11. CSS Variables (in index.css)
```css
--bg, --bg-card, --border
--gold: #C9A96E
--text-primary: #EDE8DF
--text-secondary, --text-muted
--blue: #1a6bff
--font-display: Playfair Display (serif, for titles)
--font-body: Lora (serif, for reading)
--font-ui: DM Sans (sans-serif, for UI)
```

---

## 12. What's Next (Planned Features)

### Short Term
- [ ] Profile screen — reading stats, daily streak, badges
- [ ] Fix book opening — skip table of contents, jump to Chapter 1
- [ ] Add 20+ more books to the library

### Medium Term
- [ ] User accounts (Supabase Auth)
- [ ] Reading Circles — groups of max 4 reading the same book
- [ ] Shared notepad per book for reading groups
- [ ] Reading streak notifications

### Long Term
- [ ] Custom domain (e.g. libluxe.com)
- [ ] Ad integration (Google AdSense)
- [ ] Premium subscription tier
- [ ] B2B — hotel/airline partnerships

---

## 13. Legal Notes
- Books are public domain
- Currently using cleaned Gutenberg text files
- Before commercial launch: get legal advice on book sourcing
- Standard Ebooks (standardebooks.org) and Wikisource are cleaner alternatives

---

## 14. Design Identity
- **Feel:** Private members club meets rare bookshop
- **Colors:** Warm dark (#0F0C09) + aged gold (#C9A96E)
- **Typography:** Playfair Display for titles, Lora for reading, DM Sans for UI
- **Inspiration:** Blacklane app aesthetic

---

*Last updated: April 2026*
