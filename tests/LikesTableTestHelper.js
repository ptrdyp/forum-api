/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const LikesTableTestHelper = {
  async addLike({ id = "comment-123", owner = "user-123", comment = "comment-123", is_liked = true }) {
    const query = {
      text: "INSERT INTO likes VALUES($1, $2, $3, $4)",
      values: [id, owner, comment, is_liked],
    };

    await pool.query(query);
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
