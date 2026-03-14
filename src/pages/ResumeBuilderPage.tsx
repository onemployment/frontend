import { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  useUploadResumeMutation,
  useAnalyzeResumeMutation,
} from '../store/apiSlice';

export default function ResumeBuilderPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFilename, setUploadedFilename] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [uploadResume, { isLoading: isUploading }] = useUploadResumeMutation();
  const [analyzeResume, { isLoading: isAnalyzing }] = useAnalyzeResumeMutation();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setAiResponse(null);

    try {
      const result = await uploadResume(file).unwrap();
      setUploadedFilename(result.resume.originalFilename);
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCreate = async () => {
    setError(null);
    setAiResponse(null);

    try {
      const result = await analyzeResume().unwrap();
      setAiResponse(result.message);
    } catch {
      setError('Analysis failed. Please try again.');
    }
  };

  return (
    <Box sx={{ maxWidth: 680 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Resume Builder
      </Typography>

      <Box sx={{ mb: 3 }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <Button
          variant="outlined"
          onClick={handleUploadClick}
          disabled={isUploading}
          startIcon={isUploading ? <CircularProgress size={16} /> : null}
        >
          {isUploading ? 'Uploading…' : 'Upload Resume'}
        </Button>

        {uploadedFilename && (
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            {uploadedFilename} — uploaded
          </Typography>
        )}
      </Box>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          onClick={handleCreate}
          disabled={!uploadedFilename || isAnalyzing}
          startIcon={isAnalyzing ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {isAnalyzing ? 'Analyzing…' : 'Create'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {aiResponse && (
        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>
            AI said:
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {aiResponse}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
