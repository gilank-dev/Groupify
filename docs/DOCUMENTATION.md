# Groupify Documentation

## Table of Contents

1. [Architecture](#architecture)
2. [Module Reference](#module-reference)
3. [CSS Guidelines](#css-guidelines)
4. [JavaScript Guidelines](#javascript-guidelines)
5. [Browser Compatibility](#browser-compatibility)

---

## Architecture

### Overview
Groupify menggunakan arsitektur modular dengan pemisahan concerns yang jelas:

```
┌─────────────────────────────────────────┐
│              HTML (index.html)          │
│           Structure & Semantics         │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
┌───────────────┐   ┌───────────────┐
│     CSS       │   │  JavaScript   │
│   (Styles)    │   │   (Logic)     │
└───────┬───────┘   └───────┬───────┘
        │                   │
   ┌────┴────┐         ┌────┴────┐
   │         │         │         │
   ▼         ▼         ▼         ▼
┌──────┐ ┌──────┐ ┌────────┐ ┌────────┐
│Base  │ │Comp- │ │Modules │ │  App   │
│      │ │onents│ │        │ │  Main  │
└──────┘ └──────┘ └────────┘ └────────┘
```

### Design Patterns

1. **Module Pattern** - Setiap fitur dalam file terpisah
2. **Singleton** - Instance tunggal untuk managers
3. **Observer** - Event-driven communication
4. **Factory** - Object creation untuk cards dan effects

---

## Module Reference

### Audio Module (`src/js/modules/audio.js`)

Mengelola semua sound effects menggunakan Web Audio API.

```javascript
import { audioManager } from './modules/audio.js';

// Enable/disable
audioManager.setEnabled(true);

// Set volume (0-1)
audioManager.setVolume(0.5);

// Play sounds
audioManager.playClick();
audioManager.playSuccess();
audioManager.playError();
audioManager.playCardReveal();

// Dice roll (returns stop function)
const stop = audioManager.playDiceRoll(5); // 5 seconds
stop(); // Stop early
```

**Methods:**
| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `setEnabled` | `enabled: boolean` | void | Enable/disable audio |
| `setVolume` | `volume: number` | void | Set volume level |
| `playClick` | - | void | Play click sound |
| `playSuccess` | - | void | Play success jingle |
| `playError` | - | void | Play error sound |
| `playDiceRoll` | `duration: number` | `Function` | Start dice roll sound |
| `playCardReveal` | - | void | Play card reveal sound |

### Dice Module (`src/js/modules/dice.js`)

Mengelola animasi dadu 3D.

```javascript
import { diceManager } from './modules/dice.js';

// Set duration
diceManager.setDuration(5); // 5 seconds

// Show animation
await diceManager.show();

// Hide animation
await diceManager.hide();

// Set speed
diceManager.setSpeed('fast'); // 'slow', 'normal', 'fast'
```

### Effects Module (`src/js/modules/effects.js`)

Mengelola emoji blast dan confetti effects.

```javascript
import { emojiManager, confettiManager } from './modules/effects.js';

// Emoji
emojiManager.setEnabled(true);
emojiManager.blast();
emojiManager.clear();

// Confetti
confettiManager.setEnabled(true);
confettiManager.explode({
    count: 150,
    spread: 100,
    origin: { x: 0.5, y: 0.5 }
});
confettiManager.stop();
```

### Storage Module (`src/js/modules/storage.js`)

Mengelola localStorage dengan struktur yang terorganisir.

```javascript
import { 
    appDataStorage, 
    historyStorage, 
    settingsStorage 
} from './modules/storage.js';

// App Data
appDataStorage.save({ names, groupCount, shuffleMode });
const data = appDataStorage.load();
appDataStorage.clear();

// History
historyStorage.add({ names, groupCount, stats });
const history = historyStorage.getRecent(10);
historyStorage.clear();

// Settings
const settings = settingsStorage.get();
settingsStorage.update('theme.color', 'terracotta');
settingsStorage.reset();
```

### Quotes Module (`src/js/modules/quotes.js`)

Mengelola motivational quotes.

```javascript
import { quotesManager } from './modules/quotes.js';

// Get random quote
const quote = quotesManager.getRandom();
// Returns: { text, author, category }

// Get by category
const quote = quotesManager.getByCategory('teamwork');

// Search
const results = quotesManager.search('team');
```

### Utils Module (`src/js/modules/utils.js`)

Utility functions helper.

```javascript
import {
    shuffleArray,
    distributeIntoGroups,
    calculateStats,
    copyToClipboard,
    downloadFile,
    debounce,
    throttle,
    formatDate,
    scrollToElement
} from './modules/utils.js';

// Shuffle array
const shuffled = shuffleArray([1, 2, 3, 4, 5]);

// Distribute into groups
const groups = distributeIntoGroups(names, 4, 'balanced');

// Calculate stats
const stats = calculateStats(groups);
// Returns: { totalGroups, totalMembers, avgMembers, minMembers, maxMembers, distribution }

// Copy to clipboard
const success = await copyToClipboard('text to copy');

// Download file
downloadFile(csvContent, 'filename.csv', 'text/csv');

// Debounce function
const debouncedSave = debounce(() => save(), 300);

// Scroll to element
scrollToElement(element, { offset: 100 });
```

---

## CSS Guidelines

### Naming Convention (BEM)

```css
/* Block */
.card { }

/* Element */
.card-header { }
.card-body { }

/* Modifier */
.card--large { }
.card--highlighted { }
```

### CSS Custom Properties

```css
/* Usage */
.button {
    background: var(--color-primary);
    padding: var(--space-4);
    border-radius: var(--radius-lg);
    transition: all var(--transition-normal);
}

/* Override in component */
.special-button {
    --color-primary: #ff0000;
}
```

### Responsive Breakpoints

```css
/* Mobile First */
.element {
    /* Base styles (mobile) */
}

/* Tablet */
@media (min-width: 768px) {
    .element {
        /* Tablet styles */
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .element {
        /* Desktop styles */
    }
}
```

---

## JavaScript Guidelines

### ES6+ Features

```javascript
// Arrow functions
const handleClick = () => { };

// Template literals
const message = `Hello, ${name}!`;

// Destructuring
const { names, groupCount } = data;

// Spread operator
const newArray = [...oldArray, newItem];

// Async/await
async function loadData() {
    const data = await fetchData();
}

// Modules
import { module } from './module.js';
export const value = 42;
```

### Code Style

```javascript
// Classes
class GroupifyApp {
    constructor() {
        this.state = {};
    }

    async init() {
        // Initialization
    }
}

// JSDoc comments
/**
 * Shuffle array using Fisher-Yates
 * @param {Array} array - Array to shuffle
 * @returns {Array} - Shuffled array
 */
export function shuffleArray(array) { }
```

---

## Browser Compatibility

### Required Features

| Feature | Minimum Version |
|---------|----------------|
| ES6 Modules | Chrome 61+, Firefox 60+, Safari 11+ |
| CSS Custom Properties | Chrome 49+, Firefox 31+, Safari 9.1+ |
| Web Audio API | Chrome 10+, Firefox 25+, Safari 6+ |
| localStorage | Chrome 4+, Firefox 3.5+, Safari 4+ |
| Clipboard API | Chrome 66+, Firefox 63+, Safari 13.1+ |

### Polyfills

Tidak ada polyfill yang disertakan. Untuk browser lama, pertimbangkan:
- Babel untuk transpilation
- Promise polyfill
- Fetch polyfill

---

## Troubleshooting

### Common Issues

**1. Audio tidak berbunyi**
- Pastikan user interaction telah terjadi (browser autoplay policy)
- Cek `audioManager.setEnabled(true)`

**2. localStorage tidak bekerja**
- Mode incognito/private membatasi localStorage
- Cek `storageManager.isAvailable()`

**3. Animasi tidak smooth**
- Cek `prefers-reduced-motion` setting user
- Kurangi particle count di `effects.js`

**4. Module loading error**
- Pastikan menggunakan HTTPS atau localhost
- Cek MIME type di server configuration

---

## Performance Tips

1. **Lazy Loading** - Load modules on demand
2. **Debouncing** - Throttle frequent operations
3. **CSS Containment** - Use `contain` for isolated components
4. **will-change** - Hint browser about animations
5. **RequestAnimationFrame** - Smooth animations

---

For more information, see the main README.md file.
