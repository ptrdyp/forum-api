class SetCommentLikesUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCaseAuth, useCaseParam) {
    const { id } = useCaseAuth;

    await this._threadRepository.verifyAvailableThread(useCaseParam.threadId);
    await this._commentRepository.verifyAvailableComment(useCaseParam.commentId);
    await this._commentRepository.verifyCommentBelongsToThread(useCaseParam.commentId, useCaseParam.threadId);
    await this._likeRepository.setCommentLikes(id, useCaseParam.commentId);
  }
}

module.exports = SetCommentLikesUseCase;
