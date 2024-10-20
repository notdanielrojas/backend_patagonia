import pool from "./database.model";
import bcrypt from "bcryptjs";

interface User {
  id: number;
  email: string;
  password: string;
}

interface UserWithoutPassword {
  id: number;
  email: string;
}

const verifyCredentials = async (email: string, password: string): Promise<UserWithoutPassword> => {
  const values = [email];
  const query = "SELECT * FROM users WHERE email = $1";

  try {
    const { rows, rowCount } = await pool.query<User>(query, values);

    if (rowCount === 0) {
      throw { code: 401, message: "Email or password incorrect" };
    }

    const user: User = rows[0];
    const { password: encryptedPassword, ...userWithoutPassword } = user;

    const passwordCorrect = await bcrypt.compare(password, encryptedPassword);
    if (!passwordCorrect) {
      throw { code: 401, message: "Email or password incorrect" };
    }

    return userWithoutPassword as UserWithoutPassword;
  } catch (error) {
    console.error("Database query failed:", error);
    throw { code: 500, message: "Internal server error" };
  }
};

export { verifyCredentials };
