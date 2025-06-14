const IMAGE_SIZE = '120px';

// Load the custom font
const fontFace = new FontFace('Pixelify Sans', `url(${browser.runtime.getURL('font/Pixelify_Sans/PixelifySans-VariableFont_wght.ttf')})`);
fontFace.load().then(() => {
    document.fonts.add(fontFace);
});

function createNotification() {
    // Remove existing notification if it exists
    const existingNotification = document.getElementById('archivistNotification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.id = 'archivistNotification';
    notification.innerHTML = `
        <div style="position: relative;">
            <div style="position: absolute; top: -5px; left: -5px; font-size: 12px; font-weight: bold; color: #8B4513;">ARCHIVIST</div>
            <div style="text-align: center;">
                <img src="${browser.runtime.getURL('images/Pasted image.png')}" style="width: ${IMAGE_SIZE}; height: ${IMAGE_SIZE}; image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges; margin-bottom: 10px; display: block; margin-left: auto; margin-right: auto;" alt="Tome">
                <div>Detected Missing Page! Searching archives...</div>
            </div>
        </div>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 300px;
        background: #F4E4BC;
        color: #2D1B08;
        padding: 15px;
        border: 4px solid #8B4513;
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
            document.body.appendChild(notification);
        });
    } else {
        document.body.appendChild(notification);
    }
    
    console.log('Notification created');
    return notification;
}

function updateNotification(archive) {
    const notification = document.getElementById('archivistNotification');
    if (!notification) {
        console.log('Notification not found when trying to update');
        return;
    }
    
    const tomeImg = `<img src="${browser.runtime.getURL('images/Pasted image.png')}" style="width: ${IMAGE_SIZE}; height: ${IMAGE_SIZE}; image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges; margin-bottom: 10px; display: block; margin-left: auto; margin-right: auto;" alt="Tome">`;
    const calendarLink = `<a href="https://web.archive.org/web/*/${archive.url}" style="display: inline-block; padding: 8px 12px; margin: 4px; background: #E6D7B8; border: 2px solid #8B4513; color: #2D1B08; text-decoration: none; font-size: 14px; box-shadow: 2px 2px 0px #654321; font-family: 'Pixelify Sans', Arial, sans-serif; image-rendering: pixelated;">View Archive Calendar</a>`;
    
    if (archive.error) {
        notification.innerHTML = `
            <div style="position: relative;">
                <div style="position: absolute; top: -5px; left: -5px; font-size: 12px; font-weight: bold; color: #8B4513;">ARCHIVIST</div>
                <div style="text-align: center;">
                    ${tomeImg}
                    <div style="margin-bottom: 10px;">Error checking archives</div>
                    ${calendarLink}
                </div>
            </div>
        `;
    } else if (archive?.archived_snapshots.closest?.available) {
        const archiveUrl = archive.archived_snapshots.closest.url;
        notification.innerHTML = `
            <div style="position: relative;">
                <div style="position: absolute; top: -5px; left: -5px; font-size: 12px; font-weight: bold; color: #8B4513;">ARCHIVIST</div>
                <div style="text-align: center;">
                    ${tomeImg}
                    <div style="margin-bottom: 10px;">Archive found!</div>
                    <a href="${archiveUrl}" style="display: inline-block; padding: 8px 12px; margin: 4px; background: #E6D7B8; border: 2px solid #8B4513; color: #2D1B08; text-decoration: none; font-size: 14px; box-shadow: 2px 2px 0px #654321; font-family: 'Pixelify Sans', Arial, sans-serif; image-rendering: pixelated;">View Latest Archive</a>
                    ${calendarLink}
                </div>
            </div>
        `;
    } else {
        notification.innerHTML = `
            <div style="position: relative;">
                <div style="position: absolute; top: -5px; left: -5px; font-size: 12px; font-weight: bold; color: #8B4513;">ARCHIVIST</div>
                <div style="text-align: center;">
                    ${tomeImg}
                    <div style="margin-bottom: 10px;">No archives found</div>
                    ${calendarLink}
                </div>
            </div>
        `;
    }
    
    console.log('Notification updated', archive);
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Message received:', message);
    
    if (message.action === 'showNotification') {
        createNotification();
        sendResponse({success: true});
    }
    
    if (message.action === 'archiveResults') {
        updateNotification(message.archive);
        sendResponse({success: true});
    }
    
    return true;
});

console.log('Archivist content script loaded');