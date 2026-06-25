// ── State ─────────────────────────────────────────────────────────────────────

const state = {
  screen: 'onboarding',  // 'onboarding' | 'dashboard'
  step: 1,               // 1 or 2 during onboarding
  physique: {},
  preferences: {},
  plan: null,
};

function loadState() {
  try {
    const saved = localStorage.getItem('bodyright_v1');
    if (saved) {
      const data = JSON.parse(saved);
      Object.assign(state, data);
    }
  } catch (_) {}
}

function persistState() {
  const { screen, physique, preferences, plan } = state;
  localStorage.setItem('bodyright_v1', JSON.stringify({ screen, physique, preferences, plan }));
}

function resetState() {
  localStorage.removeItem('bodyright_v1');
  Object.assign(state, { screen: 'onboarding', step: 1, physique: {}, preferences: {}, plan: null });
}

// ── Render ────────────────────────────────────────────────────────────────────

function render() {
  const app = document.getElementById('app');
  if (state.screen === 'dashboard' && state.plan) {
    app.innerHTML = dashboardHTML();
    animateBars();
    attachDashListeners();
  } else {
    app.innerHTML = state.step === 1 ? step1HTML() : step2HTML();
    attachOnboardingListeners();
  }
}

// ── Onboarding ────────────────────────────────────────────────────────────────

function step1HTML() {
  const p = state.physique;
  return `
    <div class="onboarding">
      <div class="onboarding-header">
        <div class="logo">BodyRight</div>
        <div class="step-dots">
          <div class="step-dot active"></div>
          <div class="step-dot"></div>
        </div>
      </div>

      <p class="step-eyebrow">Step 1 of 2</p>
      <h1 class="step-title">Your current<br>physique</h1>
      <p class="step-subtitle">Quick details so your plan actually fits you.</p>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Age</label>
          <input class="form-input" type="number" id="age" placeholder="25"
            min="13" max="80" value="${p.age || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">Weight (kg)</label>
          <input class="form-input" type="number" id="weight_kg" placeholder="80"
            min="30" max="300" value="${p.weight_kg || ''}">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Height (cm)</label>
        <input class="form-input" type="number" id="height_cm" placeholder="178"
          min="100" max="250" value="${p.height_cm || ''}">
      </div>

      <div class="form-group">
        <label class="form-label">Sex</label>
        ${radioCards('sex', [
          { v: 'Male',   label: 'Male' },
          { v: 'Female', label: 'Female' },
          { v: 'Other',  label: 'Prefer not to say' },
        ], p.sex, true)}
      </div>

      <div class="form-group">
        <label class="form-label">Estimated body fat %</label>
        ${radioCards('body_fat', [
          { v: 'under10', label: 'Under 10%', desc: 'Very lean — visible abs' },
          { v: '10-15',   label: '10–15%',    desc: 'Lean, some definition' },
          { v: '15-20',   label: '15–20%',    desc: 'Average, slight softness' },
          { v: '20-30',   label: '20–30%',    desc: 'Above average' },
          { v: 'over30',  label: 'Over 30%',  desc: 'Significant excess' },
        ], p.body_fat)}
      </div>

      <div class="form-group">
        <label class="form-label">Fitness level</label>
        ${radioCards('fitness_level', [
          { v: 'beginner',     label: 'Beginner',     desc: 'Less than 6 months of training' },
          { v: 'intermediate', label: 'Intermediate', desc: '6 months – 2 years' },
          { v: 'advanced',     label: 'Advanced',     desc: '2+ years consistent training' },
        ], p.fitness_level)}
      </div>

      <div id="form-error" class="form-error"></div>
      <button class="btn-primary" id="step1-next">Continue <span>→</span></button>
    </div>
  `;
}

function step2HTML() {
  const pref = state.preferences;
  const selectedDays = pref.days_per_week ? String(pref.days_per_week) : '';
  return `
    <div class="onboarding">
      <div class="onboarding-header">
        <div class="logo">BodyRight</div>
        <div class="step-dots">
          <div class="step-dot done"></div>
          <div class="step-dot active"></div>
        </div>
      </div>

      <button class="btn-back" id="back-btn">← Back</button>
      <p class="step-eyebrow">Step 2 of 2</p>
      <h1 class="step-title">Your goals</h1>
      <p class="step-subtitle">What do you want your body to look and perform like?</p>

      <div class="form-group">
        <label class="form-label">Goal physique</label>
        ${radioCards('goal', [
          { v: 'muscular',      label: 'Muscular',         desc: 'Size and mass, bodybuilder style' },
          { v: 'muscular_lean', label: 'Muscular & Lean',  desc: 'Size with visible definition' },
          { v: 'lean_athletic', label: 'Lean & Athletic',  desc: 'Cut, toned, athletic look' },
          { v: 'big_strong',    label: 'Big & Strong',     desc: 'Powerlifter / strength-first build' },
          { v: 'lean_toned',    label: 'Lean & Toned',     desc: 'Slim with light muscle tone' },
        ], pref.goal)}
      </div>

      <div class="form-group">
        <label class="form-label">Training days per week</label>
        ${radioCards('days', [
          { v: '3', label: '2–3 days', desc: 'Full Body split' },
          { v: '4', label: '4 days',   desc: 'Upper / Lower split' },
          { v: '5', label: '5–6 days', desc: 'Push / Pull / Legs split' },
        ], selectedDays)}
      </div>

      <div id="form-error" class="form-error"></div>
      <button class="btn-primary" id="step2-submit">Build my plan →</button>
    </div>
  `;
}

