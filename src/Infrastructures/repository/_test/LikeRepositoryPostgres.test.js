const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const LikesTableTestHelper = require("../../../../tests/LikesTableTestHelper");
const pool = require("../../database/postgres/pool");
const LikeRepositoryPostgres = require("../LikeRepositoryPostgres");

describe("LikeRepositoryPostgres", () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("setCommentLikes function", () => {
    it("should set the comments like correctly", async () => {
      const userId = "user-123";
      const threadId = "thread-123";
      const commentId = "comment-123";

      await UsersTableTestHelper.addUser({ id: userId, username: "putri" });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, owner: userId, thread: threadId });

      const fakeIdGenerator = () => "123";
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      await likeRepositoryPostgres.setCommentLikes(userId, commentId);

      const likes = await LikesTableTestHelper.findLikeById("like-123");
      expect(likes).toHaveLength(1);
      expect(likes[0].is_liked).toEqual(true);
    });

    it("should update the existed comments like correctly", async () => {
      const userId = "user-123";
      const threadId = "thread-123";
      const commentId = "comment-123";
      const likeId = "like-012";

      await UsersTableTestHelper.addUser({ id: userId, username: "putri" });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, owner: userId, thread: threadId });

      await LikesTableTestHelper.addLike({
        id: likeId,
        owner: userId,
        comment: commentId,
        is_liked: true,
      });

      const fakeIdGenerator = () => "123";
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      await likeRepositoryPostgres.setCommentLikes(userId, commentId);

      const likes = await LikesTableTestHelper.findLikeById(likeId);
      expect(likes[0].is_liked).toEqual(false);
    });
  });

  describe("countCommentLikes function", () => {
    it("should count comments likes correctly", async () => {
      const userId = "user-123";
      const userId2 = "user-456";
      const threadId = "thread-123";
      const commentId = "comment-123";
      const commentId2 = "comment-456";
      const likeId = "like-012";
      const likeId2 = "like-123";
      const likeId3 = "like-234";

      await UsersTableTestHelper.addUser({ id: userId, username: "putri" });
      await UsersTableTestHelper.addUser({ id: userId2, username: "alviany" });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, owner: userId, thread: threadId });
      await CommentsTableTestHelper.addComment({ id: commentId2, owner: userId2, thread: threadId });

      await LikesTableTestHelper.addLike({
        id: likeId,
        owner: userId,
        comment: commentId,
        is_liked: true,
      });
      await LikesTableTestHelper.addLike({
        id: likeId2,
        owner: userId2,
        comment: commentId,
        is_liked: true,
      });
      await LikesTableTestHelper.addLike({
        id: likeId3,
        owner: userId,
        comment: commentId2,
        is_liked: true,
      });

      const fakeIdGenerator = () => "888";
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      const countLikes = await likeRepositoryPostgres.countCommentLikes([commentId, commentId2]);

      expect(countLikes).toHaveLength(2)
      expect(countLikes[0].count).toEqual({ comment: commentId, count: 2 })
      expect(countLikes[1].count).toEqual({ comment: commentId2, count: 1 })
    });
  });
});
