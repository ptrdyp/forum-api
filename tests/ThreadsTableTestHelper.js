/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const ThreadsTableTestHelper = {
  async addThread({ id = "thread-123", title = "sebuah thread", body = "ini thread pertamaku", owner = "user-123", date = "2025-05-18T10:00:00Z" }) {
    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4, $5)",
      values: [id, title, body, owner, date],
    };

    await pool.query(query);
  },

  async findThreadById(id) {
    const query = {
      text: "SELECT * FROM threads where id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("TRUNCATE TABLE threads CASCADE");
  },
};

module.exports = ThreadsTableTestHelper;
