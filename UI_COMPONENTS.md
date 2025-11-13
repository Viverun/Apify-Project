# Playlistify AI - UI Components

## Overview
This document describes all the UI components in the `public/index.html` file for the Playlistify AI application.

---

## 4. Navigation Bar
**Element:** `<nav>`

**Features:**
- Sticky navigation with glassmorphism effect (blur backdrop)
- Logo with music icon and branding
- User display section (conditional)
- Login button (conditional)
- Logout button (for authenticated users)

**Classes:**
- `.nav-container` - Max-width container (1200px)
- `.logo` - Branding with SVG icon
- `.nav-links` - Flex container for buttons
- `#userDisplay` - Hidden by default, shows when user is logged in
- `#loginBtn` - Shows when user is not logged in

**Styling:**
- Background: Card color with 80% opacity
- Blur effect: 12px backdrop filter
- Sticky positioning at top with z-index 50

---

## 2. Animated Background
**Elements:** `.animated-gradient-bg` + `.gradient-blob` (x3)

**Features:**
- Fixed-position background layer
- Three animated gradient blobs with different colors and sizes
- Continuous float animation with 20-second cycle
- Opacity effects for depth

**Blobs:**
- **Blob 1:** 500x500px, top-left, primary color (green)
- **Blob 2:** 400x400px, top-right, lighter green, 3s delay
- **Blob 3:** 600x600px, bottom-left, darker green, 7s delay

**Animation:**
- `float` animation: 20 seconds, ease-in-out infinite
- Includes translate and scale transforms

---

## 3. Hero Section
**Element:** `<main>` > `.hero`

**Features:**
- Centered text layout with animation
- Large responsive heading (2.5rem - 5rem)
- Primary color accent on main text
- Descriptive subtitle
- Call-to-action button

**Elements:**
- `<h1>` - Main title with line break
- `.text-primary` - "Playlist Generator" text in green
- `.hero-desc` - Description paragraph
- "Create Playlist" button with music icon

**Animation:**
- Fade-in effect on load (0.8s)

---

## 4. Login Modal
**Element:** `#loginModal`

**Features:**
- Form-based login interface
- Email and password inputs
- Link to signup page
- Modal overlay with 85% opacity background
- Smooth fade-in animation

**Form Fields:**
1. **Email Input**
   - Type: email
   - Placeholder: "your@email.com"
   - Required

2. **Password Input**
   - Type: password
   - Placeholder: "Password"
   - Required

**Actions:**
- Submit button: "Login"
- Signup link: "Don't have an account? Sign up"
- Close button: × icon

---

## 5. Signup Modal
**Element:** `#signupModal`

**Features:**
- Account creation form
- Three input fields for registration
- Link back to login
- Same modal styling as login

**Form Fields:**
1. **Full Name Input**
   - Type: text
   - Placeholder: "John Doe"
   - Required

2. **Email Input**
   - Type: email
   - Placeholder: "your@email.com"
   - Required

3. **Password Input**
   - Type: password
   - Placeholder: "Password (min 6 chars)"
   - Required
   - Min length: 6 characters

**Actions:**
- Submit button: "Create Account"
- Login link: "Already have an account? Login"
- Close button: × icon

---

## 6. Configuration Modal
**Element:** `#configModal`

**Features:**
- Spotify and Apify configuration form
- Saves settings to localStorage
- Loading state with spinner
- Result display area for success/error messages

**Form Fields:**
1. **Apify Actor URL**
   - Type: url
   - Placeholder: "https://your-actor.apify.com"
   - Help text: "Your Apify Actor MCP endpoint URL"
   - Required

2. **Spotify Client ID**
   - Type: text
   - Placeholder: "Your Client ID"
   - Help text: Link to Spotify Dashboard
   - Required

3. **Spotify Client Secret**
   - Type: password
   - Placeholder: "Your Client Secret"
   - Required

4. **Refresh Token**
   - Type: text
   - Placeholder: "Your Refresh Token"
   - Help text: "Generate using Spotify Console"
   - Required

5. **Playlist Description**
   - Type: textarea
   - Placeholder: "e.g., Energetic workout mix with rock and electronic music"
   - Min height: 100px
   - Required

6. **Playlist Name**
   - Type: text
   - Placeholder: "My Awesome Playlist"
   - Required

7. **Number of Tracks**
   - Type: number
   - Default value: 20
   - Min: 5
   - Max: 100
   - Required

**Actions:**
- Submit button: "Create Playlist" with loading spinner
- Close button: × icon
- Result display with success/error messages

---

## 7. Result Display
**Element:** `#result`

**Features:**
- Shows playlist creation success with details
- Displays in playlist-result styling
- Contains link to open playlist on Spotify
- Shows error messages with different styling

