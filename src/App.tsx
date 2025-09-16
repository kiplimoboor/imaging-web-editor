import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { StudyProvider } from "@/context/StudyContext";
import { useEffect, useState } from "react";

function App() {
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "STUDY_DATA") setPatient(event.data.payload);
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);
  return (
    <>
      <StudyProvider>
        <SimpleEditor patient={patient} />
      </StudyProvider>
    </>
  );
}

export default App;
