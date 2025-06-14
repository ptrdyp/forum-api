class ThreadDetail {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, title, body, date, username, comments } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;

    if (comments && Array.isArray(comments) && comments.length > 0) {
      this.comments = comments;
    }
  }

  _verifyPayload({ id, title, body, date, username }) {
    if (!id || !title || !body || !date || !username) {
      throw new Error("THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY");
    }
    if (typeof id !== "string" || typeof title !== "string" || typeof body !== "string" || typeof date !== "string" || typeof username !== "string") {
      throw new Error("THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = ThreadDetail;
