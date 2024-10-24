import request from "supertest";
import app from "../src/index";
import pool from "../models/database.model";

beforeAll(async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(255), last_name VARCHAR(255), email VARCHAR(255) UNIQUE, password VARCHAR(255))"
  );
  await pool.query(
    "CREATE TABLE IF NOT EXISTS orders (id SERIAL PRIMARY KEY, user_id INT, total NUMERIC, status VARCHAR(50), FOREIGN KEY (user_id) REFERENCES users(id))"
  );
});

afterAll(async () => {
  await pool.query("DROP TABLE orders");
  await pool.query("DROP TABLE users");
  await pool.end();
});

describe("Order CRUD operations", () => {
  let userId: number;
  let orderId: number;

  beforeAll(async () => {
    const userResponse = await request(app)
      .post("/users")
      .send({ name: "John", last_name: "Doe", email: "john@example.com", password: "password123" });
    userId = userResponse.body.id;
  });

  describe("Creating an order", () => {
    it("should create a new order", async () => {
      const response = await request(app).post("/orders").send({ user_id: userId, total: 100.5, status: "Pending" });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("message", "Order created successfully");
      orderId = response.body.id;
    });
  });

  describe("Fetching orders", () => {
    it("should get orders by user ID", async () => {
      const response = await request(app).get(`/orders/${userId}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
    });
  });

  describe("Updating an order", () => {
    it("should update order status", async () => {
      const response = await request(app).put(`/orders/${orderId}`).send({ status: "Completed" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Order status updated successfully");
    });
  });

  describe("Deleting an order", () => {
    it("should delete order", async () => {
      const response = await request(app).delete(`/orders/${orderId}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Order deleted successfully");
    });
  });
});
