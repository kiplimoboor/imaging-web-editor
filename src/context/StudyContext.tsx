import { decodeJwt } from "jose";
import { createContext, useContext, useEffect, useState } from "react";

interface StudyContextProps {
  user: User | null;
  study: Study | null;
}

interface User {
  id: number;
  full_name: string;
  canEdit: boolean;
}

interface Study {
  patient_name: string;
  patient_id: string;
  dob: string;
  gender: string;
  dicom_uid: string;
  examination: string;
  study_date: string;
  note: string | null;
  radiologist: number;
  radiologist_name: string;
}

const StudyContext = createContext<StudyContextProps>({ user: null, study: null });

const useStudy = () => useContext(StudyContext);

function StudyProvider({ children }: React.PropsWithChildren) {
  const [study, setStudy] = useState<Study | null>(null);

  // NOTE: Gets logged in user
  const token = localStorage.getItem("token");
  if (token == null) return;
  const user: User = decodeJwt(token);
  user.canEdit = false;

  //NOTE: Gets the study data
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
