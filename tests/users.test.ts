import request from "supertest";
import app from "../src/index";
import pool from "../models/database.model";

beforeAll(async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(255), last_name VARCHAR(255), email VARCHAR(255) UNIQUE, password VARCHAR(255))"
  );
});

afterAll(async () => {
  await pool.query("DROP TABLE users");
  await pool.end();
});

describe("User CRUD operations", () => {
  let userId: number;

  describe("Creating a user", () => {
    it("should create a new user", async () => {
      const response = await request(app)
        .post("/users")
        .send({ name: "John", last_name: "Doe", email: "john@example.com", password: "password123" });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("message", "User created successfully");
      userId = response.body.id;
    });
  });

  describe("Fetching users", () => {
    it("should get the user by ID", async () => {
      const response = await request(app).get(`/users/${userId}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", userId);
    });
  });

  describe("Updating a user", () => {
    it("should update user information", async () => {
      const response = await request(app).put(`/users/${userId}`).send({ name: "Jane", last_name: "Doe" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "User updated successfully");
    });
  });

  describe("Deleting a user", () => {
    it("should delete user", async () => {
      const response = await request(app).delete(`/users/${userId}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "User deleted successfully");
    });
  });
});
