const client = require('@prisma/client');
const ApiError = require('../error/ApiError');
const skip = require('../static/Math').skip;
const take = parseInt(process.env.TAKE_ITEM);

const prisma = new client.PrismaClient();
//Получить данные 
// async function getBooks(page) {
//     return await prisma.books.findMany({
//         skip: skip(page),
//         take: take
//     });
// }
/*
// пример использования функции
const searchTerm = 'something';
const filterParams = { book_status: true };
const page = 2;
const pageSize = 10;
const result = await searchAndFilter(page, pageSize, searchTerm, filterParams);
console.log(result);
 */
    async function getBooks(page, searchTerm, filterParams) {
        let where = {};

        // Поиск по заданному поисковому термину
        if (searchTerm) {
            //Если тема поиска - является число то ищем по году
            let yaer = parseInt(searchTerm);
            if (!isNaN(yaer)) {
                where = {
                    OR: [
                        { DATA_RELEASE:  yaer },
                    ]
                }
                }
                else
            where = {
                OR: [
                    { BOOK_NAME: { contains: searchTerm } },
                    { BOOK_DESCRIPTION: { contains: searchTerm } },
                    { BOOK_SERIES: { contains: searchTerm } },
                ],
            };
        }
        console.log(where);
       let select = {};

        // Фильтрация по заданным параметрам фильтрации
        if (filterParams) {
            if (filterParams.tags && filterParams.tags.length) {
                where.book_tag = { 
                    some:{ TAGID:{  in: filterParams.tags.map((item) => (parseInt(item.ID) )),}}
                      };
            }
            if (filterParams.genres && filterParams.genres.length) {
                where.book_genre = { 
                some:{ GENREID:{  in: filterParams.genres.map((item) => (parseInt(item.ID) )),}}
                  };
            }
            if (filterParams.authors && filterParams.authors.length) {
                where.book_author = { 
                    some:{ AUTHORID:{  in: filterParams.authors.map((item) => (parseInt(item.ID) )),}}
                      };
            }
        }
        console.log(where);

        // Запрос на количество записей
        const count = await prisma.books.count({ where });

        // Запрос на страницу с данными
        const books = await prisma.books.findMany({
            where,
            skip: skip(page),
            take: take,
        });

        return {
            books: books,
            totalPages: Math.ceil(count / take),
            totalRecords: count,
        };
    }

async function getBooksById(id) {
    return await prisma.books.findUnique({
        where: {
            ID: id,
        },
    });
}

//Получить количество отзывов
async function getBookFeedbackCount(id) {
    return await prisma.feedback.count({
        where: {
            ID_BOOK: id,
        },
    });
}
//Получить количество прочтений
async function getBookReadCount(id) {
    return await prisma.user_bookmarks.count({
        where: {
            ID_BOOK: id,
        },
    });
}
//Получить средний рейтинг
async function getBookAverageRating(id) {
    return await prisma.feedback.aggregate({
        where: {
            ID_BOOK: id,
        },
        _avg: { RATING: true },
    });
}

//Создание, удаление, обновление
async function createBook(book) {
    chapters = parseInt(book.CHAPTERS);
    year = parseInt(book.BOOK_RELEASE);
    const newBook = await prisma.books.create({
        data: {
            BOOK_NAME: book.BOOK_NAME,
            BOOK_SERIES: book.BOOK_SERIES,
            DATA_RELEASE: year,
            BOOK_DESCRIPTION: book.BOOK_INFO,
            CHAPTERS: chapters,
        },
    });
    return newBook;
}

async function updateBook(id, book) {
    chapters = parseInt(book.CHAPTERS);
    year = parseInt(book.BOOK_RELEASE);
    return await prisma.books.update({
        where: {
            ID: id,
        },
        data: {
            BOOK_NAME: book.BOOK_NAME,
            BOOK_SERIES: book.BOOK_SERIES,
            DATA_RELEASE: year,
            BOOK_DESCRIPTION: book.BOOK_INFO,
            CHAPTERS: chapters,
        },
    });
}

async function deleteBook(id) {
    return await prisma.books.delete({
        where: {
            ID: id,
        },
    });

}

module.exports = { getBooks, getBooksById, createBook, updateBook, deleteBook, getBookFeedbackCount, getBookReadCount, getBookAverageRating };
