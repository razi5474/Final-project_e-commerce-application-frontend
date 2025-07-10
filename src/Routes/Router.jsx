import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home";
import UserLayout from "../Layouts/UserLayout";
import NotFound from "../Pages/NotFound";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../Pages/Login";
import ProtectedRoutes from "../Layouts/ProtectedRoutes";
import ProductDeatails from "../components/Product/ProductDeatails";
import Register from "../Pages/Register";
import SellerLayout from "../Layouts/SellerLayout";
import SellerProfile from "../Pages/seller/sellerProfile";

import ProfileLayout from "../components/layout/user/ProfileLayout";
import ProfileInfo from "../Pages/ProfileInfo";
import AddressManager from "../Pages/AddressManager";
import Orders from "../Pages/Orders";
import Cart from "../Pages/Cart";
import CategoryProducts from "../Pages/CategoryProducts";
import AllProducts from "../Pages/AllProducts";
import PaymentSuccess from "../components/layout/PaymentSuccess";
import PaymentCancel from "../components/layout/PaymentCancel";
import Checkout from "../Pages/Checkout";
import SellerDashboard from "../Pages/seller/Dashboard";
import AddProduct from "../Pages/seller/AddProduct";
import ProductList from "../Pages/seller/ProductList";
import SellerOrders from "../Pages/seller/sellerOrders";
import SellerReviews from "../Pages/seller/sellerReviews";
import UpdateProduct from "../Pages/seller/UpdateProduct";
import AdminLayout from "../Layouts/AdminLayout";
import AdminDashboard from "../Pages/admin/AdminDashboard";
import ManageUsers from "../Pages/admin/ManageUsers";
import ManageSellers from "../Pages/admin/ManageSellers";
import AdminProfile from "../Pages/admin/AdminProfile";
import ManageProducts from "../Pages/admin/ManageProducts";
import AdminOrders from "../Pages/admin/AdminOrders";
import AdminReviews from "../Pages/admin/AdminReviews";
import AdminCategories from "../Pages/admin/AdminCategories";
import RegisterSuccess from "../Pages/RegisterSuccess";

export const router = createBrowserRouter([
    {
        path: "/",
        element:<UserLayout/>,
        children:[
            {path:"",element:<Home/>},
            {path:'/category/:categoryId',element:<CategoryProducts/>},
            {path:'/products',element:<AllProducts/>}, // All products page

            // user 
        {  
            path:"/user",
            element:<ProtectedRoutes allowedRoles={['user']}/>,//protected user routes
            children:[
                {path:'profile',element:<ProfileLayout/>,
                children: [
                    { path: "", element: <ProfileInfo /> }, // /user/profile
                    { path: "address", element: <AddressManager /> },
                    {path: "orders", element: <Orders /> },
                 ],
                },
                
                {path:"cart",element:<Cart/>},
                {path:'payment/success',element:<PaymentSuccess/>},
                {path:'payment/cancel',element:<PaymentCancel/>},
                { path: "checkout", element: <Checkout/> },
                { path: "*", element: <NotFound /> }
            ],
        },
            
        ]
    },
    {
    path: "/seller",
    errorElement: <NotFound />,
    children: [
        {
            path: "login",
            element: <AuthLayout />,
            children: [
                { path: "", element: <Login role="seller" /> },
            ],
        },
        {
            path: "register",
            element: <AuthLayout />,
            children: [
                { path: "", element: <Register role="seller" /> },
            ],
        },
        {
            path: "",
            element: <ProtectedRoutes allowedRoles={['seller']} />,
            children: [
                {
                    path: "",
                    element: <SellerLayout />,
                    children: [
                        { path: "", element: <SellerDashboard /> },
                        { path: "profile", element: <SellerProfile /> },
                        { path: "add-product", element: <AddProduct /> },
                        { path: "products", element:<ProductList/>  },
                        { path: "orders", element: <SellerOrders /> },
                        { path: "reviews", element: <SellerReviews /> },
                        {path:"update-product/:id", element:<UpdateProduct/>},
                        
                    ],
                },
            ],
        },
    ],
    },

    {
        path:"/login",
        element:<AuthLayout/>,
        children:[
            {path:"",element:<Login/>}
        ]
    },
    {
        path:"/register",
        element:<AuthLayout/>,
        children:[
            {path:"",element:<Register/>}
        ]
    },
    
    // product details
    {
        path:"/product/productDeatails/:id",
        element:<UserLayout/>,
        children:[
            {path:"",element:<ProductDeatails/>}
        ]
    },
    
    // ✅ Admin login route
    {
    path: "/admin",
    children: [
        {
        path: "login",
        element: <AuthLayout />,
        children: [{ path: "", element: <Login role="admin" /> }],
        },

        // ✅ Protected Admin Layout & Pages
        {
        path: "",
        element: <ProtectedRoutes allowedRoles={['admin']} />,
        children: [
            {
            path: "",
            element: <AdminLayout />,
            children: [
                { path: "", element: <AdminDashboard /> },         // /admin
                { path: "users", element: <ManageUsers /> },       // /admin/users
                { path: "sellers", element: <ManageSellers /> },
                { path: "profile", element: <AdminProfile /> },
                {path:"manage-products",element:<ManageProducts/>},
                {path:"update-product/:id",element:<UpdateProduct/>},  
                {path:"add-product", element:<AddProduct/>},
                {path:"orders",element:<AdminOrders/>},
                {path:"reviews",element:<AdminReviews/>},
                {path:"categories",element:<AdminCategories/>}
            ],
            },
        ],
        },
    ],
    },
    {
        path: "/register-success",
        element: <RegisterSuccess />
        
    },

    {
        path:"*",
        element:<NotFound/>
    },
])
    