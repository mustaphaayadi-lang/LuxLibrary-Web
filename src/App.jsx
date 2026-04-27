*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --bg: #0F0C09;
  --bg-card: rgba(255, 235, 200, 0.04);
  --bg-card-hover: rgba(255, 235, 200, 0.07);
  --border: rgba(255, 235, 200, 0.08);
  --gold: #C9A96E;
  --gold-dark: #8B6F47;
  --text-primary: #EDE8DF;
  --text-secondary: rgba(237, 232, 223, 0.5);
  --text-muted: rgba(237, 232, 223, 0.3);
  --blue: #1a6bff;
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'Lora', Georgia, serif;
  --font-ui: 'DM Sans', sans-serif;
  --tab-bar-height: 90px;
}

html, body, #root {
  height: 100%;
  background: var(--bg);
  color: var(--text-primary);
  font-family: var(--font-ui);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

body {
  background: var(--bg);
}

button {
  font-family: var(--font-ui);
}

input, textarea {
  font-family: var(--font-ui);
}

::-webkit-scrollbar {
  width: 0px;
}

::selection {
  background: rgba(201, 169, 110, 0.3);
  color: var(--text-primary);
}