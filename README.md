# Buy Sell Market

**Tap to Trade** — a 60-second arcade crypto timing challenge. Buy low, sell high, and grow your account as much as you can before the clock runs out.

## Play

Open `index.html` in any modern browser (desktop or mobile). No build step, no dependencies — it's a single self-contained HTML file.

### Live demo

Once GitHub Pages is enabled: <https://mattbullis1.github.io/Buy-Sell-Market/>

## How to Play

- You start with **$1,000 cash** and a **60-second** round.
- **BUY** spends all your cash to buy NEON COIN at the current price.
- **SELL** dumps your entire bag at the current price.
- Only **one position at a time** — you must sell before you can buy again.
- Sell higher than you bought to score. A **successful sell increases your combo**, and each combo level adds a bonus (up to **+15%**) to your proceeds.
- A **losing sell resets your combo** to zero.
- Your score is your **ending portfolio value** (cash + coins × price).

### Market events

Random events shift the market and its volatility — watch the banner:

| Event | Effect |
| --- | --- |
| **WHALE BUY** | Momentum surges upward |
| **WHALE DUMP** | The market gets slammed |
| **FOMO WAVE** | Traders pile in |
| **PANIC SELL** | Fear spreads fast |
| **SIDEWAYS CHOP** | Lower volatility, harder to time |
| **MOON SIGNAL** | Huge pump incoming |
| **RUG TREMOR** | Sudden collapse risk |

## Features

- Live animated price chart rendered on canvas (glowing line + gradient fill)
- Momentum/drift + volatility market simulation with random shock events
- Combo bonus system rewarding consecutive profitable sells
- Clean mobile-first phone-frame UI that scales to any screen
- Zero dependencies — single HTML file

## Files

| File | Description |
| --- | --- |
| `index.html` | The complete game (HTML, CSS, and JavaScript in one file) |
| `README.md` | This file |
| `tools/smoke.mjs` | Headless-browser smoke test for the deployed site |

## Smoke Test

Verifies the deployed demo loads, the round starts, the timer counts down, the chart canvas renders, and BUY/SELL actually change the portfolio — with no page exceptions.

```bash
node tools/smoke.mjs https://mattbullis1.github.io/Buy-Sell-Market/
```

Requires `playwright` (or `playwright-core` with a local Chrome install).

## Credits

Game originally published at <https://games.mattbullis.com/Buy-Sell-Market/index.html>. Preserved here for archival and demo purposes.
