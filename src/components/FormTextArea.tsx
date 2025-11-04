import { useController, useFormContext } from 'react-hook-form';
import { TextArea } from './TextArea';
import { TextareaHTMLAttributes } from 'react';

interface FormTextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'> {
  name: string;
  label?: string;
}

export const FormTextArea: React.FC<FormTextAreaProps> = ({
  name,
  label,
  ...props
}) => {
  const { control } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return <TextArea {...field} label={label} error={error?.message} {...props} />;
};
