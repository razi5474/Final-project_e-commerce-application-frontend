import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home";
import UserLayout from "../Layouts/UserLayout";
import NotFound from "../Pages/NotFound";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../Pages/Login";
import ProtectedRoutes from "../Layouts/ProtectedRoutes";
import UserProfile from "../Pages/user/UserProfile";
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
            element:<ProtectedRoutes/>,//protected user routes
            children:[
                {path:'profile',element:<ProfileLayout/>,
                children: [
                    { path: "", element: <ProfileInfo /> }, // /user/profile
                    { path: "address", element: <AddressManager /> }, // /user/profile/address
                 ],
                },
                {path: "orders", element: <Orders /> },
                {path:"cart",element:<Cart/>}
            ],
        },
            
        ]
    },
    {
        path: "/seller",
        errorElement: <NotFound />,
        element: <SellerLayout />, // This is your layout
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
            // Protected seller routes
            {
            path: "profile",
            element:<ProtectedRoutes />,
            children:[
                {path:"",element:<SellerProfile/>}
                
            ]
                    
                    
                    
            }
        ]
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
    
    {
        path:"*",
        element:<NotFound/>
    },
])
    