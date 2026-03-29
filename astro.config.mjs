import { defineConfig } from 'astro/config'
import icon from 'astro-icon'
import node from '@astrojs/node'

// https://astro.com/docs/en/guides/integrations-guide/node/
export default defineConfig({
    output: 'server',
    adapter: node({ mode: 'standalone' }),
    integrations: [
        icon({
            iconDir: 'src/assets/icons',
        }),
    ],
    vite: {
        ssr: {
            external: ['mongoose'],
        },
    },
})
