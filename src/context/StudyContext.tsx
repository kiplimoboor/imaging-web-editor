import { createContext, useContext, useEffect, useState } from "react";

type StudyContextProps = { study: Study | null };

type Study = {
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
};

const StudyContext = createContext<StudyContextProps>({ study: null });

const useStudy = () => useContext(StudyContext);

function StudyProvider({ children }: React.PropsWithChildren) {
  const [study, setStudy] = useState<Study | null>(null);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "STUDY_DATA") setStudy(event.data.payload);
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return <StudyContext.Provider value={{ study }}>{children}</StudyContext.Provider>;
}

export { StudyProvider, useStudy };
