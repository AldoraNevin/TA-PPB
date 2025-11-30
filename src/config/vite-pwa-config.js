export const pwaConfig = {
registerType: 'autoUpdate',
includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
manifest: {
name: 'TFT Set 10 Gallery',
short_name: 'TFT Gallery',
theme_color: '#000000',
background_color: '#111827',
display: 'standalone',
start_url: '/',
icons: [
{ src: '/pwa-64x64.png', sizes: '64x64', type: 'image/png' },
{ src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
{ src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' }
]
},
workbox: {
globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
runtimeCaching: [
{
urlPattern: ({ url }) => url.origin === 'https://raw.communitydragon.org',
handler: 'NetworkFirst',
options: { cacheName: 'cdragon-json' }
},
{
urlPattern: ({ url }) => url.pathname.startsWith('/Assets/'),
handler: 'CacheFirst',
options: { cacheName: 'tft-assets' }
}
]
}
};