**Success Display:**
- Heading: "✨ Playlist Created!"
- Shows playlist name
- Shows track count
- Spotify icon button link (if URL available)

**Error Display:**
- Red-tinted background
- Error message with red text
- Uses `.error-msg` class

---

## 8. Footer
**Element:** `<footer>`

**Features:**
- Fixed at bottom
- Copyright information
- Attribution to Apify Actors
- Centered text layout

**Content:**
- "&copy; 2025 Playlistify AI | Powered by Apify Actors"

**Styling:**
- Background: Card color
- Border-top: 1px border
- Muted text color

---

## Button Styles

### Primary Button (`.btn-primary`)
- Background: Primary green color
- Text: White
- Shadow: Green glow effect
- Hover effect: Lift up animation with increased shadow

### Outline Button (`.btn-outline`)
- Background: Transparent
- Border: 1px solid border color
- Text: Foreground color
- Hover: Secondary background color

### Small Button (`.btn-small`)
- Reduced padding: 0.5rem 1rem
- Smaller font size: 0.875rem

---

## Form Element Styles

### Input & Textarea
- **Background:** Input background color
- **Border:** 1px border color
- **Border radius:** 0.5rem
- **Font:** Inter font family, 1rem size
- **Focus state:** 
  - Border color changes to primary
  - Box shadow: Primary color glow effect
  - Outline: None

### Form Group
- **Margin bottom:** 1.5rem
- **Spacing:** Organized input grouping

### Form Label
- **Font weight:** 500
- **Margin bottom:** 0.5rem

### Form Help Text
- **Font size:** 0.875rem
- **Color:** Muted gray
- **Margin top:** 0.25rem

### Form Links
- **Color:** Primary green
- **Text decoration:** None
- **Hover:** Underline

---

## Modal Styling

### Modal Overlay
- **Position:** Fixed, full viewport
- **Background:** Black with 85% opacity
- **Z-index:** 100
- **Display:** Flex center alignment
- **Padding:** 1rem

### Modal Content
- **Background:** Card color
- **Border radius:** 1rem
- **Padding:** 2rem
- **Max width:** 500px-600px
- **Box shadow:** 20px 60px rgba(0,0,0,0.5)
- **Max height:** 90vh with scroll
- **Animation:** Fade-in (0.3s)

### Modal Header
- **Layout:** Flex with space-between
- **Margin bottom:** 1.5rem

### Close Button
- **Background:** None
- **Border:** None
- **Color:** Muted text
- **Font size:** 1.5rem
- **Cursor:** Pointer
- **Hover:** Foreground color

---

## Color Palette

| Variable | Value | Use Case |
|----------|-------|----------|
| `--background` | HSL 0 0% 9% | Main background (dark) |
| `--foreground` | HSL 0 0% 98% | Text on dark backgrounds |
| `--card` | HSL 0 0% 12% | Card/modal backgrounds |
| `--primary` | HSL 141 73% 42% | Green accent color |
| `--secondary` | HSL 0 0% 18% | Secondary background |
| `--muted` | HSL 0 0% 65% | Muted text |
| `--border` | HSL 0 0% 20% | Border color |
| `--input` | HSL 0 0% 18% | Input backgrounds |

---

## Animations

### fadeIn
- **Duration:** 0.8s (hero), 0.3s (modal)
- **Effect:** Opacity from 0 to 1, Y translate from 20px to 0

### float
- **Duration:** 20s
- **Effect:** Position translate and scale
- **Timing:** ease-in-out infinite

### spin
- **Duration:** 0.6s
- **Effect:** 360-degree rotation
- **Used for:** Loading spinner

---

## Responsive Design

- **Font sizes:** Use `clamp()` for responsive scaling
- **Main heading:** Scales from 2.5rem to 5rem based on viewport width
- **Max width container:** 1200px with padding
- **Mobile padding:** 1.5rem
- **Breakpoints:** Implicit through clamp and flex layouts

---

## Key CSS Features

- **CSS Variables:** Root level theme customization
- **Backdrop filter:** Modern blur effects
- **Radial gradients:** For blob backgrounds
- **Flexbox:** Primary layout method
- **Box sizing:** border-box for all elements
- **Font:** Inter from Google Fonts

---

## Interactive Elements

### Local Storage Integration
- Saves user login data
- Stores Spotify configuration
- Auto-loads configuration on page load

### Event Handlers
- `checkLoginStatus()` - Checks user session on load
- `showLogin()` / `showSignup()` / `showConfigModal()` - Modal controls
- `handleLogin()` - Login form submission
- `handleSignup()` - Signup form submission
- `logout()` - User logout
- `createPlaylist()` - Playlist creation with API call
- `displayResult()` - Show success message
- `showError()` - Show error message
- `closeModal()` / `closeAllModals()` - Modal controls
- Modal click-outside close handler
