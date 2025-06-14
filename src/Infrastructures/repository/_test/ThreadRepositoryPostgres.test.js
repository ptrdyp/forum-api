const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const AddThread = require("../../../Domains/threads/entities/AddThread");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const UserRepositoryPostgres = require("../UserRepositoryPostgres");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("ThreadRepositoryPostgres", () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addThread function", () => {
    it("should persist add thread correctly", async () => {
      // Arrange
      const userId = "user-123";
      await UsersTableTestHelper.addUser({ id: userId, username: "bintang" });

      const payload = {
        title: "sebuah thread",
        body: "ini thread pertamaku",
        owner: userId,
      };
      const addThread = new AddThread(payload);

      const fakeIdGenerator = () => "123"; // stub!

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(addThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById("thread-123");
      expect(threads).toHaveLength(1);
      const thread = threads[0];
      expect(thread.id).toEqual("thread-123");
      expect(thread.title).toEqual("sebuah thread");
      expect(thread.body).toEqual("ini thread pertamaku");
      expect(thread.owner).toEqual("user-123");
    });

    it("should return added thread correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123", username: "bintang" });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
      const userId = await userRepositoryPostgres.getIdByUsername("bintang");

      const payload = {
        title: "sebuah thread",
        body: "ini thread pertamaku",
        owner: userId,
      };
      const addThread = new AddThread(payload);

      const fakeIdGenerator = () => "123"; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: "thread-123",
          title: "sebuah thread",
          owner: "user-123",
        })
      );
    });
  });

  describe("verifyAvailableThread function", () => {
    it("should throw NotFoundError when thread not available", async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread("thread-99999")).rejects.toThrowError(NotFoundError);
    });

    it("should not throw NotFoundError when thread available", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-456", username: "sulaiman" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-456",
        title: "threadku",
        body: "ini punyaku",
        owner: "user-456",
        date: "2025-05-18T10:00:00Z",
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread("thread-456")).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("getThreadById function", () => {
    it("should persist getThreadById correctly", async () => {
      const userId = "user-123";
      const threadId = "thread-123";
      const fixedDate = "2025-05-18T03:00:00Z";

      await UsersTableTestHelper.addUser({ id: userId, username: "banu" });
      await ThreadsTableTestHelper.addThread({ id: threadId, title: "thread with comment", body: "this thread has comment", owner: userId, date: fixedDate });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      const threadDetail = await threadRepositoryPostgres.getThreadById(threadId);

      expect(threadDetail.id).toEqual("thread-123");
      expect(threadDetail.title).toEqual("thread with comment");
      expect(threadDetail.body).toEqual("this thread has comment");
      expect(threadDetail.username).toEqual("banu");
      expect(threadDetail.date).toEqual(fixedDate);
    });
  });
});
