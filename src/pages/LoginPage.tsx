import React from 'react';
import styled from '@emotion/styled';
import { useAuth } from '../contexts/AuthContext';
import { FormWrapper } from '../components/FormWrapper';
import { FormInput } from '../components/FormInput';
import { Button } from '../components/Button';
import { LoginCredentials } from '../types';
import { loginSchema } from '../utils/validationSchemas';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const LoginCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
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

const InfoBox = styled.div`
  background-color: #dbeafe;
  color: #1e40af;
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  margin-top: 1rem;
`;

export const LoginPage: React.FC = () => {
  const { login, error, isLoading } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (data: LoginCredentials) => {
    try {
      await login(data);
      navigate('/');
    } catch (err) {
      // Error is handled by context
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Title>{t('auth.welcome')}</Title>
        <Subtitle>{t('auth.login')}</Subtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <FormWrapper<LoginCredentials>
          onSubmit={handleSubmit}
          defaultValues={{ username: '', password: '' }}
          validationSchema={loginSchema}
        >
          <FormContainer>
            <FormInput
              name="username"
              label={t('auth.username')}
              placeholder={t('auth.username')}
              autoComplete="username"
            />
            <FormInput
              name="password"
              type="password"
              label={t('auth.password')}
              placeholder={t('auth.password')}
              autoComplete="current-password"
            />
            <Button type="submit" isLoading={isLoading}>
              {t('auth.loginButton')}
            </Button>
          </FormContainer>
        </FormWrapper>
      </LoginCard>
    </LoginContainer>
  );
};
