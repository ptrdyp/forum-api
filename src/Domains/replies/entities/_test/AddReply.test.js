const AddReply = require("../AddReply");

describe("AddReply entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    const payload = {
      // not contain content
      owner: "user-123",
      comment: "comment-123",
    };

    expect(() => new AddReply(payload)).toThrowError("ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY");
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      content: 123,
      owner: 123,
      comment: [1],
    };

    expect(() => new AddReply(payload)).toThrowError("ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("should throw error when content contains more than 255 character", () => {
    const payload = {
      content: "a".repeat(256),
      owner: "user-123",
      comment: "comment-123",
    };

    // Action and Assert
    expect(() => new AddReply(payload)).toThrowError("ADD_REPLY.CONTENT_LIMIT_CHAR");
  });

  it("should create addReply object correctly", () => {
    const payload = {
      content: "sebuah balasan",
      owner: "user-123",
      comment: "comment-123",
    };

    const addReply = new AddReply(payload);

    expect(addReply.content).toEqual("sebuah balasan");
    expect(addReply.owner).toEqual("user-123");
    expect(addReply.comment).toEqual("comment-123");
  });
});
