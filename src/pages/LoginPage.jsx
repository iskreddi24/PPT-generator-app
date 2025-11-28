// src/pages/LoginPage.jsx
import { useState } from 'react';
import styled from '@emotion/styled';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/common/Spinner'; // We'll reuse our existing spinner

// --- Styled Components ---
// These are similar to AddMediaForm for a consistent look and feel.
const LoginPageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #111827;
`;

const LoginForm = styled.form`
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background-color: #1F2937;
  border-radius: 12px;
  border: 1px solid #374151;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #F9FAFB;
  text-align: center;
  margin: 0;
`;

const FormGroup = styled.div` display:flex; flex-direction:column; gap:8px; `;
const Label = styled.label` font-weight:500; color:#D1D5DB; font-size:0.95rem; `;
const Input = styled.input`
  padding: 12px; font-size: 1rem; color: #F9FAFB; background: #374151;
  border: 1px solid #4B5563; border-radius: 8px; transition: all .2s;
  &:focus { outline: none; border-color: #3B82F6; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
`;

const Button = styled.button`
  padding: 12px; font-size: 1rem; font-weight: 600; color: #fff;
  background: #3B82F6; border-radius: 8px; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  &:disabled { background: #4B5563; opacity: .7; cursor: not-allowed; }
`;

const ErrorMessage = styled.p`
  color: #F87171;
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  margin: 0;
  font-size: 0.9rem;
`;

const LoginPage = () => {
  // --- State ---
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // --- Hooks ---
  const { login } = useAuth(); // Get the global login function from our context
  const navigate = useNavigate(); // Hook to programmatically navigate the user

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    setIsSubmitting(true);

    try {
      await login(username, password);
      // If login is successful, redirect to the main dashboard page
      navigate('/', { replace: true });
    } catch (err) {
      // If the login function throws an error, it means authentication failed
      setError('Invalid username or password. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <LoginPageWrapper>
      <LoginForm onSubmit={handleSubmit}>
        <Title>Welcome Back</Title>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <FormGroup>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner size={20} thickness={2} color="#fff" />
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </LoginForm>
    </LoginPageWrapper>
  );
};

export default LoginPage;