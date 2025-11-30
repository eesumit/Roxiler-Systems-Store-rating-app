import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { LogOut, Store, User, LayoutDashboard } from "lucide-react";

export const Navbar = () => {
    const { user, logout, isAuthenticated, isAdmin, isStoreOwner } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <Store className="h-8 w-8 text-blue-600" />
                            <span className="text-xl font-bold text-gray-900">
                                Store Rating
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/stores"
                                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Stores
                                </Link>
                                {isAdmin && (
                                    <Link
                                        to="/admin/dashboard"
                                        className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                                    >
                                        <LayoutDashboard className="h-4 w-4 mr-1" />
                                        Admin
                                    </Link>
                                )}
                                {isStoreOwner && (
                                    <Link
                                        to="/store-owner/dashboard"
                                        className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                                    >
                                        <LayoutDashboard className="h-4 w-4 mr-1" />
                                        Dashboard
                                    </Link>
                                )}
                                <Link
                                    to="/profile"
                                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                                >
                                    <User className="h-4 w-4 mr-1" />
                                    {user?.name}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="btn-secondary flex items-center"
                                >
                                    <LogOut className="h-4 w-4 mr-1" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn-secondary">
                                    Login
                                </Link>
                                <Link to="/signup" className="btn-primary">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}