const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");

describe("/comments endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe("when POST /comments", () => {
    it("should response 201 and persisted comment when user is authenticated", async () => {
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
      const requestPayload = {
        content: "sebuah comment",
      };

      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedComment).toBeDefined();
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

      // add comment
      const requestPayload = {
        content: "sebuah comment",
      };

      const response = await server.inject({
        method: "POST",
        url: `/threads/thread-999/comments`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
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
      const requestPayload = {
        // content: "sebuah comment",
      };

      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
    });
  });

  describe("when DELETE /threads/{threadId}/comments/{commentId}", () => {
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

      const deleteCommentResponse = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(deleteCommentResponse.payload);
      expect(deleteCommentResponse.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });

    it("should response 403 if user is not the comment owner", async () => {
      const server = await createServer(container);

      // create user owner
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

      const deleteCommentResponse = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          authorization: `Bearer ${strangerAccessToken}`,
        },
      });

      const responseJson = JSON.parse(deleteCommentResponse.payload);
      expect(deleteCommentResponse.statusCode).toEqual(403);
      expect(responseJson.status).toEqual("fail");
    });
  });
});
