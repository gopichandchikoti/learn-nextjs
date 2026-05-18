/* eslint-disable @next/next/no-img-element */
"use client";

import { FormEvent, useMemo, useState } from "react";
import movies from "./data/movies.json";

type Movie = {
  id: string;
  rank: number;
  title: string;
  region: "Hollywood" | "Bollywood" | "Tollywood";
  language: string;
  releaseDate: string;
  year: number;
  genres: string[];
  rating: number;
  runtime: number;
  maturity: string;
  poster: string;
  backdrop: string;
  overview: string;
  sourceName: string;
  sourceUrl: string;
  freshness: string;
};

const catalog = movies as Movie[];

const regionFilters = ["All", "Hollywood", "Bollywood", "Tollywood"] as const;

function sortedByRelease(items: Movie[]) {
  return [...items].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
}

function sortedByRating(items: Movie[]) {
  return [...items].sort((a, b) => b.rating - a.rating || b.releaseDate.localeCompare(a.releaseDate));
}

function byRegion(region: Movie["region"]) {
  return sortedByRelease(catalog.filter((movie) => movie.region === region));
}

function byGenre(terms: string[]) {
  return sortedByRating(
    catalog.filter((movie) =>
      movie.genres.some((genre) => terms.some((term) => genre.toLowerCase().includes(term.toLowerCase()))),
    ),
  );
}

function imageFallback(movie: Movie, format: "poster" | "backdrop") {
  const size = format === "poster" ? "420/630" : "1400/788";
  return `https://picsum.photos/seed/${movie.id}-${format}/${size}`;
}

function formatRuntime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `${hours}h ${rest}m`;
}

function matchesQuery(movie: Movie, query: string) {
  const value = query.trim().toLowerCase();

  if (!value) {
    return true;
  }

  return [movie.title, movie.region, movie.language, movie.overview, movie.genres.join(" ")]
    .join(" ")
    .toLowerCase()
    .includes(value);
}

function SignInScreen({ onSignIn }: { onSignIn: () => void }) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSignIn();
  }

  return (
    <main className="signin-screen">
      <div className="signin-art" aria-hidden="true" />
      <section className="signin-panel" aria-labelledby="signin-title">
        <p className="brand">NETFIX</p>
        <h1 id="signin-title">Sign in to tonight&apos;s watchlist.</h1>
        <p className="signin-copy">
          Fresh Hollywood, Bollywood, and Telugu cinema in one fast browse.
        </p>

        <form className="signin-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input type="email" placeholder="you@example.com" autoComplete="email" required />
          </label>
          <label>
            Password
            <input type="password" placeholder="Demo password" autoComplete="current-password" required />
          </label>
          <button type="submit">Sign In</button>
        </form>

        <button className="ghost-button" type="button" onClick={onSignIn}>
          Continue with demo profile
        </button>

        <div className="signin-stats" aria-label="Catalog stats">
          <span>100 titles</span>
          <span>3 industries</span>
          <span>2025-2026</span>
        </div>
      </section>
    </main>
  );
}

function MovieCard({
  movie,
  rank,
  onSelect,
  onToggleList,
  saved,
  compact = false,
}: {
  movie: Movie;
  rank?: number;
  onSelect: (movie: Movie) => void;
  onToggleList: (movieId: string) => void;
  saved: boolean;
  compact?: boolean;
}) {
  return (
    <article className={compact ? "movie-card movie-card-compact" : "movie-card"}>
      {typeof rank === "number" ? <span className="rank-number">{rank}</span> : null}
      <button className="poster-button" type="button" onClick={() => onSelect(movie)}>
        <img
          src={movie.poster}
          alt={`${movie.title} poster`}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = imageFallback(movie, "poster");
          }}
        />
      </button>
      <div className="movie-card-body">
        <button className="title-button" type="button" onClick={() => onSelect(movie)}>
          {movie.title}
        </button>
        <p>
          {movie.year} <span>{movie.maturity}</span> <span>{movie.rating.toFixed(1)}</span>
        </p>
        <div className="card-actions">
          <button type="button" onClick={() => onSelect(movie)}>
            Play
          </button>
          <button type="button" onClick={() => onToggleList(movie.id)}>
            {saved ? "Saved" : "My List"}
          </button>
        </div>
      </div>
    </article>
  );
}

