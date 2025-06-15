/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("likes", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    comment: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    is_liked: {
      type: "BOOLEAN",
      notNull: true,
      default: true,
    },
  });

  pgm.addConstraint("likes", "fk_likes.owner_users.id", "FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE");
  pgm.addConstraint("likes", "fk_likes.comment_comments.id", "FOREIGN KEY(comment) REFERENCES comments(id) ON DELETE CASCADE");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('likes');
};
