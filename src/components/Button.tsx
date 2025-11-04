import styled from '@emotion/styled';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  children: ReactNode;
  isLoading?: boolean;
}

const getVariantStyles = (variant: string) => {
  switch (variant) {
    case 'primary':
      return `
        background-color: #3b82f6;
        color: white;
        &:hover:not(:disabled) {
          background-color: #2563eb;
        }
      `;
    case 'secondary':
      return `
        background-color: #6b7280;
        color: white;
        &:hover:not(:disabled) {
          background-color: #4b5563;
        }
      `;
    case 'danger':
      return `
        background-color: #ef4444;
        color: white;
        &:hover:not(:disabled) {
          background-color: #dc2626;
        }
      `;
    case 'success':
      return `
        background-color: #10b981;
        color: white;
        &:hover:not(:disabled) {
          background-color: #059669;
        }
      `;
    default:
      return '';
  }
};

const StyledButton = styled.button<{ variant: string }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  ${(props) => getVariantStyles(props.variant)}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  isLoading,
  disabled,
  ...props
}) => {
  return (
    <StyledButton variant={variant} disabled={disabled || isLoading} {...props}>
      {isLoading && <Spinner />}
      {children}
    </StyledButton>
  );
};
