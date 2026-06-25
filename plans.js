// ── Scheme: sets / reps / rest per goal type ─────────────────────────────────

const SCHEMES = {
  muscular: {
    label: 'Muscular',
    description: 'Size and mass, bodybuilder style',
    sets: 4, reps: '6–10', rest: '2–3 min',
    tip: 'Push close to failure on the last set of each exercise.',
  },
  muscular_lean: {
    label: 'Muscular & Lean',
    description: 'Size with visible definition',
    sets: 4, reps: '8–12', rest: '90 sec',
    tip: 'Superset isolation exercises where marked (*) to save time and add density.',
  },
  lean_athletic: {
    label: 'Lean & Athletic',
    description: 'Cut, toned, athletic look',
    sets: 3, reps: '12–15', rest: '60 sec',
    tip: 'Keep rest strict. Circuit-style effort — stay moving.',
  },
  big_strong: {
    label: 'Big & Strong',
    description: 'Powerlifter / strength-first build',
    sets: 5, reps: '3–5', rest: '3–5 min',
    tip: 'Log every lift. Add weight or a rep each session when you can.',
  },
  lean_toned: {
    label: 'Lean & Toned',
    description: 'Slim with light muscle tone',
    sets: 3, reps: '15–20', rest: '45 sec',
    tip: 'Light weight, full range of motion — feel the muscle working.',
  },
};

// ── Splits: exercises per day ─────────────────────────────────────────────────

const SPLITS = {
  full_body: {
    label: 'Full Body',
    sublabel: '2–3×/week',
    days: {
      'Day 1': [
        'Barbell Squat',
        'Bench Press',
        'Bent-Over Barbell Row',
        'Overhead Press',
        'Romanian Deadlift',
        'Bicep Curl *',
        'Tricep Pushdown *',
        'Plank  (3 × 45 sec)',
      ],
      'Day 2': [
        'Deadlift',
        'Incline Dumbbell Press',
        'Lat Pulldown / Pull-Up',
        'Lateral Raise *',
        'Leg Press',
        'Hammer Curl *',
        'Skull Crusher *',
        'Cable Crunch',
      ],
      'Day 3  (optional)': [
        'Bulgarian Split Squat',
        'Dumbbell Bench Press',
        'Cable Row',
        'Arnold Press',
        'Leg Curl',
        'Face Pull *',
        'Dips *',
        'Ab Wheel Rollout',
      ],
    },
  },

  upper_lower: {
    label: 'Upper / Lower',
    sublabel: '4×/week',
    days: {
      'Day 1 — Upper A': [
        'Bench Press',
        'Barbell Row',
        'Overhead Press',
        'Lat Pulldown / Pull-Up',
        'Bicep Curl *',
        'Tricep Pushdown *',
      ],
      'Day 2 — Lower A': [
        'Barbell Squat',
        'Romanian Deadlift',
        'Leg Press',
        'Leg Curl',
        'Calf Raise',
        'Plank  (3 × 45 sec)',
      ],
      'Day 3 — Upper B': [
        'Incline Dumbbell Press',
        'Cable Row',
        'Lateral Raise *',
        'Close-Grip Pulldown *',
        'Hammer Curl *',
        'Skull Crusher *',
      ],
      'Day 4 — Lower B': [
        'Deadlift',
        'Bulgarian Split Squat',
        'Leg Extension',
        'Leg Curl',
        'Calf Raise',
        'Ab Wheel Rollout',
      ],
    },
  },

  ppl: {
    label: 'Push / Pull / Legs',
    sublabel: '5–6×/week',
    days: {
      'Day 1 — Push': [
        'Bench Press',
        'Overhead Press',
        'Incline Dumbbell Press',
        'Lateral Raise',
        'Tricep Pushdown',
        'Skull Crusher',
      ],
      'Day 2 — Pull': [
        'Deadlift',
        'Lat Pulldown / Pull-Up',
        'Barbell Row',
        'Face Pull',
        'Bicep Curl',
        'Hammer Curl',
      ],
      'Day 3 — Legs': [
        'Barbell Squat',
        'Romanian Deadlift',
        'Leg Press',
        'Leg Curl',
        'Calf Raise',
        'Ab Wheel Rollout',
      ],
      'Day 4 — Push (repeat)': [
        'Bench Press',
        'Overhead Press',
        'Incline Dumbbell Press',
        'Lateral Raise',
        'Tricep Pushdown',
        'Skull Crusher',
      ],
      'Day 5 — Pull (repeat)': [
        'Weighted Pull-Up',
        'Cable Row',
        'Chest-Supported Row',
        'Face Pull',
        'Incline Dumbbell Curl',
        'Hammer Curl',
      ],
      'Day 6 — Legs (optional)': [
        'Front Squat',
        'Hip Thrust',
        'Walking Lunge',
        'Leg Curl',
        'Calf Raise',
        'Cable Crunch',
      ],
    },
  },
};

// ── Muscle coverage: direct hits per week per split ───────────────────────────

const MUSCLE_HITS = {
  full_body:   { Chest: 3, Back: 3, Shoulders: 3, Biceps: 3, Triceps: 3, Quads: 3, Hamstrings: 3, Core: 2 },
  upper_lower: { Chest: 2, Back: 2, Shoulders: 2, Biceps: 2, Triceps: 2, Quads: 2, Hamstrings: 2, Core: 2 },
  ppl:         { Chest: 2, Back: 2, Shoulders: 2, Biceps: 2, Triceps: 2, Quads: 2, Hamstrings: 2, Core: 2 },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function splitKeyFor(days) {
  if (days <= 3) return 'full_body';
  if (days === 4) return 'upper_lower';
  return 'ppl';
}

function generatePlan(goal, daysPerWeek) {
  const scheme = SCHEMES[goal];
  const split  = SPLITS[splitKeyFor(daysPerWeek)];
  return {
    goal,
    goal_label:   scheme.label,
    split_label:  split.label,
    split_sub:    split.sublabel,
    schedule:     split.days,
    sets:         scheme.sets,
    reps:         scheme.reps,
    rest:         scheme.rest,
    tip:          scheme.tip,
  };
}
