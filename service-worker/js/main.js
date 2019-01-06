if ('serviceWorker' in navigator) {
    console.log('Service Worker support')
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('sw_cached_pages.js')
            .then(reg => console.log('Service Worker Register'))
            .catch(err => console.log('error'))
    })
} else {
    console.log(666);
}
