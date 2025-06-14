const AddThread = require("../../Domains/threads/entities/AddThread");

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, useCaseAuth) {
    const { id } = useCaseAuth;

    const addThread = new AddThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: id,
    });
    return this._threadRepository.addThread(addThread);
  }
}

module.exports = AddThreadUseCase;
