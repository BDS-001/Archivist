# Archivist Firefox Extension

A Firefox extension that automatically detects missing web pages (404 errors) and searches the Internet Archive's Wayback Machine for archived versions of those pages.

## Features

- **Automatic Detection**: Monitors web requests and detects 404 errors
- **Archive Search**: Automatically queries the Internet Archive API for available snapshots
- **Themed Notification**: Displays a styled notification popup with custom pixel art design
- **Direct Archive Access**: Provides buttons to view the latest archive and archive calendar
- **Closeable Interface**: Users can dismiss the notification with a close button
- **Custom Branding**: Features custom "Archivist" branding and tome imagery
- **Retry Logic**: Includes robust retry mechanisms for reliable communication

## How It Works

1. **Background Monitoring**: The extension monitors all web requests in the background
2. **404 Detection**: When a 404 error is detected, it triggers the archive search process
3. **Archive Query**: Queries the Internet Archive's Wayback Machine API for available snapshots
4. **Notification Display**: Shows a themed notification popup in the top-right corner with:
   - **Initial**: "Searching archives..." message with tome image
   - **Success**: "Archive found!" with buttons for latest archive and calendar view
   - **No Results**: "No archives found" with calendar view button
   - **Error**: "Error checking archives" with calendar view button

## Installation

*Note: This extension is currently under development*

### Manual Installation (Developer Mode)

1. Download or clone this repository
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox" in the left sidebar
4. Click "Load Temporary Add-on"
5. Select the `manifest.json` file from the downloaded folder

## Files Overview

- `manifest.json` - Extension configuration and permissions
- `background.js` - Background script that monitors web requests and handles archive API calls
- `content.js` - Content script that creates and manages the themed notification popup
- `popup.html` - Extension popup with custom styling and information
- `images/` - Contains the custom tome icon used in notifications and popup
- `font/` - Contains the Pixelify Sans font family for consistent retro styling

## Permissions

The extension requires the following permissions:
- `webRequest` - Monitor web requests to detect 404 errors
- `tabs` - Communicate with active tabs to display banners
- `<all_urls>` - Access all URLs to monitor for missing pages

## API Usage

The extension uses the Internet Archive's Wayback Machine API:
```
https://archive.org/wayback/available?url={URL}
```

## Development Status

This extension is currently under development. Features and functionality may change.

## Technical Details

- **Manifest Version**: 2
- **Content Script**: Runs on all URLs at document start
- **Background Script**: Persistent background process
- **Retry Logic**: Up to 5 retry attempts with 500ms delays for message passing
- **Timeout**: 500ms delay before showing notification to ensure content script readiness
- **Custom Styling**: Uses Pixelify Sans font with retro pixel art aesthetic
- **Notification Positioning**: Fixed position notification in top-right corner
- **Web Accessible Resources**: Images and fonts are accessible to content scripts

## Contributing

View the source code and contribute at: https://github.com/BDS-001/Archivist

## License

See LICENSE file for details.