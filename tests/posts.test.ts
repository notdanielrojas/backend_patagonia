import request from "supertest";
import app from "../src/index";
import pool from "../models/database.model";


beforeAll(async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(255), last_name VARCHAR(255), email VARCHAR(255) UNIQUE, password VARCHAR(255))"
  );
  await pool.query(
    "CREATE TABLE IF NOT EXISTS posts (id SERIAL PRIMARY KEY, user_id INT, title VARCHAR(255), content TEXT, FOREIGN KEY (user_id) REFERENCES users(id))"
  );
});

afterAll(async () => {
  await pool.query("DROP TABLE posts");
  await pool.query("DROP TABLE users");
  await pool.end();
});

describe("Post CRUD operations", () => {
  let userId: number;
  let postId: number;

  beforeAll(async () => {
    const userResponse = await request(app)
      .post("/users")
      .send({ name: "John", last_name: "Doe", email: "john@example.com", password: "password123" });
    userId = userResponse.body.id;
  });

  describe("Creating a post", () => {
    it("should create a new post", async () => {
      const response = await request(app)
        .post("/posts")
        .send({ user_id: userId, title: "First Post", content: "This is my first post!" });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("message", "Post created successfully");
      postId = response.body.id;
    });
  });

  describe("Fetching posts", () => {
    it("should get all posts", async () => {
      const response = await request(app).get("/posts");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
    });

    it("should get a post by ID", async () => {
      const response = await request(app).get(`/posts/${postId}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", postId);
    });
  });

  describe("Updating a post", () => {
    it("should update post content", async () => {
      const response = await request(app)
        .put(`/posts/${postId}`)
        .send({ title: "Updated Post", content: "This is my updated post!" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Post updated successfully");
    });
  });

  describe("Deleting a post", () => {
    it("should delete post", async () => {
      const response = await request(app).delete(`/posts/${postId}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Post deleted successfully");
    });
  });
});
