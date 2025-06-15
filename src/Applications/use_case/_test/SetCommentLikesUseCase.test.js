const CommentRepository = require("../../../Domains/comments/CommentRepository");
const LikeRepository = require("../../../Domains/likes/LikeRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const SetCommentLikesUseCase = require("../SetCommentLikesUseCase");

describe("set comments likes use case", () => {
  it("should orchestrating the set comments like action correctly", async () => {
    const useCaseAuth = {
      id: "user-123",
    };
    const useCaseParam = {
      threadId: "thread-123",
      commentId: "comment-123",
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentBelongsToThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockLikeRepository.setCommentLikes = jest.fn().mockImplementation(() => Promise.resolve());

    const setCommentLikesUseCase = new SetCommentLikesUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        likeRepository: mockLikeRepository
    })

    await setCommentLikesUseCase.execute(useCaseAuth, useCaseParam)

    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCaseParam.threadId)
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(useCaseParam.commentId)
    expect(mockCommentRepository.verifyCommentBelongsToThread).toBeCalledWith(useCaseParam.commentId, useCaseParam.threadId)
    expect(mockLikeRepository.setCommentLikes).toBeCalledWith(useCaseAuth.id, useCaseParam.commentId)
  });
});
