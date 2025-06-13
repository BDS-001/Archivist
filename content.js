function createBanner() {
    const banner = document.createElement('div');
    banner.id = 'archivistBanner'
    banner.innerHTML = `ARCHIVIST: Detected Missing Page! searching the archives`;
    banner.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: red;
    color: white;
    padding: 10px;
    z-index: 10000;
    `;
    document.body.appendChild(banner);
    return banner
}

function updateBanner(archive) {
    const banner = document.getElementById('archivistBanner')
    archive.available ? banner.innerHTML = `Archive Discovered! ${archive.url}` : banner.innerHTML = `No Archives Found!`

}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'showBanner') {
        createBanner(message.archive)
    }

    if (message.action === 'archiveResults') {
        updateBanner(message.archive)
    }
})