// Scrape bechdeltest.com for all movies (Node 18+ required for built-in fetch)
const fs = require("fs");

const START_YEAR = 1874;
const END_YEAR = 2026;
const DELAY_MS = 500;

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

function parseMovies(html, year) {
  const movies = [];
  const moviePattern =
    /<div\s+class="movie">\s*<a\s+href="https?:\/\/(?:www\.)?imdb\.com\/title\/(tt\d+)\/?"\s*>\s*<img\s+[^>]*alt="\[\[(\d)\]\]"[^>]*>\s*<\/a>\s*<a\s+id="movie-(\d+)"\s+href="\/view\/\d+\/[^"]*">([\s\S]*?)<\/a>/gi;

  let match;
  while ((match = moviePattern.exec(html)) !== null) {
    movies.push({
      year,
      id: match[3],
      imdbId: match[1],
      title: decodeEntities(match[4].trim()),
      rating: parseInt(match[2], 10),
    });
  }
  return movies;
}

function hasNextPage(html) {
  return /href="\?page=\d+"/.test(html);
}

async function scrapeYear(year) {
  const allMovies = [];
  let page = 0;

  while (true) {
    const url =
      page === 0
        ? `https://bechdeltest.com/year/${year}/`
        : `https://bechdeltest.com/year/${year}/?page=${page}`;

    const response = await fetch(url);

    if (!response.ok) {
      if (page === 0) console.log(`  Skipping ${year} (HTTP ${response.status})`);
      break;
    }

    const html = await response.text();
    const movies = parseMovies(html, year);
    allMovies.push(...movies);

    if (movies.length < 200 || !hasNextPage(html)) break;

    page++;
    await sleep(DELAY_MS);
  }

  return allMovies;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const allMovies = [];

  for (let year = START_YEAR; year <= END_YEAR; year++) {
    console.log(`Scraping ${year}...`);
    const movies = await scrapeYear(year);
    console.log(`  Found ${movies.length} movies`);
    allMovies.push(...movies);

    if (year < END_YEAR) await sleep(DELAY_MS);
  }

  fs.writeFileSync("movies.json", JSON.stringify(allMovies, null, 2));
  console.log(`\nDone! Wrote ${allMovies.length} movies to movies.json`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