// ── Radio card helper ─────────────────────────────────────────────────────────

function radioCards(name, options, selected, horizontal = false) {
  const cls = horizontal ? 'radio-cards row' : 'radio-cards';
  return `
    <div class="${cls}">
      ${options.map(({ v, label, desc }) => `
        <label class="radio-card ${selected === v ? 'selected' : ''}">
          <input type="radio" name="${name}" value="${v}" ${selected === v ? 'checked' : ''}>
          <div class="radio-pip"></div>
          <div class="radio-card-body">
            <strong>${label}</strong>
            ${desc ? `<span>${desc}</span>` : ''}
          </div>
        </label>
      `).join('')}
    </div>
  `;
}

// ── Onboarding event handling ─────────────────────────────────────────────────

function attachOnboardingListeners() {
  // Live selection highlight
  document.querySelectorAll('.radio-card input').forEach(input => {
    input.addEventListener('change', () => {
      input.closest('.radio-cards')
           .querySelectorAll('.radio-card')
           .forEach(c => c.classList.remove('selected'));
      input.closest('.radio-card').classList.add('selected');
    });
  });

  const next = document.getElementById('step1-next');
  if (next) {
    next.addEventListener('click', () => {
      const age     = document.getElementById('age').value.trim();
      const weight  = document.getElementById('weight_kg').value.trim();
      const height  = document.getElementById('height_cm').value.trim();
      const sex     = document.querySelector('input[name="sex"]:checked')?.value;
      const bf      = document.querySelector('input[name="body_fat"]:checked')?.value;
      const level   = document.querySelector('input[name="fitness_level"]:checked')?.value;

      if (!age || !weight || !height || !sex || !bf || !level) {
        showError('Please fill in all fields before continuing.');
        return;
      }

      state.physique = {
        age: +age, weight_kg: +weight, height_cm: +height,
        sex, body_fat: bf, fitness_level: level,
      };
      state.step = 2;
      render();
      window.scrollTo(0, 0);
    });
  }

  const back = document.getElementById('back-btn');
  if (back) {
    back.addEventListener('click', () => { state.step = 1; render(); window.scrollTo(0, 0); });
  }

  const submit = document.getElementById('step2-submit');
  if (submit) {
    submit.addEventListener('click', () => {
      const goal = document.querySelector('input[name="goal"]:checked')?.value;
      const days = document.querySelector('input[name="days"]:checked')?.value;

      if (!goal || !days) {
        showError('Please choose a goal physique and training frequency.');
        return;
      }

      state.preferences = { goal, days_per_week: +days };
      state.plan        = generatePlan(goal, +days);
      state.screen      = 'dashboard';
      persistState();
      render();
      window.scrollTo(0, 0);
    });
  }
}

