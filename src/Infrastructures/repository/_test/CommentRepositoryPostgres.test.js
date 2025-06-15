const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("CommentRepositoryPostgres", () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addComment function", () => {
    it("should persist add comment correctly", async () => {
      const userId = "user-123";
      const threadId = "thread-123";
      await UsersTableTestHelper.addUser({ id: userId, username: "banu" });
      await ThreadsTableTestHelper.addThread({ id: threadId, title: "thread with comment", body: "this thread has comment", owner: userId });

      const payload = {
        content: "sebuah comment",
        owner: userId,
        thread: threadId,
      };

      const addComment = new AddComment(payload);

      const fakeIdGenerator = () => "123";

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await commentRepositoryPostgres.addComment(addComment);

      const comments = await CommentsTableTestHelper.findCommentById("comment-123");
      expect(comments).toHaveLength(1);
      const comment = comments[0];
      expect(comment.id).toEqual("comment-123");
      expect(comment.content).toEqual("sebuah comment");
      expect(comment.owner).toEqual("user-123");
      expect(comment.thread).toEqual("thread-123");
    });

    it("should return added comment correctly", async () => {
      const userId = "user-123";
      const threadId = "thread-123";
      await UsersTableTestHelper.addUser({ id: userId, username: "banu" });
      await ThreadsTableTestHelper.addThread({ id: threadId, title: "thread with comment", body: "this thread has comment", owner: userId });

      const payload = {
        content: "sebuah comment",
        owner: userId,
        thread: threadId,
      };

      const addComment = new AddComment(payload);

      const fakeIdGenerator = () => "123";

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const addedComment = await commentRepositoryPostgres.addComment(addComment);

      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: "comment-123",
          content: "sebuah comment",
          owner: "user-123",
        })
      );
    });
  });

  describe("verifyAvailableComment function", () => {
    it("should not throw NotFoundError when comment exists", async () => {
      const userId = "user-123";
      const threadId = "thread-123";
      const commentId = "comment-123";

      await UsersTableTestHelper.addUser({ id: userId, username: "dicoding" });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        title: "sebuah thread",
        body: "thread pertama",
        owner: userId,
      });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: "sebuah komentar",
        thread: threadId,
        owner: userId,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyAvailableComment(commentId)).resolves.not.toThrowError(NotFoundError);
    });

    it("should throw NotFoundError when comment does not exist", async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Verify comment does not exist
      await expect(commentRepositoryPostgres.verifyAvailableComment("comment-999")).rejects.toThrowError(NotFoundError);
    });
  });

  describe("verifyOwner function", () => {
    it("should throw Error 403 when user is not the comments owner", async () => {
      const threadId = "thread-123";
      const commentId = "comment-123";
      const strangerId = "user-999";
      const threadOwner = "user-123";
      const commentOwner = "user-456";

      await UsersTableTestHelper.addUser({ id: threadOwner, username: "xiuxin" });
      await UsersTableTestHelper.addUser({ id: commentOwner, username: "Yijin" });

      await ThreadsTableTestHelper.addThread({
        id: threadId,
        title: "sebuah thread",
        body: "thread ditulis oleh xiu xin",
        owner: threadOwner,
      });

      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: "Aku Yijin, ikut berkomentar",
        thread: threadId,
        owner: commentOwner,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.verifyOwner({
          commentId,
          owner: strangerId,
        })
      ).rejects.toThrowError(AuthorizationError);
    });

    it("should not throw Error 403 when user is the comments owner", async () => {
      const threadId = "thread-123";
      const commentId = "comment-123";
      const threadOwner = "user-123";
      const commentOwner = "user-456";

      await UsersTableTestHelper.addUser({ id: threadOwner, username: "xiuxin" });
      await UsersTableTestHelper.addUser({ id: commentOwner, username: "Yijin" });

      await ThreadsTableTestHelper.addThread({
        id: threadId,
        title: "sebuah thread",
        body: "thread ditulis oleh xiu xin",
        owner: threadOwner,
      });

      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: "Aku Yijin, ikut berkomentar",
        thread: threadId,
        owner: commentOwner,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.verifyOwner({
          commentId,
          owner: commentOwner,
        })
      ).resolves.not.toThrowError(AuthorizationError);
    });

    it("should throw NotFoundError when comment does not exist", async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const userId = "user-123";

      await UsersTableTestHelper.addUser({ id: userId, username: "xiuxin" });

      await expect(
        commentRepositoryPostgres.verifyOwner({
          commentId: "comment-999", // not exist
          owner: userId,
        })
      ).rejects.toThrowError(NotFoundError);
    });
  });

  describe("verifyCommentBelongsToThread", () => {
    it("should return true when the comment belongs to the thread", async () => {
      const threadId = "thread-123";
      const commentId = "comment-123";
      const threadOwner = "user-123";
      const commentOwner = "user-456";

      await UsersTableTestHelper.addUser({ id: threadOwner, username: "xiuxin" });
      await UsersTableTestHelper.addUser({ id: commentOwner, username: "Yijin" });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        title: "sebuah thread",
        body: "thread ditulis oleh xiu xin",
        owner: threadOwner,
      });

      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: "Aku Yijin, ikut berkomentar",
        thread: threadId,
        owner: commentOwner,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const result = await commentRepositoryPostgres.verifyCommentBelongsToThread(commentId, threadId);
      expect(result).toBe(true);
    });
    it("should throw NotFoundError when comment not available", async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentBelongsToThread("comment-99999")).rejects.toThrowError(NotFoundError);
    });
  });

  describe("getCommentsByThreadId", () => {
    it("should get comments by thread id correctly", async () => {
      const threadOwner = {
        id: "user-123",
        username: "penulis",
      };
      const firstCommentOwner = {
        id: "user-234",
        username: "faizal",
      };
      const secComentOwner = {
        id: "user-344",
        username: "sudirman",
      };

      await UsersTableTestHelper.addUser(threadOwner);
      await UsersTableTestHelper.addUser(firstCommentOwner);
      await UsersTableTestHelper.addUser(secComentOwner);

      const threadId = "thread-000";
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: threadOwner.id,
        title: "ini thread saya",
        body: "kalian boleh berkomentar",
      });

      const firstComment = {
        id: "comment-123",
        content: "firstt",
        owner: firstCommentOwner.id,
        thread: threadId,
        date: expect.any(String),
        is_delete: false,
      };
      const secComment = {
        id: "comment-233",
        owner: secComentOwner.id,
        content: "first",
        thread: threadId,
        date: expect.any(String),
        is_delete: true,
      };

      await CommentsTableTestHelper.addComment(firstComment);
      await CommentsTableTestHelper.addComment(secComment);

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const threadComments = await commentRepositoryPostgres.getCommentByThreadId(threadId);

      expect(threadComments[0]).toStrictEqual({
        id: "comment-123",
        username: "faizal",
        date: expect.any(String),
        content: "firstt",
        is_delete: false,
        likeCount: 0,
      });
      expect(threadComments[1]).toStrictEqual({
        id: "comment-233",
        username: "sudirman",
        date: expect.any(String),
        content: secComment.content,
        is_delete: false,
        likeCount: 0,
      });
    });
  });

  describe("deleteComment", () => {
    it("should delete comment", async () => {
      const threadId = "thread-123";
      const commentId = "comment-123";
      const threadOwner = "user-123";
      const commentOwner = "user-456";

      await UsersTableTestHelper.addUser({ id: threadOwner, username: "xiuxin" });
      await UsersTableTestHelper.addUser({ id: commentOwner, username: "Yijin" });

      await ThreadsTableTestHelper.addThread({
        id: threadId,
        title: "sebuah thread",
        body: "thread ditulis oleh xiu xin",
        owner: threadOwner,
      });

      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: "Aku Yijin, ikut berkomentar",
        thread: threadId,
        owner: commentOwner,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await commentRepositoryPostgres.deleteComment({ commentId, threadId });

      const comments = await CommentsTableTestHelper.findCommentById(commentId);
      expect(comments[0].is_delete).toStrictEqual(true);
    });

    it("should throw NotFoundError when comment is not found", async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      return expect(
        commentRepositoryPostgres.deleteComment({
          commentId: "comment-123",
          threadId: "thread-123",
        })
      ).rejects.toThrowError(NotFoundError);
    });
  });
});
