import { Alert, AlertTitle, Box } from '@mui/material';

export const ErrorMessage = ({ title = 'Error', message, onRetry }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Alert severity="error" action={onRetry}>
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Box>
  );
};
