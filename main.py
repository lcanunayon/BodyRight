import os


# ---------------------------------------------------------------------------
# Display helpers
# ---------------------------------------------------------------------------

def clear():
    os.system("cls" if os.name == "nt" else "clear")


def header(title):
    print("\n" + "=" * 56)
    print(f"  {title}")
    print("=" * 56)


def divider():
    print("  " + "─" * 54)


def prompt_int(prompt, lo, hi):
    while True:
        try:
            val = int(input(prompt).strip())
            if lo <= val <= hi:
                return val
            print(f"  Enter a number between {lo} and {hi}.")
        except ValueError:
            print("  Invalid — enter a whole number.")


def prompt_choice(options):
    for i, opt in enumerate(options, 1):
        print(f"    {i}. {opt}")
    idx = prompt_int("\n  Your choice: ", 1, len(options))
    return idx - 1


# ---------------------------------------------------------------------------
# Static plan data
# ---------------------------------------------------------------------------

# Sets / reps / rest scheme per goal type
SCHEMES = {
    "muscular": {
        "sets": 4, "reps": "6–10", "rest": "2–3 min",
        "tip": "Push close to failure on the last set of each exercise.",
    },
    "muscular_lean": {
        "sets": 4, "reps": "8–12", "rest": "90 sec",
        "tip": "Superset isolation exercises where marked (*) to save time and add density.",
    },
    "lean_athletic": {
        "sets": 3, "reps": "12–15", "rest": "60 sec",
        "tip": "Keep rest strict. Circuit-style effort — stay moving.",
    },
    "big_strong": {
        "sets": 5, "reps": "3–5", "rest": "3–5 min",
        "tip": "Log every lift. Add weight or a rep each session when you can.",
    },
    "lean_toned": {
        "sets": 3, "reps": "15–20", "rest": "45 sec",
        "tip": "Light weight, full range of motion, feel the muscle working.",
    },
}

# Exercise list per split
SPLITS = {
    "full_body": {
        "label": "Full Body  (2–3×/week)",
        "days": {
            "Day 1": [
                "Barbell Squat",
                "Bench Press",
                "Bent-Over Barbell Row",
                "Overhead Press",
                "Romanian Deadlift",
                "Bicep Curl *",
                "Tricep Pushdown *",
                "Plank  (3 × 30–60 sec)",
            ],
            "Day 2": [
                "Deadlift",
                "Incline Dumbbell Press",
                "Lat Pulldown / Pull-Up",
                "Lateral Raise *",
                "Leg Press",
                "Hammer Curl *",
                "Skull Crusher *",
                "Cable Crunch",
            ],
            "Day 3  (optional)": [
                "Bulgarian Split Squat",
                "Dumbbell Bench Press",
                "Cable Row",
                "Arnold Press",
                "Leg Curl",
                "Face Pull *",
                "Dips *",
                "Ab Wheel Rollout",
            ],
        },
    },
    "upper_lower": {
        "label": "Upper / Lower  (4×/week)",
        "days": {
            "Day 1 — Upper A": [
                "Bench Press",
                "Barbell Row",
                "Overhead Press",
                "Lat Pulldown / Pull-Up",
                "Bicep Curl *",
                "Tricep Pushdown *",
            ],
            "Day 2 — Lower A": [
                "Barbell Squat",
                "Romanian Deadlift",
                "Leg Press",
                "Leg Curl",
                "Calf Raise",
                "Plank  (3 × 45 sec)",
            ],
            "Day 3 — Upper B": [
                "Incline Dumbbell Press",
                "Cable Row",
                "Lateral Raise *",
                "Close-Grip Pulldown *",
                "Hammer Curl *",
                "Skull Crusher *",
            ],
            "Day 4 — Lower B": [
                "Deadlift",
                "Bulgarian Split Squat",
                "Leg Extension",
                "Leg Curl",
                "Calf Raise",
                "Ab Wheel Rollout",
            ],
        },
    },
    "ppl": {
        "label": "Push / Pull / Legs  (5–6×/week)",
        "days": {
            "Day 1 — Push": [
                "Bench Press",
                "Overhead Press",
                "Incline Dumbbell Press",
                "Lateral Raise",
                "Tricep Pushdown",
                "Skull Crusher",
            ],
            "Day 2 — Pull": [
                "Deadlift",
                "Lat Pulldown / Pull-Up",
                "Barbell Row",
                "Face Pull",
                "Bicep Curl",
                "Hammer Curl",
            ],
            "Day 3 — Legs": [
                "Barbell Squat",
                "Romanian Deadlift",
                "Leg Press",
                "Leg Curl",
                "Calf Raise",
                "Ab Wheel Rollout",
            ],
            "Day 4 — Push  (repeat)": [
                "Bench Press",
                "Overhead Press",
                "Incline Dumbbell Press",
                "Lateral Raise",
                "Tricep Pushdown",
                "Skull Crusher",
            ],
            "Day 5 — Pull  (repeat)": [
                "Weighted Pull-Up",
                "Cable Row",
                "Chest-Supported Row",
                "Face Pull",
                "Incline Dumbbell Curl",
                "Hammer Curl",
            ],
            "Day 6 — Legs  (optional)": [
                "Front Squat",
                "Hip Thrust",
                "Walking Lunge",
                "Leg Curl",
                "Calf Raise",
                "Cable Crunch",
            ],
        },
    },
}

