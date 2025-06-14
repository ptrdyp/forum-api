const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AddedReply = require("../../Domains/replies/entities/AddedReply");
const ReplyRepository = require("../../Domains/replies/ReplyRepository");

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(addReply) {
    const { content, owner, comment } = addReply;
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO replies VALUES ($1, $2, $3, $4) RETURNING id, content, owner",
      values: [id, content, owner, comment],
    };

    const result = await this._pool.query(query);
    return new AddedReply({ ...result.rows[0] });
  }

  async getReplyByCommentId(commentId) {
    const query = {
      text: `SELECT 
              replies.id,
              username,
              content,
              TO_CHAR(
                date, 'YYYY-MM-DD"T"HH24:MI:SS"Z"'
              ) as date,
              is_delete
             FROM replies
             LEFT JOIN users
             ON replies.owner = users.id
             WHERE comment = $1
             ORDER BY date ASC`,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async verifyOwner({ replyId, owner }) {
    const query = {
      text: "SELECT owner FROM replies WHERE id = $1",
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Replies tidak ditemukan");
    }

    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError("Pengguna tidak memiliki hak akses");
    }
  }

  async deleteReply({ replyId, commentId }) {
    const query = {
      text: "UPDATE replies SET is_delete = true WHERE id = $1 AND comment = $2",
      values: [replyId, commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Balasan tidak ditemukan");
    }
  }
}

module.exports = ReplyRepositoryPostgres;
