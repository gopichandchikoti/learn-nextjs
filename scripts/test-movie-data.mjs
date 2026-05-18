import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";

const filePath = path.join(process.cwd(), "app", "data", "movies.json");
const movies = JSON.parse(await readFile(filePath, "utf8"));

assert.ok(Array.isArray(movies), "movies.json should export an array");
assert.ok(movies.length >= 100, `expected at least 100 movies, received ${movies.length}`);

const ids = new Set(movies.map((movie) => movie.id));
assert.equal(ids.size, movies.length, "movie ids should be unique");

const requiredFields = [
  "id",
  "title",
  "region",
  "language",
  "releaseDate",
  "year",
  "genres",
  "rating",
  "runtime",
  "maturity",
  "poster",
  "backdrop",
  "overview",
  "sourceName",
  "sourceUrl",
];

for (const movie of movies) {
  for (const field of requiredFields) {
    assert.ok(movie[field] !== undefined && movie[field] !== "", `${movie.title} is missing ${field}`);
  }

  assert.ok(["Hollywood", "Bollywood", "Tollywood"].includes(movie.region), `${movie.title} has an invalid region`);
  assert.ok(movie.year === 2025 || movie.year === 2026, `${movie.title} should be from the 2025-2026 slate`);
  assert.ok(Array.isArray(movie.genres) && movie.genres.length > 0, `${movie.title} needs at least one genre`);
  assert.ok(movie.poster.startsWith("https://"), `${movie.title} poster should be a hosted image`);
  assert.ok(movie.backdrop.startsWith("https://"), `${movie.title} backdrop should be a hosted image`);
  assert.ok(movie.overview.length >= 80, `${movie.title} overview should be descriptive`);
}

const byRegion = movies.reduce((counts, movie) => {
  counts[movie.region] = (counts[movie.region] ?? 0) + 1;
  return counts;
}, {});

assert.ok(byRegion.Hollywood >= 30, "catalog should include at least 30 Hollywood movies");
assert.ok(byRegion.Bollywood >= 30, "catalog should include at least 30 Bollywood movies");
assert.ok(byRegion.Tollywood >= 30, "catalog should include at least 30 Telugu/Tollywood movies");

const hasGenre = (term) =>
  movies.filter((movie) => movie.genres.some((genre) => genre.toLowerCase().includes(term))).length;

assert.ok(hasGenre("action") >= 20, "action row should have enough titles");
assert.ok(hasGenre("science fiction") >= 6, "sci-fi row should have enough titles");
assert.ok(hasGenre("horror") >= 8, "horror row should have enough titles");
assert.ok(hasGenre("romance") >= 10, "romance row should have enough titles");

const topTen = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 10);
assert.equal(topTen.length, 10, "top ten row should contain 10 movies");

console.log(`Movie data OK: ${movies.length} titles across ${Object.keys(byRegion).join(", ")}`);
