import { useState, useRef, useEffect } from 'react'
import {
  Fab,
  Drawer,
  Box,
  TextField,
  IconButton,
  Typography,
  Paper,
  List,
  ListItem,
  CircularProgress,
} from '@mui/material'
import {
  Send as SendIcon,
  Close as CloseIcon,
  SmartToy as SmartToyIcon,
} from '@mui/icons-material'
import ReactMarkdown from 'react-markdown'
import { useMutation } from '@tanstack/react-query'
import { aiService } from '../services/aiService'

export default function AIChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  const chatMutation = useMutation({
    mutationFn: (message) => aiService.sendChatMessage(message),
    onSuccess: (response, variables) => {
      const aiResponse = response.data?.response || response.response || 'I received your message.'
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: variables },
        { role: 'assistant', content: aiResponse },
      ])
      setInput('')
    },
    onError: (error) => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Error: ${error.response?.data?.error?.message || 'Failed to get response'}`,
        },
      ])
    },
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim() || chatMutation.isPending) return

    setMessages((prev) => [...prev, { role: 'user', content: input }])
    chatMutation.mutate(input)
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
        aria-label="AI Chat"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
        onClick={() => setOpen(true)}
      >
        <SmartToyIcon />
      </Fab>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400 }, maxWidth: '100%' },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box
            sx={{
              p: 2,
              borderBottom: 1,
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SmartToyIcon color="primary" />
              <Typography variant="h6">AI Assistant</Typography>
            </Box>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            {messages.length === 0 ? (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <SmartToyIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  Ask me anything about your time tracking data!
                </Typography>
              </Box>
            ) : (
              <List>
                {messages.map((message, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: message.role === 'user' ? 'flex-end' : 'flex-start',
                      mb: 2,
                    }}
                  >
                    <Paper
                      sx={{
                        p: 2,
                        maxWidth: '80%',
                        backgroundColor: message.role === 'user' ? 'primary.main' : 'grey.100',
                        color: message.role === 'user' ? 'white' : 'text.primary',
                      }}
                    >
                      {message.role === 'assistant' ? (
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      ) : (
                        <Typography>{message.content}</Typography>
                      )}
                    </Paper>
                  </ListItem>
                ))}
                {chatMutation.isPending && (
                  <ListItem>
                    <CircularProgress size={24} />
                  </ListItem>
                )}
                <div ref={messagesEndRef} />
              </List>
            )}
          </Box>

          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Ask a question..."
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
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  )
}
