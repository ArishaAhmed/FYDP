import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProfilePage.css';
import Navbar from './navbar';
import Footer from './footer';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData({
          first_name: response.data.first_name || '',
          last_name: response.data.last_name || '',
          email: response.data.email || '',
        });
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch profile');
        if (err.response?.status === 401) navigate('/login');
        console.error(err);
      }
    };

    fetchProfile();
  }, [navigate]);

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    if (value && !validatePassword(value)) {
      setPasswordError('Password must contain at least 8 characters, one uppercase letter, one number, and one special character.');
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value !== newPassword) {
      setConfirmError("Passwords don't match.");
    } else {
      setConfirmError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword && !currentPassword) {
      setError('Current password is required to update password.');
      return;
    }

    if (newPassword && confirmPassword !== newPassword) {
      setConfirmError("Passwords don't match.");
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const updateData = {};
    if (userData.first_name) updateData.first_name = userData.first_name;
    if (userData.last_name) updateData.last_name = userData.last_name;
    if (newPassword) {
      updateData.new_password = newPassword;
      updateData.current_password = currentPassword;
    }

    try {
      const response = await axios.put('http://localhost:5000/profile', updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setSuccess(response.data.message || 'Profile updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      // Update localStorage userInitial if email changed (for future use)
      if (response.data.email) {
        localStorage.setItem('userInitial', response.data.email.charAt(0).toUpperCase());
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
      if (err.response?.status === 401) navigate('/login');
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      {/* Background Diamonds */}
      <div className="diamond-container">
        <div className="diamond pink"></div>
        <div className="diamond blue"></div>
        <div className="diamond purple"></div>
      </div>
      <div className="diamond-container-two">
        <div className="diamond pink-two"></div>
        <div className="diamond blue-two"></div>
        <div className="diamond purple-two"></div>
      </div>

      {/* Profile Page */}
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
        </div>

        <div className="out-container">
          <div className="profile-picture">
            <div className="profile-initial">{userData.email.charAt(0).toUpperCase() || '?'}</div>
          </div>

          <div className="profile-details">
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  placeholder="Enter your first name"
                  value={userData.first_name}
                  onChange={(e) => setUserData({ ...userData, first_name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  placeholder="Enter your last name"
                  value={userData.last_name}
                  onChange={(e) => setUserData({ ...userData, last_name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" value={userData.email} readOnly />
              </div>

              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={handlePasswordChange}
                />
                {passwordError && <p className="error">{passwordError}</p>}
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                />
                {confirmError && <p className="error">{confirmError}</p>}
              </div>

              <button
                className="save-button"
                disabled={passwordError || confirmError}
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;