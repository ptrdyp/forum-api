const AddComment = require("../AddComment");

describe("a comment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      // not contain content
      owner: "user-123",
      thread: "thread-123",
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError("ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      content: 123,
      owner: 123,
      thread: [1],
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError("ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("should throw error when content contains more than 255 character", () => {
    const payload = {
      content: "a".repeat(256),
      owner: "user-123",
      thread: "thread-123",
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError("ADD_COMMENT.CONTENT_LIMIT_CHAR");
  });

  it("should create addComment object correctly", () => {
    const payload = {
      content: "sebuah comment",
      owner: "user-123",
      thread: "thread-123",
    };

    const addComment = new AddComment(payload)

    expect(addComment.content).toEqual(payload.content)
    expect(addComment.owner).toEqual(payload.owner)
    expect(addComment.thread).toEqual(payload.thread)
  });
});
