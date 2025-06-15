const LikesTableTestHelper = require("../../../../tests/LikesTableTestHelper");
const container = require("../../container");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");

describe("/threads/{threadId}/comments/{commentId}/likes endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
  });

  describe("when PUT /threads/{threadId}/comments/{commentId}/likes", () => {
    it("should response 200 and persisted likes status", async () => {
      const server = await createServer(container);
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "putri",
          password: "secret",
          fullname: "putri dyah",
        },
      });

      const loginResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "putri",
          password: "secret",
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(loginResponse.payload);

      const addThreadResponse = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "thread saya",
          body: "ini adalah thread",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const {
        data: { addedThread },
      } = JSON.parse(addThreadResponse.payload);

      const addCommentResponse = await server.inject({
        method: "POST",
        url: `/threads/${addedThread.id}/comments`,
        payload: { content: "saya berkomentar" },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const {
        data: { addedComment },
      } = JSON.parse(addCommentResponse.payload);

      const setLikesResponse = await server.inject({
        method: "PUT",
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      const responseJson = JSON.parse(setLikesResponse.payload);
      expect(setLikesResponse.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });

    it("should response 404 when comments thread to be liked not found", async () => {
      const server = await createServer(container);
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "putri",
          password: "secret",
          fullname: "putri dyah",
        },
      });

      const loginResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "putri",
          password: "secret",
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(loginResponse.payload);

      const addThreadResponse = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "thread saya",
          body: "ini adalah thread",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const {
        data: { addedThread },
      } = JSON.parse(addThreadResponse.payload);

      const addCommentResponse = await server.inject({
        method: "POST",
        url: `/threads/${addedThread.id}/comments`,
        payload: { content: "saya berkomentar" },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const {
        data: { addedComment },
      } = JSON.parse(addCommentResponse.payload);

      const setLikesResponse = await server.inject({
        method: "PUT",
        url: `/threads/thread-not-exist/comments/${addedComment.id}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(setLikesResponse.payload);
      expect(setLikesResponse.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
    });

    it("should response 404 when comment to be liked not found", async () => {
      const server = await createServer(container);
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "putri",
          password: "secret",
          fullname: "putri dyah",
        },
      });

      const loginResponse = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "putri",
          password: "secret",
        },
      });

      const {
        data: { accessToken },
      } = JSON.parse(loginResponse.payload);

      const addThreadResponse = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "thread saya",
          body: "ini adalah thread",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const {
        data: { addedThread },
      } = JSON.parse(addThreadResponse.payload);

      const setLikesResponse = await server.inject({
        method: "PUT",
        url: `/threads/${addedThread.id}/comments/comment-not-exist/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(setLikesResponse.payload);
      expect(setLikesResponse.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
    });
  });
});
