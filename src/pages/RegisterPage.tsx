import React from 'react';
import styled from '@emotion/styled';
import { useAuth } from '../contexts/AuthContext';
import { FormWrapper } from '../components/FormWrapper';
import { FormInput } from '../components/FormInput';
import { FormPasswordInput } from '../components/FormPasswordInput';
import { Button } from '../components/Button';
import { RegisterCredentials } from '../types';
import { registerSchema } from '../utils/validationSchemas';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
`;

const RegisterCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #6b7280;
  text-align: center;
  margin-bottom: 2rem;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #991b1b;
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: #6b7280;
  font-size: 0.875rem;

  a {
    color: #3b82f6;
    font-weight: 500;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const RegisterPage: React.FC = () => {
  const { register, error, isLoading } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (data: RegisterCredentials & { confirmPassword: string }) => {
    try {
      const { confirmPassword, ...credentials } = data;
      await register(credentials);
      navigate('/login');
    } catch (err) {
      // Error is handled by context
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <Title>Create Account</Title>
        <Subtitle>Sign up to get started</Subtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <FormWrapper<RegisterCredentials & { confirmPassword: string }>
          onSubmit={handleSubmit}
          defaultValues={{ username: '', email: '', name: '', password: '', confirmPassword: '' }}
          validationSchema={registerSchema}
        >
          <FormContainer>
            <FormInput
              name="username"
              label="Username"
              placeholder="Enter your username"
              autoComplete="username"
            />
            <FormInput
              name="email"
              type="email"
              label="Email"
              placeholder="Enter your email"
              autoComplete="email"
            />
            <FormInput
              name="name"
              label="Full Name"
              placeholder="Enter your full name"
              autoComplete="name"
            />
            <FormPasswordInput
              name="password"
              label="Password"
              placeholder="Enter your password"
              autoComplete="new-password"
            />
            <FormPasswordInput
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm your password"
              autoComplete="new-password"
            />
            <Button type="submit" isLoading={isLoading}>
              Create Account
            </Button>
          </FormContainer>
        </FormWrapper>

        <LoginLink>
          Already have an account? <Link to="/login">Sign in</Link>
        </LoginLink>
      </RegisterCard>
    </RegisterContainer>
  );
};
