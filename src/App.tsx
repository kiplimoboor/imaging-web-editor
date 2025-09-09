import { useEffect, useState } from "react";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

function App() {
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "STUDY_DATA") setPatient(event.data.payload);
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);
  return <SimpleEditor patient={patient} />;
}

export default App;
