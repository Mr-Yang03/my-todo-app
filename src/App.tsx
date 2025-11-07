import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './contexts/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';
import HomePage from './pages/HomePage';
import CompletedTodosPage from './pages/CompletedTodosPage';
import PendingTodosPage from './pages/PendingTodosPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import './utils/i18n';
import './App.scss';

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Main routes with modal support */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <HomePage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/task/create"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <HomePage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/task/:taskId/edit"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <HomePage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/task/:taskId/delete"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <HomePage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/completed"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <CompletedTodosPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/completed/task/create"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <CompletedTodosPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/completed/task/:taskId/edit"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <CompletedTodosPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/completed/task/:taskId/delete"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <CompletedTodosPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/pending"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <PendingTodosPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pending/task/create"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <PendingTodosPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pending/task/:taskId/edit"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <PendingTodosPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pending/task/:taskId/delete"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <PendingTodosPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
