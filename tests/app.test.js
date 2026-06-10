const request = require("supertest");
const { app, reset } = require("../app");

beforeEach(() => {
  reset();
});

describe("Movie Watchlist API", () => {
  test("GET /movies returns empty list initially", async () => {
    const res = await request(app).get("/movies");
    expect(res.status).toBe(200);
    expect(res.body.movies).toEqual([]);
    expect(res.body.count).toBe(0);
  });

  test("POST /movies creates a movie", async () => {
    const res = await request(app).post("/movies").send({ title: "Inception", director: "Nolan" });
    expect(res.status).toBe(201); // Fails until Bug 3 is fixed
    expect(res.body.title).toBe("Inception");
    expect(res.body.watched).toBe(false);
  });

  test("POST /movies without title returns 400", async () => {
    const res = await request(app).post("/movies").send({});
    expect(res.status).toBe(400);
  });

  test("POST /movies accepts the 'drama' genre", async () => {
    const res = await request(app).post("/movies").send({ title: "The Pianist", genre: "drama" });
    expect(res.status).toBe(201); // Fails until Bug 2 is fixed
  });

  test("GET /movies/:id returns a movie", async () => {
    const created = await request(app).post("/movies").send({ title: "Alien" });
    const id = created.body.id;
    const res = await request(app).get(`/movies/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(id);
  });

  test("PUT /movies/:id updates a movie", async () => {
    const created = await request(app).post("/movies").send({ title: "Old title" });
    const id = created.body.id;
    const res = await request(app).put(`/movies/${id}`).send({ title: "New title", watched: true });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("New title");
    expect(res.body.watched).toBe(true);
  });

  test("DELETE /movies/:id deletes a movie", async () => {
    const created = await request(app).post("/movies").send({ title: "Delete me" });
    const id = created.body.id;
    const res = await request(app).delete(`/movies/${id}`);
    expect(res.status).toBe(200);
  });

  test("GET /movies?watched=true returns only watched movies", async () => {
    await request(app).post("/movies").send({ title: "Unwatched" });
    const created = await request(app).post("/movies").send({ title: "Watched" });
    await request(app).put(`/movies/${created.body.id}`).send({ watched: true });

    const res = await request(app).get("/movies?watched=true");
    expect(res.status).toBe(200);
    expect(res.body.movies.every((m) => m.watched === true)).toBe(true); // Fails until Bug 1 is fixed
  });

  test("GET /movies/stats returns statistics", async () => {
    await request(app).post("/movies").send({ title: "M1", genre: "action" });
    await request(app).post("/movies").send({ title: "M2", genre: "comedy" });
    const res = await request(app).get("/movies/stats");
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(2);
    expect(res.body.watched).toBe(0);
  });

  // --- Feature tests: PATCH /movies/:id/watch (implement this endpoint) ---

  test("PATCH /movies/:id/watch marks a movie watched", async () => {
    const created = await request(app).post("/movies").send({ title: "Watch me" });
    const id = created.body.id;
    const res = await request(app).patch(`/movies/${id}/watch`);
    expect(res.status).toBe(200);
    expect(res.body.watched).toBe(true);
  });

  test("PATCH /movies/:id/watch returns 404 for unknown movie", async () => {
    const res = await request(app).patch("/movies/does-not-exist/watch");
    expect(res.status).toBe(404);
  });
});
