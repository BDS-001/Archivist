async function checkArchives(url) {
    try {
        const result = await fetch(`https://archive.org/wayback/available?url=${encodeURIComponent(url)}`);
        if (result.ok) return result.json();

        const error = {
            name: "HTTPError",
            message: `Failed to fetch from endpoint. Status: ${result.status}`
        }
        return {error};
    } catch (error) {
        return {error};
    }
}

async function handleWebRequest(res) {
    if (res.error) {
        return
    }

    if (res.statusCode === 404) {
        let message = {action: 'showBanner'}
        browser.tabs.sendMessage(res.tabId, message).catch(() => {})

        const archiveResults = await checkArchives(res.url)
        message = {action: 'archiveResults', archive: archiveResults}
        browser.tabs.sendMessage(res.tabId, message).catch(() => {})
    }
}

browser.webRequest.onCompleted.addListener(handleWebRequest, {urls: ["<all_urls>"], types: ["main_frame"]}, [])
browser.webRequest.onErrorOccurred.addListener(handleWebRequest, {urls: ["<all_urls>"], types: ["main_frame"]})