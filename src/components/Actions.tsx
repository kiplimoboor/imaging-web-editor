import { useStudy } from "@/context/StudyContext";
import { useUser } from "@/context/UserContext";
import templates from "@/templates/templates";
import PrintIcon from "@mui/icons-material/Print";
import SaveIcon from "@mui/icons-material/Save";
import { Autocomplete, Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Editor } from "@tiptap/react";

interface ActionsProps {
  editor: Editor | null;
  setAlert: (state: boolean) => void;
  printFn: () => void;
}
function Actions({ editor, setAlert, printFn }: ActionsProps) {
  const { study } = useStudy();
  const { user } = useUser();

  const handleChangeTemplate = (newValue: string | null) => {
    if (newValue !== null) editor?.commands.setContent(templates[newValue]);
    else editor?.commands.setContent("");
  };

  const handleSave = async () => {
    const res = await fetch("http://172.16.0.29/api/notes", {
      method: "POST",
      body: JSON.stringify({ id: study?.patient_id, uid: study?.dicom_uid, note: editor?.getHTML() }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.status === 201) {
      if (study && editor) study.note = editor?.getHTML();
      setAlert(true);
    }
  };

  const handlePrint = async () => {
    if (study?.note !== editor?.getHTML() && user?.canEdit) {
      await handleSave();
    }
    printFn();
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "12px", justifyContent: "center" }}>
      <Autocomplete
        disabled={!user?.canEdit}
        options={Object.keys(templates)}
        onChange={(_, newValue: string | null) => handleChangeTemplate(newValue)}
        disablePortal
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Choose a Template" size="small" sx={{ height: 40 }} />}
      />
      <Button startIcon={<SaveIcon />} variant="contained" size="medium" onClick={handleSave} disabled={!user?.canEdit}>
        Save
      </Button>

      <Button startIcon={<PrintIcon />} variant="outlined" size="medium" onClick={handlePrint}>
        Print
      </Button>
    </div>
  );
}
export default Actions;
