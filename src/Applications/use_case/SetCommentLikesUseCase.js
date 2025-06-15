class SetCommentLikesUseCase {
  constructor({ commentRepository, likeRepository }) {
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCaseAuth, useCaseParam) {
    const { id } = useCaseAuth;
    const { threadId, commentId } = useCaseParam;

    await this._commentRepository.verifyAvailableComment(threadId, commentId);
    await this._likeRepository.setCommentLikes(id, commentId);
  }
}

module.exports = SetCommentLikesUseCase;
