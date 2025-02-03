// Signup.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    photo: null,
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setUserData({
      ...userData,
      photo: e.target.files[0], // Store file directly
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare FormData
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('email', userData.email);
      formData.append('password', userData.password);
      if (userData.photo) {
        formData.append('photo', userData.photo); // Append file
      }

      const res = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        body: formData, // Send as FormData
      });

      const data = await res.json();

      if (res.ok) {
        if (data.token) {
          // Store token and user data in localStorage
          localStorage.setItem('user', JSON.stringify(userData)); 
          localStorage.setItem('token', data.token); 
          navigate('/Dashboard'); // Redirect to dashboard
        } else {
          setError('No token received');
        }
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 animate-gradient bg-cover">
      <div className="max-w-lg w-full p-8 bg-white bg-opacity-80 shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">Full Name</label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              required
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-600">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={userData.phone}
              onChange={handleChange}
              required
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              required
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              required
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="photo" className="block text-sm font-medium text-gray-600">Profile Picture</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Already have an account? 
          <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
