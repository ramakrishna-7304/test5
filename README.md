# Movie Watchlist API — Interview Project

A small REST API for managing a movie watchlist, built with Node.js & Express.

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run the server
npm start
```

Server runs at `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/movies` | List all movies (optional: `?watched=true/false`) |
| POST | `/movies` | Create a movie (`title`, `director`, `genre`: action/comedy/horror/drama) |
| GET | `/movies/:id` | Get a movie by ID |
| PUT | `/movies/:id` | Update a movie (`title`, `director`, `genre`, `rating` 1–5, `watched`) |
| DELETE | `/movies/:id` | Delete a movie |
| GET | `/movies/stats` | Get summary statistics |

## Running Tests

```bash
npm test
```

## Your Tasks

1. **Create a branch** called `interview/<your-name>`.
2. **Run the tests** — some will fail. Find and fix the **3 bugs** causing them.
3. **Add a new feature:** implement a `PATCH /movies/:id/watch` endpoint that marks a movie as watched (a shortcut instead of using PUT). It should return `404` if the movie does not exist.
4. **Commit your changes** with clear commit messages and open a **Pull Request** back to the main branch.
