const Route = require('express').Router();
const bookController = require('../Controller/booksController');
const checkRole = require('../middleware/checkRoleMiddleware');

Route.get('/:page', bookController.getBooks);
Route.post('/search/:page', bookController.getBookSearch);
Route.get('/id/:id', bookController.getBookById);
Route.get('/raiting/:id', bookController.getBookAvarageRaiting);
// Route.get('/name/:name', bookController.getBooksByName);
// Route.get('/series/:series/:page', bookController.getBooksBySeries);
// Route.get('/author/:author/:page', bookController.getBooksByAuthor);
// Route.get('/genre/:genre/:page', bookController.getBooksByGenre);
// Route.get('/status/:status/:page', bookController.getBooksByStatus);

//Удаление, добавление, изменение данных
Route.post('/', checkRole('ADMIN'), bookController.create);
Route.put('/:id', checkRole('ADMIN'), bookController.update);
Route.delete('/:id', checkRole('ADMIN'), bookController.delete);
//Ganre
//Tags

module.exports = Route;
