# 📚 AYT Books — 3D Virtual Library

An immersive 3D virtual library and digital reading room built with React, Three.js, and Tailwind CSS. Walk through realistic 3D bookshelves, pick a book, and read it in whichever mode suits you — from a cozy virtual reading table to a full VR-style immersive view.

## ✨ Features

- **3D Bookshelf Library** — browse categorized bookshelves (Islamic Books, Children & Teen, Educational, Personal Development, and more) in an explorable 3D scene.
- **Multiple Reading Modes**
  - 📖 Table Reading Mode — read at a virtual desk with page-turn animations and bookmarking
  - 🖥️ Fullscreen PDF Mode
  - 🌌 Immersive Reading Mode
  - 🥽 VR Reading Mode with mobile orientation/gyroscope support
- **Classic 2D Library View** for a simpler, distraction-free browsing experience
- **Search, Categories & "My Books"** modals for quickly finding and tracking books
- **Bookmarks & Notes** saved locally so you can pick up where you left off
- **Offline Reading** support
- **Bilingual Content** — English and Bengali (Noto Serif Bengali / Hind Siliguri) typography support
- Smooth animations powered by `motion` (Framer Motion) and celebratory confetti on reading milestones

## 🛠️ Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Three.js](https://threejs.org/) for the 3D library scene
- [Vite](https://vitejs.dev/) for tooling and dev server
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Motion](https://motion.dev/) for animations
- [Lucide React](https://lucide.dev/) for icons

## 🚀 Getting Started

**Prerequisites:** [Node.js](https://nodejs.org/) 18+

```bash
# 1. Clone the repo
git clone https://github.com/<your-username>/aytbooks-3d-virtual-library.git
cd aytbooks-3d-virtual-library

# 2. Install dependencies
npm install

# 3. Run the dev server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Build for production

```bash
npm run build
npm run preview
```

The production build is emitted to the `dist/` folder and can be deployed to any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages, etc.).

## 📁 Project Structure

```
src/
├── components/
│   ├── library/     # 3D library scene, bookshelf, book spotlight & transitions
│   ├── reader/      # Table / Fullscreen / Immersive / VR reading modes
│   └── ui/          # Header, navigation, modals (search, categories, settings, TOC...)
├── data/            # Book catalog & category data
├── services/        # Local storage service (progress, bookmarks, notes, settings)
├── utils/           # Audio helpers
├── types.ts         # Shared TypeScript types
└── App.tsx          # App shell and state management
```

## 📄 License

This project is licensed under the [MIT License](LICENSE).
