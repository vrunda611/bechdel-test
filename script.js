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

function showResult(movie) {
  hideLoading();
  errorEl.classList.add("hidden");
  resultEl.classList.remove("hidden");

  // Yes! / No. badge
  const passes = movie.rating === 3;
  resultBadge.textContent = passes ? "Yes!" : "Nope";
  resultBadge.className = "badge " + (passes ? "badge-pass" : "badge-fail");

  // Subtitle text
  resultBody.textContent = passes
    ? "women spoke to each other about something other than a man.\ncinema lives another day."
    : "unfortunately the women were busy existing around men...";

  // BechdelTest.com link
  resultLink.href = `https://bechdeltest.com/view/${movie.imdbId}/`;

  // Trigger fade-in animation
  resultEl.classList.remove("fade-in");
  // Force reflow so re-adding the class restarts the animation
  void resultEl.offsetWidth;
  resultEl.classList.add("fade-in");
}

function resetUI() {
  resultEl.classList.add("hidden");
  resultEl.classList.remove("fade-in");
  errorEl.classList.add("hidden");
  movieInput.value = "";
  movieInput.focus();
}

// ---- Auto-resize Input ----

function resizeInput() {
  const length = movieInput.value.length || movieInput.placeholder.length;
  movieInput.style.width = Math.max(6, length + 1) + "ch";
}

// ---- Main Handler ----

async function handleSearch() {
  const query = movieInput.value.trim();
  if (!query) {
    movieInput.focus();
    return;
  }

  showLoading();

  try {
    const data = await fetchData();
    const movie = searchMovie(query, data);

    if (!movie) {
      showError(
        `Couldn\u2019t find \u201c${query}\u201d in our database. Try the full title \u2014 we have ~10,700 movies from 1874\u20132026.`
      );
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
    handleSearch();
  }
});

movieInput.addEventListener("input", resizeInput);

// Initialize input width
resizeInput();