function MovieRow({
  title,
  subtitle,
  items,
  onSelect,
  onToggleList,
  savedIds,
  topTen = false,
}: {
  title: string;
  subtitle: string;
  items: Movie[];
  onSelect: (movie: Movie) => void;
  onToggleList: (movieId: string) => void;
  savedIds: string[];
  topTen?: boolean;
}) {
  const rowId = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <section className="movie-row" aria-labelledby={rowId}>
      <div className="row-heading">
        <div>
          <h2 id={rowId}>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <span>{items.length} titles</span>
      </div>
      <div className={topTen ? "row-scroller top-row" : "row-scroller"}>
        {items.map((movie, index) => (
          <MovieCard
            key={`${title}-${movie.id}`}
            movie={movie}
            rank={topTen ? index + 1 : undefined}
            onSelect={onSelect}
            onToggleList={onToggleList}
            saved={savedIds.includes(movie.id)}
            compact={topTen}
          />
        ))}
      </div>
    </section>
  );
}

function DetailModal({
  movie,
  onClose,
  onToggleList,
  saved,
}: {
  movie: Movie;
  onClose: () => void;
  onToggleList: (movieId: string) => void;
  saved: boolean;
}) {
  return (
    <div className="modal-layer" role="presentation" onClick={onClose}>
      <article className="movie-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close movie details">
          x
        </button>
        <div className="modal-hero">
          <img
            src={movie.backdrop}
            alt=""
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = imageFallback(movie, "backdrop");
            }}
          />
          <div>
            <p className="eyebrow">{movie.freshness}</p>
            <h2 id="modal-title">{movie.title}</h2>
            <p className="modal-meta">
              {movie.year} <span>{movie.region}</span> <span>{movie.language}</span> <span>{formatRuntime(movie.runtime)}</span>
            </p>
          </div>
        </div>
        <div className="modal-content">
          <p>{movie.overview}</p>
          <dl>
            <div>
              <dt>Genres</dt>
              <dd>{movie.genres.join(", ")}</dd>
            </div>
            <div>
              <dt>Rating</dt>
              <dd>{movie.rating.toFixed(1)} audience score</dd>
            </div>
            <div>
              <dt>Source</dt>
              <dd>
                <a href={movie.sourceUrl} target="_blank" rel="noreferrer">
                  {movie.sourceName}
                </a>
              </dd>
            </div>
          </dl>
          <div className="modal-actions">
            <button type="button">Play Now</button>
            <button type="button" onClick={() => onToggleList(movie.id)}>
              {saved ? "Remove from My List" : "Add to My List"}
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}

