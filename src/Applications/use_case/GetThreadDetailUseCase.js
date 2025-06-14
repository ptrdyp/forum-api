const ThreadDetail = require("../../Domains/threads/entities/ThreadDetail");

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCaseParam) {
    const { threadId } = useCaseParam;

    const threadDetail = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentByThreadId(threadId);

    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await this._replyRepository.getReplyByCommentId(comment.id);

        const mappedReplies = replies.map((reply) => ({
          id: reply.id,
          content: reply.is_delete ? "**balasan telah dihapus**" : reply.content,
          date: reply.date instanceof Date ? reply.date.toISOString() : reply.date,
          username: reply.username,
        }));

        const commentDetail = {
          id: comment.id,
          username: comment.username,
          date: comment.date instanceof Date ? comment.date.toISOString() : comment.date,
          content: comment.is_delete ? "**komentar telah dihapus**" : comment.content,
        };

        if (mappedReplies.length > 0) {
          commentDetail.replies = mappedReplies;
        } else {
          commentDetail.replies = []; 
        }

        return commentDetail;
      })
    );

    return new ThreadDetail({
      id: threadDetail.id,
      title: threadDetail.title,
      body: threadDetail.body,
      date: threadDetail.date instanceof Date ? threadDetail.date.toISOString() : threadDetail.date,
      username: threadDetail.username,
      comments: commentsWithReplies,
    });
  }
}

module.exports = GetThreadDetailUseCase;
