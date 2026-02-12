// ===========================
// Bechdel Test Checker — Logic
// ===========================

const CSV_URL =
  "https://raw.githubusercontent.com/rfordatascience/tidytuesday/main/data/2021/2021-03-09/raw_bechdel.csv";

// Cached dataset (populated after first fetch)
let movieData = null;

// DOM references
const movieInput = document.getElementById("movie-input");
const findOutBtn = document.getElementById("find-out-btn");
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");
const errorMsg = document.getElementById("error-message");
const resultEl = document.getElementById("result");
const resultTitle = document.getElementById("result-title");
const resultBadge = document.getElementById("result-badge");
const resultExplanation = document.getElementById("result-explanation");
const resultLink = document.getElementById("result-link");
const tryAnotherBtn = document.getElementById("try-another-btn");

// Score explanations (indexed by rating 0–3)
const explanations = [
  "This film has fewer than two named women characters.",
  "This film has named women, but they never talk to each other.",
  "Named women talk to each other — but only about a man.",
  "Named women talk to each other about something other than a man!",
];

// ---- CSV Parsing ----

function parseCSV(text) {
  const lines = text.split("\n");
  // Skip header row
  const movies = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const fields = parseCSVLine(line);
    if (fields.length < 5) continue;

    movies.push({
      year: parseInt(fields[0], 10),
      id: fields[1],
      imdbId: fields[2],
      title: fields[3],
      rating: parseInt(fields[4], 10),
    });
  }

  return movies;
}

// Handle quoted fields (titles with commas)
function parseCSVLine(line) {
  const fields = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (inQuotes) {
      if (ch === '"') {
        // Check for escaped quote ("")
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++; // skip next quote
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        fields.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
  }

  fields.push(current); // last field
  return fields;
}

// ---- Data Fetching ----

async function fetchData() {
  if (movieData) return movieData;

  const response = await fetch(CSV_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch movie data. Please check your internet connection.");
  }

  const text = await response.text();
  movieData = parseCSV(text);
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

  // Title + year
  resultTitle.textContent = `${movie.title} (${movie.year})`;

  // PASS / FAIL badge
  const passes = movie.rating === 3;
  resultBadge.textContent = passes ? "PASS" : "FAIL";
  resultBadge.className = "badge " + (passes ? "badge-pass" : "badge-fail");

  // Score breakdown steps
  const steps = resultEl.querySelectorAll(".score-step");
  steps.forEach((step) => {
    const level = parseInt(step.dataset.level, 10);
    if (movie.rating >= level) {
      step.classList.add("met");
      step.classList.remove("not-met");
    } else {
      step.classList.remove("met");
      step.classList.add("not-met");
    }
  });

  // Explanation text
  resultExplanation.textContent = explanations[movie.rating] || "";

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
        `Couldn\u2019t find \u201c${query}\u201d in our database. Try the full title \u2014 we have ~9,000 movies from 1874\u20132020.`
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

tryAnotherBtn.addEventListener("click", resetUI);

// Initialize input width
resizeInput();
