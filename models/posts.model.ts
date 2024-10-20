import pool from "./database.model.js";

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

const getPostById = async (postId: number): Promise<UserPost | null> => {
  const query = `SELECT * FROM posts WHERE id = $1`;
  const values = [postId];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

const getAllPosts = async (): Promise<UserPost[]> => {
  const query = `SELECT * FROM posts`;
  const result = await pool.query(query);
  return result.rows as UserPost[];
};

const editPostUser = async (
  id: number,
  postData: { image_url: string; title: string; description: string }
): Promise<void> => {
  const { image_url, title, description } = postData;
  const query = `
    UPDATE posts 
    SET image_url = $1, title = $2, description = $3 
    WHERE id = $4
  `;
  const values = [image_url, title, description, id];
  await pool.query(query, values);
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

export { postUser, getPostById, getPostsByUserId, editPostUser, deletePostUser, getAllPosts };
