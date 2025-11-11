import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  Fab,
  Drawer,
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import { aiAPI } from '../../api/ai';
import { useSnackbar } from 'notistack';

export const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();

  const chatMutation = useMutation({
    mutationFn: aiAPI.chat,
    onSuccess: (response) => {
      const aiMessage = {
        id: Date.now(),
        role: 'assistant',
        content: response.data?.message || 'No response',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.error?.message || 'Failed to get AI response', {
        variant: 'error',
      });
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    chatMutation.mutate(inputValue);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 64,
          height: 64,
        }}
        onClick={() => setIsOpen(true)}
      >
        <ChatIcon />
      </Fab>

      {/* Chat Drawer */}
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400 } },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              bgcolor: 'primary.main',
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ChatIcon />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                AI Assistant
              </Typography>
            </Box>
            <IconButton onClick={() => setIsOpen(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box sx={{ flex: 1, overflow: 'auto', p: 2, bgcolor: '#f5f5f5' }}>
            {messages.length === 0 ? (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="body1" color="text.secondary" paragraph>
                  👋 Hi! I'm your AI assistant.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ask me anything about your time tracking:
                </Typography>
                <Box sx={{ mt: 2, textAlign: 'left' }}>
                  <Typography variant="body2" color="text.secondary">
                    • "What did I work on last week?"
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • "Show me all security work in Q4"
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • "How many billable hours this month?"
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • "Generate a summary for my manager"
                  </Typography>
                </Box>
              </Box>
            ) : (
              messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    mb: 2,
                    display: 'flex',
                    justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      maxWidth: '80%',
                      bgcolor: message.role === 'user' ? 'primary.main' : 'white',
                      color: message.role === 'user' ? 'white' : 'text.primary',
                    }}
                  >
                    {message.role === 'assistant' ? (
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    ) : (
                      <Typography variant="body2">{message.content}</Typography>
                    )}
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        mt: 1,
                        opacity: 0.7,
                      }}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </Typography>
                  </Paper>
                </Box>
              ))
            )}
            {chatMutation.isPending && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                <Paper sx={{ p: 2 }}>
                  <CircularProgress size={20} />
                  <Typography variant="body2" sx={{ ml: 1, display: 'inline' }}>
                    Thinking...
                  </Typography>
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          <Divider />

          {/* Input */}
          <Box sx={{ p: 2, bgcolor: 'white' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                placeholder="Ask me anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={chatMutation.isPending}
              />
              <IconButton
                color="primary"
                onClick={handleSend}
                disabled={!inputValue.trim() || chatMutation.isPending}
                sx={{ alignSelf: 'flex-end' }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};
