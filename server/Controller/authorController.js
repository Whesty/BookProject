const ApiError = require('../error/ApiError');
const Author = require('../Model/author');

const AuthorController = {
    addAuthor: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const author = req.body;
            console.log(author);
            const result = await Author.addAuthorforBook(id, author);
            res.json(result);
        } catch (error) {
            next(ApiError.internal('Ошибка при добавлении автора для книги'));
        }
    },

    deleteAuthor: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const author = parseInt(req.params.author);
            const result = await Author.deleteAuthorforBook(id, author);
            if (result) {
                res.json(result);
            } else {
                next(ApiError.badRequest('Автор не найден'));
            }
        } catch (error) {
            next(ApiError.internal('Ошибка при удалении автора для книги'));
        }
    },

    createAuthor: async (req, res, next) => {
        try {
            const author = req.body;
            const result = await Author.addAuthor(author);
            res.json(result);
        } catch (error) {
            next(ApiError.internal('Ошибка при создании автора'));
        }
    },

    getAuthors: async (req, res, next) => {
        try {
            const page = parseInt(req.params.page);
            const authors = await Author.getAuthors(page);
            res.json(authors);
        } catch (error) {
            next(ApiError.internal('Ошибка при получении авторов'));
        }
    },

    getBookAuthors: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const authors = await Author.getBookAuthors(id);
            res.json(authors);
        } catch (error) {
            next(ApiError.internal('Ошибка при получении авторов книги'));
        }
    },
    updateAuthor: async (req, res, next) => {
        try {
            const author = req.body;
            const id = parseInt(req.params.id);
            const result = await Author.updateAuthor(id, author);
            res.json(result);
        } catch (error) {
            next(ApiError.internal('Ошибка при обновлении автора'));
        }
    },
    delete: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const result = await Author.deleteA(id);
            res.json(result);
        } catch (error) {
            next(ApiError.internal('Ошибка при удалении автора'));
        }
    }

};

module.exports = AuthorController;
