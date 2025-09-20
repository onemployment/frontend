import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material/TextField';

interface FormFieldProps extends Omit<TextFieldProps, 'error'> {
  fieldErrors?: string[];
}

export function FormField({
  fieldErrors,
  helperText,
  ...props
}: FormFieldProps) {
  const error = Boolean(fieldErrors?.length);
  const finalHelperText = fieldErrors?.[0] || helperText;

  return (
    <TextField
      {...props}
      error={error}
      helperText={finalHelperText}
      fullWidth
      margin="normal"
    />
  );
}
