# Piano My Account Widget — Wire Up Real Inline Widget

## Context
The Lakeview University demo site at lakeview.pianodemo.com now has real Piano ID login working. Next step: wire up Piano's My Account widget so logged-in users can manage their account, view subscriptions/licenses, and update profile info — all rendered inline by Piano.

The Piano Composer SDK is already loaded in `index.html` with AID `QiNgMM49pu` (production). Piano ID login/logout is already functional in `Home.jsx`.

## Overview of changes
1. Create a new `src/pages/AccountPage.jsx` with the Piano My Account widget rendered inline
2. Add a `/account` route in `src/main.jsx`
3. Update the My Account nav link in `Home.jsx` to navigate to `/account` instead of scrolling

## File 1: Create `src/pages/AccountPage.jsx`

Create this new file. It should:
- Match the existing site's design system (same header, footer, fonts, color palette as Home.jsx)
- Include the same sticky header with navigation (Home, Journals, Courses, Library, Campus News, My Account)
- The header nav items for Home/Journals/Courses/Library/Campus News should link to `/#journals`, `/#courses`, etc. (or just `/` for Home) using `<Link>` from react-router-dom
- My Account should be highlighted as active in the nav
- Show the logged-in user's name and Sign Out button in the header (same as Home.jsx)
- Have a page title section: "My Account" heading with subtitle "Manage your profile, subscriptions, and site license."
- Include a container div with `id="piano-my-account"` where the Piano widget renders
- Call `tp.myaccount.show()` in a `useEffect` to render the widget into that container

### Piano My Account integration code:
```jsx
useEffect(() => {
  const tp = window.tp || [];
  tp.push(["init", function() {
    // Only show My Account widget if user is logged in
    if (window.tp.pianoId.getUser()) {
      window.tp.myaccount.show({
        displayMode: "inline",
        containerSelector: "#piano-my-account"
      });
    }
  }]);
}, []);
```

### Piano ID session detection:
Same pattern as Home.jsx — detect existing session and listen for login/logout:
```jsx
useEffect(() => {
  const tp = window.tp || [];
  tp.push(["init", function() {
    const user = window.tp.pianoId.getUser();
    if (user) {
      setIsLoggedIn(true);
      setUserName((user.firstName || "") + " " + (user.lastName || ""));
    }

    window.tp.pianoId.show({
      loggedIn: function(data) {
        setIsLoggedIn(true);
        setUserName((data.user.firstName || "") + " " + (data.user.lastName || ""));
      },
      loggedOut: function() {
        setIsLoggedIn(false);
        setUserName("");
      }
    });
  }]);
}, []);
```

### Layout for the My Account page content area:
```jsx
<div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 32px 80px" }}>
  <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: "#1B1B3A", marginBottom: 8 }}>
    My Account
  </h1>
  <p style={{ fontSize: 14, color: "#6B6560", marginBottom: 32 }}>
    Manage your profile, subscriptions, and site license.
  </p>

  {/* Piano My Account widget renders here */}
  <div
    id="piano-my-account"
    style={{
      minHeight: 400,
      background: "white",
      borderRadius: 12,
      border: "1px solid #E2DDD5",
      padding: 32,
    }}
  />
</div>
```

### If the user is NOT logged in:
Instead of the Piano widget container, show a message prompting them to sign in, with a button that calls `window.tp.pianoId.show({ screen: "login" })`.

### Sign Out handling:
The Sign Out button in the header should call:
```jsx
const handleLogout = () => {
  if (window.tp && window.tp.pianoId) {
    window.tp.pianoId.logout();
  }
  setIsLoggedIn(false);
  setUserName("");
  // Navigate back to home after logout
  navigate('/');
};
```
Use `useNavigate` from react-router-dom for the redirect.

## File 2: Update `src/main.jsx`

Add the `/account` route. Import `AccountPage` and add it to the router:
```jsx
import AccountPage from './pages/AccountPage';
```
Add inside the Routes:
```jsx
<Route path="/account" element={<AccountPage />} />
```

## File 3: Update `src/pages/Home.jsx`

Change the My Account nav button from a scroll action to a route navigation.

Find this line in the nav:
```jsx
{isLoggedIn && <button style={styles.navBtn(currentSection === 'account')} onClick={() => scrollToSection('account')}>My Account</button>}
```

Replace with:
```jsx
{isLoggedIn && <Link to="/account" style={{ ...styles.navBtn(false), textDecoration: 'none' }}>My Account</Link>}
```

Make sure `Link` is already imported from `react-router-dom` (it should be).

## Design requirements
- The AccountPage must use the EXACT same header, footer, fonts, and color palette as Home.jsx
- Copy the header and footer JSX from Home.jsx into AccountPage.jsx (including the Google Fonts link tag)
- The sticky header, gold accent color (#C4A44A), dark gradient background, nav styling — all identical
- The My Account nav item should appear active (gold color, gold underline) on this page
- The `#piano-my-account` container should have a white background with rounded corners so the Piano widget looks integrated with the site design

## What NOT to change
- `index.html` — already has the correct Composer script
- `src/data.js` — no changes needed
- Individual content page components — no changes needed
- The license activation modal in Home.jsx — stays as-is

## Verification
After making changes:
1. `npm run build` should succeed with no errors
2. Navigating to `/account` should render the AccountPage with the same header/footer as the home page
3. The `#piano-my-account` div should be present in the DOM when logged in
4. The My Account nav link in Home.jsx should navigate to `/account` (not scroll)
5. If not logged in, the account page should show a sign-in prompt instead of the widget container
6. Sign Out on the account page should log out via Piano ID and redirect to `/`
