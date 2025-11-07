import styled from '@emotion/styled';
import { forwardRef, InputHTMLAttributes, useState, useRef } from 'react';

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 0.75rem 3rem 0.75rem 1rem;
  border: 1px solid ${(props) => (props.hasError ? '#ef4444' : '#d1d5db')};
  border-radius: 0.5rem;
  font-size: 1rem;
  line-height: 1.5;
  transition: all 0.2s;
  background-color: #fff;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: ${(props) => (props.hasError ? '#ef4444' : '#3b82f6')};
    box-shadow: 0 0 0 3px
      ${(props) => (props.hasError ? '#fee2e2' : '#dbeafe')};
  }

  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6b7280;
  transition: color 0.2s;

  &:hover {
    color: #374151;
  }

  &:focus {
    outline: none;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const ErrorText = styled.span`
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const EyeSlashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
    />
  </svg>
);

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const togglePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault(); // Prevent form submission
      
      // Save current cursor position
      const input = inputRef.current;
      const cursorPosition = input?.selectionStart ?? 0;
      
      setShowPassword((prev) => !prev);
      
      // Restore cursor position after state update
      setTimeout(() => {
        if (input) {
          input.focus();
          input.setSelectionRange(cursorPosition, cursorPosition);
        }
      }, 0);
    };

    // Combine refs
    const setRefs = (element: HTMLInputElement | null) => {
      inputRef.current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    return (
      <InputWrapper>
        {label && <Label>{label}</Label>}
        <InputContainer>
          <StyledInput
            ref={setRefs}
            type={showPassword ? 'text' : 'password'}
            hasError={!!error}
            {...props}
          />
          <ToggleButton
            type="button"
            onClick={togglePasswordVisibility}
            onMouseDown={(e) => e.preventDefault()} // Prevent input from losing focus
            tabIndex={-1} // Prevent button from being focused by Tab key
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
          </ToggleButton>
        </InputContainer>
        {error && <ErrorText>{error}</ErrorText>}
      </InputWrapper>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
