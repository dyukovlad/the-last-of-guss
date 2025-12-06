import { useState } from 'react';
import type { ChangeEvent } from 'react';

interface FormValues {
  [key: string]: string;
}

interface ValidationRules {
  [fieldName: string]: (value: string) => string | null;
}

export const useFormValidation = (
  initialValues: FormValues,
  validationRules: ValidationRules
) => {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validateField = (name: string, value: string): string | null => {
    if (validationRules[name]) {
      return validationRules[name](value);
    }
    return null;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    // Validate field on change
    const error = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string | null> = {};
    let isValid = true;

    Object.keys(validationRules).forEach((field) => {
      const error = validateField(field, values[field] || '');
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  };

  return {
    values,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    validateForm,
    resetForm,
  };
};
