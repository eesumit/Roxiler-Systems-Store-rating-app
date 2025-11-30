import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { StoresPage } from './pages/store/StoresPage';
import { StoreDetailPage } from './pages/store/StoreDetailPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { StoreOwnerDashboard } from './pages/storeOwner/StoreOwnerDashboard';
import { ProfilePage } from './pages/user/ProfilePage';
const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/stores" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              <Route
                path="/stores"
                element={
                  <ProtectedRoute>
                    <StoresPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/stores/:id"
                element={
                  <ProtectedRoute>
                    <StoreDetailPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/store-owner/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['store_owner']}>
                    <StoreOwnerDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Add more routes as needed */}
            </Routes>
          </Layout>
          <ToastContainer />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
export default App;