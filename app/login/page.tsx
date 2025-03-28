'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PageLayout from '../components/PageLayout';

interface LoginFormData {
  email: string;
  password: string;
}

interface AuthError {
  code: string;
  message: string;
}

export default function Login() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Error logging in. Please check your credentials.';
      
      if (error instanceof Error && 'code' in error) {
        const authError = error as AuthError;
        switch (authError.code) {
          case 'auth/invalid-email':
            errorMessage = 'Invalid email.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'This account has been disabled.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'User not found.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password.';
            break;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="Login">
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </PageLayout>
  );
} 