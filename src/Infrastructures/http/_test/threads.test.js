const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");
const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");

describe("/threads endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  describe("when POST /threads", () => {
    it("should response 201 and persisted thread when user is authenticated", async () => {
      // Arrange
      const server = await createServer(container);

      // Create user
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          fullname: "Dicoding Indonesia",
          password: "secret",
        },
      });

      // Simulasi login
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

      const requestPayload = {
        title: "sebuah thread",
        body: "ini thread pertamaku",
      };

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedThread).toBeDefined();
    });
  });

  describe("when GET /threads/{threadId}", () => {
    it("should response 200 and return thread detail, its comment, and replies correctly", async () => {
      const server = await createServer(container);

      // Create user
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "dicoding",
          fullname: "Dicoding Indonesia",
          password: "secret",
        },
      });
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "komentator",
          fullname: "pengguna sebagai komentator",
          password: "secret",
        },
      });
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "responder",
          fullname: "pengguna sebagai responder",
          password: "secret",
        },
      });

      // Simulasi login
      const loginResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "dicoding",
          password: "secret",
        },
      });
      const komentatorLoginResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "komentator",
          password: "secret",
        },
      });
      const responderLoginResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "responder",
          password: "secret",
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(loginResponse.payload);
      const {
        data: { accessToken: komentatorAccessToken },
      } = JSON.parse(komentatorLoginResponse.payload);
      const {
        data: { accessToken: responderAccessToken },
      } = JSON.parse(responderLoginResponse.payload);

      const requestPayload = {
        title: "sebuah thread",
        body: "ini thread pertamaku",
      };

      // add thread
      const threadResponse = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const {
        data: { addedThread },
      } = JSON.parse(threadResponse.payload);
      const threadId = addedThread.id;

      // add comment
      const addCommentPayload = {
        content: "sebuah comment",
      };

      const commentResponse = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: addCommentPayload,
        headers: {
          authorization: `Bearer ${komentatorAccessToken}`,
        },
      });

      const {
        data: { addedComment },
      } = JSON.parse(commentResponse.payload);
      const commentId = addedComment.id;

      // Add reply
      const addReplyPayload = {
        content: "sebuah balasan",
      };

      await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: addReplyPayload,
        headers: {
          authorization: `Bearer ${responderAccessToken}`,
        },
      });

      // get
      const threadDetailResponse = await server.inject({
        method: "GET",
        url: `/threads/${threadId}`,
      });

      const responseJson = JSON.parse(threadDetailResponse.payload);
      const thread = responseJson.data.thread;
      const comment = thread.comments.find((comment) => comment.id === commentId);

      expect(threadDetailResponse.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(thread).toBeDefined();
      expect(thread.id).toEqual(threadId);
      expect(thread.comments).toHaveLength(1);
      expect(comment.replies).toHaveLength(1);
    });
  });
});
