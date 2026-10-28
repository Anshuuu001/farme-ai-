import { useState } from 'react';
import {
  LeafIcon,
  EyeIcon,
  EyeOffIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  UserIcon,
  LogOutIcon
} from '../components/common/Icons';
import { api } from '../services/api';

export default function AuthPage({ currentUser, onLogin, onLogout, onNavigate }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Field Agronomist');

  // UI state
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function validate() {
    const newErrors = {};

    if (mode === 'register' && !fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (mode === 'register') {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Confirmation password is required';
      } else if (confirmPassword !== password) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    setSubmissionSuccess('');

    if (!validate()) return;

    setIsLoading(true);

    try {
      if (mode === 'register') {
        const data = await api.register({
          name: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
          role
        });

        setSubmissionSuccess('Account created successfully! Redirecting...');
        onLogin(data.token, data.user);
        setTimeout(() => {
          onNavigate('dashboard');
        }, 600);
      } else {
        const data = await api.login({
          email: email.trim().toLowerCase(),
          password
        });

        setSubmissionSuccess('Signed in successfully! Redirecting...');
        onLogin(data.token, data.user);
        setTimeout(() => {
          onNavigate('dashboard');
        }, 600);
      }
    } catch (err) {
      console.error('[Auth Error]:', err);
      setServerError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        {currentUser?.isLoggedIn ? (
          /* Active Logged-in State */
          <div style={{ padding: '36px 32px', textAlign: 'center' }}>
            <div className="auth-brand-badge" style={{ margin: '0 auto 16px auto' }}>
              <UserIcon size={26} />
            </div>
            <h1 className="auth-title">Active Session</h1>
            <p className="auth-desc" style={{ marginBottom: '24px' }}>
              You are currently authenticated in AgriVision AI
            </p>

            <div
              style={{
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px 20px',
                textAlign: 'left',
                marginBottom: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Name
                </span>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{currentUser.name}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Email
                </span>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>{currentUser.email}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Role
                </span>
                <div>
                  <span className="badge badge-success">{currentUser.role || 'Field Agronomist'}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => onNavigate('dashboard')}
              >
                <span>Continue to Dashboard</span>
                <ArrowRightIcon size={16} />
              </button>
              <button
                type="button"
                className="btn btn-danger-outline"
                onClick={onLogout}
              >
                <LogOutIcon size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* Sign In / Register Form */
          <>
            <div className="auth-header">
              <div className="auth-brand-badge">
                <LeafIcon size={26} />
              </div>
              <h1 className="auth-title">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="auth-desc">
                {mode === 'login'
                  ? 'Access AgriVision AI Tomato Pathology Studio'
                  : 'Register for tomato crop health monitoring'}
              </p>
            </div>

            <div className="auth-tab-switch">
              <button
                type="button"
                className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
                onClick={() => {
                  setMode('login');
                  setErrors({});
                  setServerError('');
                  setSubmissionSuccess('');
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
                onClick={() => {
                  setMode('register');
                  setErrors({});
                  setServerError('');
                  setSubmissionSuccess('');
                }}
              >
                Register
              </button>
            </div>

            <div className="auth-body">
              {serverError && (
                <div
                  style={{
                    backgroundColor: 'var(--danger-bg)',
                    border: '1px solid var(--danger-border)',
                    color: 'var(--danger-text)',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.85rem'
                  }}
                >
                  <AlertTriangleIcon size={18} style={{ flexShrink: 0 }} />
                  <span>{serverError}</span>
                </div>
              )}

              {submissionSuccess && (
                <div
                  style={{
                    backgroundColor: 'var(--success-bg)',
                    border: '1px solid var(--success-border)',
                    color: 'var(--success-text)',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.85rem'
                  }}
                >
                  <CheckCircleIcon size={18} style={{ flexShrink: 0 }} />
                  <span>{submissionSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {mode === 'register' && (
                  <>
                    <div className="form-group">
                      <label className="form-label" htmlFor="fullName">
                        Full Name
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        className={`form-input ${errors.fullName ? 'is-invalid' : ''}`}
                        placeholder="e.g. Dr. Ramesh Kumar"
                        value={fullName}
                        disabled={isLoading}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: null }));
                        }}
                      />
                      {errors.fullName && (
                        <span className="field-error-message">
                          <AlertTriangleIcon size={14} />
                          {errors.fullName}
                        </span>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="userRole">
                        Professional Role
                      </label>
                      <select
                        id="userRole"
                        className="form-input"
                        value={role}
                        disabled={isLoading}
                        onChange={(e) => setRole(e.target.value)}
                      >
                        <option value="Field Agronomist">Field Agronomist</option>
                        <option value="Tomato Farm Owner">Tomato Farm Owner / Grower</option>
                        <option value="Agricultural Extension Agent">Agricultural Extension Agent</option>
                        <option value="Agronomy Researcher / Student">Agronomy Researcher / Student</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label className="form-label" htmlFor="email">
                    Work Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={`form-input ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="agronomist@farm.org"
                    value={email}
                    disabled={isLoading}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                    }}
                  />
                  {errors.email && (
                    <span className="field-error-message">
                      <AlertTriangleIcon size={14} />
                      {errors.email}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="password">
                    Password
                    <span className="form-label-desc">(min. 6 characters)</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      className={`form-input ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="••••••••"
                      value={password}
                      disabled={isLoading}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                      }}
                    />
                    <button
                      type="button"
                      className="input-icon-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="field-error-message">
                      <AlertTriangleIcon size={14} />
                      {errors.password}
                    </span>
                  )}
                </div>

                {mode === 'register' && (
                  <div className="form-group">
                    <label className="form-label" htmlFor="confirmPassword">
                      Confirm Password
                    </label>
                    <div className="input-wrapper">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={`form-input ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        placeholder="••••••••"
                        value={confirmPassword}
                        disabled={isLoading}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }));
                        }}
                      />
                      <button
                        type="button"
                        className="input-icon-btn"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? 'Hide confirmation password' : 'Show confirmation password'}
                      >
                        {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <span className="field-error-message">
                        <AlertTriangleIcon size={14} />
                        {errors.confirmPassword}
                      </span>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  <span>
                    {isLoading
                      ? mode === 'login' ? 'Signing In...' : 'Registering...'
                      : mode === 'login' ? 'Sign In to Studio' : 'Complete Registration'}
                  </span>
                  {!isLoading && <ArrowRightIcon size={16} />}
                </button>
              </form>

              <div className="auth-footer-help">
                AgriVision AI uses salted bcrypt hashing and JWT tokens. Database: MySQL.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
