const CommentRepository = require("../CommentRepository");

describe("CommentRepository interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const commentRepository = new CommentRepository();

    // Action and assert
    await expect(commentRepository.addComment({})).rejects.toThrowError("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(commentRepository.verifyAvailableComment({})).rejects.toThrowError("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(commentRepository.getCommentByThreadId({})).rejects.toThrowError("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(commentRepository.verifyOwner({})).rejects.toThrowError("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(commentRepository.verifyCommentBelongsToThread({})).rejects.toThrowError("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(commentRepository.deleteComment({})).rejects.toThrowError("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  });
});
