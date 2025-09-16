import Alert from "@mui/material/Alert";
import Snackbar, { type SnackbarCloseReason } from "@mui/material/Snackbar";

interface SnackbarProps {
  open: boolean;
  setAlert: (state: boolean) => void;
}

function SnackbarAlert({ open, setAlert }: SnackbarProps) {
  const handleClose = (_: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason == "clickaway") return;
    setAlert(false);
  };

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      autoHideDuration={1000}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: "100%" }}>
        Report Saved
      </Alert>
    </Snackbar>
  );
}

export default SnackbarAlert;
