import { decodeJwt } from "jose";
import { createContext, useContext, useEffect, useState } from "react";

interface StudyContextProps {
  user: User | null;
  study: Study | null;
}

interface User {
  id: number;
}

interface Study {
  patient_id: string;
  dicom_uid: string;
  note: string | null;
}

const StudyContext = createContext<StudyContextProps>({ user: null, study: null });

const useStudy = () => useContext(StudyContext);

function StudyProvider({ children }: React.PropsWithChildren) {
  const [study, setStudy] = useState<Study | null>(null);

  const token = localStorage.getItem("token");
  if (token == null) return;
  const user: User = decodeJwt(token);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "STUDY_DATA") setStudy(event.data.payload);
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return <StudyContext.Provider value={{ user, study }}>{children}</StudyContext.Provider>;
}

export { StudyProvider, useStudy };
