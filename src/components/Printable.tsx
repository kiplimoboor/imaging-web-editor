import { forwardRef } from "react";
import "../components/Printable.scss";
import Letterhead from "./Letterhead";

interface PrintableProps {
  content: string | undefined;
  patient: any;
  ref?: React.Ref<HTMLDivElement>;
}
const Printable = forwardRef<HTMLDivElement, PrintableProps>(
  ({ content, patient }, ref) => {
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
                  <td>{patient?.name}</td>
                </tr>
                <tr>
                  <td>Patient ID:</td>
                  <td>{patient?.id}</td>
                </tr>
                <tr>
                  <td>Gender:</td>
                  <td>N/A</td>
                </tr>
                <tr>
                  <td>Date of Birth:</td>
                  <td>N/A</td>
                </tr>
                <tr>
                  <td>Examination:</td>
                  <td>N/A</td>
                </tr>
                <tr>
                  <td>Examination Date:</td>
                  <td>{patient?.date}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <hr />
          <div dangerouslySetInnerHTML={{ __html: content || "" }} />
        </div>
      </>
    );
  },
);

export default Printable;
