import styled from '@emotion/styled';
import { forwardRef, TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const TextAreaWrapper = styled.div`
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

const StyledTextArea = styled.textarea<{ hasError?: boolean }>`
  padding: 0.75rem 1rem;
  border: 1px solid ${(props) => (props.hasError ? '#ef4444' : '#d1d5db')};
  border-radius: 0.5rem;
  font-size: 1rem;
  line-height: 1.5;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  transition: all 0.2s;
  background-color: #fff;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;

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

const ErrorText = styled.span`
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <TextAreaWrapper>
        {label && <Label>{label}</Label>}
        <StyledTextArea ref={ref} hasError={!!error} {...props} />
        {error && <ErrorText>{error}</ErrorText>}
      </TextAreaWrapper>
    );
  }
);

TextArea.displayName = 'TextArea';
