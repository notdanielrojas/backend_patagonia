import pool from "./database.model";
import bcrypt from "bcryptjs";

interface User {
  name: string;
  last_name: string;
  email: string;
  password: string;
}

interface UserRow {
  id: number;
  name: string;
  last_name: string;
  email: string;
  password: string;
}

const getUserByEmail = async (email: string): Promise<UserRow> => {
  try {
    const query = "SELECT * FROM users WHERE email = $1";
    const values = [email];
    const { rows } = await pool.query<UserRow>(query, values);

    if (rows.length === 0) {
      throw { code: 404, message: "User not found" };
    }

    return rows[0];
  } catch (error: any) {
    throw {
      code: error.code || 500,
      message: error.message || "Error retrieving user",
    };
  }
};

const getUserById = async (id: number): Promise<UserRow | null> => {
  try {
    const result = await pool.query<UserRow>("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0] || null;
  } catch (error: any) {
    throw {
      code: error.code || 500,
      message: error.message || "Error retrieving user by ID",
    };
  }
};

const getAllUsers = async (): Promise<UserRow[]> => {
  const result = await pool.query<UserRow>("SELECT * FROM users");
  return result.rows;
};

const registerUser = async (user: User): Promise<void> => {
  const { name, last_name, email, password } = user;
  const encryptedPassword = bcrypt.hashSync(password);
  const values = [name, last_name, email, encryptedPassword];
  const query = "INSERT INTO users (name, last_name, email, password) VALUES ($1, $2, $3, $4)";

  await pool.query(query, values);
};

const deleteUser = async (id: number): Promise<void> => {
  try {
    const query = "DELETE FROM users WHERE id = $1";
    const values = [id];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      throw { code: 404, message: "User not found" };
    }

    console.log(`User with ID ${id} deleted successfully.`);
  } catch (error: any) {
    throw {
      code: error.code || 500,
      message: error.message || "Error deleting user",
    };
  }
};

const editUser = async (id: number, userData: Partial<User>): Promise<void> => {
  try {
    const { name, last_name, email, password } = userData;

    const updates: string[] = [];
    const values: (string | number)[] = [];

    if (name) {
      updates.push(`name = $${updates.length + 1}`);
      values.push(name);
    }
    if (last_name) {
      updates.push(`last_name = $${updates.length + 1}`);
      values.push(last_name);
    }
    if (email) {
      updates.push(`email = $${updates.length + 1}`);
      values.push(email);
    }
    if (password) {
      const encryptedPassword = bcrypt.hashSync(password);
      updates.push(`password = $${updates.length + 1}`);
      values.push(encryptedPassword);
    }

    if (updates.length === 0) {
      throw { code: 400, message: "No data provided to update" };
    }

    values.push(id);

    const query = `UPDATE users SET ${updates.join(", ")} WHERE id = $${updates.length + 1}`;
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      throw { code: 404, message: "User not found" };
    }

    console.log(`User with ID ${id} updated successfully.`);
  } catch (error: any) {
    throw {
      code: error.code || 500,
      message: error.message || "Error updating user",
    };
  }
};

export { getUserById, getUserByEmail, getAllUsers, registerUser, deleteUser, editUser };
