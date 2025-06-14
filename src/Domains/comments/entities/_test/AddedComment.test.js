const AddedComment = require("../AddedComment");

describe("a AddedComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      // not contain content
      owner: "user-123",
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError("ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: [1],
      content: 123,
      owner: 123,
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError("ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("should create addedComment object correctly", () => {
    const payload = {
      id: "comment-123",
      content: "sebuah comment",
      owner: "user-123",
    };

    const addedComment = new AddedComment(payload);

    expect(addedComment.id).toEqual("comment-123");
    expect(addedComment.content).toEqual("sebuah comment");
    expect(addedComment.owner).toEqual("user-123");
  });
});
