const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const GetThreadDetailUseCase = require("../GetThreadDetailUseCase");

describe("GetThreadDetailUseCase", () => {
  it("should orchestrating the get thread detail action correctly for multiple threads", async () => {
    const useCaseParam = {
      threadId: "thread-123",
    };
    const useCaseParam2 = {
      threadId: "thread-567",
    };

    const mockThreadData = {
      "thread-123": {
        id: "thread-123",
        title: "sebuah thread",
        body: "sebuah body thread",
        date: new Date("2021-08-08T07:19:09.775Z"),
        username: "dicoding",
      },
      "thread-567": {
        id: "thread-567",
        title: "sebuah thread",
        body: "sebuah body thread",
        date: "2021-08-08T07:19:09.775Z",
        username: "dicoding",
      },
    };

    const mockCommentsData = {
      "thread-123": [
        {
          id: "comment-123",
          username: "johndoe",
          date: new Date("2021-08-08T07:22:33.555Z"),
          content: "sebuah comment",
          is_delete: false,
          likeCount: 2,
        },
        {
          id: "comment-345",
          username: "johndoe2",
          date: "2021-08-08T07:22:33.555Z",
          content: "komentar ini sudah dihapus harusnya",
          is_delete: true,
          likeCount: 0,
        },
      ],
      "thread-567": [
        {
          id: "comment-567",
          username: "johndoe",
          date: "2021-08-08T07:22:33.555Z",
          content: "sebuah comment",
          is_delete: false,
          likeCount: 5,
        },
      ],
    };

    const mockRepliesData = {
      "comment-123": [
        {
          id: "reply-555",
          content: "sebuah balasan",
          date: new Date("2021-08-08T08:07:01.522Z"),
          username: "dicoding",
          is_delete: false,
        },
        {
          id: "reply-123",
          content: "ini harusnya tidak muncul karena dihapus",
          date: "2021-08-08T08:07:01.522Z",
          username: "dicoding",
          is_delete: true,
        },
      ],
      "comment-345": [],
      "comment-567": [
        {
          id: "reply-666",
          content: "sebuah balasan",
          date: "2021-08-08T08:07:01.522Z",
          username: "dicoding",
          is_delete: false,
        },
      ],
    };

    const expectedThreadDetail = {
      id: "thread-123",
      title: "sebuah thread",
      body: "sebuah body thread",
      date: "2021-08-08T07:19:09.775Z",
      username: "dicoding",
      comments: [
        {
          id: "comment-123",
          username: "johndoe",
          date: "2021-08-08T07:22:33.555Z",
          content: "sebuah comment",
          likeCount: 2,
          replies: [
            {
              id: "reply-555",
              content: "sebuah balasan",
              date: "2021-08-08T08:07:01.522Z",
              username: "dicoding",
            },
            {
              id: "reply-123",
              content: "**balasan telah dihapus**",
              date: "2021-08-08T08:07:01.522Z",
              username: "dicoding",
            },
          ],
        },
        {
          id: "comment-345",
          username: "johndoe2",
          date: "2021-08-08T07:22:33.555Z",
          content: "**komentar telah dihapus**",
          likeCount: 0,
          replies: [],
        },
      ],
    };

    const expectedThreadDetail2 = {
      id: "thread-567",
      title: "sebuah thread",
      body: "sebuah body thread",
      date: "2021-08-08T07:19:09.775Z",
      username: "dicoding",
      comments: [
        {
          id: "comment-567",
          username: "johndoe",
          date: "2021-08-08T07:22:33.555Z",
          content: "sebuah comment",
          likeCount: 5,
          replies: [
            {
              id: "reply-666",
              content: "sebuah balasan",
              date: "2021-08-08T08:07:01.522Z",
              username: "dicoding",
            },
          ],
        },
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = jest.fn((id) => Promise.resolve(mockThreadData[id]));
    mockCommentRepository.getCommentByThreadId = jest.fn((threadId) => Promise.resolve(mockCommentsData[threadId]));
    mockReplyRepository.getReplyByCommentId = jest.fn((commentId) => Promise.resolve(mockRepliesData[commentId]));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const threadDetail = await getThreadDetailUseCase.execute(useCaseParam);
    const threadDetail2 = await getThreadDetailUseCase.execute(useCaseParam2);

    expect(threadDetail).toEqual(expectedThreadDetail);
    expect(threadDetail2).toEqual(expectedThreadDetail2);

    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith("thread-123");
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith("thread-567");

    expect(mockCommentRepository.getCommentByThreadId).toHaveBeenCalledWith("thread-123");
    expect(mockCommentRepository.getCommentByThreadId).toHaveBeenCalledWith("thread-567");

    expect(mockReplyRepository.getReplyByCommentId).toHaveBeenCalledWith("comment-123");
    expect(mockReplyRepository.getReplyByCommentId).toHaveBeenCalledWith("comment-345");
    expect(mockReplyRepository.getReplyByCommentId).toHaveBeenCalledWith("comment-567");
  });
});
