async function getPageUrl() {
    const tab = await browser.tabs.query({active: true, currentWindow: true})
    return tab[0].url
}

async function setupArchiveLink() {
    const url = await getPageUrl()
    
    //check if we should show the archive functionality
    const isSettingsPage = url.includes('chrome://') || url.includes('moz-extension://') || url.includes('about:') || url.includes('chrome-extension://')
    const isNewTab = url.includes('newtab') || url === 'about:blank' || url === 'chrome://newtab/'
    
    //dont create button for settings pages and new tabs
    if (isSettingsPage || isNewTab) {
        return
    }
    
    const buttonText = 'View Archive'
    const buttonBase = buttonText.length > 12 ? 'button-base-wide-export.webp' : 'button-base.webp'
    
    const button = document.createElement('a')
    button.href = `https://web.archive.org/web/*/${url}`
    button.innerHTML = buttonText
    button.className = 'archive-button'
    button.target = '_blank'
    button.rel = 'noopener noreferrer'
    button.style.backgroundImage = `url('${browser.runtime.getURL(`images/${buttonBase}`)}')`
    button.style.backgroundSize = '100% 100%'
    button.style.backgroundRepeat = 'no-repeat'
    button.style.backgroundPosition = 'center'
    button.style.display = 'flex'
    button.style.alignItems = 'center'
    button.style.justifyContent = 'center'
    button.style.padding = '8px 12px'
    button.style.border = 'none'
    button.style.color = '#F4E4BC'
    button.style.textDecoration = 'none'
    button.style.fontSize = '14px'
    button.style.fontFamily = "'Pixelify Sans', Arial, sans-serif"
    button.style.imageRendering = 'pixelated'
    button.style.textShadow = '1px 1px 0px #2D1B08'
    button.style.fontWeight = 'bold'
    button.style.minWidth = '100px'
    button.style.minHeight = '32px'

    const archiveSection = document.createElement('div')
    archiveSection.style.display = 'flex'
    archiveSection.style.alignItems = 'center'
    archiveSection.style.justifyContent = 'space-between'
    archiveSection.style.marginTop = '15px'
    archiveSection.style.padding = '12px'
    archiveSection.style.backgroundColor = '#E6D7B8'
    archiveSection.style.border = '2px solid #8B4513'
    archiveSection.style.boxShadow = 'inset 2px 2px 0px #F4E4BC, inset -2px -2px 0px #D4C4A8'
    archiveSection.style.fontFamily = "'Pixelify Sans', Arial, sans-serif"
    archiveSection.style.imageRendering = 'pixelated'

    const text = document.createElement('span')
    text.textContent = 'View current page archives'
    text.style.fontSize = '12px'
    text.style.color = '#2D1B08'
    text.style.fontWeight = 'bold'
    text.style.textShadow = '1px 1px 0px #F4E4BC'
    text.style.letterSpacing = '0.5px'

    archiveSection.appendChild(button)
    archiveSection.appendChild(text)

    const container = document.querySelector('.popup-container')
    container.appendChild(archiveSection)
}

setupArchiveLink()