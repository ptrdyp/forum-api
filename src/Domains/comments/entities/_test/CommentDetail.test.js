const CommentDetail = require("../CommentDetail");

describe("a comment detail entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    const emptyPayload = {};
    const noIdPropPayload = {
      //   id: "comment-123",
      username: "johndoe",
      date: "2021-08-08T07:22:33.555Z",
      content: "sebuah comment",
      likeCount: 2,
    };
    const noUsernamePropPayload = {
      id: "comment-123",
      //   username: "johndoe",
      date: "2021-08-08T07:22:33.555Z",
      content: "sebuah comment",
      likeCount: 2,
    };
    const noDatePropPayload = {
      id: "comment-123",
      username: "johndoe",
      //   date: "2021-08-08T07:22:33.555Z",
      content: "sebuah comment",
      likeCount: 2,
    };
    const noContentPropPayload = {
      id: "comment-123",
      username: "johndoe",
      date: "2021-08-08T07:22:33.555Z",
      //   content: "sebuah comment",
      likeCount: 2,
    };

    expect(() => new CommentDetail(emptyPayload)).toThrowError("COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY");
    expect(() => new CommentDetail(noIdPropPayload)).toThrowError("COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY");
    expect(() => new CommentDetail(noUsernamePropPayload)).toThrowError("COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY");
    expect(() => new CommentDetail(noDatePropPayload)).toThrowError("COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY");
    expect(() => new CommentDetail(noContentPropPayload)).toThrowError("COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY");
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      id: 123,
      username: ["johndoe"],
      date: 2022,
      content: 123,
      replies: "ini reply",
      likeCount: 2,
    };

    expect(() => new CommentDetail(payload)).toThrowError("COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("should return comment detail object correctly", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      username: "johndoe",
      date: "2021-08-08T07:22:33.555Z",
      content: "sebuah comment",
      likeCount: 2,
    };

    // Action
    const commentDetail = new CommentDetail(payload);

    // Assert
    expect(commentDetail.id).toEqual("comment-123");
    expect(commentDetail.username).toEqual("johndoe");
    expect(commentDetail.date).toEqual("2021-08-08T07:22:33.555Z");
    expect(commentDetail.content).toEqual("sebuah comment");
    expect(commentDetail.likeCount).toEqual(2);
  });

  it("should return thread comment object correctly without replies", () => {
    const payloadWithoutReplies = {
      id: "comment-123",
      username: "johndoe",
      date: "2021-08-08T07:22:33.555Z",
      content: "sebuah comment",
      // replies is intentionally omitted
      likeCount: 2,
    };

    const payloadWithNullReplies = {
      id: "comment-123",
      username: "johndoe",
      date: "2021-08-08T07:22:33.555Z",
      content: "sebuah comment",
      replies: null,
      likeCount: 2,
    };

    const payloadWithEmptyReplies = {
      id: "comment-123",
      username: "johndoe",
      date: "2021-08-08T07:22:33.555Z",
      content: "sebuah comment",
      replies: [],
      likeCount: 2,
    };

    const commentWithoutReplies = new CommentDetail(payloadWithEmptyReplies);
    const commentWithNullReplies = new CommentDetail(payloadWithNullReplies);
    const commentWithEmptyReplies = new CommentDetail(payloadWithoutReplies);

    expect(commentWithoutReplies.replies).toBeUndefined;
    expect(commentWithEmptyReplies.replies).toBeUndefined;
    expect(commentWithNullReplies.replies).toBeUndefined;
  });

  it("should return thread comment object correctly with replies", () => {
    const payloadWithReplies = {
      id: "comment-123",
      username: "johndoe",
      date: "2021-08-08T07:22:33.555Z",
      content: "sebuah comment",
      likeCount: 2,
      replies: [
        {
          id: "reply-xNBtm9HPR-492AeiimpfN",
          content: "sebuah balasan",
          date: "2021-08-08T08:07:01.522Z",
          username: "dicoding",
        },
      ],
    };

    const commentDetail = new CommentDetail(payloadWithReplies);

    // Assert
    expect(commentDetail.id).toEqual("comment-123");
    expect(commentDetail.username).toEqual("johndoe");
    expect(commentDetail.date).toEqual("2021-08-08T07:22:33.555Z");
    expect(commentDetail.content).toEqual("sebuah comment");
    expect(commentDetail.replies).toEqual([
      {
        id: "reply-xNBtm9HPR-492AeiimpfN",
        content: "sebuah balasan",
        date: "2021-08-08T08:07:01.522Z",
        username: "dicoding",
      },
    ]);
  });
});
