import { useController, useFormContext } from 'react-hook-form';
import { PasswordInput } from './PasswordInput';
import { InputHTMLAttributes } from 'react';

interface FormPasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'type'> {
  name: string;
  label?: string;
}

export const FormPasswordInput: React.FC<FormPasswordInputProps> = ({ name, label, ...props }) => {
  const { control } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return <PasswordInput {...field} label={label} error={error?.message} {...props} />;
};
