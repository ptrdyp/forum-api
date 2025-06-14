const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");
const container = require("../../container");

describe("/replies endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  describe("when POST /replies", () => {
    it("should response 201 and persisted reply when user is authenticated", async () => {
      const server = await createServer(container);

      // create user
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          fullname: "Dicoding Indonesia",
          password: "secret",
        },
      });

      // login
      const loginResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(loginResponse.payload);

      // create thread
      const threadResponse = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "sebuah thread",
          body: "ini thread pertamaku",
        },
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // get thread id
      const {
        data: { addedThread },
      } = JSON.parse(threadResponse.payload);
      const threadId = addedThread.id;

      // add comment
      const commentResponse = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: {
          content: "sebuah comment",
        },
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // get comment id
      const {
        data: { addedComment },
      } = JSON.parse(commentResponse.payload);
      const commentId = addedComment.id;

      // Add reply
      const replyResponse = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: {
          content: "sebuah balasan",
        },
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(replyResponse.payload);
      expect(replyResponse.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedReply).toBeDefined();
    });

    it("should response 404 when thread and comment not found", async () => {
      const server = await createServer(container);

      // create user
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          fullname: "Dicoding Indonesia",
          password: "secret",
        },
      });

      // login
      const loginResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(loginResponse.payload);

      // Add reply
      const replyResponse = await server.inject({
        method: "POST",
        url: `/threads/thread-123/comments/comment-123/replies`,
        payload: {
          content: "sebuah balasan",
        },
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(replyResponse.payload);
      expect(replyResponse.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
    });

    it("should response 404 when thread not found", async () => {
      const server = await createServer(container);

      // create user
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          fullname: "Dicoding Indonesia",
          password: "secret",
        },
      });

      // login
      const loginResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(loginResponse.payload);

      // create thread
      const threadResponse = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "sebuah thread",
          body: "ini thread pertamaku",
        },
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // get thread id
      const {
        data: { addedThread },
      } = JSON.parse(threadResponse.payload);
      const threadId = addedThread.id;

      // add comment
      const commentResponse = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: {
          content: "sebuah comment",
        },
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // get comment id
      const {
        data: { addedComment },
      } = JSON.parse(commentResponse.payload);
      const commentId = addedComment.id;

      // Add reply
      const replyResponse = await server.inject({
        method: "POST",
        url: `/threads/xxx/comments/${commentId}/replies`,
        payload: {
          content: "sebuah balasan",
        },
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(replyResponse.payload);
      expect(replyResponse.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
    });

    it("should response 404 when comment not found", async () => {
      const server = await createServer(container);

      // create user
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          fullname: "Dicoding Indonesia",
          password: "secret",
        },
      });

      // login
      const loginResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(loginResponse.payload);

      // create thread
      const threadResponse = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "sebuah thread",
          body: "ini thread pertamaku",
        },
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // get thread id
      const {
        data: { addedThread },
      } = JSON.parse(threadResponse.payload);
      const threadId = addedThread.id;

      // Add reply
      const replyResponse = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/comment-123/replies`,
        payload: {
          content: "sebuah balasan",
        },
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(replyResponse.payload);
      expect(replyResponse.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
    });

    it("should response 400 when payload did not contain needed property", async () => {
      const server = await createServer(container);

      // create user
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          fullname: "Dicoding Indonesia",
          password: "secret",
        },
      });

      // login
      const loginResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(loginResponse.payload);

      // create thread
      const threadResponse = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "sebuah thread",
          body: "ini thread pertamaku",
        },
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // get thread id
      const {
        data: { addedThread },
      } = JSON.parse(threadResponse.payload);
      const threadId = addedThread.id;

      // add comment
      const commentResponse = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: {
          content: "sebuah comment",
        },
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // get comment id
      const {
        data: { addedComment },
      } = JSON.parse(commentResponse.payload);
      const commentId = addedComment.id;

      // Add reply
      const replyResponse = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: {
          //   content: "sebuah balasan",
        },
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(replyResponse.payload);
      expect(replyResponse.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
    });
  });

  describe("when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}", () => {
    it("should response 200 when request correct", async () => {
      const server = await createServer(container);

      // create user
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          fullname: "Dicoding Indonesia",
          password: "secret",
        },
      });

      // login
      const loginResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(loginResponse.payload);

      // create thread
      const threadResponse = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "sebuah thread",
          body: "ini thread pertamaku",
        },
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // get thread id
      const {
        data: { addedThread },
      } = JSON.parse(threadResponse.payload);
      const threadId = addedThread.id;

      // add comment
      const addCommentPayload = {
        content: "sebuah comment",
      };

      const addCommentResponse = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: addCommentPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // get comment id
      const {
        data: { addedComment },
      } = JSON.parse(addCommentResponse.payload);
      const commentId = addedComment.id;

      // add reply
      const addReplyPayload = {
        content: "sebuah balasan",
      };

      const addReplyResponse = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: addReplyPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // get reply id
      const {
        data: { addedReply },
      } = JSON.parse(addReplyResponse.payload);
      const replyId = addedReply.id;

      const deleteReplyResponse = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(deleteReplyResponse.payload);
      expect(deleteReplyResponse.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });

    it("should response 403 if user is not the comment owner", async () => {
      const server = await createServer(container);

      // create user
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          fullname: "Dicoding Indonesia",
          password: "secret",
        },
      });

      // login
      const loginResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(loginResponse.payload);

      // create thread
      const threadResponse = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "sebuah thread",
          body: "ini thread pertamaku",
        },
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // get thread id
      const {
        data: { addedThread },
      } = JSON.parse(threadResponse.payload);
      const threadId = addedThread.id;

      // add comment
      const addCommentPayload = {
        content: "sebuah comment",
      };

      const addCommentResponse = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: addCommentPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // get comment id
      const {
        data: { addedComment },
      } = JSON.parse(addCommentResponse.payload);
      const commentId = addedComment.id;

      // add reply
      const addReplyPayload = {
        content: "sebuah balasan",
      };

      const addReplyResponse = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: addReplyPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // get reply id
      const {
        data: { addedReply },
      } = JSON.parse(addReplyResponse.payload);
      const replyId = addedReply.id;

      // post stranger user
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "stranger",
          fullname: "Stranger is not the owner",
          password: "stranger",
        },
      });

      // login
      const strangerLoginResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "stranger",
          password: "stranger",
        },
      });

      const {
        data: { accessToken: strangerAccessToken },
      } = JSON.parse(strangerLoginResponse.payload);

      const deleteReplyResponse = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          authorization: `Bearer ${strangerAccessToken}`,
        },
      });

      const responseJson = JSON.parse(deleteReplyResponse.payload);
      expect(deleteReplyResponse.statusCode).toEqual(403);
      expect(responseJson.status).toEqual("fail");
    });
  });
});
