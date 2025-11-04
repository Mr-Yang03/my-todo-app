import React from 'react';
import styled from '@emotion/styled';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { useTranslation } from 'react-i18next';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
`;

const Navbar = styled.nav`
  background: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  margin: 0;
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
`;

const LangButton = styled.button`
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }
`;

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <LayoutContainer>
      <Navbar>
        <NavContent>
          <Logo>{t('app.title')}</Logo>
          <NavActions>
            <LangButton onClick={toggleLanguage}>
              {i18n.language === 'en' ? '🇻🇳 Tiếng Việt' : '🇺🇸 English'}
            </LangButton>
            {user && (
              <>
                <UserInfo>
                  <span>👤</span>
                  <span>{user.name}</span>
                </UserInfo>
                <Button variant="secondary" onClick={logout}>
                  {t('app.logout')}
                </Button>
              </>
            )}
          </NavActions>
        </NavContent>
      </Navbar>
      {children}
    </LayoutContainer>
  );
};
