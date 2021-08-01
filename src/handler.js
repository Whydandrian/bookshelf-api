const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const { name, year, author, summary,
    publisher, pageCount, readPage, reading } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage ? true : false;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (!name || name === undefined) {
    const response = h.response({
      "status": "fail",
      "message": "Gagal menambahkan buku. Mohon isi nama buku"
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      "status": "fail",
      "message": "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
    });
    response.code(400);
    return response;
  }

  const newBook = {
    id, name, year, author, summary,
    publisher, pageCount, readPage, finished, reading,
    insertedAt, updatedAt
  };

  books.push(newBook);

  const isSuccess = books.filter((books) => books.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;

  };

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;


};

const getAllBooksHandler = (request, h) => {

  if (books.length > 0) {
    const response = h.response({
      status: 'success',
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      },
    });
    response.code(200);
    return response;

  }
  
  const response = h.response({
    status: 'success',
    data: {
      books: [],
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((b) => b.id === bookId)[0]

  if (typeof (book) !== 'undefined') {
    const response = h.response({
      status: 'ok',
      data: {
        book
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    "status": "fail",
    "message": "Buku tidak ditemukan"
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const { name, year, author, summary,
    publisher, pageCount, readPage,
    reading } = request.payload;

  if (!name || name === undefined) {
    const response = h.response({
      "status": "fail",
      "message": "Gagal memperbarui buku. Mohon isi nama buku"
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      "status": "fail",
      "message": "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
    });
    response.code(400);
    return response;
  }

  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name, year, author,
      summary, publisher,
      pageCount, readPage,
      reading
    };

    const response = h.response({
      "status": "success",
      "message": "Buku berhasil diperbarui"
    });
    response.code(200);
    return response;
  }

  const response = h.request({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBooksByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== 1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  } else {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    });
    response.code(404);
    return response;
  }

};


module.exports = {
  addBookHandler, getAllBooksHandler, getBookByIdHandler,
  editBookByIdHandler
};
