import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Make sure this repo name matches your GitHub repository!
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/', // <-- REPLACE with your actual repo name
});
