# Implement Piano Inline Content Lock Pattern on Gated Content Pages

## Context
The Lakeview University demo site uses Piano Composer to gate content. We want to implement the **inline content lock** pattern from Piano's template demo (https://templates-demo.piano.io/built-ins/content-lock.html).

### How the pattern works:
1. The page renders ALL content normally as sibling elements (paragraphs, sections, etc.)
2. An empty `<div class="piano-container">` is placed between content elements — after a "teaser" portion (e.g., first 2-3 paragraphs)
3. When Composer fires (user has no access), it injects an inline template into `.piano-container` and applies a CSS class `piano-container--active` via an "Apply CSS" card
4. CSS rule `.piano-container--active ~ *` hides everything AFTER the container
5. A fade-out gradient `::before` pseudo-element on the active container creates a visual teaser effect — the content fades to white above the template, signaling "there's more behind the paywall"
6. When the user HAS access (e.g., site license), Composer doesn't fire, the container stays empty, and the full content is visible

**This means the client-side code is simple: just render everything, drop in an empty div, and add some CSS. Composer does the rest.**

## Files to modify
1. `src/pages/JournalArticle.jsx`
2. `src/pages/CoursePage.jsx`
3. `src/pages/LibraryBook.jsx`
4. `src/pages/NewsArticle.jsx`

Additionally, we need a small global CSS addition — either inline in each component or in a shared location.

## Step 1: Read each content page component
Before making any changes, read all four files to understand their current structure and how they render content. Take note of:
- How the article/content body is structured (is it one big block? individual paragraphs? sections?)
- Any existing gating UI (blurred text, overlays, lock messages) — these should be removed
- Whether the page already has a `useEffect` calling `tp.experience.execute()`

## Step 2: Required CSS
Each content page needs this CSS. The cleanest approach is to add a `<style>` tag in the component's JSX return (right after the Google Fonts link tag that already exists), or inject it once in a shared location.

```css
/* Piano inline content lock: hide everything after the active container */
.piano-container--active ~ * {
  display: none;
}

/* Fade-out gradient above the template — creates the "content continues behind paywall" teaser effect */
.piano-container--active {
  position: relative;
}

.piano-container--active::before {
  content: "";
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  height: 200px;
  pointer-events: none;
  background-image: linear-gradient(
    to top,
    #FAF8F5 0%,
    #FAF8F5 20%,
    rgba(250, 248, 245, 0) 100%
  );
}
```

**Important:** The gradient color must match the Lakeview site background color `#FAF8F5` (warm off-white), NOT plain white. This ensures the fade looks seamless.

## Step 3: Restructure content pages for the content lock pattern

The critical requirement is that the article body content and the `.piano-container` div must be **sibling elements** inside a common parent. The CSS sibling selector (`~`) only works on siblings.

### For each content page, the article body area should follow this structure:

```jsx
<div className="article-body">
  {/* Teaser content — always visible */}
  <p>First paragraph of content...</p>
  <p>Second paragraph of content...</p>

  {/* Piano container — Composer injects inline template here for gated users */}
  {item.locked && <div className="piano-container"></div>}

  {/* Remaining content — hidden by CSS when piano-container--active is applied */}
  <p>Third paragraph...</p>
  <p>Fourth paragraph...</p>
  <p>Fifth paragraph...</p>
  {/* ... rest of content */}
</div>
```

Key rules:
- The `piano-container` div MUST be a direct sibling of the content elements it hides — not nested inside a wrapper
- Only insert the `piano-container` div on locked content (`item.locked`). Free content doesn't need it.
- The div must be completely empty — no children, no whitespace
- Place it after a meaningful teaser amount (2-3 paragraphs for articles, or after the course overview for courses)

### Content structure by page type:

**JournalArticle.jsx** — Journals have: title, authors, metadata, abstract, and a full article body. Place the `piano-container` after the abstract so the teaser shows title + authors + abstract, and the full paper content is behind the lock.

**CoursePage.jsx** — Courses have: title, instructor, term, description, and module/syllabus content. Place the `piano-container` after the course description/overview so the teaser shows the course info, and the module details are behind the lock.

**LibraryBook.jsx** — Books have: title, author, metadata, description/summary. Place the `piano-container` after the book summary/first section so the teaser shows the book info, and extended content (table of contents, chapters, etc.) is behind the lock.

**NewsArticle.jsx** — News has: title, date, category, and article body paragraphs. Place the `piano-container` after the first 2-3 paragraphs so the teaser shows the lede, and the rest of the story is behind the lock.

## Step 4: Remove any existing client-side gating UI

On each content page, remove:
- Blurred text styling (`filter: "blur(...)"`, `userSelect: "none"`)
- Lock overlay divs that block content
- "Sign in to access" or "License required" buttons/messages that prevent reading
- Any `canAccess()`, `hasLicense`, or `isLoggedIn` access-checking logic used for content gating
- Conditional rendering that hides/truncates content based on `locked` flag

