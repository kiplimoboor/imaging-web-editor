import { useStudy } from "@/context/StudyContext";
import { forwardRef } from "react";
import "../components/Printable.scss";
import Letterhead from "./Letterhead";

interface PrintableProps {
  content: string | undefined;
  ref?: React.Ref<HTMLDivElement>;
}
const Printable = forwardRef<HTMLDivElement, PrintableProps>(({ content }, ref) => {
  const { study } = useStudy();

  return (
    <>
      <div ref={ref} className="printable-container">
        <Letterhead />
        <hr />
        <div className="patient-info">
          <table>
            <tbody>
              <tr>
                <td>Patient Name:</td>
                <td>{study?.patient_name || "Not Specified"}</td>
              </tr>
              <tr>
                <td>Patient ID:</td>
                <td>{study?.patient_id || "Not Specified"}</td>
              </tr>
              <tr>
                <td>Gender:</td>
                <td>{study?.gender || "Not Specified"}</td>
              </tr>
              <tr>
                <td>Date of Birth:</td>
                <td>{study?.dob || "Not Specified"}</td>
              </tr>
              <tr>
                <td>Examination:</td>
                <td>{study?.examination || "Not Specified"}</td>
              </tr>
              <tr>
                <td>Examination Date:</td>
                <td>{study?.study_date || "Not Specified"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <hr />

        <div dangerouslySetInnerHTML={{ __html: content || "" }} />

        <div className="signature">
          <p>{study?.radiologist_name.toUpperCase()} </p>
          <p>CONSULTANT RADIOLOGIST</p>
        </div>
      </div>
    </>
  );
});

export default Printable;
