import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  base: '/calculadora-freelance/' // ¡Asegúrate de que el nombre coincide con el repo en GitHub!
})