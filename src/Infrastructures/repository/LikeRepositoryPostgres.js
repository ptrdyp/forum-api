const LikeRepository = require("../../Domains/likes/LikeRepository");

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async setCommentLikes(userId, commentId) {
    const selectLikes = {
      text: "SELECT id FROM likes WHERE owner = $1 AND comment = $2",
      values: [userId, commentId],
    };
    const { rows } = await this._pool.query(selectLikes);

    if (rows.length > 0) {
      const deleteQuery = {
        text: "DELETE FROM likes WHERE owner = $1 AND comment = $2",
        values: [userId, commentId],
      };
      await this._pool.query(deleteQuery);
    } else {
      const id = `like-${this._idGenerator()}`;
      const insertQuery = {
        text: "INSERT INTO likes (id, owner, comment) VALUES($1, $2, $3)",
        values: [id, userId, commentId],
      };
      await this._pool.query(insertQuery);
    }
  }

  async countCommentLikes(commentIds) {
    if (commentIds.length === 0) return [];

    const placeholders = commentIds.map((_, index) => `$${index + 1}`).join(", ");
    const query = {
      text: `
      SELECT 
        comment, 
        CAST(COUNT(id) as int) as like_count 
      FROM likes 
      WHERE comment IN (${placeholders}) 
      GROUP BY comment
      ORDER BY comment
    `,
      values: commentIds,
    };

    const { rows } = await this._pool.query(query);
    return rows;
  }
}

module.exports = LikeRepositoryPostgres;
