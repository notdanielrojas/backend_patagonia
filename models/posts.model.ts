import pool from "./database.model";

interface UserPost {
  id?: number;
  image_url: string;
  title: string;
  description: string;
  user_id: number;
}

const postUser = async ({ user_id, image_url, title, description }: UserPost): Promise<void> => {
  const query = `INSERT INTO posts ( user_id, image_url, title, description) VALUES ($1, $2, $3, $4)`;
  const values = [user_id, image_url, title, description];
  await pool.query(query, values);
};

const getPostsByUserId = async (user_id: number): Promise<UserPost[]> => {
  const query = `SELECT * FROM posts WHERE user_id = $1`;
  const values = [user_id];
  const result = await pool.query(query, values);
  return result.rows as UserPost[];
};

const getAllPosts = async (): Promise<UserPost[]> => {
  const query = `SELECT * FROM posts`;
  const result = await pool.query(query);
  return result.rows as UserPost[];
};


const editPostUser = async (id: number, user: UserPost): Promise<void> => {
  const { image_url, title, description } = user;
  const values = [image_url, title, description, id];
  const query = "UPDATE posts SET image_url = $1, title = $2, description = $3 WHERE id = $4";

  try {
    await pool.query(query, values);
  } catch (error) {
    console.error("Error updating user post:", error);
    throw new Error("Failed to update post in database");
  }
};

const deletePostUser = async (id: number): Promise<void> => {
  const query = "DELETE FROM posts WHERE id = $1";

  try {
    const result = await pool.query(query, [id]);
    if (result.rowCount === 0) {
      throw new Error("No post found with the given ID");
    }
  } catch (error) {
    console.error("Error deleting user post:", error);
    throw new Error("Failed to delete post from database");
  }
};

export { postUser, getPostsByUserId, editPostUser, deletePostUser, getAllPosts };
