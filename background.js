async function checkArchives(url) {
    try {
        const result = await fetch(`https://archive.org/wayback/available?url=${encodeURIComponent(url)}`);
        if (result.ok) return result.json();
        return {error: `HTTP ${result.status}`};
    } catch (error) {
        return {error: error.message};
    }
}

// Cross-browser compatibility
const browserAPI = (typeof browser !== 'undefined') ? browser : chrome;

async function sendMessageWithRetry(tabId, message, maxRetries = 5) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            await browserAPI.tabs.sendMessage(tabId, message);
            return;
        } catch (error) {
            console.log(`Message send attempt ${i + 1} failed:`, error);
            if (i < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
    }
    console.log('All message send attempts failed');
}

async function handleTabUpdate(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url && 
        (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
        try {
            const response = await fetch(tab.url, {method: 'HEAD'});
            if (response.status === 404) {
                setTimeout(async () => {
                    await sendMessageWithRetry(tabId, {action: 'showNotification'});
                    
                    const archiveResults = await checkArchives(tab.url);
                    await sendMessageWithRetry(tabId, {
                        action: 'archiveResults', 
                        archive: archiveResults
                    });
                }, 500);
            }
        } catch (error) {
            console.log('Error checking page status:', error);
        }
    }
}

browserAPI.tabs.onUpdated.addListener(handleTabUpdate);