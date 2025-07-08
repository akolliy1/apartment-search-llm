import { Alert, AlertDescription, AlertTitle } from './ui/alert.jsx';
import { Button } from './ui/button.jsx';
import { AlertCircle, X } from 'lucide-react';

const ErrorAlert = ({ error, onDismiss }) => {
  if (!error) return null;

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="flex items-center justify-between">
        Search Error
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="h-auto p-0 text-destructive hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </AlertTitle>
      <AlertDescription>
        {error}
      </AlertDescription>
    </Alert>
  );
};

export default ErrorAlert;

