import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider } from './contexts/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';
import HomePage from './pages/HomePage';
import CompletedTodosPage from './pages/CompletedTodosPage';
import PendingTodosPage from './pages/PendingTodosPage';
import { LoginPage } from './pages/LoginPage';
import './utils/i18n';
import './App.scss';

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
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
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  );
}

export default App;
