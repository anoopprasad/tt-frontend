import { useState } from 'react'
import {
  Fab,
  Drawer,
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  CircularProgress,
  Avatar,
} from '@mui/material'
import { Chat, Close, Send, SmartToy, Person } from '@mui/icons-material'
import { useMutation } from '@tanstack/react-query'
import { aiService } from '../../services/aiService'
import ReactMarkdown from 'react-markdown'

const AIChat = () => {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  const chatMutation = useMutation({
    mutationFn: (message) => aiService.sendMessage(message, messages),
    onSuccess: (response) => {
      const aiMessage = {
        role: 'assistant',
        content: response?.data?.response || 'Sorry, I could not process that.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    },
    onError: () => {
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    },
  })

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    chatMutation.mutate(input)
    setInput('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
        onClick={() => setOpen(true)}
      >
        <Chat />
      </Fab>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 400 },
            maxWidth: '100%',
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: 1,
              borderColor: 'divider',
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SmartToy />
              <Typography variant="h6" fontWeight={600}>
                AI Assistant
              </Typography>
            </Box>
            <IconButton onClick={() => setOpen(false)} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
            {messages.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  textAlign: 'center',
                  color: 'text.secondary',
                }}
              >
                <SmartToy sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
                <Typography variant="body1">
                  Ask me anything about your time tracking!
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Examples: "What did I work on last week?" or "Show me all
                  security work in Q4"
                </Typography>
              </Box>
            ) : (
              messages.map((message, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    gap: 1,
                    mb: 2,
                    flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor:
                        message.role === 'user' ? 'primary.main' : 'secondary.main',
                      width: 32,
                      height: 32,
                    }}
                  >
                    {message.role === 'user' ? (
                      <Person fontSize="small" />
                    ) : (
                      <SmartToy fontSize="small" />
                    )}
                  </Avatar>
                  <Paper
                    sx={{
                      p: 1.5,
                      maxWidth: '75%',
                      backgroundColor:
                        message.role === 'user' ? 'primary.light' : 'grey.100',
                      color: message.role === 'user' ? 'white' : 'text.primary',
                    }}
                  >
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </Paper>
                </Box>
              ))
            )}
            {chatMutation.isPending && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                  <SmartToy fontSize="small" />
                </Avatar>
                <Paper sx={{ p: 1.5, backgroundColor: 'grey.100' }}>
                  <CircularProgress size={20} />
                </Paper>
              </Box>
            )}
          </Box>

          {/* Input */}
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={chatMutation.isPending}
              />
              <IconButton
                color="primary"
                onClick={handleSend}
                disabled={!input.trim() || chatMutation.isPending}
              >
                <Send />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  )
}

export default AIChat
