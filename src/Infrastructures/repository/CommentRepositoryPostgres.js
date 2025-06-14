const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const CommentRepository = require("../../Domains/comments/CommentRepository");
const AddedComment = require("../../Domains/comments/entities/AddedComment");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(addComment) {
    const { content, owner, thread } = addComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO comments VALUES ($1, $2, $3, $4) RETURNING id, content, owner",
      values: [id, content, owner, thread],
    };

    const result = await this._pool.query(query);
    return new AddedComment({ ...result.rows[0] });
  }

  async verifyAvailableComment(commentId) {
    const query = {
      text: "SELECT id FROM comments WHERE id = $1",
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Komentar tidak ditemukan");
    }
  }

  async verifyOwner({ commentId, owner }) {
    const query = {
      text: "SELECT owner FROM comments WHERE id = $1",
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Komentar tidak ditemukan");
    }

    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError("Pengguna tidak memiliki hak akses");
    }
  }

  async verifyCommentBelongsToThread(commentId, threadId) {
    const query = {
      text: "SELECT 1 FROM comments WHERE id = $1 AND thread = $2",
      values: [commentId, threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Komentar tidak ditemukan di thread ini");
    }

    return result.rowCount > 0;
  }

  async getCommentByThreadId(threadId) {
    const query = {
      text: `SELECT 
              comments.id,
              username,
              content,
              TO_CHAR(
                date, 'YYYY-MM-DD"T"HH24:MI:SS"Z"'
              ) as date,
              is_delete
             FROM comments
             LEFT JOIN users
             ON comments.owner = users.id
             WHERE thread = $1
             ORDER BY date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deleteComment({ commentId, threadId }) {
    const query = {
      text: "UPDATE comments SET is_delete = true WHERE id = $1 AND thread = $2",
      values: [commentId, threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Comment tidak ditemukan");
    }
  }
}

module.exports = CommentRepositoryPostgres;
