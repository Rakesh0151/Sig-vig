import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "./ThemeProvider";
import logo from '../assets/logo.png';
import { motion } from "framer-motion";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    new_password: "",
    confirm_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [flashMessages, setFlashMessages] = useState([]);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  // Get token from URL parameters
  const token = new URLSearchParams(location.search).get('token');

  const cliniFinesseTheme = {
    primary: '#57c1ef',
    secondary: '#ee3739',
    background: theme === 'dark' ? '#1a1a1a' : '#f8fafc',
    cardBackground: theme === 'dark' ? '#2d2d2d' : '#ffffff',
    text: theme === 'dark' ? '#ffffff' : '#1e293b',
    textSecondary: theme === 'dark' ? '#94a3b8' : '#64748b',
    border: theme === 'dark' ? '#404040' : '#e2e8f0',
    inputBackground: theme === 'dark' ? '#3a3a3a' : '#ffffff',
    inputBorder: theme === 'dark' ? '#525252' : '#cbd5e1',
    surface: theme === 'dark' ? '#3a3a3a' : '#ffffff',
    success: theme === 'dark' ? '#4ade80' : '#166534',
    error: theme === 'dark' ? '#f87171' : '#dc2626',
  };

  const validatePassword = (password) => {
    const validations = {
      length: password.length >= 9 && password.length <= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|&gt;&lt;]/.test(password)
    };
    setPasswordValidation(validations);
    return Object.values(validations).every(Boolean);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'new_password') {
      validatePassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFlashMessages([]);

    // Validate password requirements
    if (!validatePassword(formData.new_password)) {
      setFlashMessages([{
        category: 'danger',
        message: 'Please ensure your password meets all requirements.'
      }]);
      setLoading(false);
      return;
    }

    // Validate passwords match
    if (formData.new_password !== formData.confirm_password) {
      setFlashMessages([{
        category: 'danger',
        message: 'Passwords do not match.'
      }]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://signal-app-748522437054.us-central1.run.app/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          new_password: formData.new_password,
          token: token
        }),
      });

      if (response.ok) {
        setFlashMessages([{
          category: 'success',
          message: 'Password has been successfully reset. You can now login with your new password.'
        }]);
        setTimeout(() => navigate("/login"), 3000);
      } else {
        throw new Error('Failed to reset password');
      }
    } catch (error) {
      setFlashMessages([{
        category: 'danger',
        message: 'Failed to reset password. Please try again or request a new reset link.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: cliniFinesseTheme.background }}
      >
        <div className="p-8 rounded-xl border text-center" style={{ backgroundColor: cliniFinesseTheme.cardBackground }}>
          <h2 className="text-xl mb-4" style={{ color: cliniFinesseTheme.text }}>Invalid Reset Link</h2>
          <p className="mb-4" style={{ color: cliniFinesseTheme.textSecondary }}>
            This password reset link is invalid or has expired.
          </p>
          <button
            onClick={() => navigate("/forgot-password")}
            className="px-4 py-2 rounded-md text-white"
            style={{ backgroundColor: cliniFinesseTheme.primary }}
          >
            Request New Reset Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex transition-colors duration-500"
      style={{ backgroundColor: cliniFinesseTheme.background }}
    >
      <div className="w-full md:w-[40%] flex justify-center items-center px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div 
            className="p-8 rounded-xl border"
            style={{
              backgroundColor: cliniFinesseTheme.cardBackground,
              borderColor: cliniFinesseTheme.border,
              boxShadow: `0 4px 24px ${theme === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)'}`,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
              <div className="flex flex-col items-start">
                <div className="flex items-center specimen-font">
                  <span className="text-2xl font-bold" style={{ color: cliniFinesseTheme.secondary }}>
                    Sig
                  </span>
                  <span className="text-2xl font-bold" style={{ color: cliniFinesseTheme.primary }}>
                    Vig
                  </span>
                </div>
                <span className="text-xs specimen-font-medium tracking-wide" style={{ color: cliniFinesseTheme.textSecondary }}>
                  powered by <span style={{ color: cliniFinesseTheme.secondary }}>CLIN</span><span style={{ color: cliniFinesseTheme.primary }}>FINESSE</span>
                </span>
              </div>
            </div>

            <h2 
              className="text-xl font-bold mb-2 text-center specimen-font"
              style={{ color: cliniFinesseTheme.text }}
            >
              Set New Password
            </h2>

            <p
              className="text-sm text-center mb-4 specimen-font-medium"
              style={{ color: cliniFinesseTheme.textSecondary }}
            >
              Please enter your email and choose a new password.
            </p>

            {/* Flash Messages */}
            {flashMessages.length > 0 && (
              <div className="mb-6">
                {flashMessages.map((msg, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3 p-4 rounded-lg mb-3 text-sm specimen-font-medium"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      backgroundColor: msg.category === 'success' 
                        ? theme === 'dark' ? 'rgba(30, 58, 58, 0.8)' : 'rgba(240, 249, 240, 0.8)'
                        : theme === 'dark' ? 'rgba(58, 30, 30, 0.8)' : 'rgba(253, 242, 242, 0.8)',
                      color: msg.category === 'success' 
                        ? theme === 'dark' ? '#4ade80' : '#166534'
                        : theme === 'dark' ? '#f87171' : '#dc2626',
                      border: `1px solid ${msg.category === 'success' 
                        ? theme === 'dark' ? '#4ade80' : '#bbf7d0'
                        : theme === 'dark' ? '#f87171' : '#fecaca'}`
                    }}
                  >
                    {msg.category === 'success' ? (
                      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                    {msg.message}
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* Password Requirements */}
            <div className="mb-4 p-3 rounded-lg border specimen-font-medium text-sm"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)',
                borderColor: cliniFinesseTheme.border
              }}>
              <h3 className="mb-2 font-semibold text-sm" style={{ color: cliniFinesseTheme.text }}>
                Password Requirements:
              </h3>
              <ul className="space-y-0.5 text-xs">
                <li className="flex items-center gap-1.5">
                  <span style={{ color: passwordValidation.length ? cliniFinesseTheme.success : cliniFinesseTheme.error }}>
                    {passwordValidation.length ? '✓' : '×'}
                  </span>
                  <span style={{ color: cliniFinesseTheme.textSecondary }}>
                    9-12 characters
                  </span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span style={{ color: passwordValidation.uppercase ? cliniFinesseTheme.success : cliniFinesseTheme.error }}>
                    {passwordValidation.uppercase ? '✓' : '×'}
                  </span>
                  <span style={{ color: cliniFinesseTheme.textSecondary }}>
                    One uppercase letter
                  </span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span style={{ color: passwordValidation.lowercase ? cliniFinesseTheme.success : cliniFinesseTheme.error }}>
                    {passwordValidation.lowercase ? '✓' : '×'}
                  </span>
                  <span style={{ color: cliniFinesseTheme.textSecondary }}>
                    One lowercase letter
                  </span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span style={{ color: passwordValidation.number ? cliniFinesseTheme.success : cliniFinesseTheme.error }}>
                    {passwordValidation.number ? '✓' : '×'}
                  </span>
                  <span style={{ color: cliniFinesseTheme.textSecondary }}>
                    One number
                  </span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span style={{ color: passwordValidation.special ? cliniFinesseTheme.success : cliniFinesseTheme.error }}>
                    {passwordValidation.special ? '✓' : '×'}
                  </span>
                  <span style={{ color: cliniFinesseTheme.textSecondary }}>
                    One special character (!@#$%^&*(),.?":{}|&gt;&lt;)
                  </span>
                </li>
              </ul>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm specimen-font-medium mb-1.5"
                  style={{ color: cliniFinesseTheme.text }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 pl-9 rounded-lg border specimen-font-medium text-sm transition-all duration-200 focus:ring-2 focus:ring-opacity-20 focus:outline-none"
                    style={{
                      backgroundColor: cliniFinesseTheme.inputBackground,
                      borderColor: cliniFinesseTheme.inputBorder,
                      color: cliniFinesseTheme.text,
                    }}
                    placeholder="Enter your email"
                  />
                  <svg 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                    style={{ color: cliniFinesseTheme.textSecondary }}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>

              <div>
                <label 
                  htmlFor="new_password" 
                  className="block text-sm specimen-font-medium mb-1.5"
                  style={{ color: cliniFinesseTheme.text }}
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="new_password"
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 pl-9 pr-9 rounded-lg border specimen-font-medium text-sm transition-all duration-200 focus:ring-2 focus:ring-opacity-20 focus:outline-none"
                    style={{
                      backgroundColor: cliniFinesseTheme.inputBackground,
                      borderColor: cliniFinesseTheme.inputBorder,
                      color: cliniFinesseTheme.text,
                    }}
                    placeholder="Enter new password"
                  />
                  <svg 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                    style={{ color: cliniFinesseTheme.textSecondary }}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-md transition-colors duration-200 hover:bg-black hover:bg-opacity-5"
                    style={{ color: cliniFinesseTheme.textSecondary }}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label 
                  htmlFor="confirm_password" 
                  className="block text-sm specimen-font-medium mb-1.5"
                  style={{ color: cliniFinesseTheme.text }}
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm_password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 pl-9 pr-9 rounded-lg border specimen-font-medium text-sm transition-all duration-200 focus:ring-2 focus:ring-opacity-20 focus:outline-none"
                    style={{
                      backgroundColor: cliniFinesseTheme.inputBackground,
                      borderColor: cliniFinesseTheme.inputBorder,
                      color: cliniFinesseTheme.text,
                    }}
                    placeholder="Confirm new password"
                  />
                  <svg 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                    style={{ color: cliniFinesseTheme.textSecondary }}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-md transition-colors duration-200 hover:bg-black hover:bg-opacity-5"
                    style={{ color: cliniFinesseTheme.textSecondary }}
                  >
                    {showConfirmPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 rounded-md text-sm specimen-font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-60 disabled:cursor-not-allowed text-white mt-2"
                style={{
                  backgroundColor: loading ? cliniFinesseTheme.textSecondary : cliniFinesseTheme.primary,
                  boxShadow: loading ? 'none' : `0 4px 12px ${cliniFinesseTheme.primary}20`
                }}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Resetting Password...
                  </div>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p 
                className="text-xs specimen-font-medium"
                style={{ color: cliniFinesseTheme.textSecondary }}
              >
                Secure password reset process
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden md:flex md:w-[60%] relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: `linear-gradient(45deg, ${cliniFinesseTheme.primary}10, ${cliniFinesseTheme.secondary}10)`,
            opacity: 0.5
          }}
        />
        <div className="relative z-10 flex flex-col justify-center px-12 lg:px-20 w-full">
          <h1 
            className="text-4xl font-bold mb-4 specimen-font"
            style={{ color: cliniFinesseTheme.text }}
          >
            Create New Password
          </h1>
          <p 
            className="text-lg mb-8 specimen-font-medium"
            style={{ color: cliniFinesseTheme.textSecondary }}
          >
            Choose a strong password to keep your account secure
          </p>

          {/* Security Features */}
          <div className="grid grid-cols-2 gap-8">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Secure Process",
                description: "Industry-standard security protocols"
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: "Strong Password",
                description: "Create a secure new password"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4"
              >
                <div 
                  className="p-2 rounded-lg"
                  style={{ 
                    backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    color: cliniFinesseTheme.primary
                  }}
                >
                  {feature.icon}
                </div>
                <div>
                  <h3 
                    className="text-lg font-semibold mb-1 specimen-font"
                    style={{ color: cliniFinesseTheme.text }}
                  >
                    {feature.title}
                  </h3>
                  <p 
                    className="text-sm specimen-font-medium"
                    style={{ color: cliniFinesseTheme.textSecondary }}
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 