const InvariantError = require("./InvariantError");

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  "REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError("tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada"),
  "REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError("tidak dapat membuat user baru karena tipe data tidak sesuai"),
  "REGISTER_USER.USERNAME_LIMIT_CHAR": new InvariantError("tidak dapat membuat user baru karena karakter username melebihi batas limit"),
  "REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER": new InvariantError("tidak dapat membuat user baru karena username mengandung karakter terlarang"),
  "USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError("harus mengirimkan username dan password"),
  "USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError("username dan password harus string"),
  "REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN": new InvariantError("harus mengirimkan token refresh"),
  "REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError("refresh token harus string"),
  "DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN": new InvariantError("harus mengirimkan token refresh"),
  "DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError("refresh token harus string"),

  "ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError("tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada"),
  "ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError("tidak dapat membuat thread baru karena tipe data tidak sesuai"),
  "ADD_THREAD.TITLE_LIMIT_CHAR": new InvariantError("tidak dapat membuat thread baru karena karakter title melebihi batas limit"),
  "ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError("harus mengirimkan id, owner, dan title"),
  "ADDED_THREAD.TITLE_LIMIT_CHAR": new InvariantError("tidak dapat menghasilkan thread baru karena karakter title melebihi batas limit"),
  "ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError("id, owner, dan title harus string"),

  "ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError("tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada"),
  "ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError("tidak dapat membuat comment baru karena tipe data tidak sesuai"),
  "ADD_COMMENT.CONTENT_LIMIT_CHAR": new InvariantError("tidak dapat membuat comment baru karena karakter content melebihi batas limit"),
  "ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError("tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada"),
  "ADDED_COMMENT.CONTENT_LIMIT_CHAR": new InvariantError("tidak dapat menghasilkan comment baru karena karakter content melebihi batas limit"),
  "ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError("tidak dapat membuat comment baru karena tipe data tidak sesuai"),

  "THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError("tidak dapat menampilkan detail thread, properti yang dibutuhkan tidak ada"),
  "THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError("tidak dapat menampilkan detail thread, tipe data tidak sesuai"),

  "COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError("tidak dapat menampilkan detail comment, properti yang dibutuhkan tidak ada"),
  "COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError("tidak dapat menampilkan detail comment, tipe data tidak sesuai"),

  "REPLY_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError("tidak dapat menampilkan detail reply, properti yang dibutuhkan tidak ada"),
  "REPLY_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError("tidak dapat menampilkan detail reply, tipe data tidak sesuai"),

  "GET_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError("tidak dapat menampilkan data, properti yang dibutuhkan tidak ada"),
  "GET_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError("tidak dapat menampilkan data, tipe data tidak sesuai"),

  "ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError("tidak dapat membuat reply baru karena properti yang dibutuhkan tidak ada"),
  "ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError("tidak dapat membuat reply baru karena tipe data tidak sesuai"),
  "ADD_REPLY.CONTENT_LIMIT_CHAR": new InvariantError("tidak dapat membuat reply baru karena karakter content melebihi batas limit"),
  "ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError("tidak dapat membuat reply baru karena properti yang dibutuhkan tidak ada"),
  "ADDED_REPLY.CONTENT_LIMIT_CHAR": new InvariantError("tidak dapat menghasilkan reply baru karena karakter content melebihi batas limit"),
  "ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError("tidak dapat membuat reply baru karena tipe data tidak sesuai"),
};

module.exports = DomainErrorTranslator;
