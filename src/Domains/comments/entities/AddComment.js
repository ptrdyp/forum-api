class AddComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content, owner, thread } = payload;

    this.content = content;
    this.owner = owner;
    this.thread = thread;
  }

  _verifyPayload({ content, owner, thread }) {
    if (!content || !owner || !thread) {
      throw new Error("ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (typeof content !== "string" || typeof owner !== "string" || typeof thread !== "string") {
      throw new Error("ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }

    if (content.length > 255) {
      throw new Error("ADD_COMMENT.CONTENT_LIMIT_CHAR");
    }
  }
}

module.exports = AddComment;
