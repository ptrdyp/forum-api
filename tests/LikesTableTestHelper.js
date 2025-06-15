/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const LikesTableTestHelper = {
  async addLike({ id = "comment-123", owner = "user-123", comment = "comment-123" }) {
    const query = {
      text: "INSERT INTO likes VALUES($1, $2, $3)",
      values: [id, owner, comment],
    };

    await pool.query(query);
  },

  async findLikesByUserAndComment(userId, commentId) {
    const query = {
      text: "SELECT * FROM likes WHERE owner = $1 AND comment = $2",
      values: [userId, commentId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async findLikeById(id) {
    const query = {
      text: "SELECT * FROM likes where id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("TRUNCATE TABLE likes CASCADE");
  },
};

module.exports = LikesTableTestHelper;
