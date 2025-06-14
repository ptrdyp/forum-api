const CommentRepository = require("../../../Domains/comments/CommentRepository");
const DeleteCommentUseCase = require("../DeleteCommentUseCase");

describe("DeleteCommentUseCase", () => {
  it("should orchestrating the delete comment action correctly", async () => {
    const useCaseAuth = {
      id: "user-123",
    };
    const useCaseParam = {
      threadId: "thread-123",
      commentId: "comment-123",
    };

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.verifyOwner = jest.fn().mockImplementation(() => Promise.resolve());

    mockCommentRepository.deleteComment = jest.fn().mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    await deleteCommentUseCase.execute(useCaseAuth, useCaseParam);

    expect(mockCommentRepository.verifyOwner).toBeCalledWith({
      commentId: useCaseParam.commentId,
      owner: useCaseAuth.id,
    });

    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith({
      commentId: useCaseParam.commentId,
      threadId: useCaseParam.threadId,
    });
  });
});