function showError(msg) {
  const el = document.getElementById('form-error');
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function dashboardHTML() {
  const { physique: p, preferences: pref, plan } = state;
  const daysLabel = { 3: '2–3', 4: '4', 5: '5–6' }[pref.days_per_week] || pref.days_per_week;

  return `
    <div class="dashboard">
      <header class="dash-header">
        <div class="logo">BodyRight</div>
        <nav class="dash-nav">
          <span class="nav-item active">Plan</span>
          <span class="nav-item">Progress</span>
          <span class="nav-item">Library</span>
        </nav>
        <button class="btn-ghost" id="edit-plan-btn">Edit plan</button>
      </header>

      <div class="dash-content">

        <!-- Hero -->
        <div class="plan-hero">
          <div class="hero-eyebrow">Your Training Plan</div>
          <div class="hero-title">${plan.goal_label}</div>
          <div class="hero-sub">${plan.split_label} &nbsp;·&nbsp; ${plan.split_sub}</div>
        </div>

        <!-- Stats -->
        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-val">${plan.sets}</div>
            <div class="stat-lbl">Sets / exercise</div>
          </div>
          <div class="stat-card">
            <div class="stat-val sm">${plan.reps}</div>
            <div class="stat-lbl">Rep range</div>
          </div>
          <div class="stat-card">
            <div class="stat-val xs">${plan.rest}</div>
            <div class="stat-lbl">Rest between sets</div>
          </div>
          <div class="stat-card">
            <div class="stat-val">${daysLabel}</div>
            <div class="stat-lbl">Days / week</div>
          </div>
        </div>

        <!-- Tip -->
        <div class="tip-card"><b>Tip —</b> ${plan.tip}</div>

        <!-- Profile strip -->
        <div class="profile-strip">
          <div class="profile-item">
            <span class="profile-item-label">Age</span>
            <span class="profile-item-value">${p.age} yrs</span>
          </div>
          <div class="profile-divider"></div>
          <div class="profile-item">
            <span class="profile-item-label">Weight</span>
            <span class="profile-item-value">${p.weight_kg} kg</span>
          </div>
          <div class="profile-divider"></div>
          <div class="profile-item">
            <span class="profile-item-label">Height</span>
            <span class="profile-item-value">${p.height_cm} cm</span>
          </div>
          <div class="profile-divider"></div>
          <div class="profile-item">
            <span class="profile-item-label">Sex</span>
            <span class="profile-item-value">${p.sex}</span>
          </div>
          <div class="profile-divider"></div>
          <div class="profile-item">
            <span class="profile-item-label">Level</span>
            <span class="profile-item-value">${capitalize(p.fitness_level)}</span>
          </div>
          <div class="profile-divider"></div>
          <div class="profile-item">
            <span class="profile-item-label">Body fat</span>
            <span class="profile-item-value">${p.body_fat.replace('under', '<').replace('over', '>')}%</span>
          </div>
        </div>

        <!-- Weekly Schedule -->
        <div class="section-hd">
          <h2 class="section-title">Weekly Schedule</h2>
          <span class="section-tag orange">All muscles 2×/week</span>
        </div>
        <div class="schedule-grid">
          ${scheduleCardsHTML(plan)}
        </div>

        <!-- Muscle Coverage -->
        <div class="section-hd">
          <h2 class="section-title">Muscle Coverage</h2>
          <span class="section-tag">Direct hits per week</span>
        </div>
        <div class="coverage-card">
          ${coverageBarsHTML(pref.days_per_week)}
        </div>

      </div>
    </div>
  `;
}

function scheduleCardsHTML(plan) {
  return Object.entries(plan.schedule).map(([dayKey, exercises]) => {
    const { num, name } = parseDayKey(dayKey);
    const items = exercises.map((ex, i) => {
      const clean = ex.replace(' *', '').trim();
      const isTimed = /sec|min/.test(ex);
      return `
        <li class="exercise-item">
          <span class="ex-num">${i + 1}</span>
          <span class="ex-name">${clean}</span>
          ${!isTimed ? `<span class="ex-scheme">${plan.sets}×${plan.reps}</span>` : ''}
        </li>
      `;
    }).join('');

    return `
      <div class="day-card">
        <div class="day-eyebrow">${num}</div>
        <div class="day-name">${name || 'Full Body'}</div>
        <div class="day-count">${exercises.length} exercises</div>
        <ul class="exercise-list">${items}</ul>
      </div>
    `;
  }).join('');
}

function coverageBarsHTML(daysPerWeek) {
  const hits = MUSCLE_HITS[splitKeyFor(daysPerWeek)];
  const max  = 3;
  return Object.entries(hits).map(([muscle, count]) => {
    const pct = Math.round((count / max) * 100);
    return `
      <div class="muscle-row">
        <span class="muscle-name">${muscle}</span>
        <div class="bar-track">
          <div class="bar-fill" data-w="${pct}"></div>
        </div>
        <span class="muscle-hits">${count}×</span>
      </div>
    `;
  }).join('');
}

function animateBars() {
  requestAnimationFrame(() => {
    document.querySelectorAll('.bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.w + '%';
    });
  });
}

function attachDashListeners() {
  document.getElementById('edit-plan-btn')?.addEventListener('click', () => {
    if (!confirm('Reset your plan and start over?')) return;
    resetState();
    render();
    window.scrollTo(0, 0);
  });
}

// ── Utilities ─────────────────────────────────────────────────────────────────

function parseDayKey(key) {
  // "Day 1 — Upper A"  →  { num: "Day 1", name: "Upper A" }
  // "Day 1"            →  { num: "Day 1", name: "" }
  const sep = key.indexOf('—');
  if (sep !== -1) {
    return {
      num:  key.slice(0, sep).trim(),
      name: key.slice(sep + 1).trim().replace(/\(repeat\)/i, '').trim(),
    };
  }
  // "Day 3  (optional)" → treat the parenthetical as the name
  const m = key.match(/^(Day \d+)\s*(.*)/i);
  return m ? { num: m[1], name: m[2] || '' } : { num: key, name: '' };
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

// ── Boot ──────────────────────────────────────────────────────────────────────

loadState();
render();