GOAL_LABELS = {
    "muscular":      "Muscular",
    "muscular_lean": "Muscular & Lean",
    "lean_athletic": "Lean & Athletic",
    "big_strong":    "Big & Strong",
    "lean_toned":    "Lean & Toned",
}


def split_key_for(days: int) -> str:
    if days <= 3:
        return "full_body"
    if days == 4:
        return "upper_lower"
    return "ppl"


# ---------------------------------------------------------------------------
# Stage 1 — Current Physique
# ---------------------------------------------------------------------------

def collect_physique() -> dict:
    header("STAGE 1 of 3 — Current Physique")
    print("  A few quick details so your plan actually fits you.\n")

    age = prompt_int("  Age (years, 13–80): ", 13, 80)

    print("\n  Sex:")
    sex_opts = ["Male", "Female", "Prefer not to say"]
    sex = sex_opts[prompt_choice(sex_opts)]

    weight = prompt_int("\n  Weight in kg  (e.g. 80): ", 30, 300)
    height = prompt_int("  Height in cm  (e.g. 178): ", 100, 250)

    print("\n  Estimated body fat %  (rough guess is fine):")
    bf_opts = [
        "Under 10%  — very lean, abs clearly visible",
        "10–15%     — lean, some definition",
        "15–20%     — average, slight softness",
        "20–30%     — above average",
        "Over 30%   — significant excess body fat",
    ]
    body_fat = bf_opts[prompt_choice(bf_opts)]

    print("\n  Current fitness level:")
    level_opts = [
        "Beginner       (less than 6 months of consistent training)",
        "Intermediate   (6 months – 2 years)",
        "Advanced       (2+ years consistent)",
    ]
    fitness_level = level_opts[prompt_choice(level_opts)]

    return {
        "age": age,
        "sex": sex,
        "weight_kg": weight,
        "height_cm": height,
        "body_fat": body_fat,
        "fitness_level": fitness_level,
    }


# ---------------------------------------------------------------------------
# Stage 2 — Preferences
# ---------------------------------------------------------------------------

def collect_preferences() -> dict:
    header("STAGE 2 of 3 — Your Preferences")
    print("  What do you want your body to look and perform like?\n")

    print("  Goal physique:")
    goal_opts = [
        "Muscular            — size and mass, bodybuilder style",
        "Muscular & Lean     — size with visible definition",
        "Lean & Athletic     — cut, toned, athletic look",
        "Big & Strong        — powerlifter / strength-first build",
        "Lean & Toned        — slim with light muscle tone",
    ]
    goal_keys = ["muscular", "muscular_lean", "lean_athletic", "big_strong", "lean_toned"]
    goal = goal_keys[prompt_choice(goal_opts)]

    print("\n  How many days per week do you want to train?")
    freq_opts = [
        "2–3 days   — Full Body split",
        "4 days     — Upper / Lower split",
        "5–6 days   — Push / Pull / Legs split",
    ]
    freq_values = [3, 4, 5]
    days_per_week = freq_values[prompt_choice(freq_opts)]

    return {"goal": goal, "days_per_week": days_per_week}


# ---------------------------------------------------------------------------
# Stage 3 — Plan generation (static lookup)
# ---------------------------------------------------------------------------

def generate_plan(preferences: dict) -> dict:
    goal = preferences["goal"]
    days = preferences["days_per_week"]
    split = SPLITS[split_key_for(days)]
    scheme = SCHEMES[goal]
    return {
        "split_label": split["label"],
        "schedule": split["days"],
        **scheme,
    }


# ---------------------------------------------------------------------------
# Stage 4 — Display
# ---------------------------------------------------------------------------

def display_plan(physique: dict, preferences: dict, plan: dict) -> None:
    clear()
    header("STAGE 3 of 3 — Your Personalised Plan")

    print(f"  Profile  : {physique['sex']}, {physique['age']} yrs  |  "
          f"{physique['weight_kg']} kg  |  {physique['height_cm']} cm")
    print(f"  Level    : {physique['fitness_level'].split('(')[0].strip()}")
    print(f"  Goal     : {GOAL_LABELS[preferences['goal']]}")
    print(f"  Split    : {plan['split_label']}")
    print(f"  Scheme   : {plan['sets']} sets × {plan['reps']} reps   Rest: {plan['rest']}")
    print(f"  Tip      : {plan['tip']}")

    divider()

    for day, exercises in plan["schedule"].items():
        print(f"\n  {day}")
        print(f"    {'─' * 50}")
        for i, ex in enumerate(exercises, 1):
            # Ab / hold exercises already carry their own set/rep note
            if "sec" in ex or "min" in ex:
                print(f"    {i:>2}. {ex}")
            else:
                print(f"    {i:>2}. {ex:<36}  {plan['sets']} × {plan['reps']}")

    divider()
    print()
    print("  Every major muscle group is hit at least 2× per week.")
    print("  * marks exercises you can superset with the one above.")
    print()
    print("  When you can complete all reps cleanly, add weight next session.")
    print()


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main():
    clear()
    print()
    print("  " + "=" * 52)
    print("          B O D Y R I G H T")
    print("          Sculpt the body you want.")
    print("  " + "=" * 52)
    print()
    print("  Answer a few questions and you will get a complete")
    print("  weekly training plan built around your goals.")
    print()
    input("  Press Enter to begin...\n")

    physique = collect_physique()
    preferences = collect_preferences()

    header("Building your plan...")
    plan = generate_plan(preferences)

    display_plan(physique, preferences, plan)


if __name__ == "__main__":
    main()
