import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { StudyProvider } from "@/context/StudyContext";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <UserProvider>
      <StudyProvider>
        <SimpleEditor />
      </StudyProvider>
    </UserProvider>
  );
}

export default App;
