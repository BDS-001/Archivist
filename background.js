function handleWebRequest(res) {
    if (res.error) {
        console.log(`NETWORK ERROR: ${res.error} on ${res.url}`);
        return
    }

    console.log(`${res.statusCode} - ${res.url}`);
    if (res.statusCode === 404) {
        const data = res
        browser.tabs.sendMessage(res.tabId, {
            action: 'showBanner',
            data: data
        })
    }
}

browser.webRequest.onCompleted.addListener(handleWebRequest, {urls: ["<all_urls>"], types: ["main_frame"]}, [])
browser.webRequest.onErrorOccurred.addListener(handleWebRequest, {urls: ["<all_urls>"], types: ["main_frame"]})