export default function Home() {
  const [signedIn, setSignedIn] = useState(false);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<(typeof regionFilters)[number]>("All");
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const hero = catalog.find((movie) => movie.title === "Project Hail Mary") ?? catalog[0];

  const visibleMovies = useMemo(() => {
    return sortedByRelease(
      catalog.filter((movie) => (region === "All" || movie.region === region) && matchesQuery(movie, query)),
    );
  }, [query, region]);

  const rows = useMemo(
    () => [
      {
        title: "Top Ten Today",
        subtitle: "The highest-rated picks from the full catalog.",
        items: sortedByRating(catalog).slice(0, 10),
        topTen: true,
      },
      {
        title: "Telugu Movies",
        subtitle: "Fresh Tollywood action, family dramas, and thrillers.",
        items: byRegion("Tollywood"),
      },
      {
        title: "Bollywood Heat",
        subtitle: "Hindi cinema releases and upcoming tentpoles.",
        items: byRegion("Bollywood"),
      },
      {
        title: "Hollywood New Releases",
        subtitle: "Studio titles, genre releases, and franchise nights.",
        items: byRegion("Hollywood"),
      },
      {
        title: "Popular Movies",
        subtitle: "High-score titles across all three industries.",
        items: sortedByRating(catalog).slice(0, 24),
      },
      {
        title: "Action & Thrills",
        subtitle: "Chases, spies, missions, and big-screen pressure.",
        items: byGenre(["Action", "Thriller", "Spy"]),
      },
      {
        title: "Sci-Fi Worlds",
        subtitle: "Future tech, space travel, monsters, and impossible missions.",
        items: byGenre(["Science Fiction", "Superhero"]),
      },
      {
        title: "Horror Nights",
        subtitle: "Slashers, supernatural trouble, and darker mysteries.",
        items: byGenre(["Horror", "Supernatural"]),
      },
      {
        title: "Romance & Drama",
        subtitle: "Love stories, family stakes, and emotional arcs.",
        items: byGenre(["Romance", "Drama"]),
      },
      {
        title: "All 100 Latest Drops",
        subtitle: "The complete Hollywood, Bollywood, and Telugu catalog.",
        items: sortedByRelease(catalog),
      },
    ],
    [],
  );

  function toggleList(movieId: string) {
    setSavedIds((current) => (current.includes(movieId) ? current.filter((id) => id !== movieId) : [...current, movieId]));
  }

  if (!signedIn) {
    return <SignInScreen onSignIn={() => setSignedIn(true)} />;
  }

  return (
    <main className="streaming-shell">
      <header className="app-header">
        <a className="brand" href="#home">
          NETFIX
        </a>
        <nav aria-label="Primary">
          <a href="#top-ten-today">Top 10</a>
          <a href="#telugu-movies">Telugu</a>
          <a href="#bollywood-heat">Bollywood</a>
          <a href="#sci-fi-worlds">Sci-Fi</a>
        </nav>
        <div className="header-actions">
          <label className="search-box">
            <span>Search</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Titles, genres, language" />
          </label>
          <button type="button" onClick={() => setSignedIn(false)}>
            Sign Out
          </button>
        </div>
      </header>

      <section
        id="home"
        className="hero"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.92), rgba(0,0,0,.62), rgba(0,0,0,.18)), url("${hero.backdrop}")`,
        }}
      >
        <div className="hero-content">
          <p className="eyebrow">Featured tonight</p>
          <h1>{hero.title}</h1>
          <p>{hero.overview}</p>
          <div className="hero-meta">
            <span>{hero.year}</span>
            <span>{hero.region}</span>
            <span>{hero.language}</span>
            <span>{hero.genres.slice(0, 2).join(" / ")}</span>
          </div>
          <div className="hero-actions">
            <button type="button" onClick={() => setActiveMovie(hero)}>
              Play
            </button>
            <button type="button" onClick={() => toggleList(hero.id)}>
              {savedIds.includes(hero.id) ? "Saved" : "My List"}
            </button>
          </div>
        </div>
      </section>

      <section className="filter-strip" aria-label="Catalog filters">
        <div>
          <p className="eyebrow">Browse</p>
          <h2>{visibleMovies.length} movies ready</h2>
        </div>
        <div className="filter-buttons">
          {regionFilters.map((filter) => (
            <button
              key={filter}
              className={region === filter ? "active" : ""}
              type="button"
              onClick={() => setRegion(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {query || region !== "All" ? (
        <section className="search-results" aria-labelledby="search-results-title">
          <div className="row-heading">
            <div>
              <h2 id="search-results-title">Filtered Results</h2>
              <p>Matching your current search and region filter.</p>
            </div>
            <span>{visibleMovies.length} titles</span>
          </div>
          <div className="result-grid">
            {visibleMovies.map((movie) => (
              <MovieCard
                key={`result-${movie.id}`}
                movie={movie}
                onSelect={setActiveMovie}
                onToggleList={toggleList}
                saved={savedIds.includes(movie.id)}
              />
            ))}
          </div>
        </section>
      ) : null}

      {savedIds.length > 0 ? (
        <MovieRow
          title="My List"
          subtitle="Saved for later in this demo profile."
          items={catalog.filter((movie) => savedIds.includes(movie.id))}
          onSelect={setActiveMovie}
          onToggleList={toggleList}
          savedIds={savedIds}
        />
      ) : null}

      {rows.map((row) => (
        <MovieRow
          key={row.title}
          title={row.title}
          subtitle={row.subtitle}
          items={row.items}
          onSelect={setActiveMovie}
          onToggleList={toggleList}
          savedIds={savedIds}
          topTen={row.topTen}
        />
      ))}

      <footer className="app-footer">
        <p>
          Movie list sources: Wikipedia film release lists for American, Hindi, and Telugu cinema. Poster and
          summary art use Wikipedia/Wikimedia where available with hosted fallbacks.
        </p>
      </footer>

      {activeMovie ? (
        <DetailModal
          movie={activeMovie}
          onClose={() => setActiveMovie(null)}
          onToggleList={toggleList}
          saved={savedIds.includes(activeMovie.id)}
        />
      ) : null}
    </main>
  );
}
