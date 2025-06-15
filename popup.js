async function getPageUrl() {
    const tab = await browser.tabs.query({active: true, currentWindow: true})
    return tab[0].url
}

async function setupArchiveLink() {
    const url = await getPageUrl()
    const button = document.createElement('a')
    button.href = `https://web.archive.org/web/*/${url}`
    button.innerHTML = 'View Archive'
    button.className = 'archive-button'
    button.target = '_blank'
    button.rel = 'noopener noreferrer'

    const container = document.querySelector('.popup-container')
    container.append(button)
}

setupArchiveLink()