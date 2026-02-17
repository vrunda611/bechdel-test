// ===========================
// Bechdel Test Checker — Logic
// ===========================

// ---- Language Detection ----
const LANG = document.documentElement.lang === "fr" ? "fr" : "en";
const t = TRANSLATIONS[LANG];

// ---- i18n Helpers ----

function interpolate(template, vars) {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? "");
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (t[key] !== undefined) {
      el.textContent = t[key];
    }
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (t[key] !== undefined) {
      el.setAttribute("data-placeholder", t[key]);
    }
  });
  document.querySelectorAll("[data-i18n-href]").forEach((el) => {
    const key = el.getAttribute("data-i18n-href");
    if (t[key] !== undefined) {
      el.setAttribute("href", t[key]);
    }
  });
}

applyTranslations();

// ---- Data URL (adjust for /fr subdirectory) ----
const DATA_URL = LANG === "fr" ? "../movies.json" : "movies.json";

// Cached dataset (populated after first fetch)
let movieData = null;

// DOM references
const movieInput = document.getElementById("movie-input");
const findOutBtn = document.getElementById("find-out-btn");
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");
const errorMsg = document.getElementById("error-message");
const resultEl = document.getElementById("result");
const resultBadge = document.getElementById("result-badge");
const resultBody = document.getElementById("result-body");
const resultLink = document.getElementById("result-link");
const didYouMeanEl = document.getElementById("did-you-mean");

// ---- Descriptor texts (cycled sequentially) ----

const passTexts = t.passTexts;
const failTexts = t.failTexts;

let passIndex = 0;
let failIndex = 0;

// ---- Data Fetching ----

async function fetchData() {
  if (movieData) return movieData;

  const response = await fetch(DATA_URL);
  if (!response.ok) {
    throw new Error(t.genericError);
  }

  movieData = await response.json();
  return movieData;
}

// ---- Search ----

function searchMovie(query, data) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return null;

  let exactMatches = [];
  let startsWithMatches = [];
  let includesMatches = [];

  for (const movie of data) {
    const title = movie.title.toLowerCase();

    if (title === normalized) {
      exactMatches.push(movie);
    } else if (title.startsWith(normalized)) {
      startsWithMatches.push(movie);
    } else if (title.includes(normalized)) {
      includesMatches.push(movie);
    }
  }

  // Pick from highest-priority bucket, prefer most recent year
  const pickMostRecent = (arr) =>
    arr.sort((a, b) => b.year - a.year)[0];

  if (exactMatches.length) return pickMostRecent(exactMatches);
  if (startsWithMatches.length) return pickMostRecent(startsWithMatches);
  if (includesMatches.length) return pickMostRecent(includesMatches);

  return null;
}

// ---- Fuzzy Matching ----

function levenshteinDistance(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

function fuzzySearch(query, data) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return null;

  const threshold = Math.max(3, Math.floor(normalized.length * 0.4));
  let bestMatch = null;
  let bestDistance = Infinity;

  for (const movie of data) {
    const title = movie.title.toLowerCase();
    const dist = levenshteinDistance(normalized, title);

    if (dist < bestDistance || (dist === bestDistance && bestMatch && movie.year > bestMatch.year)) {
      bestDistance = dist;
      bestMatch = movie;
    }
  }

  return bestDistance <= threshold ? bestMatch : null;
}

// ---- UI Helpers ----

function showLoading() {
  loadingEl.classList.remove("hidden");
  errorEl.classList.add("hidden");
  resultEl.classList.add("hidden");
  resultEl.classList.remove("fade-in");
  findOutBtn.disabled = true;
  findOutBtn.textContent = t.searching;
}

function hideLoading() {
  loadingEl.classList.add("hidden");
  findOutBtn.disabled = false;
  findOutBtn.textContent = t.findOut;
}

function showError(message) {
  hideLoading();
  errorEl.classList.remove("hidden");
  resultEl.classList.add("hidden");
  errorMsg.textContent = message;
}

function showResult(movie, didYouMean = false) {
  hideLoading();
  errorEl.classList.add("hidden");
  resultEl.classList.remove("hidden");

  // Movie title hint
  if (didYouMean) {
    didYouMeanEl.textContent = interpolate(t.didYouMean, { title: movie.title, year: movie.year });
  } else {
    didYouMeanEl.textContent = interpolate(t.movieTitle, { title: movie.title, year: movie.year });
  }
  didYouMeanEl.classList.remove("hidden");

  // Yes! / No. badge
  const passes = movie.rating === 3;
  resultBadge.textContent = passes ? t.yes : t.nope;
  resultBadge.className = "badge " + (passes ? "badge-pass" : "badge-fail");

  // Subtitle text (cycle through descriptors)
  if (passes) {
    resultBody.textContent = passTexts[passIndex % passTexts.length];
    passIndex++;
  } else {
    resultBody.textContent = failTexts[failIndex % failTexts.length];
    failIndex++;
  }

  // BechdelTest.com link
  resultLink.href = `https://bechdeltest.com/view/${movie.id}/`;

  // Trigger fade-in animation
  resultEl.classList.remove("fade-in");
  // Force reflow so re-adding the class restarts the animation
  void resultEl.offsetWidth;
  resultEl.classList.add("fade-in");
}

// ---- Main Handler ----

async function handleSearch() {
  const query = movieInput.textContent.trim();
  if (!query) {
    movieInput.focus();
    return;
  }

  showLoading();

  try {
    const data = await fetchData();
    const movie = searchMovie(query, data);

    if (!movie) {
      const fuzzyMatch = fuzzySearch(query, data);
      if (fuzzyMatch) {
        showResult(fuzzyMatch, true);
      } else {
        showError(interpolate(t.notFound, { query }));
      }
      return;
    }

    showResult(movie);
  } catch (err) {
    showError(err.message || t.genericError);
  }
}

// ---- Event Listeners ----

findOutBtn.addEventListener("click", handleSearch);

movieInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    handleSearch();
  }
});

movieInput.addEventListener("paste", (e) => {
  e.preventDefault();
  const text = e.clipboardData.getData("text/plain");
  document.execCommand("insertText", false, text);
});

// ---- Info Panel ----
const infoPanelToggle = document.getElementById("info-panel-toggle");
const infoPanel = document.getElementById("info-panel");
const infoPanelClose = document.getElementById("info-panel-close");

function openInfoPanel() {
  document.body.classList.add("info-panel-open");
  infoPanel.setAttribute("aria-hidden", "false");
  infoPanelToggle.setAttribute("aria-expanded", "true");
  infoPanelClose.focus();
}

function closeInfoPanel() {
  document.body.classList.remove("info-panel-open");
  infoPanel.setAttribute("aria-hidden", "true");
  infoPanelToggle.setAttribute("aria-expanded", "false");
  infoPanelToggle.focus();
}

infoPanelToggle.addEventListener("click", () => {
  const isOpen = document.body.classList.contains("info-panel-open");
  isOpen ? closeInfoPanel() : openInfoPanel();
});

infoPanelClose.addEventListener("click", closeInfoPanel);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && document.body.classList.contains("info-panel-open")) {
    closeInfoPanel();
  }
});
