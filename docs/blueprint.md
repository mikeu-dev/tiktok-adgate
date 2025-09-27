# **App Name**: TikTok AdGate

## Core Features:

- URL Input and Validation: Accepts TikTok video URLs and validates their format using standard methods. Error state messages are shown for bad URLs.
- TikTok API Integration: Connects to the TikTok Downloader API (https://www.tikwm.com/api/) via POST requests, sending the video URL to their system and receiving the output JSON.
- Video Information Display: Shows video details like thumbnail and title upon receiving JSON data from the TikTok API. Includes clear loading and error states.
- Ad-Gated Download Buttons: Implements download buttons that trigger an ad modal before allowing the user to proceed with the download.
- AdSense Integration: Supports Google AdSense via a custom React component with `adsbygoogle` initialization and ad unit display in the modal and other layout sections.
- Countdown Timer: Displays a countdown timer inside the ad modal, disabling the 'Continue Download' button until the timer reaches zero. Configurable ad display length using a tool (e.g., between 10–15 seconds).
- Minimal User Activity Logging: Logs the number of downloads in localStorage to track minimal user engagement within their local browser only, resetting if the cache is cleared.

## Style Guidelines:

- Primary color: HSL(210, 70%, 50%) – RGB(30, 144, 255). A vibrant blue tone for general interactable elements.
- Background color: HSL(210, 10%, 20%) – RGB(51, 56, 64). A dark desaturated background providing comfortable contrast, emphasizing content without overpowering the design.
- Accent color: HSL(180, 60%, 60%) – RGB(77, 201, 194). A brighter cyan for subtle highlights and call-to-action elements that guides user interaction.
- Body and headline font: 'Inter', a sans-serif font offering excellent legibility for all text elements.
- Code Font: 'Source Code Pro' will be used where inline code must be shown in the app.
- Mobile-first layout to ensure a responsive design. Core components arranged for optimal viewing on smaller screens with collapsible sections for extended content.
- Use a consistent set of simple, outlined icons from a library like Phosphor Icons or Tabler Icons for UI elements (download button, loading indicators, etc.).