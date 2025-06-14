const AddedReply = require("../AddedReply");

describe("AddedReply entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    const payload = {
      // not contain content
      owner: "user-123",
    };

    expect(() => new AddedReply(payload)).toThrowError("ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY");
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      id: [1],
      content: 123,
      owner: 123,
    };

    expect(() => new AddedReply(payload)).toThrowError("ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("should create addedReply object correctly", () => {
    const payload = {
      id: "reply-123",
      content: "sebuah balasan",
      owner: "user-123",
    };

    const addedReply = new AddedReply(payload);

    expect(addedReply.id).toEqual("reply-123");
    expect(addedReply.content).toEqual("sebuah balasan");
    expect(addedReply.owner).toEqual("user-123");
  });
});
