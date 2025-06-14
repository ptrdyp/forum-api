/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const RepliesTableTestHelper = {
  async addReply({ id = "reply-123", content = "sebuah balasan", owner = "user-123", comment = 'comment-123' }) {
    const query = {
      text: "INSERT INTO replies VALUES($1, $2, $3, $4)",
      values: [id, content, owner, comment],
    };

    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: "SELECT * FROM replies where id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("TRUNCATE TABLE replies CASCADE");
  },
};

module.exports = RepliesTableTestHelper;
