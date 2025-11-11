// AI Chat component

import React, { useState, useRef, useEffect } from 'react';
import {
  Drawer,
  Box,
  TextField,
  IconButton,
  Typography,
  Paper,
  CircularProgress,
  Fab,
} from '@mui/material';
import {
  Send,
  Close,
  Chat as ChatIcon,
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import { useAIChat } from '../../hooks/useAIChat';
import { useUIStore } from '../../store/uiStore';
import type { ChatMessage } from '../../types';

export const AIChat: React.FC = () => {
  const { chatOpen, toggleChat, setChatOpen } = useUIStore();
  const { mutate: sendMessage, isPending } = useAIChat();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isPending) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');

    sendMessage(
      { message: currentInput },
      {
        onSuccess: (response) => {
          const aiMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: response.response,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, aiMessage]);
        },
        onError: () => {
          const errorMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'Sorry, I encountered an error. Please try again.',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        },
      }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
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
        aria-label="chat"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
        onClick={toggleChat}
      >
        <ChatIcon />
      </Fab>

      {/* Chat Drawer */}
      <Drawer
        anchor="right"
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400 }, p: 2 },
        }}
      >
        <Box display="flex" flexDirection="column" height="100%">
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">AI Assistant</Typography>
            <IconButton onClick={() => setChatOpen(false)}>
              <Close />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box flex={1} overflow="auto" mb={2}>
            {messages.length === 0 ? (
              <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
                Ask me anything about your time entries!
              </Typography>
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
                      bgcolor: message.role === 'user' ? 'primary.main' : 'grey.100',
                      color: message.role === 'user' ? 'white' : 'text.primary',
                    }}
                  >
                    {message.role === 'assistant' ? (
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    ) : (
                      <Typography>{message.content}</Typography>
                    )}
                  </Paper>
                </Box>
              ))
            )}
            {isPending && (
              <Box display="flex" justifyContent="flex-start" mb={2}>
                <Paper sx={{ p: 2 }}>
                  <CircularProgress size={20} />
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input */}
          <Box display="flex" gap={1}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isPending}
            />
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={!input.trim() || isPending}
            >
              <Send />
            </IconButton>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};
