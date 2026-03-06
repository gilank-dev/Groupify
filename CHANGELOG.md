# Changelog

All notable changes to Groupify will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2024-03-05

### 🎉 Major Changes - TypeScript Refactor

#### Added
- **TypeScript Support** - Full TypeScript implementation for type safety
- **Type Definitions** - Comprehensive type definitions in `src/types/index.ts`
- **Build System** - Vite 5.0 for fast development and production builds
- **Modular Architecture** - Reorganized into feature-based modules:
  - `src/audio/` - Audio management with Web Audio API
  - `src/effects/` - Dice animation and confetti effects
  - `src/storage/` - Type-safe localStorage management
  - `src/quotes/` - Motivational quotes database
  - `src/utils/` - Utility functions with proper typing

#### Changed
- **Refactored to TypeScript** - All JavaScript files converted to TypeScript
- **Improved Error Handling** - Better error messages and validation
- **Enhanced Audio** - Fixed Web Audio API context resumption for browsers
- **Better Type Safety** - Strict mode enabled for all TypeScript files
- **Updated Dependencies** - Latest versions of TypeScript and Vite

#### Fixed
- **Audio Context Bug** - Fixed autoplay policy issues in Chrome/Safari
- **LocalStorage Errors** - Better error handling for storage operations
- **Animation Timing** - Fixed dice animation duration sync
- **Export Function** - Fixed CSV export with proper encoding
- **Event Listeners** - Fixed memory leaks from duplicate listeners
- **Type Errors** - All type-related runtime errors resolved

#### Improved
- **Code Quality** - ESLint strict rules applied
- **Performance** - Optimized animations and reduced reflows
- **Accessibility** - Better ARIA labels and keyboard navigation
- **Documentation** - Updated README with TypeScript setup guide

---

## [1.0.0] - 2024-01-15

### Initial Release

#### Added
- Basic name shuffling functionality
- 3D dice animation
- Emoji blast effects
- LocalStorage auto-save
- CSV export
- Dark mode support
- Multiple theme colors
- Sound effects
- History tracking
- Settings panel
- Keyboard shortcuts
- Responsive design
- Print support

---

## Version History

| Version | Release Date | Changes |
|---------|-------------|---------|
| 2.0.0 | 2024-03-05 | TypeScript refactor, bug fixes |
| 1.0.0 | 2024-01-15 | Initial release |

---

## Upcoming Features

### Planned for v2.1.0
- [ ] Custom shuffle mode
- [ ] Import from Google Sheets
- [ ] Share results via link
- [ ] Custom emoji packs
- [ ] Sound pack customization
- [ ] Multi-language support (i18n)

### Under Consideration
- [ ] PWA support (offline mode)
- [ ] Real-time collaboration
- [ ] API for developers
- [ ] Mobile app (React Native)

---

## Breaking Changes

### v2.0.0
- Migrated from JavaScript to TypeScript
- Changed module structure (src/js → src/*)
- Updated build system (Vite instead of plain files)
- Requires Node.js 18+ for development

---

## Migration Guide (v1.x → v2.0.0)

### For Developers

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Update Import Paths**
   ```typescript
   // Old (v1.x)
   import { utils } from './src/js/utils.js';
   
   // New (v2.0.0)
   import { utils } from './src/utils';
   ```

3. **Build Command**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm run build
   ```

### For Users
- No changes needed, the app works the same way
- All your saved data is compatible

---

**Full Changelog**: [Compare changes](https://github.com/username/groupify/compare/v1.0.0...v2.0.0)
