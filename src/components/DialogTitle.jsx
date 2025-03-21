import { Box, DialogTitle, IconButton } from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';

const StyledDialogTitle = ({
  children,
  onClose,
  hideCloseButton = false,
  customElement = null,
  ...other
}) => {
  return (
    <DialogTitle
      sx={{
        mr: 1,
        ml: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
      }}
      {...other}
    >
      {children}
      <Box sx={{ flex: '1 1 auto' }} />
      {customElement}
      {!hideCloseButton && (
        <IconButton
          aria-label="close"
          onClick={onClose}
          edge="end"
          sx={{ color: theme => theme.palette.text.secondary }}
        >
          <CloseOutlined />
        </IconButton>
      )}
    </DialogTitle>
  );
};

export default StyledDialogTitle;
