const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const pool = require("../../database/postgres/pool");
const AddReply = require("../../../Domains/replies/entities/AddReply");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const ReplyRepositoryPostgres = require("../ReplyRepositoryPostgres");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("ReplyRepositoryPostgres", () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addReply function", () => {
    it("should persist add reply correctly", async () => {
      const userId = "user-123";
      const threadId = "thread-123";
      const commentId = "comment-123";
      await UsersTableTestHelper.addUser({ id: userId, username: "banii" });
      await ThreadsTableTestHelper.addThread({ id: threadId, title: "thread with comment", body: "this thread has comment", owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, content: "comment with reply", owner: userId, thread: threadId });

      const payload = {
        content: "sebuah balasan",
        owner: userId,
        comment: commentId,
      };

      const addReply = new AddReply(payload);

      const fakeIdGenerator = () => "123";

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await replyRepositoryPostgres.addReply(addReply);

      const replies = await RepliesTableTestHelper.findReplyById("reply-123");
      expect(replies).toHaveLength(1);
      const reply = replies[0];
      expect(reply.id).toEqual("reply-123");
      expect(reply.content).toEqual("sebuah balasan");
      expect(reply.owner).toEqual("user-123");
      expect(reply.comment).toEqual("comment-123");
    });

    it("should return added reply correctly", async () => {
      const userId = "user-123";
      const threadId = "thread-123";
      const commentId = "comment-123";
      await UsersTableTestHelper.addUser({ id: userId, username: "banii" });
      await ThreadsTableTestHelper.addThread({ id: threadId, title: "thread with comment", body: "this thread has comment", owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, content: "comment with reply", owner: userId, thread: threadId });

      const payload = {
        content: "sebuah balasan",
        owner: userId,
        comment: commentId,
      };

      const addReply = new AddReply(payload);

      const fakeIdGenerator = () => "123";

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const addedReply = await replyRepositoryPostgres.addReply(addReply);

      expect(addedReply).toStrictEqual(
        new AddedReply({
          id: "reply-123",
          content: "sebuah balasan",
          owner: "user-123",
        })
      );
    });
  });

  describe("getReplyByCommentId", () => {
    it("should get replies by comment id correctly", async () => {
      const threadOwner = {
        id: "user-123",
        username: "penulis",
      };
      const commentOwner = {
        id: "user-234",
        username: "faizal",
      };
      const firstReplyOwner = {
        id: "user-344",
        username: "sudirman",
      };
      const secondReplyOwner = {
        id: "user-445",
        username: "budi",
      };

      await UsersTableTestHelper.addUser(threadOwner);
      await UsersTableTestHelper.addUser(commentOwner);
      await UsersTableTestHelper.addUser(firstReplyOwner);
      await UsersTableTestHelper.addUser(secondReplyOwner);

      const threadId = "thread-000";
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: threadOwner.id,
        title: "ini thread saya",
        body: "kalian boleh berkomentar",
      });

      const comment = {
        id: "comment-123",
        content: "firstt",
        owner: commentOwner.id,
        thread: threadId,
        date: expect.any(String),
        is_delete: false,
      };

      const firstReply = {
        id: "reply-123",
        content: "aku balasan pertama",
        owner: firstReplyOwner.id,
        date: "2021-08-08T07:22:33.555Z",
        is_delete: false,
      };

      const secondReply = {
        id: "reply-234",
        content: "aku balasan pertama tapi ternyata kedua",
        owner: secondReplyOwner.id,
        date: "2021-08-08T07:22:36.555Z",
        is_delete: true,
      };

      await CommentsTableTestHelper.addComment(comment);
      await RepliesTableTestHelper.addReply(firstReply);
      await RepliesTableTestHelper.addReply(secondReply);

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const replyComment = await replyRepositoryPostgres.getReplyByCommentId(comment.id);

      expect(replyComment).toStrictEqual([
        {
          id: "reply-123",
          content: "aku balasan pertama",
          date: expect.any(String),
          username: "sudirman",
          is_delete: false,
        },
        {
          id: "reply-234",
          content: "aku balasan pertama tapi ternyata kedua",
          date: expect.any(String),
          username: "budi",
          is_delete: false,
        },
      ]);
    });
  });

  describe("verifyOwner function", () => {
    it("should throw Error 403 when user is not the reply owner", async () => {
      const threadId = "thread-123";
      const commentId = "comment-123";
      const replyId = "reply-123";
      const strangerId = "user-999";
      const threadOwner = "user-123";
      const commentOwner = "user-456";
      const replyOwner = "user-555";

      await UsersTableTestHelper.addUser({ id: threadOwner, username: "xiuxin" });
      await UsersTableTestHelper.addUser({ id: commentOwner, username: "Yijin" });
      await UsersTableTestHelper.addUser({ id: replyOwner, username: "Suhu" });

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

      await RepliesTableTestHelper.addReply({
        id: replyId,
        content: "Aku membalasnya",
        comment: commentId,
        owner: replyOwner,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(
        replyRepositoryPostgres.verifyOwner({
          replyId,
          owner: strangerId,
        })
      ).rejects.toThrowError(AuthorizationError);
    });

    it("should not throw Error 403 when user is the reply owner", async () => {
      const threadId = "thread-123";
      const commentId = "comment-123";
      const replyId = "reply-123";
      const threadOwner = "user-123";
      const commentOwner = "user-456";
      const replyOwner = "user-555";

      await UsersTableTestHelper.addUser({ id: threadOwner, username: "xiuxin" });
      await UsersTableTestHelper.addUser({ id: commentOwner, username: "Yijin" });
      await UsersTableTestHelper.addUser({ id: replyOwner, username: "Suhu" });

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

      await RepliesTableTestHelper.addReply({
        id: replyId,
        content: "Aku membalasnya",
        comment: commentId,
        owner: replyOwner,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(
        replyRepositoryPostgres.verifyOwner({
          replyId,
          owner: replyOwner,
        })
      ).resolves.not.toThrowError(AuthorizationError);
    });

    it("should throw NotFoundError when reply does not exist", async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const userId = "user-123";

      await UsersTableTestHelper.addUser({ id: userId, username: "xiuxin" });

      await expect(
        replyRepositoryPostgres.verifyOwner({
          commentId: "reply-999", // not exist
          owner: userId,
        })
      ).rejects.toThrowError(NotFoundError);
    });
  });

  describe("deleteReply", () => {
    it("should delete reply", async () => {
      const threadId = "thread-123";
      const commentId = "comment-123";
      const replyId = "reply-123";
      const threadOwner = "user-123";
      const commentOwner = "user-456";
      const replyOwner = "user-555";

      await UsersTableTestHelper.addUser({ id: threadOwner, username: "xiuxin" });
      await UsersTableTestHelper.addUser({ id: commentOwner, username: "Yijin" });
      await UsersTableTestHelper.addUser({ id: replyOwner, username: "Suhu" });

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

      await RepliesTableTestHelper.addReply({
        id: replyId,
        content: "Aku membalasnya",
        comment: commentId,
        owner: replyOwner,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await replyRepositoryPostgres.deleteReply({ replyId, commentId });

      const replies = await RepliesTableTestHelper.findReplyById(replyId);
      expect(replies[0].is_delete).toStrictEqual(true);
    });

    it("should throw NotFoundError when reply is not found", async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      return expect(
        replyRepositoryPostgres.deleteReply({
          replyId: "reply-123",
          commentId: "comment-123",
        })
      ).rejects.toThrowError(NotFoundError);
    });
  });
});
