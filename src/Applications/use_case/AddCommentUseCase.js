const AddComment = require("../../Domains/comments/entities/AddComment");

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, useCaseAuth, threadId) {
    const userId = useCaseAuth.id;

    await this._threadRepository.verifyAvailableThread(threadId);

    const addComment = new AddComment({
      content: useCasePayload.content,
      owner: userId,
      thread: threadId,
    });

    return this._commentRepository.addComment(addComment);
  }
}

module.exports = AddCommentUseCase;
