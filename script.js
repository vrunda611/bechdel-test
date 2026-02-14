// ===========================
// Bechdel Test Checker — Logic
// ===========================

const DATA_URL = "movies.json";

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

const passTexts = [
  "Women talked to each other about something other than a man. The bar is low and yet.",
  "Women had a whole conversation without mentioning a single dude. Revolutionary, apparently.",
  "The women in this film acknowledged each other's existence. Cinema is healing.",
  "Two women spoke and the world didn't end. Take notes, Hollywood.",
  "Women talking to women about not-men. Groundbreaking. Literally groundbreaking.",
  "The girls are girlbossing, the plot is plotting, and men are simply not involved.",
  "Proof that women can in fact carry a conversation without a man. Shocking, we know.",
  "The women had things to say to each other. And none of it was about Greg.",
  "Somewhere, a woman talked to another woman about literally anything else. We won.",
  "Women existing beyond the male gaze? In THIS economy? Love that for them.",
  "Two named women. One conversation. Zero men mentioned. That's cinema, baby.",
  "The bare minimum was met and honestly? We're celebrating.",
  "Women spoke to each other like real humans do. The representation we deserve.",
  "Not a single 'but what does he think?' in sight. A masterpiece of dialogue.",
  "The women in this movie passed the vibe check AND the Bechdel Test.",
  "Women having conversations about stuff that matters to them. Wild concept, huge if true.",
];

const failTexts = [
  "Unfortunately the women were busy existing around men.",
  "The women simply did not have time for each other. Too many men to orbit, apparently.",
  "Shockingly, the women forgot to talk to each other. Must've been busy being plot devices.",
  "The girlies never got their moment. Hollywood said 'not today.'",
  "Two women could have had a chat. The writers said absolutely not.",
  "The women were there. They just... never spoke. Like decorative houseplants.",
  "Zero woman-to-woman conversations detected. The algorithm is disappointed.",
  "The women's dialogue budget was apparently spent on the men. Classic.",
  "Another film where women exist exclusively in relation to men. Groundbreaking.",
  "The women were present but narratively invisible. A tale as old as cinema.",
  "She was there. She was named. She just never talked to another her.",
  "The script really said 'women talking to women? Not on my watch.'",
  "Turns out the women had nothing to say to each other. Or weren't allowed to.",
  "The women in this film communicated exclusively through men. Very carrier pigeon of them.",
  "No woman-to-woman dialogue found. The bar was underground and they brought a shovel.",
  "Hollywood once again confirming that women only exist when men are watching.",
];

let passIndex = 0;
let failIndex = 0;

// ---- Data Fetching ----

async function fetchData() {
  if (movieData) return movieData;

  const response = await fetch(DATA_URL);
  if (!response.ok) {
    throw new Error("Failed to load movie data.");
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
  findOutBtn.textContent = "Searching\u2026";
}

function hideLoading() {
  loadingEl.classList.add("hidden");
  findOutBtn.disabled = false;
  findOutBtn.textContent = "Find Out";
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
    didYouMeanEl.textContent = `Did you mean "${movie.title} (${movie.year})"?`;
  } else {
    didYouMeanEl.textContent = `${movie.title} (${movie.year})`;
  }
  didYouMeanEl.classList.remove("hidden");

  // Yes! / No. badge
  const passes = movie.rating === 3;
  resultBadge.textContent = passes ? "Yes!" : "Nope";
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
        showError(
          `Couldn\u2019t find \u201c${query}\u201d in our database. Try the full title \u2014 we have ~10,700 movies from 1874\u20132026.`
        );
      }
      return;
    }

    showResult(movie);
  } catch (err) {
    showError(err.message || "Something went wrong. Please try again.");
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
