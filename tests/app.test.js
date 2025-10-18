
const request = require("supertest");
const app = require("../src/app");

describe("Portfolio app", () => {
  test("serves homepage (index.html) with status 200 and name", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200); // FIXED
    //expect(res.statusCode).toBe(201); // WRONG ON PURPOSE for fail demo
    expect(res.text).toMatch(/Varun Kakkar/);
  });

  test("serves CSS with correct content type", async () => {
    const res = await request(app).get("/style.css");
    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toMatch(/text\/css/);
  });

  test("/api/profile returns my profile JSON", async () => {
    const res = await request(app).get("/api/profile");
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Varun Kakkar");
    expect(res.body.location).toBe("Ontario, Canada");
    expect(Array.isArray(res.body.skills)).toBe(true);
  });

  test("/api/projects returns at least 3 items", async () => {
    const res = await request(app).get("/api/projects");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(3);
  });

  test("404 handler returns JSON", async () => {
    const res = await request(app).get("/does-not-exist");
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("not found");
  });

  test("home page contains my title tagline", async () => {
    const res = await request(app).get("/");
    expect(res.text).toMatch(/Cloud & DevOps Engineer/i);
  });
});

