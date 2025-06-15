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
    it("should add like when user has not liked the comment", async () => {
      const userId = "user-123";
      const threadId = "thread-123";
      const commentId = "comment-123";

      await UsersTableTestHelper.addUser({ id: userId, username: "putri123" });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, owner: userId, thread: threadId });

      const fakeIdGenerator = () => "123";
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      await likeRepositoryPostgres.setCommentLikes(userId, commentId);

      const likes = await LikesTableTestHelper.findLikeById("like-123");
      expect(likes).toHaveLength(1);
      expect(likes[0].owner).toEqual(userId);
      expect(likes[0].comment).toEqual(commentId);
    });

    it("should remove like when user has already liked the comment", async () => {
      const userId = "user-456";
      const threadId = "thread-123";
      const commentId = "comment-123";
      const likeId = "like-012";

      await UsersTableTestHelper.addUser({ id: userId, username: "putri456" });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, owner: userId, thread: threadId });

      await LikesTableTestHelper.addLike({
        id: likeId,
        owner: userId,
        comment: commentId,
      });

      const fakeIdGenerator = () => "123";
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      await likeRepositoryPostgres.setCommentLikes(userId, commentId);

      const likes = await LikesTableTestHelper.findLikeById(likeId);
      expect(likes).toHaveLength(0);
    });

    it("should toggle like correctly (like -> unlike -> like)", async () => {
      const userId = "user-789";
      const threadId = "thread-123";
      const commentId = "comment-123";

      await UsersTableTestHelper.addUser({ id: userId, username: "putri789" });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, owner: userId, thread: threadId });

      const fakeIdGenerator = () => "123";
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // First call: should add like
      await likeRepositoryPostgres.setCommentLikes(userId, commentId);
      let likes = await LikesTableTestHelper.findLikesByUserAndComment(userId, commentId);
      expect(likes).toHaveLength(1);

      // Second call: should remove like
      await likeRepositoryPostgres.setCommentLikes(userId, commentId);
      likes = await LikesTableTestHelper.findLikesByUserAndComment(userId, commentId);
      expect(likes).toHaveLength(0);

      // Third call: should add like again
      await likeRepositoryPostgres.setCommentLikes(userId, commentId);
      likes = await LikesTableTestHelper.findLikesByUserAndComment(userId, commentId);
      expect(likes).toHaveLength(1);
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
      });
      await LikesTableTestHelper.addLike({
        id: likeId2,
        owner: userId2,
        comment: commentId,
      });
      await LikesTableTestHelper.addLike({
        id: likeId3,
        owner: userId,
        comment: commentId2,
      });

      const fakeIdGenerator = () => "888";
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      const countLikes = await likeRepositoryPostgres.countCommentLikes([commentId, commentId2]);

      expect(countLikes).toHaveLength(2);

      const comment1Likes = countLikes.find((like) => like.comment === commentId);
      expect(comment1Likes.like_count).toEqual(2);

      const comment2Likes = countLikes.find((like) => like.comment === commentId2);
      expect(comment2Likes.like_count).toEqual(1);
    });

    it("should return empty array when no comment ids provided", async () => {
      const fakeIdGenerator = () => "888";
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      const countLikes = await likeRepositoryPostgres.countCommentLikes([]);

      expect(countLikes).toEqual([]);
    });

    it("should return empty array when no likes found for given comment ids", async () => {
      const userId = "user-123";
      const threadId = "thread-123";
      const commentId = "comment-123";

      await UsersTableTestHelper.addUser({ id: userId, username: "putri123" });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, owner: userId, thread: threadId });

      const fakeIdGenerator = () => "888";
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      const countLikes = await likeRepositoryPostgres.countCommentLikes([commentId]);

      expect(countLikes).toEqual([]);
    });
  });
});
