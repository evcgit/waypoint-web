import {
  Dialog,
  DialogContent,
  Button,
  DialogActions,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import StyledDialogTitle from './DialogTitle';

const Modal = ({
  open,
  onModalClose,
  modalTitle = '',
  children,
  maxWidth = 'md',
  alwaysMaxWidth = false,
  fullScreen = false,
  showDividers = false,
  hideBackdrop = false,
  disableBackdropClick = false,
  useDialogActions = false,
  showCancelButton = true,
  dialogActionButton = null,
  hideCloseButton = false,
  closeButtonName = 'Cancel',
  customTitleElement = null,
  disableEscapeKeyDown = false,
  overrideSx = {}
}) => {
  if (children === null || !children) {
    console.warn('null children in Modal? ', children, typeof children, modalTitle);
  }

  const theme = useTheme();
  const useFullScreen = useMediaQuery(theme.breakpoints.down('md')) || fullScreen;

  return (
    <Dialog
      aria-label={modalTitle}
      open={open}
      onClose={(event, reason) => {
        if (reason === 'backdropClick' && disableBackdropClick) {
          return;
        }
        onModalClose();
      }}
      fullScreen={useFullScreen}
      maxWidth={maxWidth}
      hideBackdrop={hideBackdrop}
      fullWidth={alwaysMaxWidth}
      disableEscapeKeyDown={disableEscapeKeyDown}
    >
      <StyledDialogTitle
        onClose={onModalClose}
        hideCloseButton={disableBackdropClick || hideCloseButton}
        customElement={customTitleElement}
      >
        {modalTitle}
      </StyledDialogTitle>
      <DialogContent
        dividers={showDividers}
        sx={{ ...(Object.entries(overrideSx).length && overrideSx) }}
      >
        {children}
      </DialogContent>
      {useDialogActions && (
        <DialogActions sx={{ px: 3, py: 2, justifyContent: 'flex-end' }}>
          {showCancelButton && (
            <Button onClick={onModalClose} color="primary">
              {closeButtonName}
            </Button>
          )}
          {dialogActionButton}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default Modal;
