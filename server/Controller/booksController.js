const Book = require('../Model/books');
const ApiError = require('../error/ApiError');

const BookController = {
    getBooks: async (req, res, next) => {
        try {
            const page = parseInt(req.params.page);
            const books = await Book.getBooks(page, "", {});
            res.json(books);
        } catch (error) {
            next(ApiError.internal('Ошибка при получении списка книг'));
        }
    },

    getBookSearch: async (req, res, next) => {
        try {
            const page = parseInt(req.params.page);
            const search = req.body.searchTerm;
            const filtr = req.body.filterParams;
            const books = await Book.getBooks(page, search, filtr);
            res.json(books);
        } catch (error) {
            next(ApiError.internal('Ошибка при поиске книги'));
        }
    },

    getBookById: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const book = await Book.getBooksById(id);
            if (book) {
                res.json(book);
            } else {
                next(ApiError.badRequest('Книга не найдена'));
            }
        } catch (error) {
            next(ApiError.internal('Ошибка при получении информации о книге'));
        }
    },

    getBookFeedbackCount: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const count = await Book.getBookFeedbackCount(id);
            if (count) {
                res.json(count);
            } else {
                next(ApiError.badRequest('Книга не найдена'));
            }
        } catch (error) {
            next(ApiError.internal('Ошибка при получении количества отзывов о книге'));
        }
    },

    getBookReadCount: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const count = await Book.getBookReadCount(id);
            if (count) {
                res.json(count);
            } else {
                next(ApiError.badRequest('Книга не найдена'));
            }
        } catch (error) {
            next(ApiError.internal('Ошибка при получении количества прочтений книги'));
        }
    },

    getBookAvarageRaiting: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const count = await Book.getBookAverageRating(id);
            if (count) {
                res.json(count);
            } else {
                next(ApiError.badRequest('Книга не найдена'));
            }
        } catch (error) {
            next(ApiError.internal('Ошибка при получении среднего рейтинга книги'));
        }
    },

    create: async (req, res, next) => {
        try {
            const book = req.body;
            const result = await Book.createBook(book);
            res.json(result);
        } catch (error) {
            next(ApiError.internal('Ошибка при создании книги'));
        }
    },

    update: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const book = req.body;
            const result = await Book.updateBook(id, book);
            res.json(result);
        } catch (error) {
            next(ApiError.internal('Ошибка при обновлении книги', error.message));
        }
    },

    delete: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const result = await Book.deleteBook(id);
            res.json(result);
        } catch (error) {
            next(ApiError.internal('Ошибка при удалении книги'));
        }
    },
};

module.exports = BookController;