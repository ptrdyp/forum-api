const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const DeleteReplyUseCase = require("../DeleteReplyUseCase");

describe("DeleteReplyUseCase", () => {
  it("should orchestrating the delete comment action correctly", async () => {
    const useCaseAuth = {
      id: "user-123",
    };
    const useCaseParam = {
      threadId: "thread-123",
      commentId: "comment-123",
      replyId: "reply-123",
    };

    const mockReplyRepository = new ReplyRepository();

    mockReplyRepository.verifyOwner = jest.fn().mockImplementation(() => Promise.resolve());

    mockReplyRepository.deleteReply = jest.fn().mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    await deleteReplyUseCase.execute(useCaseAuth, useCaseParam);

    expect(mockReplyRepository.verifyOwner).toBeCalledWith({
      replyId: useCaseParam.replyId,
      owner: useCaseAuth.id,
    });

    expect(mockReplyRepository.deleteReply).toHaveBeenCalledWith({
      replyId: useCaseParam.replyId,
      commentId: useCaseParam.commentId,
    });
  });
});
