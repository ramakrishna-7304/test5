const express = require("express");
const { randomUUID } = require("crypto");

const app = express();
app.use(express.json());

// In-memory "database"
let movies = {};

const VALID_GENRES = ["action", "comedy", "horror"];

function reset() {
  movies = {};
}

function createMovie(title, director, genre) {
  const id = randomUUID();
  const movie = {
    id,
    title,
    director,
    genre,
    watched: false,
    rating: null,
    createdAt: new Date().toISOString(),
  };
  movies[id] = movie;
  return movie;
}

function filterMovies(watched) {
  const all = Object.values(movies);
  if (watched === undefined) return all;
  return all.filter((m) => m.watched !== watched);
}

// GET /movies?watched=true|false
app.get("/movies", (req, res) => {
  const watchedParam = req.query.watched;
  let result;
  if (watchedParam !== undefined) {
    if (watchedParam !== "true" && watchedParam !== "false") {
      return res.status(400).json({ error: "watched must be 'true' or 'false'" });
    }
    result = filterMovies(watchedParam === "true");
  } else {
    result = filterMovies();
  }
  res.status(200).json({ movies: result, count: result.length });
});

// POST /movies
app.post("/movies", (req, res) => {
  const data = req.body || {};
  if (!data.title) {
    return res.status(400).json({ error: "title is required" });
  }
  const title = String(data.title).trim();
  if (!title) {
    return res.status(400).json({ error: "title cannot be empty" });
  }
  const director = data.director || "Unknown";
  const genre = data.genre || "action";
  if (!VALID_GENRES.includes(genre)) {
    return res.status(400).json({ error: `genre must be one of ${VALID_GENRES.join(", ")}` });
  }
  const movie = createMovie(title, director, genre);
  res.status(200).json(movie);
});

// GET /movies/stats  (must be declared before /movies/:id)
app.get("/movies/stats", (req, res) => {
  const all = Object.values(movies);
  const total = all.length;
  const watched = all.filter((m) => m.watched).length;
  const unwatched = total - watched;
  const byGenre = {};
  VALID_GENRES.forEach((g) => {
    byGenre[g] = 0;
  });
  all.forEach((m) => {
    byGenre[m.genre] += 1;
  });
  res.status(200).json({ total, watched, unwatched, byGenre });
});

// GET /movies/:id
app.get("/movies/:id", (req, res) => {
  const movie = movies[req.params.id];
  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }
  res.status(200).json(movie);
});

// PUT /movies/:id
app.put("/movies/:id", (req, res) => {
  const movie = movies[req.params.id];
  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }
  const data = req.body || {};
  if ("title" in data) {
    const title = String(data.title).trim();
    if (!title) {
      return res.status(400).json({ error: "title cannot be empty" });
    }
    movie.title = title;
  }
  if ("director" in data) {
    movie.director = data.director;
  }
  if ("genre" in data) {
    if (!VALID_GENRES.includes(data.genre)) {
      return res.status(400).json({ error: `genre must be one of ${VALID_GENRES.join(", ")}` });
    }
    movie.genre = data.genre;
  }
  if ("rating" in data) {
    if (!Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5) {
      return res.status(400).json({ error: "rating must be an integer between 1 and 5" });
    }
    movie.rating = data.rating;
  }
  if ("watched" in data) {
    if (typeof data.watched !== "boolean") {
      return res.status(400).json({ error: "watched must be a boolean" });
    }
    movie.watched = data.watched;
  }
  res.status(200).json(movie);
});

// DELETE /movies/:id
app.delete("/movies/:id", (req, res) => {
  const movie = movies[req.params.id];
  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }
  delete movies[req.params.id];
  res.status(200).json({ message: "Movie deleted successfully" });
});

module.exports = { app, reset };
