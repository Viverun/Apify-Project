# 🔄 Automatic Redirect Configuration

## Overview

The Playlistify AI app is configured to **automatically redirect** users from the homepage (`/` or `/index.html`) to the main playlist creation interface (`/create-playlist.html`). This ensures users always land on the functional interface without manual navigation.

## How It Works

### 1. **JavaScript Redirect (Primary)**
The `index.html` file contains a JavaScript snippet that immediately redirects to `create-playlist.html`:

```javascript
(function() {
  const currentUrl = new URL(window.location.href);
  const queryParams = currentUrl.search; // Preserves ?token=... and any other params
  window.location.href = '/create-playlist.html' + queryParams;
})();
```

**Key Features:**
- ✅ Preserves all query parameters (including `?token=...`)
- ✅ Executes immediately on page load
- ✅ Works in all modern browsers

### 2. **Meta Refresh (Fallback)**
For users with JavaScript disabled, a meta refresh tag provides a fallback:

```html
<meta http-equiv="refresh" content="0; url=/create-playlist.html" />
```

**Note:** This fallback doesn't preserve query parameters, but ensures basic functionality.

### 3. **Loading Message**
Users will briefly see a loading message:
- **Logo:** "Playlistify"
- **Tagline:** "Redirecting to Create Playlist..."
- **Status:** "Loading Playlistify AI..."

## Deployment URLs

### Local Development
```
http://localhost:3001/                           → Redirects to →  http://localhost:3001/create-playlist.html
http://localhost:3001/?token=abc123              → Redirects to →  http://localhost:3001/create-playlist.html?token=abc123
```

### Apify Production
```
https://jubilant-pheasant--apify-project.apify.actor/
  → Redirects to →
https://jubilant-pheasant--apify-project.apify.actor/create-playlist.html?token=apify_api_...
```

## Token Management

The redirect preserves the `token` query parameter, which is essential for:
- ✅ API authentication
- ✅ User session persistence
- ✅ Direct access links

**Example Flow:**
1. User visits: `https://your-app.apify.actor/?token=apify_api_xyz789`
2. JavaScript captures query params: `?token=apify_api_xyz789`
3. Redirects to: `https://your-app.apify.actor/create-playlist.html?token=apify_api_xyz789`
4. Token remains available for API calls

## Testing

### Local Testing
```bash
# Start the server
npm start

# Visit in browser
http://localhost:3001/

# You should be immediately redirected to
http://localhost:3001/create-playlist.html
```

### Test with Token
```
http://localhost:3001/?token=test123
# Should redirect to:
http://localhost:3001/create-playlist.html?token=test123
```

## Customization

### Change Redirect Target
To redirect to a different page, edit `public/index.html`:

```javascript
// Change this line:
window.location.href = '/create-playlist.html' + queryParams;

// To redirect to a different page:
window.location.href = '/your-page.html' + queryParams;
```

### Add Delay (Optional)
To add a brief delay before redirect:

```javascript
setTimeout(() => {
  window.location.href = '/create-playlist.html' + queryParams;
}, 1000); // 1 second delay
```

### Custom Landing Page
If you want to keep a landing page without automatic redirect:
1. Remove the redirect script from `index.html`
2. Remove the meta refresh tag
3. Add a manual button/link to navigate to `create-playlist.html`

## Troubleshooting

### Redirect Not Working
1. **Check JavaScript Console**: Open browser DevTools → Console for errors
2. **Verify File Location**: Ensure `create-playlist.html` exists in `public/` folder
3. **Clear Cache**: Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

### Token Not Preserved
1. **Check URL**: Verify token is in original URL
2. **Check Console**: Look for JavaScript errors
3. **Test Manually**: Try `window.location.search` in browser console

### Meta Refresh Not Working
- **Browsers**: Some browsers require HTTPS for meta refresh
- **Content Security Policy**: Check if CSP headers block redirects

## Benefits

✅ **Better User Experience**: No manual navigation needed
✅ **Token Preservation**: Authentication remains intact
✅ **SEO Friendly**: Can still have a landing page for search engines
✅ **Flexible**: Easy to customize or disable
✅ **Fallback Support**: Works even without JavaScript

## Related Files

- `public/index.html` - Homepage with redirect logic
- `public/create-playlist.html` - Main application interface
- `src/main.ts` - Express server configuration
- `.actor/actor.json` - Apify actor configuration

## See Also

- [Main README](README.md)
- [Apify Deployment Guide](APIFY_DEPLOYMENT.md)
- [Testing Checklist](TESTING_CHECKLIST.md)