The `LockBadge` component can stay as a static visual indicator.

## Step 5: Ensure tp.experience.execute() fires on content pages

Check if `tp.experience.execute()` is already called globally in `index.html`. If yes, you're done — Composer will evaluate on every page.

If it's NOT global, OR if experience execute needs to re-fire on client-side route changes (which is likely with a React SPA), add this to each content page component:

```jsx
useEffect(() => {
  // Re-trigger Composer on route change so inline template fires on this page
  if (window.tp && window.tp.experience) {
    window.tp.experience.execute();
  }
}, []);
```

**SPA routing note:** Since this is a React Router SPA, page navigations don't trigger a full page reload. The Composer script in `index.html` fires `tp.experience.execute()` on initial load, but it may NOT re-fire on client-side route changes. Adding the `useEffect` above ensures Composer evaluates on each content page visit. This is important — without it, the inline template won't appear when a user navigates to a gated article from the home page.

## Step 6: Verify the parent element structure

Double-check that the parent container of the article body content does NOT have `overflow: hidden` set in its styles. If it does, the fade-out gradient `::before` pseudo-element (which extends above the container via `bottom: 100%`) will be clipped and invisible. Remove or change `overflow: hidden` to `overflow: visible` on the article body parent.

## What NOT to change
- `index.html` — no changes needed
- `src/data.js` — keep the `locked` boolean (we use it to conditionally render the piano-container div)
- `src/main.jsx` — no changes
- `src/pages/Home.jsx` — no changes (home page doesn't use content lock)
- `src/pages/AccountPage.jsx` — no changes

## Example: What a journal article page should look like after changes

```jsx
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { JOURNALS } from '../data';

export default function JournalArticle() {
  const { slug } = useParams();
  const article = JOURNALS.find(j => j.slug === slug);

  // Re-trigger Composer on route change for SPA
  useEffect(() => {
    if (window.tp && window.tp.experience) {
      window.tp.experience.execute();
    }
  }, [slug]);

  if (!article) return <div>Article not found</div>;

  return (
    <div style={{ /* page wrapper styles */ }}>
      <style>{`
        .piano-container--active ~ * {
          display: none;
        }
        .piano-container--active {
          position: relative;
        }
        .piano-container--active::before {
          content: "";
          position: absolute;
          bottom: 100%;
          left: 0;
          right: 0;
          height: 200px;
          pointer-events: none;
          background-image: linear-gradient(
            to top,
            #FAF8F5 0%,
            #FAF8F5 20%,
            rgba(250, 248, 245, 0) 100%
          );
        }
      `}</style>

      {/* Header, nav, etc. */}

      <main>
        <h1>{article.title}</h1>
        <div>{article.authors} · {article.journal} · {article.year}</div>
        <LockBadge locked={article.locked} />

        {/* Article body — content and piano-container must be siblings */}
        <div className="article-body">
          {/* Teaser: abstract is always visible */}
          <p>{article.abstract}</p>

          {/* Piano inline template container — only on locked content */}
          {article.locked && <div className="piano-container"></div>}

          {/* Full content — hidden when piano-container--active */}
          <p>{/* paragraph 1 of full text */}</p>
          <p>{/* paragraph 2 of full text */}</p>
          <p>{/* paragraph 3 of full text */}</p>
        </div>
      </main>

      {/* Footer */}
    </div>
  );
}
```

This is a simplified example — adapt the actual structure to match each page's existing layout and styles. The critical thing is the sibling relationship and the empty `.piano-container` div placement.

## Verification
After making changes:
1. `npm run build` should succeed with no errors
2. Each locked content page should have a `<div class="piano-container"></div>` in the DOM (inspect with browser dev tools)
3. Free content pages (e.g., `/journals/keynesian-multipliers`) should NOT have a piano-container div
4. Without Composer configured: all content is fully visible on all pages (the piano-container is empty and invisible)
5. With Composer configured (targeting locked pages with an inline template + Apply CSS card adding `piano-container--active`):
   - Users WITHOUT access see: teaser content → fade-out gradient → Piano template (paywall/regwall) → remaining content hidden
   - Users WITH access see: full content, no template, no fade
6. No remaining client-side gating UI (no blurred text, no overlay divs, no "sign in to access" messages)
7. The fade-out gradient color matches the site background (#FAF8F5), not plain white

## Composer Configuration Reminder (for Mark, not for CC)
After the code changes, configure Composer:
1. Create an experience targeting locked content page URLs (e.g., URL contains `/journals/computational-neuroscience`)
2. Add a condition: user does NOT have access to the site license term
3. Action: Show inline template → select your paywall/regwall template → container selector: `.piano-container`
4. Add an "Apply CSS" card that adds class `piano-container--active` to the container
5. When the user registers and gets a site license, Composer's access check passes and the template doesn't fire — full content is visible
