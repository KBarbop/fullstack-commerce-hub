import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import {
    Categories,
    CategoryForm, CategoryView,
    Dashboard,
    Homepage,
    LogIn,
    OrdersSystem, OrderView,
    ProductForm,
    Products, ProductView,
    Users,
    UserView
} from "../pages";
import { authorizeUserSession } from "../utils";
import { reduxLogOutUser, useAppDispatch } from "../store";
import { useEffect, useState, useMemo } from "react";

const PrivateRoutes = () => {
    const [authState, setAuthState] = useState({ isAuthorized: false, isLoading: true });
    const dispatch = useAppDispatch();

    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                const authorizationRequest = await authorizeUserSession();
                if (authorizationRequest.status !== 200) {
                    dispatch(reduxLogOutUser());
                }
                setAuthState({ isAuthorized: authorizationRequest.status === 200, isLoading: false });
            } catch (e) {
                console.error(e);
                setAuthState({ isAuthorized: false, isLoading: false });
            }
        };
        checkAuthorization().catch(e => console.error(e));
    }, [dispatch]);

    const { isAuthorized, isLoading } = authState;

    if (isLoading) {
        return <div>Loading...</div>; // Optionally, show a loading spinner or component
    }

    return isAuthorized ? <Outlet /> : <Navigate to="/log-in" />;
};

const Routing = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PrivateRoutes />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/create-category" element={<CategoryForm />} />
                    <Route path="/edit-category/:categoryId" element={<CategoryForm />} />
                    <Route path="/create-product" element={<ProductForm />} />
                    <Route path="/edit-product/:productId" element={<ProductForm />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/users/:userId" element={<UserView />} />
                    <Route path="/orders/:orderId" element={<OrderView />} />
                    <Route path="/products/:productId" element={<ProductView />} />
                    <Route path="/categories/:categoryId" element={<CategoryView />} />
                    <Route path="/orders-system" element={<OrdersSystem />} />
                </Route>
                <Route path="/" element={<Homepage />} />
                <Route path="/log-in" element={<LogIn />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Routing;
