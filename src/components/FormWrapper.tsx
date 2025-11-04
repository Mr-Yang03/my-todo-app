import React from 'react';
import {
  useForm,
  FormProvider,
  UseFormReturn,
  FieldValues,
  SubmitHandler,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface FormWrapperProps<T extends FieldValues> {
  children: React.ReactNode;
  onSubmit: SubmitHandler<T>;
  defaultValues?: Partial<T>;
  validationSchema?: yup.AnyObjectSchema;
  className?: string;
}

export function FormWrapper<T extends FieldValues>({
  children,
  onSubmit,
  defaultValues,
  validationSchema,
  className,
}: FormWrapperProps<T>) {
  const methods = useForm<T>({
    defaultValues: defaultValues as any,
    resolver: validationSchema ? yupResolver(validationSchema) : undefined,
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </FormProvider>
  );
}

// Hook to access form context
export { useFormContext } from 'react-hook-form';
