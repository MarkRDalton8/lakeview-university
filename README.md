# Lakeview University — Digital Commons

A demo university site for showcasing Piano site license capabilities, Piano ID login, and the My Account widget.

## Quick Start

```bash
npm install
npm run dev
```

## Deploy to Vercel

```bash
# Option 1: Vercel CLI
npm i -g vercel
vercel

# Option 2: Git push
# Connect your repo to Vercel — it auto-detects Vite and deploys.
```

Vercel will auto-detect the Vite framework. No additional configuration needed.

## Wiring Up Real Piano Integration

### 1. Add your Piano SDK

In `index.html`, uncomment the Piano script block and replace `YOUR_AID` with your Piano Application ID:

```html
<script src="https://sandbox.tinypass.com/xbuilder/experience/load?aid=YOUR_AID"></script>
<script>
  var tp = window.tp || [];
  tp.push(["setAid", "YOUR_AID"]);
  tp.push(["setSandbox", true]);  // false for production
  tp.push(["setUsePianoIdUserProvider", true]);
  tp.push(["init", function() {
    tp.experience.execute();
  }]);
</script>
```

### 2. Integration Points in `LakeviewUniversity.jsx`

The component has commented-out `tp.*` calls at each integration point:

| Feature | Piano API | Container ID |
|---------|-----------|--------------|
| Login | `tp.pianoId.show()` | `#piano-login-container` |
| My Account | `tp.myaccount.show()` | `#piano-my-account` |
| License Activation | `tp.offer.show()` | `#piano-license-container` |
| Access Check | `tp.api.callApi("/access/list")` | — |

### 3. Configuration

At the top of `LakeviewUniversity.jsx`, update the `PIANO_CONFIG` object:

```js
const PIANO_CONFIG = {
  AID: "YOUR_PIANO_AID_HERE",
  SANDBOX: true,
  PIANO_JS_URL: "https://sandbox.tinypass.com/xbuilder/experience/load?aid=YOUR_AID",
};
```

## Demo Flow

1. **Unauthenticated** — Content shows lock badges, abstracts are blurred
2. **Sign In** — Piano ID login modal (mock or real)
3. **Activate License** — Site license activation offer
4. **Licensed** — All content unlocks
5. **My Account** — Profile, license status, and Piano My Account widget

## Project Structure

```
├── index.html              # Entry point + Piano SDK script
├── src/
│   ├── main.jsx            # React mount
│   └── LakeviewUniversity.jsx  # Main app component
├── public/
│   └── favicon.svg
├── package.json
└── vite.config.js
```
