import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const OUTPUT = path.join(ROOT, "app", "data", "movies.json");

const listSources = {
  hollywood2026: {
    name: "Wikipedia: List of American films of 2026",
    url: "https://en.wikipedia.org/wiki/List_of_American_films_of_2026",
  },
  hollywood2025: {
    name: "Wikipedia: List of American films of 2025",
    url: "https://en.wikipedia.org/wiki/List_of_American_films_of_2025",
  },
  bollywood2026: {
    name: "Wikipedia: List of Hindi films of 2026",
    url: "https://en.wikipedia.org/wiki/List_of_Hindi_films_of_2026",
  },
  bollywood2025: {
    name: "Wikipedia: List of Hindi films of 2025",
    url: "https://en.wikipedia.org/wiki/List_of_Hindi_films_of_2025",
  },
  telugu2026: {
    name: "Wikipedia: List of Telugu films of 2026",
    url: "https://en.wikipedia.org/wiki/List_of_Telugu_films_of_2026",
  },
  telugu2025: {
    name: "Wikipedia: List of Telugu films of 2025",
    url: "https://en.wikipedia.org/wiki/List_of_Telugu_films_of_2025",
  },
};

const genrePools = {
  action: ["Action", "Thriller"],
  adventure: ["Adventure", "Fantasy"],
  animation: ["Animation", "Family"],
  comedy: ["Comedy", "Family"],
  crime: ["Crime", "Thriller"],
  drama: ["Drama"],
  horror: ["Horror", "Thriller"],
  romance: ["Romance", "Drama"],
  sciFi: ["Science Fiction", "Adventure"],
  sports: ["Sports", "Drama"],
  spy: ["Spy", "Action", "Thriller"],
  superhero: ["Superhero", "Action", "Adventure"],
  war: ["War", "Drama", "Action"],
};

