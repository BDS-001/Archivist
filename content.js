const IMAGE_SIZE = '120px';

// Load the custom font
const fontFace = new FontFace('Pixelify Sans', `url(${browser.runtime.getURL('font/Pixelify_Sans/PixelifySans-VariableFont_wght.ttf')})`);
fontFace.load().then(() => {
    document.fonts.add(fontFace);
});

function addCloseButtonListener() {
    const closeBtn = document.getElementById('archivistCloseBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            const notification = document.getElementById('archivistNotification');
            if (notification) {
                notification.remove();
            }
        });
    }
}

function getButtonBase(text) {
    return text.length > 12 ? 'button-base-wide-export.webp' : 'button-base.webp';
}

function buildNotificationHTML(text, showCalendarButton = false, archiveUrl = null) {
    const tomeImg = `<img src="${browser.runtime.getURL('images/tome.png')}" style="width: ${IMAGE_SIZE}; height: ${IMAGE_SIZE}; image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges; margin-bottom: 10px; display: block; margin-left: auto; margin-right: auto;" alt="Tome">`;
    const calendarButtonBase = getButtonBase('View Archive Calendar');
    const calendarLink = showCalendarButton ? `<a href="https://web.archive.org/web/*/${window.location.href}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; justify-content: center; padding: 8px 12px; margin: 4px; background-image: url('${browser.runtime.getURL(`images/${calendarButtonBase}`)}'); background-size: 100% 100%; background-repeat: no-repeat; background-position: center; border: none; color: #F4E4BC; text-decoration: none; font-size: 14px; font-family: 'Pixelify Sans', Arial, sans-serif; image-rendering: pixelated; text-shadow: 1px 1px 0px #2D1B08; font-weight: bold; min-width: 100px; min-height: 32px;">View Archive Calendar</a>` : '';
    const archiveButtonBase = getButtonBase('View Latest Archive');
    const archiveButton = archiveUrl ? `<a href="${archiveUrl}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; justify-content: center; padding: 8px 12px; margin: 4px; background-image: url('${browser.runtime.getURL(`images/${archiveButtonBase}`)}'); background-size: 100% 100%; background-repeat: no-repeat; background-position: center; border: none; color: #F4E4BC; text-decoration: none; font-size: 14px; font-family: 'Pixelify Sans', Arial, sans-serif; image-rendering: pixelated; text-shadow: 1px 1px 0px #2D1B08; font-weight: bold; min-width: 100px; min-height: 32px;">View Latest Archive</a>` : '';
    
    return `
        <div style="position: relative;">
            <div style="position: absolute; top: -5px; left: -5px; font-size: 12px; font-weight: bold; color: #8B4513;">ARCHIVIST</div>
            <button id="archivistCloseBtn" style="position: absolute; top: -10px; right: -10px; background: none; color: #2D1B08; border: none; font-size: 30px; width: 40px; height 40px; cursor: pointer; font-weight: bold; line-height: 1; font-family: 'Pixelify Sans', Arial, sans-serif; display: flex; align-items: center; justify-content: center;">x</button>
            <div style="text-align: center;">
                ${tomeImg}
                <div style="margin-bottom: 10px;">${text}</div>
                ${archiveButton}
                ${calendarLink}
            </div>
        </div>
    `;
}

function createNotification() {
    // Remove existing notification if it exists
    const existingNotification = document.getElementById('archivistNotification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.id = 'archivistNotification';
    notification.innerHTML = buildNotificationHTML('Detected Missing Page! Searching archives...');
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
            addCloseButtonListener();
        });
    } else {
        document.body.appendChild(notification);
        addCloseButtonListener();
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
    
    if (archive.error) {
        notification.innerHTML = buildNotificationHTML('Error checking archives', true);
    } else if (archive?.archived_snapshots.closest?.available) {
        const archiveUrl = archive.archived_snapshots.closest.url;
        notification.innerHTML = buildNotificationHTML('Archive found!', true, archiveUrl);
    } else {
        notification.innerHTML = buildNotificationHTML('No archives found', true);
    }
    
    addCloseButtonListener();
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
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