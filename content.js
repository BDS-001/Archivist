function createBanner() {
    // Remove existing banner if it exists
    const existingBanner = document.getElementById('archivistBanner');
    if (existingBanner) {
        existingBanner.remove();
    }
    
    const banner = document.createElement('div');
    banner.id = 'archivistBanner';
    banner.innerHTML = 'ARCHIVIST: Detected Missing Page! Searching archives...';
    banner.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background: #ff4444;
        color: white;
        padding: 15px;
        text-align: center;
        font-family: Arial, sans-serif;
        font-size: 16px;
        font-weight: bold;
        z-index: 999999;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
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
    
    if (archive.error) {
        banner.innerHTML = 'ARCHIVIST: Error checking archives';
        banner.style.background = '#666';
    } else if (archive.archived_snapshots && archive.archived_snapshots.closest && archive.archived_snapshots.closest.available) {
        const archiveUrl = archive.archived_snapshots.closest.url;
        banner.innerHTML = `ARCHIVIST: Archive found! <a href="${archiveUrl}" style="color: #fff; text-decoration: underline;">View archived version</a>`;
        banner.style.background = '#44aa44';
    } else {
        banner.innerHTML = 'ARCHIVIST: No archives found for this page';
        banner.style.background = '#aa4444';
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