const seeds = [
  movie("The Super Mario Galaxy Movie", "Hollywood", "English", "2026-04-03", genrePools.animation, "hollywood2026"),
  movie("Project Hail Mary", "Hollywood", "English", "2026-03-20", genrePools.sciFi, "hollywood2026"),
  movie("Hoppers", "Hollywood", "English", "2026-02-27", genrePools.animation, "hollywood2026"),
  movie("Scream 7", "Hollywood", "English", "2026-02-27", genrePools.horror, "hollywood2026"),
  movie("Goat", "Hollywood", "English", "2026-02-13", genrePools.sports, "hollywood2026"),
  movie("Wuthering Heights", "Hollywood", "English", "2026-02-13", genrePools.romance, "hollywood2026"),
  movie("Send Help", "Hollywood", "English", "2026-01-30", genrePools.horror, "hollywood2026"),
  movie("Reminders of Him", "Hollywood", "English", "2026-02-13", genrePools.romance, "hollywood2026"),
  movie("Iron Lung", "Hollywood", "English", "2026-02-06", genrePools.horror, "hollywood2026"),
  movie("The Drama", "Hollywood", "English", "2026-04-03", genrePools.drama, "hollywood2026"),
  movie("The Strangers: Chapter 3", "Hollywood", "English", "2026-02-06", genrePools.horror, "hollywood2026"),
  movie("The President's Cake", "Hollywood", "English", "2026-02-06", genrePools.drama, "hollywood2026"),
  movie("Zootopia 2", "Hollywood", "English", "2025-11-26", genrePools.animation, "hollywood2025"),
  movie("A Minecraft Movie", "Hollywood", "English", "2025-04-04", genrePools.adventure, "hollywood2025"),
  movie("Lilo & Stitch", "Hollywood", "English", "2025-05-23", genrePools.comedy, "hollywood2025"),
  movie("Avatar: Fire and Ash", "Hollywood", "English", "2025-12-19", genrePools.sciFi, "hollywood2025"),
  movie("Superman", "Hollywood", "English", "2025-07-11", genrePools.superhero, "hollywood2025"),
  movie("Wicked: For Good", "Hollywood", "English", "2025-11-21", ["Musical", "Fantasy", "Drama"], "hollywood2025"),
  movie("Jurassic World Rebirth", "Hollywood", "English", "2025-07-02", genrePools.sciFi, "hollywood2025"),
  movie("Sinners", "Hollywood", "English", "2025-04-18", genrePools.horror, "hollywood2025"),
  movie("The Fantastic Four: First Steps", "Hollywood", "English", "2025-07-25", genrePools.superhero, "hollywood2025"),
  movie("How to Train Your Dragon", "Hollywood", "English", "2025-06-13", genrePools.adventure, "hollywood2025"),
  movie("Captain America: Brave New World", "Hollywood", "English", "2025-02-14", genrePools.superhero, "hollywood2025"),
  movie("Thunderbolts", "Hollywood", "English", "2025-05-02", genrePools.superhero, "hollywood2025"),
  movie("Mission: Impossible - The Final Reckoning", "Hollywood", "English", "2025-05-23", genrePools.spy, "hollywood2025"),
  movie("Mickey 17", "Hollywood", "English", "2025-03-07", genrePools.sciFi, "hollywood2025"),
  movie("Black Bag", "Hollywood", "English", "2025-03-14", genrePools.spy, "hollywood2025"),
  movie("The Amateur", "Hollywood", "English", "2025-04-11", genrePools.spy, "hollywood2025"),
  movie("Final Destination Bloodlines", "Hollywood", "English", "2025-05-16", genrePools.horror, "hollywood2025"),
  movie("F1", "Hollywood", "English", "2025-06-27", ["Sports", "Action", "Drama"], "hollywood2025"),
  movie("28 Years Later", "Hollywood", "English", "2025-06-20", genrePools.horror, "hollywood2025"),
  movie("Ballerina", "Hollywood", "English", "2025-06-06", genrePools.action, "hollywood2025"),
  movie("The Accountant 2", "Hollywood", "English", "2025-04-25", genrePools.action, "hollywood2025"),
  movie("Snow White", "Hollywood", "English", "2025-03-21", ["Musical", "Fantasy", "Family"], "hollywood2025"),
  movie("The Monkey", "Hollywood", "English", "2025-02-21", genrePools.horror, "hollywood2025"),
  movie("Companion", "Hollywood", "English", "2025-01-31", ["Science Fiction", "Thriller", "Horror"], "hollywood2025"),
  movie("The Gorge", "Hollywood", "English", "2025-02-14", ["Science Fiction", "Romance", "Action"], "hollywood2025"),
  movie("Tron: Ares", "Hollywood", "English", "2025-10-10", genrePools.sciFi, "hollywood2025"),

  movie("Ikkis", "Bollywood", "Hindi", "2026-01-01", genrePools.war, "bollywood2026"),
  movie("Rahu Ketu", "Bollywood", "Hindi", "2026-01-16", ["Comedy", "Drama"], "bollywood2026"),
  movie("Happy Patel: Khatarnak Jasoos", "Bollywood", "Hindi", "2026-01-16", ["Comedy", "Spy"], "bollywood2026"),
  movie("Border 2", "Bollywood", "Hindi", "2026-01-23", genrePools.war, "bollywood2026"),
  movie("Gandhi Talks", "Bollywood", "Hindi", "2026-01-30", ["Drama", "Comedy"], "bollywood2026"),
  movie("Mardaani 3", "Bollywood", "Hindi", "2026-02-27", genrePools.crime, "bollywood2026"),
  movie("Vadh 2", "Bollywood", "Hindi", "2026-02-06", genrePools.crime, "bollywood2026"),
  movie("Tu Yaa Main", "Bollywood", "Hindi", "2026-02-13", ["Thriller", "Romance"], "bollywood2026"),
  movie("O Romeo", "Bollywood", "Hindi", "2026-02-13", ["Romance", "Comedy", "Drama"], "bollywood2026"),
  movie("Do Deewane Seher Mein", "Bollywood", "Hindi", "2026-02-20", genrePools.romance, "bollywood2026"),
  movie("Dhurandhar: The Revenge", "Bollywood", "Hindi", "2026-03-19", genrePools.spy, "bollywood2026"),
  movie("Bhooth Bangla", "Bollywood", "Hindi", "2026-04-02", ["Horror", "Comedy"], "bollywood2026"),
  movie("Battle of Galwan", "Bollywood", "Hindi", "2026-04-17", genrePools.war, "bollywood2026"),
  movie("Alpha", "Bollywood", "Hindi", "2026-04-17", genrePools.spy, "bollywood2026"),
  movie("Love and War", "Bollywood", "Hindi", "2026-03-20", ["Romance", "War", "Drama"], "bollywood2026"),
  movie("Chhaava", "Bollywood", "Hindi", "2025-02-14", ["Historical", "Action", "Drama"], "bollywood2025"),
  movie("Saiyaara", "Bollywood", "Hindi", "2025-07-18", genrePools.romance, "bollywood2025"),
  movie("War 2", "Bollywood", "Hindi", "2025-08-14", genrePools.spy, "bollywood2025"),
  movie("Sitaare Zameen Par", "Bollywood", "Hindi", "2025-06-20", ["Sports", "Comedy", "Drama"], "bollywood2025"),
  movie("Sky Force", "Bollywood", "Hindi", "2025-01-24", genrePools.war, "bollywood2025"),
  movie("Deva", "Bollywood", "Hindi", "2025-01-31", genrePools.action, "bollywood2025"),
  movie("Emergency", "Bollywood", "Hindi", "2025-01-17", ["Political", "Drama", "Historical"], "bollywood2025"),
  movie("Fateh", "Bollywood", "Hindi", "2025-01-10", genrePools.action, "bollywood2025"),
  movie("Sikandar", "Bollywood", "Hindi", "2025-03-30", genrePools.action, "bollywood2025"),
  movie("Jaat", "Bollywood", "Hindi", "2025-04-10", genrePools.action, "bollywood2025"),
  movie("Kesari Chapter 2", "Bollywood", "Hindi", "2025-04-18", ["Historical", "Courtroom", "Drama"], "bollywood2025"),
  movie("Ground Zero", "Bollywood", "Hindi", "2025-04-25", ["Action", "Drama", "Thriller"], "bollywood2025"),
  movie("Jewel Thief", "Bollywood", "Hindi", "2025-04-25", ["Heist", "Thriller", "Action"], "bollywood2025"),
  movie("Raid 2", "Bollywood", "Hindi", "2025-05-01", genrePools.crime, "bollywood2025"),
  movie("Dhadak 2", "Bollywood", "Hindi", "2025-08-01", genrePools.romance, "bollywood2025"),
  movie("Thamma", "Bollywood", "Hindi", "2025-10-21", ["Horror", "Comedy", "Romance"], "bollywood2025"),

  movie("Psych Siddhartha", "Tollywood", "Telugu", "2026-01-01", ["Psychological", "Thriller"], "telugu2026"),
  movie("Madham", "Tollywood", "Telugu", "2026-01-01", ["Drama", "Thriller"], "telugu2026"),
  movie("Sahakutumbaanaam", "Tollywood", "Telugu", "2026-01-01", ["Family", "Drama"], "telugu2026"),
  movie("Vanaveera", "Tollywood", "Telugu", "2026-01-01", genrePools.action, "telugu2026"),
  movie("Nilakanta", "Tollywood", "Telugu", "2026-01-02", ["Drama", "Thriller"], "telugu2026"),
  movie("The RajaSaab", "Tollywood", "Telugu", "2026-01-09", ["Horror", "Comedy", "Romance"], "telugu2026"),
  movie("Silent Screams", "Tollywood", "Telugu", "2026-01-09", ["Drama", "Thriller"], "telugu2026"),
  movie("Mana Shankara Vara Prasad Garu", "Tollywood", "Telugu", "2026-01-12", ["Family", "Comedy", "Drama"], "telugu2026"),
  movie("Bhartha Mahasayulaku Wignyapthi", "Tollywood", "Telugu", "2026-01-13", genrePools.romance, "telugu2026"),
  movie("Anaganaga Oka Raju", "Tollywood", "Telugu", "2026-01-14", ["Comedy", "Romance"], "telugu2026"),
  movie("Nari Nari Naduma Murari", "Tollywood", "Telugu", "2026-01-14", ["Comedy", "Drama"], "telugu2026"),
  movie("Cheekatilo", "Tollywood", "Telugu", "2026-01-23", ["Mystery", "Thriller"], "telugu2026"),
  movie("Euphoria", "Tollywood", "Telugu", "2026-02-06", ["Drama", "Mystery"], "telugu2026"),
  movie("Hey Balwanth", "Tollywood", "Telugu", "2026-02-20", ["Drama", "Comedy"], "telugu2026"),
  movie("Vishnu Vinyasam", "Tollywood", "Telugu", "2026-02-27", ["Drama", "Family"], "telugu2026"),
  movie("Ustaad Bhagat Singh", "Tollywood", "Telugu", "2026-03-19", genrePools.action, "telugu2026"),
  movie("Biker", "Tollywood", "Telugu", "2026-04-03", ["Action", "Drama"], "telugu2026"),
  movie("Rakasa", "Tollywood", "Telugu", "2026-04-03", ["Horror", "Thriller"], "telugu2026"),
  movie("Dacoit: A Love Story", "Tollywood", "Telugu", "2026-04-10", ["Action", "Romance", "Thriller"], "telugu2026"),
  movie("Bad Boy Karthik", "Tollywood", "Telugu", "2026-04-17", genrePools.action, "telugu2026"),
  movie("Gaayapadda Simham", "Tollywood", "Telugu", "2026-05-01", ["Drama", "Action"], "telugu2026"),
  movie("Game Changer", "Tollywood", "Telugu", "2025-01-10", ["Political", "Action", "Drama"], "telugu2025"),
  movie("Daaku Maharaaj", "Tollywood", "Telugu", "2025-01-12", genrePools.action, "telugu2025"),
  movie("Sankranthiki Vasthunam", "Tollywood", "Telugu", "2025-01-14", ["Comedy", "Action", "Family"], "telugu2025"),
  movie("Thandel", "Tollywood", "Telugu", "2025-02-07", ["Romance", "Action", "Drama"], "telugu2025"),
  movie("Court", "Tollywood", "Telugu", "2025-03-14", ["Courtroom", "Drama"], "telugu2025"),
  movie("Robinhood", "Tollywood", "Telugu", "2025-03-28", ["Action", "Comedy"], "telugu2025"),
  movie("Mad Square", "Tollywood", "Telugu", "2025-03-28", ["Comedy", "Drama"], "telugu2025"),
  movie("Jack", "Tollywood", "Telugu", "2025-04-10", ["Action", "Comedy"], "telugu2025"),
  movie("Odela 2", "Tollywood", "Telugu", "2025-04-17", ["Supernatural", "Thriller"], "telugu2025"),
  movie("HIT: The Third Case", "Tollywood", "Telugu", "2025-05-01", ["Crime", "Thriller", "Action"], "telugu2025"),
];

