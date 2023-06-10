const { json } = require('express');
const User = require('../Model/users');
const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');


const generateJwt = (id, email, role) => {
    return jwt.sign({ id, email, role }, process.env.SECRET_KEY, { expiresIn: '24h' });
};

const UsersController = {
    registration: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            role = 'USER';
            if (!email || !password) {
                return next(ApiError.badRequest('Некорректный email или пароль'));
            }
            const candidate = await User.getUsersByEmail(email);
            if (candidate) {
                return next(ApiError.badRequest('Пользователь с таким email уже существует'));
            }
            const hashPassword = await bcrypt.hash(password, 5);
            const user = await User.create(email, hashPassword, role);
            const token = generateJwt(user.ID, user.EMAIL, user.ACCESS_LEVEL);
            //Загрузить avatar из статика как User[id]
            const avatarPath = path.join(`${__dirname}/../public/static/User${user.ID}.jpg`);
            const defaultAvatarPath = path.join(__dirname, '../public/static/avatar.jpg');
            fs.copyFileSync(defaultAvatarPath, avatarPath);
            return res.json({ token, user });
        } catch (error) {
            console.log(error);
            next(ApiError.badRequest('Ошибка при регистрации'));
        }
    },

    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const user = await User.getUsersByEmail(email);
            if (!user) {
                return next(ApiError.internal('Пользователь не найден'));
            }
            const comparePassword = bcrypt.compareSync(password, user.pass);
            if (!comparePassword) {
                return next(ApiError.internal('Указан неверный пароль'));
            }
            const token = generateJwt(user.ID, user.EMAIL, user.ACCESS_LEVEL);
            return res.json({ token, user });
        } catch (error) {
            next(ApiError.badRequest('Ошибка при авторизации'));
        }
    },

    check: async (req, res, next) => {
        try {
            if (!req.user) {
                return next(ApiError.unauthorized('Пользователь не авторизован, не передан user'));
            }
            const token = generateJwt(req.user.id, req.user.email, req.user.role);
            user = await User.getUsersById(req.user.id);
            return res.json({ token, user });
        } catch (error) {
            next(ApiError.badRequest('Ошибка при проверке авторизации'));
        }
    },

    getUsers: async (req, res) => {
        try {
            const page = parseInt(req.params.page);
            const users = await User.getUsers(page);
            res.json(users);
        } catch (error) {
            next(ApiError.internal('Ошибка при получении пользователей'));
        }
    },

    getUsersById: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const user = await User.getUsersById(id);
            if (user) {
                res.json(user);
            } else {
                next(ApiError.badRequest('Пользователь не найден'));
            }
        } catch (error) {
            next(ApiError.internal('Ошибка при получении пользователя'));
        }
    },

    getUserAuthorized: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const user = await User.getUserAuthorized(id);
            if (user) {
                res.json(user);
            } else {
                next(ApiError.badRequest('Пользователь не найден'));
            }
        } catch (error) {
            next(ApiError.internal('Ошибка при получении пользователя'));
        }
    },

    getUsersByEmail: async (req, res, next) => {
        try {
            const email = req.params.email;
            const user = await User.getUsersByEmail(email);
            if (user) {
                res.json(user);
            } else {
                next(ApiError.badRequest('Пользователь не найден'));
            }
        } catch (error) {
            next(ApiError.internal('Ошибка при получении пользователя'));
        }
    },

    create: async (req, res, next) => {
        try {
            const { name, info, avatar, idAuthorized } = req.body;
            const user = await User.create(name, info, avatar, idAuthorized);
            res.json(user);
        } catch (error) {
            next(ApiError.internal('Ошибка при создании пользователя'));
        }
    },

    update: async (req, res, next) => {
        try {
            const { USER_NAME, USER_INFO } = req.body;
            const id = parseInt(req.params.id);
            const user = await User.updateUsers(id, USER_NAME, USER_INFO);
            res.json(user);
        } catch (error) {
            next(ApiError.internal('Ошибка при обновлении пользователя'));
        }
    },

    delete: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            //Удалить все значения из связанных таблиц
            //Комментарии   
            console.log(id);
            const comments = await User.deleteComments(id);
            //Закладки
            console.log('delcom');
            const bookmarks = await User.deleteBookmarks(id);
            console.log('delbook');
            const user = await User.deleteUsers(id);
            res.json(user);
        } catch (error) {
            next(ApiError.internal('Ошибка при удалении пользователя'));
        }
    },
};

module.exports = UsersController;
