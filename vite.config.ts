import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    // GitHub Pages এ এই সাইট থাকবে https://aytmart.github.io/aytbooks/ এই ঠিকানায়,
    // তাই base path সেট করা জরুরি — নাহলে CSS/JS/ছবি লোড হবে না।
    // যদি ভবিষ্যতে কাস্টম ডোমেইন (যেমন aytbooks.com) ব্যবহার করেন, তাহলে base: '/' রাখবেন।
    base: '/aytbooks/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
