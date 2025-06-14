const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddCommentUseCase = require("../AddCommentUseCase");

describe("AddCommentUseCase", () => {
  it("should orchestrating the add comment action correctly", async () => {
    // Arrange
    const useCasePayload = {
      content: "sebuah comment",
    };
    const useCaseAuth = {
      id: "user-123",
    };
    const threadId = "thread-123";

    const expectedAddedComment = {
      id: "comment-123",
      content: "sebuah comment",
      owner: "user-123",
      thread: "thread-123",
    };

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve(expectedAddedComment));

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload, useCaseAuth, threadId);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new AddComment({
        content: useCasePayload.content,
        owner: useCaseAuth.id,
        thread: threadId,
      })
    );
    expect(addedComment.id).toStrictEqual("comment-123");
    expect(addedComment.content).toStrictEqual("sebuah comment");
    expect(addedComment.owner).toStrictEqual("user-123");
    expect(addedComment.thread).toStrictEqual("thread-123");
  });
});
