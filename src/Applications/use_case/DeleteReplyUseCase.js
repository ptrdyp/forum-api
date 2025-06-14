class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCaseAuth, useCaseParam) {
    const { id } = useCaseAuth;

    await this._replyRepository.verifyOwner({
      replyId: useCaseParam.replyId,
      owner: id,
    });

    await this._replyRepository.deleteReply({
      replyId: useCaseParam.replyId,
      commentId: useCaseParam.commentId,
    });
  }
}

module.exports = DeleteReplyUseCase;
