async function checkArchives(url) {
    try {
        const result = await fetch(`https://archive.org/wayback/available?url=${encodeURIComponent(url)}`);
        if (result.ok) return result.json();
        return {error: `HTTP ${result.status}`};
    } catch (error) {
        return {error: error.message};
    }
}

async function sendMessageWithRetry(tabId, message, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            await browser.tabs.sendMessage(tabId, message);
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

async function handleWebRequest(res) {
    // Only handle 404 errors
    if (res.statusCode !== 404) return;
    
    // Wait a bit for content script to be ready
    setTimeout(async () => {
        await sendMessageWithRetry(res.tabId, {action: 'showBanner'});
        
        // Check archives and update banner
        const archiveResults = await checkArchives(res.url);
        await sendMessageWithRetry(res.tabId, {
            action: 'archiveResults', 
            archive: archiveResults
        });
    }, 1000);
}

browser.webRequest.onCompleted.addListener(handleWebRequest, {urls: ["<all_urls>"], types: ["main_frame"]}, []);