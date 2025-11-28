// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [
//     react({
//       // This is the key change: we're telling the React plugin
//       // to use Emotion's Babel plugin for compilation.
//       jsxImportSource: '@emotion/react',
//       babel: {
//         plugins: ['@emotion/babel-plugin'],
//       },
//     }),
//   ],
// })
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
  },
  server: {
    port: 5173,
  }
})
