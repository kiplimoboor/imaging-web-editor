import { useStudy } from "@/context/StudyContext";
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
  const { user, study } = useStudy();

  const handleChange = (newValue: string | null) => {
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
      console.log(user?.id);
      console.log(study?.dicom_uid);
      if (study && editor) study.note = editor?.getHTML();
      setAlert(true);
      return true;
    }
    return false;
  };

  const handlePrint = () => {
    if (study?.note !== editor?.getHTML()) handleSave();
    printFn();
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "12px", justifyContent: "center" }}>
      <Autocomplete
        options={Object.keys(templates)}
        onChange={(_, newValue: string | null) => handleChange(newValue)}
        disablePortal
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Choose a Template" size="small" sx={{ height: 40 }} />}
      />
      <Button startIcon={<PrintIcon />} variant="outlined" size="medium" onClick={handlePrint}>
        Print
      </Button>
      <Button startIcon={<SaveIcon />} variant="contained" size="medium" onClick={handleSave}>
        Save
      </Button>
    </div>
  );
}
export default Actions;
