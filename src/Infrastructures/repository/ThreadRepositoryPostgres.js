const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AddedThread = require("../../Domains/threads/entities/AddedThread");
const ThreadDetail = require("../../Domains/threads/entities/ThreadDetail");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(addThread) {
    const { title, body, owner } = addThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO threads VALUES ($1, $2, $3, $4) RETURNING id, title, owner",
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);
    return new AddedThread({ ...result.rows[0] });
  }

  async verifyAvailableThread(id) {
    const query = {
      text: "SELECT id FROM threads WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Thread tidak ditemukan");
    }
  }

  async getThreadById(id) {
    const query = {
      text: `
      SELECT 
      threads.id,
      username,
      title,
      body,
      TO_CHAR(
        date, 'YYYY-MM-DD"T"HH24:MI:SS"Z"'
      ) as date
     FROM threads
     JOIN users ON threads.owner = users.id
     WHERE threads.id = $1
      `,
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;
