import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import CourseList from './components/courses/CourseList';
import CourseForm from './components/courses/CourseForm';
import Navbar from './components/layout/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/courses"
                element={
                  <PrivateRoute>
                    <CourseList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/courses/new"
                element={
                  <PrivateRoute>
                    <CourseForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/courses/edit/:id"
                element={
                  <PrivateRoute>
                    <CourseForm />
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<Navigate to="/courses" />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

