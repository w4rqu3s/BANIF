import { createBrowserRouter, Navigate} from "react-router-dom"
import Login from './pages/login'
import AccountPage from "./pages/account"
import GerentePage from "./pages/manager"


const router = createBrowserRouter([
    { 
        path: "/", 
        element: <Navigate to="/login" replace />
    },
    {
        path: "/login", 
        element: <Login />,
    },
    {
        path: "/cliente",
        element: <AccountPage />,
    },
    {
        path: "/gerente", 
        element: <GerentePage />
    }
])

export default router