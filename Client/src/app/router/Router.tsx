import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/Home";
import Catalog from "../../features/catalog/Catalog";
import ProductDetails from "../../features/catalog/ProductDetails";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/Contact";
import TestErrorsPage from "../errors/TestErrors";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";

export const router = createBrowserRouter([{
    path: '/',
    element: <App />,
    children: [
        { path: '', element: <HomePage/>},
        { path: 'products', element: <Catalog/>},
        { path: 'products/:id', element: <ProductDetails/>},
        { path: 'about', element: <AboutPage/>},
        { path: 'contact', element: <ContactPage/>},
        { path: 'errors', element: <TestErrorsPage/>},
        { path: 'server-error', element: <ServerError/>},
        { path: 'not-found', element: <NotFound/>},
        { path: '*', element: <Navigate replace to='/not-found'/>}
    ]
}]);