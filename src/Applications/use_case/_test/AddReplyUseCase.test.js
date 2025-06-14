const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AddReply = require("../../../Domains/replies/entities/AddReply");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const AddReplyUseCase = require("../AddReplyUseCase");

describe("AddReplyUseCase", () => {
  it("should orchestrating the add reply action correctly", async () => {
    const useCasePayload = {
      content: "sebuah balasan",
    };
    const useCaseAuth = {
      id: "user-123",
    };
    const threadId = "thread-123";
    const commentId = "comment-123";

    const expectedAddedReply = {
      id: "reply-123",
      content: "sebuah balasan",
      owner: "user-123",
      comment: "comment-123",
    };

    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockCommentRepository.verifyAvailableComment = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentBelongsToThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn().mockImplementation(() => Promise.resolve(expectedAddedReply));

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
    });

    const addedReply = await addReplyUseCase.execute(useCasePayload, useCaseAuth, commentId, threadId);

    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(commentId);
    expect(mockCommentRepository.verifyCommentBelongsToThread).toBeCalledWith(commentId, threadId);
    expect(mockReplyRepository.addReply).toBeCalledWith(
      new AddReply({
        content: useCasePayload.content,
        owner: useCaseAuth.id,
        comment: commentId,
      })
    );
    expect(addedReply.id).toStrictEqual("reply-123");
    expect(addedReply.content).toStrictEqual("sebuah balasan");
    expect(addedReply.owner).toStrictEqual("user-123");
    expect(addedReply.comment).toStrictEqual("comment-123");
  });
});
