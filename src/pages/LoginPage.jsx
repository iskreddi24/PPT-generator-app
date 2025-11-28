// src/pages/LoginPage.jsx
import { useState } from "react";
import styled from "@emotion/styled";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/common/Spinner";

// --- Styled Components ---
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
  background-color: #1f2937;
  border-radius: 12px;
  border: 1px solid #374151;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #f9fafb;
  text-align: center;
  margin: 0;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #d1d5db;
  font-size: 0.95rem;
`;

const Input = styled.input`
  padding: 12px;
  font-size: 1rem;
  color: #f9fafb;
  background: #374151;
  border: 1px solid #4b5563;
  border-radius: 8px;
  transition: all 0.2s;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }
`;

const Button = styled.button`
  padding: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background: #3b82f6;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  &:disabled {
    background: #4b5563;
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #f87171;
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  margin: 0;
  font-size: 0.9rem;
`;

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(username, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError("Invalid username or password. Please try again.");
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
    autoComplete="username"
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
    autoComplete="current-password"
  />
</FormGroup>


        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner size={20} thickness={2} color="#fff" />
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </LoginForm>
    </LoginPageWrapper>
  );
};

export default LoginPage;
