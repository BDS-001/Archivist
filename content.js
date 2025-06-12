function createBanner(data) {
    const banner = document.createElement('div');
    banner.innerHTML = `ARCHIVIST: Detected Missing Page! ${data.statusCode}, check out past versions! `;
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
    const waybackURL = document.createElement('a')
    waybackURL.href = `https://web.archive.org/web/*/${data.url}`
    waybackURL.innerHTML = 'Explore the Archives'
    banner.appendChild(waybackURL)
    document.body.appendChild(banner);
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'showBanner') {
        createBanner(message.data)
    }
})