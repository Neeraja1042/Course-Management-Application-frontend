import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { courseService } from '../../services/api';

const CourseForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    course_name: '',
    description: '',
    instructor: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchCourse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await courseService.getById(id);
      if (response.data.success) {
        setFormData({
          course_name: response.data.data.course_name,
          description: response.data.data.description,
          instructor: response.data.data.instructor
        });
      }
    } catch (err) {
      setMessage('Failed to fetch course details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');

    try {
      setLoading(true);
      let response;
      if (isEdit) {
        response = await courseService.update(id, formData);
      } else {
        response = await courseService.create(formData);
      }

      if (response.data.success) {
        setMessage(isEdit ? 'Course updated successfully!' : 'Course created successfully!');
        setTimeout(() => {
          navigate('/courses');
        }, 1500);
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        const errorObj = {};
        err.response.data.errors.forEach((error) => {
          errorObj[error.field] = error.message;
        });
        setErrors(errorObj);
      } else {
        setMessage(err.response?.data?.message || 'Operation failed');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="form-container">
      <h2>{isEdit ? 'Edit Course' : 'Create New Course'}</h2>
      {message && (
        <div className={message.includes('success') ? 'success-message' : 'error-alert'}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="course_name">Course Name</label>
          <input
            type="text"
            id="course_name"
            name="course_name"
            value={formData.course_name}
            onChange={handleChange}
            required
            minLength="2"
            maxLength="200"
          />
          {errors.course_name && <div className="error-message">{errors.course_name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            minLength="10"
            maxLength="1000"
          />
          {errors.description && <div className="error-message">{errors.description}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="instructor">Instructor</label>
          <input
            type="text"
            id="instructor"
            name="instructor"
            value={formData.instructor}
            onChange={handleChange}
            required
            minLength="2"
            maxLength="100"
          />
          {errors.instructor && <div className="error-message">{errors.instructor}</div>}
        </div>

        <div className="course-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {isEdit ? 'Update Course' : 'Create Course'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/courses')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;

