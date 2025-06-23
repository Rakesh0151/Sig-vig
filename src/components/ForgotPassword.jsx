import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, themeConfig } from "./ThemeProvider";
import logo from '../assets/logo.png';
import { motion } from "framer-motion";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [flashMessages, setFlashMessages] = useState([]);
  const navigate = useNavigate();
  const { theme } = useTheme();

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFlashMessages([]);

    try {
      const response = await fetch('https://signal-app-748522437054.us-central1.run.app/forget-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setFlashMessages([{
          category: 'success',
          message: 'Password reset instructions have been sent to your email. Please check your inbox.'
        }]);
        setTimeout(() => navigate("/login"), 3000);
      } else {
        throw new Error('Failed to send reset email');
      }
    } catch (error) {
      setFlashMessages([{
        category: 'danger',
        message: 'Failed to process your request. Please try again later.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex transition-colors duration-500"
      style={{ backgroundColor: cliniFinesseTheme.background }}
    >
      {/* Left Side - Form */}
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
            <div className="flex items-center justify-center gap-3 mb-8">
              <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
              <div className="flex flex-col items-start">
                <div className="flex items-center specimen-font">
                  <span className="text-3xl font-bold" style={{ color: cliniFinesseTheme.secondary }}>
                    Sig
                  </span>
                  <span className="text-3xl font-bold" style={{ color: cliniFinesseTheme.primary }}>
                    Vig
                  </span>
                </div>
                <span className="text-xs specimen-font-medium tracking-wide mt-1" style={{ color: cliniFinesseTheme.textSecondary }}>
                  powered by <span style={{ color: cliniFinesseTheme.secondary }}>CLIN</span><span style={{ color: cliniFinesseTheme.primary }}>FINESSE</span>
                </span>
              </div>
            </div>

            <h2 
              className="text-2xl font-bold mb-2 text-center specimen-font"
              style={{ color: cliniFinesseTheme.text }}
            >
              Reset Your Password
            </h2>

            <p
              className="text-sm text-center mb-6 specimen-font-medium"
              style={{ color: cliniFinesseTheme.textSecondary }}
            >
              Enter your email address and we'll send you instructions to reset your password.
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
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm specimen-font-medium mb-2"
                  style={{ color: cliniFinesseTheme.text }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 pl-10 rounded-lg border specimen-font-medium transition-all duration-200 focus:ring-2 focus:ring-opacity-20 focus:outline-none"
                    style={{
                      backgroundColor: cliniFinesseTheme.inputBackground,
                      borderColor: cliniFinesseTheme.inputBorder,
                      color: cliniFinesseTheme.text,
                    }}
                    placeholder="Enter your email address"
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

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg text-sm specimen-font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-60 disabled:cursor-not-allowed text-white"
                style={{
                  backgroundColor: loading ? cliniFinesseTheme.textSecondary : cliniFinesseTheme.primary,
                  boxShadow: loading ? 'none' : `0 4px 12px ${cliniFinesseTheme.primary}20`
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </div>
                ) : (
                  'Send Reset Instructions'
                )}
              </motion.button>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full mt-4 py-2 px-4 rounded-lg text-sm specimen-font-medium transition-all duration-200 border flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: cliniFinesseTheme.border,
                  color: cliniFinesseTheme.text
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Login
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
            Password Recovery
          </h1>
          <p 
            className="text-lg mb-8 specimen-font-medium"
            style={{ color: cliniFinesseTheme.textSecondary }}
          >
            Don't worry! We'll help you regain access to your account securely.
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Quick Recovery",
                description: "Fast and efficient reset process"
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

export default ForgotPassword; 