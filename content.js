const IMAGE_SIZE = '120px';

// Load the custom font
const fontFace = new FontFace('Pixelify Sans', `url(${browser.runtime.getURL('font/Pixelify_Sans/PixelifySans-VariableFont_wght.ttf')})`);
fontFace.load().then(() => {
    document.fonts.add(fontFace);
});

function createBanner() {
    // Remove existing banner if it exists
    const existingBanner = document.getElementById('archivistBanner');
    if (existingBanner) {
        existingBanner.remove();
    }
    
    const banner = document.createElement('div');
    banner.id = 'archivistBanner';
    banner.innerHTML = `
        <div style="text-align: center;">
            <img src="${browser.runtime.getURL('images/Pasted image.png')}" style="width: ${IMAGE_SIZE}; height: ${IMAGE_SIZE}; image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges; margin-bottom: 10px; display: block; margin-left: auto; margin-right: auto;" alt="Tome">
            <div>ARCHIVIST: Detected Missing Page! Searching archives...</div>
        </div>
    `;
    banner.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 300px;
        background: #F4E4BC;
        color: #2D1B08;
        padding: 15px;
        border: 4px solid #8B4513;
        border-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><rect x="0" y="0" width="4" height="4" fill="%23654321"/><rect x="4" y="0" width="8" height="4" fill="%238B4513"/><rect x="12" y="0" width="4" height="4" fill="%23654321"/><rect x="0" y="4" width="4" height="8" fill="%238B4513"/><rect x="12" y="4" width="4" height="8" fill="%238B4513"/><rect x="0" y="12" width="4" height="4" fill="%23654321"/><rect x="4" y="12" width="8" height="4" fill="%238B4513"/><rect x="12" y="12" width="4" height="4" fill="%23654321"/></svg>') 4;
        font-family: 'Pixelify Sans', Arial, sans-serif;
        font-size: 24px;
        z-index: 999999;
        box-shadow: 4px 4px 0px #654321;
        image-rendering: pixelated;
        image-rendering: -moz-crisp-edges;
        image-rendering: crisp-edges;
    `;
    
    // Ensure body exists
    if (!document.body) {
        document.addEventListener('DOMContentLoaded', () => {
            document.body.appendChild(banner);
        });
    } else {
        document.body.appendChild(banner);
    }
    
    console.log('Banner created');
    return banner;
}

function updateBanner(archive) {
    const banner = document.getElementById('archivistBanner');
    if (!banner) {
        console.log('Banner not found when trying to update');
        return;
    }
    
    const tomeImg = `<img src="${browser.runtime.getURL('images/Pasted image.png')}" style="width: ${IMAGE_SIZE}; height: ${IMAGE_SIZE}; image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges; margin-bottom: 10px; display: block; margin-left: auto; margin-right: auto;" alt="Tome">`;
    const calendarLink = `<a href="https://web.archive.org/web/*/${archive.url}" style="display: inline-block; padding: 8px 12px; margin: 4px; background: #E6D7B8; border: 2px solid #8B4513; color: #2D1B08; text-decoration: none; font-size: 14px; box-shadow: 2px 2px 0px #654321; font-family: 'Pixelify Sans', Arial, sans-serif; image-rendering: pixelated;">View Archive Calendar</a>`;
    
    if (archive.error) {
        banner.innerHTML = `
            <div style="text-align: center;">
                ${tomeImg}
                <div style="margin-bottom: 10px;">ARCHIVIST: Error checking archives</div>
                ${calendarLink}
            </div>
        `;
    } else if (archive?.archived_snapshots.closest?.available) {
        const archiveUrl = archive.archived_snapshots.closest.url;
        banner.innerHTML = `
            <div style="text-align: center;">
                ${tomeImg}
                <div style="margin-bottom: 10px;">ARCHIVIST: Archive found!</div>
                <a href="${archiveUrl}" style="display: inline-block; padding: 8px 12px; margin: 4px; background: #E6D7B8; border: 2px solid #8B4513; color: #2D1B08; text-decoration: none; font-size: 14px; box-shadow: 2px 2px 0px #654321; font-family: 'Pixelify Sans', Arial, sans-serif; image-rendering: pixelated;">View Latest Archive</a>
                ${calendarLink}
            </div>
        `;
    } else {
        banner.innerHTML = `
            <div style="text-align: center;">
                ${tomeImg}
                <div style="margin-bottom: 10px;">ARCHIVIST: No archives found</div>
                ${calendarLink}
            </div>
        `;
    }
    
    console.log('Banner updated', archive);
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Message received:', message);
    
    if (message.action === 'showBanner') {
        createBanner();
        sendResponse({success: true});
    }
    
    if (message.action === 'archiveResults') {
        updateBanner(message.archive);
        sendResponse({success: true});
    }
    
    return true;
});

console.log('Archivist content script loaded');