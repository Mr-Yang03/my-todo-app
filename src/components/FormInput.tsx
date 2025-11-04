import { useController, useFormContext } from 'react-hook-form';
import { Input } from './Input';
import { InputHTMLAttributes } from 'react';

interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> {
  name: string;
  label?: string;
}

export const FormInput: React.FC<FormInputProps> = ({ name, label, ...props }) => {
  const { control } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return <Input {...field} label={label} error={error?.message} {...props} />;
};
