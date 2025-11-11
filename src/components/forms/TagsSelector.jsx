import { FormControl, InputLabel, Select, MenuItem, Chip, Box, CircularProgress, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { tagService } from '../../services/tagService'

const TagsSelector = ({ value = [], onChange, disabled, error, helperText }) => {
  const { data: tagsData, isLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: tagService.getTags,
  })

  const tags = tagsData?.data || []

  return (
    <FormControl fullWidth error={error} disabled={disabled || isLoading}>
      <InputLabel>Tags</InputLabel>
      <Select
        multiple
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label="Tags"
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((tagId) => {
              const tag = tags.find((t) => t.id === tagId)
              return <Chip key={tagId} label={tag?.name || tagId} size="small" />
            })}
          </Box>
        )}
      >
        {isLoading ? (
          <MenuItem disabled>
            <CircularProgress size={20} />
          </MenuItem>
        ) : (
          tags.map((tag) => (
            <MenuItem key={tag.id} value={tag.id}>
              {tag.name}
            </MenuItem>
          ))
        )}
      </Select>
      {helperText && <Typography variant="caption" color="error">{helperText}</Typography>}
    </FormControl>
  )
}

export default TagsSelector
