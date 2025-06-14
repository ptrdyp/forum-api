const AddReply = require("../../Domains/replies/entities/AddReply");

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, useCaseAuth, commentId, threadId) {
    const userId = useCaseAuth.id;

    await this._commentRepository.verifyAvailableComment(commentId);
    await this._commentRepository.verifyCommentBelongsToThread(commentId, threadId);

    const addReply = new AddReply({
      content: useCasePayload.content,
      owner: userId,
      comment: commentId,
    });

    return this._replyRepository.addReply(addReply);
  }
}

module.exports = AddReplyUseCase;
