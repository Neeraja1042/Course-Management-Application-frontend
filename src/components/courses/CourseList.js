import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { courseService } from '../../services/api';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseService.getAll();
      if (response.data.success) {
        setCourses(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch courses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      const response = await courseService.delete(id);
      if (response.data.success) {
        setMessage('Course deleted successfully');
        fetchCourses();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setError('Failed to delete course');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="courses-header">
        <h1>Courses</h1>
        <Link to="/courses/new" className="btn btn-primary btn-small">
          Add New Course
        </Link>
      </div>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-alert">{error}</div>}

      {courses.length === 0 ? (
        <div className="empty-state">
          <h2>No courses found</h2>
          <p>Get started by creating your first course!</p>
        </div>
      ) : (
        courses.map((course) => (
          <div key={course.id} className="course-card">
            <h3>{course.course_name}</h3>
            <p>{course.description}</p>
            <div className="course-meta">
              <strong>Instructor:</strong> {course.instructor}
            </div>
            <div className="course-actions">
              <button
                onClick={() => navigate(`/courses/edit/${course.id}`)}
                className="btn btn-secondary btn-small"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(course.id)}
                className="btn btn-danger btn-small"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CourseList;

