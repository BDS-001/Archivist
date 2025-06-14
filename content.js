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
        background: #CBB67B;
        color: #3B2F1C;
        padding: 15px;
        border: 8px solid #471a0f;
        font-family: 'Pixelify Sans', Arial, sans-serif;
        font-size: 24px;
        z-index: 999999;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
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
    
    if (archive.error) {
        banner.innerHTML = `
            <div style="text-align: center;">
                ${tomeImg}
                <div>ARCHIVIST: Error checking archives</div>
            </div>
        `;
    } else if (archive?.archived_snapshots.closest?.available) {
        const archiveUrl = archive.archived_snapshots.closest.url;
        banner.innerHTML = `
            <div style="text-align: center;">
                ${tomeImg}
                <div style="margin-bottom: 10px;">ARCHIVIST: Archive found!</div>
                <a href="${archiveUrl}" style="display: inline-block; padding: 8px 12px; margin: 2px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 3px; color: #333; text-decoration: none; font-size: 12px;">View Latest Archive</a>
                <a href="https://web.archive.org/web/*/${archive.url}" style="display: inline-block; padding: 8px 12px; margin: 2px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 3px; color: #333; text-decoration: none; font-size: 12px;">View All Archives</a>
            </div>
        `;
    } else {
        banner.innerHTML = `
            <div style="text-align: center;">
                ${tomeImg}
                <div>ARCHIVIST: No archives found for this page</div>
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