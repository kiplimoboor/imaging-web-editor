import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { StudyProvider } from "@/context/StudyContext";

function App() {
  return (
    <StudyProvider>
      <SimpleEditor />
    </StudyProvider>
  );
}

export default App;
