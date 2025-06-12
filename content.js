function createBanner(data) {
    const banner = document.createElement('div');
    banner.innerHTML = `ARCHIVIST: Detected Missing Page! ${data.statusCode}`;
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
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'showBanner') {
        createBanner(message.data)
    }
})