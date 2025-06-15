const SetCommentLikesUseCase = require("../../../../Applications/use_case/SetCommentLikesUseCase");

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(request, h) {
    const owner = request.auth.credentials;
    const setCommentLikesUseCase = this._container.getInstance(SetCommentLikesUseCase.name);
    await setCommentLikesUseCase.execute(owner, request.params);

    const response = h.response({
      status: "success",
    });

    response.code(200);
    return response;
  }
}

module.exports = LikesHandler;
