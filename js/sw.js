// sw.js

const CACHE_NAME = 'globle-cache-v3'; // Aumentei a versão para forçar a atualização

// Lista simplificada para garantir que os ficheiros essenciais existem.
// Todos os caminhos são relativos ao index.html
const urlsToCache = [
    './',
    './index.html',
    './css/main.css',
    './css/game.css',
    './css/historico.css',
    './css/modal.css',
    './js/main.js',
    './js/app.js',
    './js/api.js',
    './js/utils.js',
    './js/modes/countryle.js',
    './js/modes/flagle.js',
    './conf/icon-192.png', // Verifique se os ícones estão DENTRO da pasta conf
    './conf/icon-512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache aberto. A tentar adicionar ficheiros...');
                return cache.addAll(urlsToCache);
            })
            .catch(err => {
                console.error('Falha ao executar cache.addAll(): ', err);
            })
    );
});

self.addEventListener('fetch', event => {
    if (event.request.url.includes('restcountries.com')) {
        return fetch(event.request);
    }
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});