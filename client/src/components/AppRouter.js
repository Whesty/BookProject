import React, { useContext } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import { authRoutes, publicRoutes, adminRoutes } from "../Routes";
import { BOOKS_ROUTE } from "../utils/const";
import { Context } from "../index";

const AppRouter = () => {
    const {user} = useContext(Context);
    const isAdmin = user.checkAdmin();
    console.log(isAdmin);
    console.log(user);
    return (
        <Routes>
            {user.isAuth && authRoutes.map(({path, element}) =>
                <Route key={path} path={path} Component={element} exact />)}
            {publicRoutes.map(({path, element}) =>
                <Route key={path} path={path} Component={element} exact />
            )}
            {isAdmin && adminRoutes.map(({path, element}) =>
                <Route key={path} path={path} Component={element} exact />
            )
            } 
            <Route path="*" element={<Navigate to={BOOKS_ROUTE} />} />
            
        </Routes>
    );
};

export default AppRouter;