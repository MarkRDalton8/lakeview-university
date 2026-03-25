# Fix Vercel 404s + Make Site Composer-Friendly with Real Page Loads

## Context
Two issues to fix:

**Issue 1 — 404 on hard refresh:** Vercel throws a 404 when you hard refresh (CMD-SHIFT-R) on any route like `/journals/computational-neuroscience`. This is because Vercel looks for a literal file at that path, but it's a client-side React Router route — no file exists. We need a Vercel rewrite config.

**Issue 2 — SPA navigation breaks Composer:** React Router's `<Link>` component does client-side navigation without a real page load. This means the Piano Composer SDK (loaded in `index.html`) does NOT re-initialize on route changes. `tp.experience.execute()` has to be manually re-triggered in each component's `useEffect`, which is fragile and doesn't match how a real publisher site works.

**The fix for both:** Add a `vercel.json` rewrite AND convert all cross-page navigation from React Router `<Link>` to standard `<a>` tags. This means every page click triggers a real page load — the browser requests the URL, Vercel serves `index.html` via the rewrite, the Piano SDK fires fresh, and Composer evaluates naturally. This is exactly how Piano works on a real publisher site.

## Changes

### 1. Create `vercel.json` in the project root

Create a new file `vercel.json` at the project root (same level as `package.json`):

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This tells Vercel: for any URL that doesn't match a static file, serve `index.html`. React Router then reads the URL and renders the correct page.

### 2. Convert `<Link>` to `<a>` for cross-page navigation

In every file that uses React Router's `<Link>` component for navigation **between different pages**, replace it with a standard `<a>` tag. This forces a real page load on each navigation.

**Files to check and update:**

#### `src/pages/Home.jsx`
- Content cards currently use `<Link to={/journals/${j.slug}}>` (and similar for courses, library, news)
- Replace with `<a href={/journals/${j.slug}}>` (and similar)
- Also replace any `<Link to="/account">` with `<a href="/account">`
- Remove `Link` from the `import { ... } from 'react-router-dom'` line if it's no longer used
- If `react-router-dom` is no longer imported at all, remove the import entirely

**Important:** The `<a>` tags need the same styling as the old `<Link>` components. The `ContentCard` component currently wraps `<Link>`. Change it to wrap `<a>` instead:

Find the `ContentCard` component and change its inner element from `<Link>` to `<a>`:
```jsx
// Before
const ContentCard = ({ children, to, style }) => (
  <Link to={to} style={{ ... }}>
    {children}
  </Link>
);

// After
const ContentCard = ({ children, to, style }) => (
  <a href={to} style={{ ... }}>
    {children}
  </a>
);
```

#### `src/pages/JournalArticle.jsx`
- Any `<Link>` back to home or to other articles → replace with `<a>`
- Remove `Link` from react-router-dom import if no longer needed
- **Keep** `useParams` from react-router-dom (still needed for reading the slug from the URL)

#### `src/pages/CoursePage.jsx`
- Same as above

#### `src/pages/LibraryBook.jsx`
- Same as above

#### `src/pages/NewsArticle.jsx`
- Same as above

#### `src/pages/AccountPage.jsx`
- Any `<Link>` navigation → replace with `<a>`
- Keep `useParams` or `useNavigate` if used for non-navigation purposes

#### `src/main.jsx`
- **Keep React Router here** — the `<Routes>` and `<Route>` definitions stay. React Router is still needed to parse the URL and render the correct page component. We're only removing client-side *navigation* (`<Link>`), not client-side *routing* (`<Route>`).

### 3. Remove `tp.experience.execute()` from content page useEffects

Since every page visit is now a real page load, the global `tp.experience.execute()` in `index.html` fires naturally on every page. You do NOT need to re-trigger it in each content page component's `useEffect`.

Search all content page files for any `useEffect` that calls `tp.experience.execute()` and **remove the entire useEffect block** (not just the execute call — remove the whole useEffect if that's all it does). The global call in `index.html` handles it.

If a content page has a `useEffect` that does OTHER things besides calling `tp.experience.execute()`, keep the useEffect but remove only the execute line.

### 4. Verify `<a>` tag styles match `<Link>` styles

React Router's `<Link>` renders as an `<a>` tag under the hood, so the styling should transfer directly. But verify that:
- `textDecoration: 'none'` is set on `<a>` tags (Links had this by default in some setups)
- `color: 'inherit'` is set so text doesn't turn blue
- Hover effects still work

The `ContentCard` component already has these styles in its inline style object, so this should just work. But double-check the other `<Link>` usages (nav items, back links, etc.) to make sure they also carry over the styling.

## What NOT to change
- `index.html` — no changes (Piano SDK and `tp.experience.execute()` already fire here)
- `src/data.js` — no changes
- `src/main.jsx` routing — keep `<BrowserRouter>`, `<Routes>`, `<Route>` definitions. Only `<Link>` is being replaced, not the router itself.
- `package.json` — react-router-dom stays as a dependency (still used for `useParams` and route definitions)

## Why this is better for Composer demos
1. **Fresh SDK on every page:** The Piano Composer script in `index.html` fires on every real page load. No need for manual re-triggering.
2. **Reliable experience evaluation:** Composer sees each page visit as a genuine pageview, just like a real publisher site.
3. **URL targeting just works:** Composer targets URLs. With real page loads, the URL is always correct when Composer evaluates.
4. **No race conditions:** With SPA navigation, there's a risk that Composer evaluates before the new page content renders. With real page loads, this can't happen.
5. **Matches customer sites:** Real Piano customers use traditional multi-page sites. Your demo site now behaves the same way, making Composer demos more authentic.

## Verification
After making changes:
1. `npm run build` should succeed with no errors
2. `vercel.json` exists in the project root with the rewrite rule
3. Hard refresh (CMD-SHIFT-R) on any route (e.g., `/journals/computational-neuroscience`) should load the page correctly — no 404
4. Clicking a content card on the home page should trigger a real page load (you'll see the browser's loading indicator in the tab, not just a React re-render)
5. No `<Link>` components from react-router-dom should remain in any page component (search for `<Link` in all files under `src/pages/`)
6. `<Route>` and `useParams` from react-router-dom should still be used in `main.jsx` and content pages
7. The Piano SDK script fires fresh on each page visit (check browser dev tools Network tab — you should see the `experience/load` script request on every navigation)
8. No `tp.experience.execute()` calls in content page `useEffect` hooks (the global call in index.html handles it)
9. All links are visually styled correctly (no blue underlined text, hover effects work)
