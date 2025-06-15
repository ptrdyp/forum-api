class CommentDetail {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, username, date, content, replies, likeCount } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = content;
    this.likeCount = likeCount;

    if (replies && Array.isArray(replies) && replies.length > 0) {
      this.replies = replies;
    }
  }

  _verifyPayload({ id, username, date, content, likeCount }) {
    if (!id || !username || !date || !content) {
      throw new Error("COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY");
    }
    if (typeof id !== "string" || typeof username !== "string" || typeof date !== "string" || typeof content !== "string" || typeof likeCount !== 'number') {
      throw new Error("COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = CommentDetail;
