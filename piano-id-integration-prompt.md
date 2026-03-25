# Piano ID Integration — Replace Mock Login with Real Piano ID

## Context
The Lakeview University demo site at lakeview.pianodemo.com currently uses mock login/logout flows. The Piano Composer SDK is already loaded in `index.html` with AID `QiNgMM49pu` (production). We need to replace the mock auth with real Piano ID calls so the login modal, registration, and logout are all handled by Piano's native UI.

## Files to modify
- `src/pages/Home.jsx` — this is the only file that needs changes

## Changes required

### 1. Update the import line
Change:
```jsx
import { useState, useRef } from 'react';
```
To:
```jsx
import { useState, useEffect } from 'react';
```
(We no longer need `useRef`, we do need `useEffect`)

### 2. Remove `showLoginModal` state
Delete:
```jsx
const [showLoginModal, setShowLoginModal] = useState(false);
```

### 3. Add Piano ID useEffect after the state declarations
Add this block right after the state declarations (after the `currentSection` useState line):

```jsx
// Piano ID — Session detection + login/logout event listeners
useEffect(() => {
  const tp = window.tp || [];
  tp.push(["init", function() {
    // Pick up existing session (returning user / page refresh)
    const user = window.tp.pianoId.getUser();
    if (user) {
      setIsLoggedIn(true);
      setUserName((user.firstName || "") + " " + (user.lastName || ""));
      setUserEmail(user.email || "");
    }

    // Listen for login/logout events going forward
    window.tp.pianoId.show({
      loggedIn: function(data) {
        setIsLoggedIn(true);
        setUserName((data.user.firstName || "") + " " + (data.user.lastName || ""));
        setUserEmail(data.user.email || "");
      },
      loggedOut: function() {
        setIsLoggedIn(false);
        setHasLicense(false);
        setUserName("");
        setUserEmail("");
      }
    });
  }]);
}, []);
```

### 4. Replace handleLogin
Replace the entire `handleLogin` function with:
```jsx
const handleLogin = () => {
  if (window.tp && window.tp.pianoId) {
    window.tp.pianoId.show({ screen: "login" });
  }
};
```
Piano renders its own modal — we don't need our custom one.

### 5. Replace handleLogout
Replace the entire `handleLogout` function with:
```jsx
const handleLogout = () => {
  if (window.tp && window.tp.pianoId) {
    window.tp.pianoId.logout();
  }
  setIsLoggedIn(false);
  setHasLicense(false);
  setUserName("");
  setUserEmail("");
};
```

### 6. Delete handleMockLogin
Remove the entire `handleMockLogin` function — it's no longer used.

### 7. Delete the mock Login Modal JSX
Remove the entire Login Modal block near the bottom of the JSX return. It starts with:
```jsx
{/* Login Modal */}
{showLoginModal && (
```
and ends with its closing `)}`. Delete this entire block. Piano ID renders its own login/registration UI overlay when `tp.pianoId.show()` is called.

**Keep the License Modal** — that stays as-is for now (still mock).

## What NOT to change
- `index.html` — already has the correct Composer script
- `src/data.js` — no changes needed
- Individual page components (`JournalArticle.jsx`, `CoursePage.jsx`, etc.) — no changes needed
- The license activation modal — stays as mock for now
- Everything else in the styles, JSX structure, navigation, etc. stays the same

## Verification
After making changes:
1. `npm run build` should succeed with no errors
2. The import line should have `useEffect` and not `useRef`
3. There should be zero references to `showLoginModal` or `handleMockLogin` in the file
4. There should be zero references to `useRef` in the file
5. The Login Modal JSX block should be gone
6. The License Modal JSX block should still be present
