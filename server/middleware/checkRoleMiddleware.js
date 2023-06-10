const jwt = require('jsonwebtoken');
const ApiError = require('../error/ApiError');
module.exports = function (role){
    return function (req, res, next) {
    if (req.method === 'OPTIONS'){
        console.log("OPTIONS");
        next();
    }
    try{
        const token = req.headers.authorization.split(' ')[1];
        console.log("token: ", token);
        if (!token){
            return next(ApiError.unauthorized('Нe авторизован(Не передан токен)'));
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log("decoded: ", decoded.role);
        if (decoded.role !== role){
            console.log("decoded.role !== role");
            return next(ApiError.unauthorized('У вас нет прав'));
        }
        req.user = decoded;
        next();
    }
    catch(e){
        return next(ApiError.unauthorized('Не авторизован(Непредвиденная ошибка)'+e.message));
    }
}
}