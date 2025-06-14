const ReplyDetail = require("../ReplyDetail");

describe("a reply detail entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    const emptyPayload = {};
    const noIdPropPayload = {
      //   id: "reply-123",
      content: "**balasan telah dihapus**",
      date: "2021-08-08T07:59:48.766Z",
      username: "johndoe",
    };
    const noUsernamePropPayload = {
      id: "reply-123",
      content: "**balasan telah dihapus**",
      date: "2021-08-08T07:59:48.766Z",
      //   username: "johndoe",
    };
    const noDatePropPayload = {
      id: "reply-123",
      content: "**balasan telah dihapus**",
      //   date: "2021-08-08T07:59:48.766Z",
      username: "johndoe",
    };
    const noContentPropPayload = {
      id: "reply-123",
      //   content: "**balasan telah dihapus**",
      date: "2021-08-08T07:59:48.766Z",
      username: "johndoe",
    };

    expect(() => new ReplyDetail(emptyPayload)).toThrowError("REPLY_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY");
    expect(() => new ReplyDetail(noIdPropPayload)).toThrowError("REPLY_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY");
    expect(() => new ReplyDetail(noUsernamePropPayload)).toThrowError("REPLY_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY");
    expect(() => new ReplyDetail(noDatePropPayload)).toThrowError("REPLY_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY");
    expect(() => new ReplyDetail(noContentPropPayload)).toThrowError("REPLY_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY");
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      id: ["reply-123"],
      content: 123,
      date: 123,
      username: 123,
    };

    expect(() => new ReplyDetail(payload)).toThrowError("REPLY_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("should return reply detail object correctly", () => {
    // Arrange
    const payload = {
      id: "reply-123",
      content: "sebuah balasan",
      date: "2021-08-08T07:59:48.766Z",
      username: "johndoe",
    };

    // Action
    const replyDetail = new ReplyDetail(payload);

    // Assert
    expect(replyDetail.id).toEqual("reply-123");
    expect(replyDetail.username).toEqual("johndoe");
    expect(replyDetail.date).toEqual("2021-08-08T07:59:48.766Z");
    expect(replyDetail.content).toEqual("sebuah balasan");
  });
});
