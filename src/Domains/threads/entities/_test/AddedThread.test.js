const AddedThread = require("../AddedThread");

describe("a AddedThread entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      title: "sebuah thread",
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError("ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: 123,
      title: 123,
      owner: 123,
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError("ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("should create addedThread object correctly", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "sebuah thread",
      owner: "user-123",
    };

    // Action
    const { id, title, owner } = new AddedThread(payload);

    // Assert
    expect(id).toEqual("thread-123");
    expect(title).toEqual("sebuah thread");
    expect(owner).toEqual("user-123");
  });
});
