import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaSave, FaEdit, FaCamera } from 'react-icons/fa';

const Profile = () => {
  //context
  const [auth, setAuth] = useAuth();
  //state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //get user data
  useEffect(() => {
    const { email, name, phone, address } = auth?.user;
    setName(name);
    setPhone(phone);
    setEmail(email);
    setAddress(address);
  }, [auth?.user]);

  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.put("/api/v1/auth/profile", {
        name,
        email,
        password,
        phone,
        address,
      });
      if (data?.errro) {
        toast.error(data?.error);
      } else {
        setAuth({ ...auth, user: data?.updatedUser });
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success("Profile Updated Successfully");
        setIsEditing(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <Layout title={"Your Profile"}>
      <div className="modern-profile-container">
        <div className="profile-content">
          <div className="profile-sidebar">
            <UserMenu />
          </div>
          <div className="profile-main">
            {/* Profile Header */}
            <div className="profile-header">
              <div className="profile-avatar">
                <div className="avatar-circle">
                  <FaUser />
                </div>
                <button className="avatar-edit-btn">
                  <FaCamera />
                </button>
              </div>
              <div className="profile-info">
                <h1 className="profile-name">{auth?.user?.name}</h1>
                <p className="profile-email">{auth?.user?.email}</p>
                <button 
                  className={`edit-toggle-btn ${isEditing ? 'active' : ''}`}
                  onClick={toggleEdit}
                >
                  <FaEdit />
                  <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                </button>
              </div>
            </div>

            {/* Profile Form */}
            <div className="profile-form-container">
              <div className="form-header">
                <h2 className="form-title">Personal Information</h2>
                <p className="form-subtitle">Update your account information and settings</p>
              </div>

              <form onSubmit={handleSubmit} className="modern-profile-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      <FaUser />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="modern-form-input"
                      placeholder="Enter your full name"
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FaEnvelope />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="modern-form-input disabled"
                      placeholder="Enter your email address"
                      disabled
                    />
                    <small className="form-help">Email cannot be changed</small>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FaLock />
                      New Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="modern-form-input"
                      placeholder="Enter new password (optional)"
                      disabled={!isEditing}
                    />
                    <small className="form-help">Leave blank to keep current password</small>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FaPhone />
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="modern-form-input"
                      placeholder="Enter your phone number"
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">
                      <FaMapMarkerAlt />
                      Address
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="modern-form-textarea"
                      placeholder="Enter your complete address"
                      rows="3"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={toggleEdit}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="save-btn"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="loading-spinner"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaSave />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Account Security */}
            <div className="security-section">
              <h3 className="section-title">Account Security</h3>
              <div className="security-grid">
                <div className="security-item">
                  <div className="security-icon">
                    <FaLock />
                  </div>
                  <div className="security-content">
                    <h4>Password</h4>
                    <p>Last changed 30 days ago</p>
                  </div>
                  <button className="security-btn">Change</button>
                </div>
                
                <div className="security-item">
                  <div className="security-icon">
                    <FaPhone />
                  </div>
                  <div className="security-content">
                    <h4>Two-Factor Authentication</h4>
                    <p>Add an extra layer of security</p>
                  </div>
                  <button className="security-btn">Enable</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;