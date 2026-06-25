# BodyRight

A workout planner that sculpts your training around the body you want — not a generic template.

You answer two sets of questions (your current physique, then your goals) and BodyRight generates a complete weekly training plan with the right split, set/rep scheme, and muscle coverage for your preference type.

---

## Features

- **Physique intake** — age, sex, weight, height, body fat estimate, fitness level
- **Goal selection** — five physique targets (Muscular, Muscular & Lean, Lean & Athletic, Big & Strong, Lean & Toned)
- **Auto split selection** — Full Body / Upper-Lower / Push-Pull-Legs chosen based on how many days per week you want to train
- **Static plan generator** — pre-built routines per split × goal combination, guaranteed to hit every major muscle group at least twice a week
- **Muscle coverage visualization** — bar chart showing direct weekly hits per muscle group
- **Persistent plan** — saved to `localStorage`, survives page refresh

---

## Running the app

### Web (primary)

Open `index.html` directly in a browser — no build step, no server required.

```
index.html
```

For best results use a local server to avoid any browser CORS restrictions on file loading:

```bash
# Python
python -m http.server 8080

# Node
npx serve .
```

Then visit `http://localhost:8080`.

### Terminal (prototype)

The original terminal version is still fully functional:

```bash
python main.py
```

Requires Python 3.6+. No dependencies.

---

## Project structure

```
BodyRight/
├── index.html      # App shell
├── styles.css      # Design system (Kinetic Minimalist)
├── plans.js        # Static plan data + generatePlan()
├── app.js          # SPA state, rendering, event handling
├── main.py         # Terminal prototype (same logic)
└── diagram.md      # Mermaid.js app flow diagram
```

---

## Design system

**Kinetic Minimalist** — energetic yet disciplined. Clean white base with Energetic Orange (`#ff6b00`) reserved exclusively for interactive elements and primary CTAs.

| Token | Value | Used for |
|---|---|---|
| Primary orange | `#ff6b00` | Buttons, stats, active states |
| Background | `#fcf9f8` | App base |
| Surface | `#ffffff` | Cards |
| Deep carbon | `#1c1b1b` | Body text |
| Typeface | Inter | All text |

Card radius: 16px. Spacing grid: multiples of 4px.

---

## How the plan generator works

The plan is a lookup, not a calculation. Two axes combine:

1. **Days per week → split**
   - 2–3 days → Full Body
   - 4 days → Upper / Lower
   - 5–6 days → Push / Pull / Legs

2. **Goal → set/rep scheme**
   - Muscular → 4 × 6–10, heavy, 2–3 min rest
   - Muscular & Lean → 4 × 8–12, 90 sec rest
   - Lean & Athletic → 3 × 12–15, 60 sec rest
   - Big & Strong → 5 × 3–5, 3–5 min rest
   - Lean & Toned → 3 × 15–20, 45 sec rest

Exercise lists are static per split. The scheme (sets/reps/rest) is applied uniformly. This makes `generatePlan()` in `plans.js` a simple merge — the function that will be replaced when AI is added.

---

## Roadmap

- [ ] AI-driven plan generation (replace static lookup in `generatePlan()`)
- [ ] Workout logging and progress tracking
- [ ] Progress charts (weight lifted over time, consistency)
- [ ] Exercise library with video/form cues
- [ ] Rest timer
- [ ] User accounts and cloud sync
