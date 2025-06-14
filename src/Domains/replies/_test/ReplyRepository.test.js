const ReplyRepository = require("../ReplyRepository");

describe("ReplyRepository", () => {
  it("should throw error when invoke abstract behavior", async () => {
    const replyRepository = new ReplyRepository();

    await expect(replyRepository.addReply({})).rejects.toThrowError("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(replyRepository.verifyAvailableReply({})).rejects.toThrowError("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(replyRepository.getReplyByCommentId({})).rejects.toThrowError("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(replyRepository.verifyOwner({})).rejects.toThrowError("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(replyRepository.deleteReply({})).rejects.toThrowError("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  });
});
