const ThreadDetail = require("../ThreadDetail");

describe("a thread detail entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    const emptyPayload = {};
    const noBodyPropPayload = {
      id: "thread-123",
      title: "sebuah thread",
      // without body,
      date: "2021-08-08T07:19:09.775Z",
      username: "dicoding",
    };
    const noUsernamePropPayload = {
      id: "thread-123",
      title: "sebuah thread",
      body: "ini thread saya",
      date: "2021-08-08T07:19:09.775Z",
      //   username: "dicoding",
    };
    const noDatePropPayload = {
      id: "thread-123",
      title: "sebuah thread",
      body: "ini thread saya",
      //   date: "2021-08-08T07:19:09.775Z",
      username: "dicoding",
    };

    expect(() => new ThreadDetail(emptyPayload)).toThrowError("THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY");
    expect(() => new ThreadDetail(noBodyPropPayload)).toThrowError("THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY");
    expect(() => new ThreadDetail(noUsernamePropPayload)).toThrowError("THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY");
    expect(() => new ThreadDetail(noDatePropPayload)).toThrowError("THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY");
  });

  it("should throw error when payload did not meet data type specification", () => {
    const halfInvalidPayloadDataType = {
      id: 1,
      title: [],
      body: 123,
      date: 2021,
      username: 123,
    };
    const invalidPayloadDataType = {
      id: 1,
      title: [],
      body: 123,
      date: 2021,
      username: 123,
      comments: "ini comment",
    };

    expect(() => new ThreadDetail(halfInvalidPayloadDataType)).toThrowError("THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION");
    expect(() => new ThreadDetail(invalidPayloadDataType)).toThrowError("THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("should return thread detail object correctly without comments", () => {
    const payloadWithoutComments = {
      id: "thread-123",
      title: "sebuah thread",
      body: "ini thread saya",
      date: "2021-08-08T07:19:09.775Z",
      username: "dicoding",
      // comments is intentionally omitted
    };

    const payloadWithNullComments = {
      id: "thread-123",
      title: "sebuah thread",
      body: "ini thread saya",
      date: "2021-08-08T07:19:09.775Z",
      username: "dicoding",
      comments: null,
    };

    const payloadWithEmptyComments = {
      id: "thread-123",
      title: "sebuah thread",
      body: "ini thread saya",
      date: "2021-08-08T07:19:09.775Z",
      username: "dicoding",
      comments: [],
    };

    const threadWithoutComments = new ThreadDetail(payloadWithoutComments);
    const threadWithNullComments = new ThreadDetail(payloadWithNullComments);
    const threadWithEmptyComments = new ThreadDetail(payloadWithEmptyComments);

    expect(payloadWithoutComments.id).toEqual("thread-123");
    expect(payloadWithoutComments.title).toEqual("sebuah thread");
    expect(payloadWithoutComments.body).toEqual("ini thread saya");
    expect(payloadWithoutComments.date).toEqual("2021-08-08T07:19:09.775Z");
    expect(payloadWithoutComments.username).toEqual("dicoding");

    expect(threadWithoutComments.comments).toBeUndefined;
    expect(threadWithNullComments.comments).toBeUndefined;
    expect(threadWithEmptyComments.comments).toBeUndefined;
  });

  it("should return thread detail object correctly with comments", () => {
    const payloadWithComments = {
      id: "thread-123",
      title: "sebuah thread",
      body: "ini thread saya",
      date: "2021-08-08T07:19:09.775Z",
      username: "dicoding",
      comments: [
        {
          id: "comment-456",
          username: "johndoe",
          date: "2021-08-08T07:22:33.555Z",
          content: "sebuah comment",
        },
      ],
    };

    const threadDetail = new ThreadDetail(payloadWithComments);

    // Assert
    expect(threadDetail.id).toEqual("thread-123");
    expect(threadDetail.title).toEqual("sebuah thread");
    expect(threadDetail.body).toEqual("ini thread saya");
    expect(threadDetail.date).toEqual("2021-08-08T07:19:09.775Z");
    expect(threadDetail.username).toEqual("dicoding");
  });

  it("should return thread detail object correctly", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "sebuah thread",
      body: "ini thread saya",
      date: "2021-08-08T07:19:09.775Z",
      username: "dicoding",
    };

    const payloadWithComments = {
      id: "thread-123",
      title: "sebuah thread",
      body: "ini thread saya",
      date: "2021-08-08T07:19:09.775Z",
      username: "dicoding",
      comments: [
        {
          id: "comment-456",
          username: "johndoe",
          date: "2021-08-08T07:22:33.555Z",
          content: "sebuah comment",
        },
      ],
    };

    // Action
    const threadDetail = new ThreadDetail(payload);
    const threadDetailWithComments = new ThreadDetail(payloadWithComments);

    // Assert
    expect(threadDetail.id).toEqual("thread-123");
    expect(threadDetail.title).toEqual("sebuah thread");
    expect(threadDetail.body).toEqual("ini thread saya");
    expect(threadDetail.date).toEqual("2021-08-08T07:19:09.775Z");
    expect(threadDetail.username).toEqual("dicoding");
    expect(threadDetail.comments).toEqual(undefined);

    // Assert
    expect(threadDetailWithComments.id).toEqual("thread-123");
    expect(threadDetailWithComments.title).toEqual("sebuah thread");
    expect(threadDetailWithComments.body).toEqual("ini thread saya");
    expect(threadDetailWithComments.date).toEqual("2021-08-08T07:19:09.775Z");
    expect(threadDetailWithComments.username).toEqual("dicoding");
    expect(threadDetailWithComments.comments).toEqual([
      {
        id: "comment-456",
        username: "johndoe",
        date: "2021-08-08T07:22:33.555Z",
        content: "sebuah comment",
      },
    ]);
  });
});
