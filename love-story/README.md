# Interactive Birthday Card

A single-page, no-build-tools website that plays three sequential scenes:
an arrow shot from a hand-drawn bow, a cinematic "Happy Birthday" card
reveal, and a tree that grows and blooms into a heart-shaped canopy.

## Run it

No framework, no build step — just open `index.html` in any modern browser:

- double-click `index.html`, or
- serve the folder (nicer for mobile testing): `python3 -m http.server` then
  visit `http://localhost:8000`

Works with mouse **and** touch (drag the arrow back with your finger).

## Personalize it

Everything editable lives in **`config.js`** — you should never need to
touch the HTML/CSS/JS:

| Key | What it controls |
|---|---|
| `recipientName` / `senderName` | who it's for / who it's from |
| `introLine`, `pullInstruction` | Scene 1 texts |
| `wishLine`, `cardTitle`, `cardSubtitle` | Scene 2 card texts |
| `signatureLine`, `finaleTitle`, `finaleSubtitle` | Scene 3 texts |
| `bgCream`, `bgCrimson`, `ink`, `accentGold`, `heartPink`, `heartDeep` | the whole color palette |
| `heartBlueTop`, `heartBlueDeep` | the floating heart's gradient |
| `leafColors` | array of leaf/blossom colors for the tree scene |
| `autoAdvanceCard`, `cardHoldMs` | whether/how long the card waits before the tree scene |

Change a value, save, refresh — done.

## The three scenes

1. **Bow & Arrow** — drag the arrow back on the sketch-style bow and release
   it at the floating heart.
2. **Burst → Card** — the heart pops, crimson radiates out to fill the
   screen, letterbox bars part to reveal the birthday card.
3. **Blooming Tree** — the scene fades to cream, a tree draws itself on,
   blossoms cascade into a heart-shaped canopy, and a final message appears.
   Hit *replay* any time to watch it again.

## Files

```
index.html   markup for all three scenes
style.css    theming + animations (colors via CSS custom properties)
config.js    ALL editable text/colors — start here
app.js       scene manager + bow physics + transitions
```