function movie(title, region, language, releaseDate, genres, sourceKey) {
  return { title, region, language, releaseDate, genres, sourceKey };
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function scoreFor(index, releaseDate) {
  const yearBoost = releaseDate.startsWith("2026") ? 0.35 : 0.1;
  const wave = ((index * 37) % 24) / 10;
  return Number(Math.min(9.6, 6.8 + yearBoost + wave).toFixed(1));
}

function runtimeFor(index, region) {
  const base = region === "Hollywood" ? 96 : 125;
  return base + ((index * 11) % 45);
}

function maturityFor(index, genres) {
  if (genres.includes("Horror") || genres.includes("Crime")) {
    return index % 2 === 0 ? "A" : "16+";
  }

  if (genres.includes("Family") || genres.includes("Animation")) {
    return "7+";
  }

  return index % 3 === 0 ? "13+" : "U/A";
}

function fallbackImages(seed) {
  const slug = slugify(seed.title);

  return {
    poster: `https://picsum.photos/seed/${slug}-poster/420/630`,
    backdrop: `https://picsum.photos/seed/${slug}-backdrop/1400/788`,
  };
}

function wikipediaCandidates(seed) {
  const base = seed.title
    .replace(/:/g, "")
    .replace(/\s+-\s+/g, " ")
    .replace(/\s+/g, "_");
  const industry = seed.region === "Tollywood" ? "Telugu" : seed.region === "Bollywood" ? "Hindi" : "American";
  const year = seed.releaseDate.slice(0, 4);

  return [
    base,
    `${base}_(${year}_film)`,
    `${base}_(film)`,
    `${base}_(${industry}_film)`,
    `${base}_(Indian_film)`,
  ];
}

async function fetchSummary(seed) {
  for (const candidate of wikipediaCandidates(seed)) {
    const endpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(candidate)}`;
    try {
      const response = await fetch(endpoint, {
        headers: {
          "User-Agent": "CodexMovieClone/1.0 (local educational project)",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      const pageText = `${data.description ?? ""} ${data.extract ?? ""}`;
      const hasMovieHint = /film|movie|cinema|motion picture|directed by|produced by/i.test(pageText);

      if (data.type === "standard" && hasMovieHint) {
        return {
          overview: data.extract,
          poster: data.thumbnail?.source,
          backdrop: data.originalimage?.source ?? data.thumbnail?.source,
          pageUrl: data.content_urls?.desktop?.page,
        };
      }
    } catch {
      // The generated catalog remains usable with deterministic fallback art.
    }
  }

  return {};
}

function fallbackOverview(seed) {
  const genreText = seed.genres.slice(0, 2).join(" and ").toLowerCase();
  return `${seed.title} is a ${seed.language} ${genreText} title from the ${seed.region} slate, curated for a Netflix-style browse experience with release metadata from public movie lists.`;
}

function toAscii(value) {
  return value
    .replace(/\u2018|\u2019/g, "'")
    .replace(/\u201c|\u201d/g, '"')
    .replace(/\u2013|\u2014/g, "-")
    .replace(/\u00a0/g, " ")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7e]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function build() {
  if (seeds.length !== 100) {
    throw new Error(`Expected exactly 100 movie seeds, found ${seeds.length}.`);
  }

  const movies = [];

  for (const [index, seed] of seeds.entries()) {
    const wiki = await fetchSummary(seed);
    const images = fallbackImages(seed);
    const source = listSources[seed.sourceKey];

    movies.push({
      id: `${seed.region.toLowerCase()}-${slugify(seed.title)}`,
      rank: index + 1,
      title: seed.title,
      region: seed.region,
      language: seed.language,
      releaseDate: seed.releaseDate,
      year: Number(seed.releaseDate.slice(0, 4)),
      genres: seed.genres,
      rating: scoreFor(index + 1, seed.releaseDate),
      runtime: runtimeFor(index + 1, seed.region),
      maturity: maturityFor(index + 1, seed.genres),
      poster: wiki.poster ?? images.poster,
      backdrop: wiki.backdrop ?? images.backdrop,
      overview: toAscii(wiki.overview ?? fallbackOverview(seed)),
      sourceName: source.name,
      sourceUrl: wiki.pageUrl ?? source.url,
      freshness: seed.releaseDate.startsWith("2026") ? "2026 slate" : "2025 slate",
    });
  }

  await mkdir(path.dirname(OUTPUT), { recursive: true });
  await writeFile(OUTPUT, `${JSON.stringify(movies, null, 2)}\n`);
  console.log(`Wrote ${movies.length} movies to ${path.relative(ROOT, OUTPUT)}`);
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
