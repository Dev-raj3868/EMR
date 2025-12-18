import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Printer, Download, Pencil, Trash2, RotateCcw, Phone } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import Logo from "../Logo";
import html2pdf from "html2pdf.js";
import { useAuth } from "@/hooks/useAuth";
import type {
  PatientSnapshot,
  Vital,
  DiagnosisItem,
  TestItem,
  MedicineItem,
  FollowUp,
  DoctorInfo,
} from "@/hooks/prescription";

interface PrescriptionPreviewProps {
  patientSnapshot: PatientSnapshot;
  doctorInfo?: DoctorInfo;
  complaints: string;
  chronicDiseases: string[];
  // caseHistory: string;
  vitals: Vital[];
  diagnosis: DiagnosisItem[];
  tests: TestItem[];
  medicines: MedicineItem[];
  generalAdvice: string;
  surgeryAdvice: string;
  followUp: FollowUp;
  onEdit: () => void;
  onDelete: () => void;
  onReset: () => void;
  showActions?: boolean;
}

export function PrescriptionPreview({
  patientSnapshot,
  doctorInfo,
  complaints,
  chronicDiseases,
  // caseHistory,
  vitals,
  diagnosis,
  tests,
  medicines,
  generalAdvice,
  surgeryAdvice,
  followUp,
  onEdit,
  onDelete,
  onReset,
  showActions = true,
}: PrescriptionPreviewProps) {
  const printRef = useRef<HTMLDivElement>(null);
const { doctor, activeClinic } = useAuth();
  const [showDoctorInfo, setShowDoctorInfo] = useState(true);
  const [showPatientInfo, setShowPatientInfo] = useState(true);
  const [showFooter, setShowFooter] = useState(true);

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // taken from useAuth 
  const mergedDoctorInfo = {
    name: doctorInfo?.name || doctor?.name,
    qualification: doctorInfo?.qualification || doctor?.specialization,
    clinic: doctorInfo?.clinic || activeClinic?.clinic_name,
    address: doctorInfo?.address,
    phone: doctorInfo?.phone,
  };


const handlePrint = () => {
  window.print();
};

// DOWNLOAD —  PDF download
  const handleDownload = () => {
    if (!printRef.current) return;

    const element = printRef.current;

    const opt = {
      margin: 0,
      filename: "prescription.pdf",
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: "mm" as const, format: "a4" as const, orientation: "portrait" as const },
    };

    html2pdf().set(opt).from(element).save();
  };



  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
<DashboardLayout>
  <div className="space-y-4">

    {/* Action Buttons & Toggles */}
    {showActions && (
      <div className="space-y-4 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <Button onClick={onEdit} variant="outline" size="sm">
              <Pencil className="h-4 w-4 mr-1" /> Edit
            </Button>
            <Button onClick={onReset} variant="ghost" size="sm">
              <RotateCcw className="h-4 w-4 mr-1" /> New Prescription
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handlePrint} size="sm">
              <Printer className="h-4 w-4 mr-1" /> Print
            </Button>
            <Button onClick={handleDownload} variant="secondary" size="sm">
              <Download className="h-4 w-4 mr-1" /> Download
            </Button>
            <Button onClick={onDelete} variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 p-3 rounded-md border bg-card text-sm">
          <div className="flex items-center gap-2">
            <Switch id="show-doctor" checked={showDoctorInfo} onCheckedChange={setShowDoctorInfo} />
            <Label htmlFor="show-doctor">Show Doctor Info</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="show-patient" checked={showPatientInfo} onCheckedChange={setShowPatientInfo} />
            <Label htmlFor="show-patient">Show Patient Info</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="show-footer" checked={showFooter} onCheckedChange={setShowFooter} />
            <Label htmlFor="show-footer">Show Footer</Label>
          </div>
        </div>
      </div>
    )}

    {/* Prescription Preview */}
    <div
      ref={printRef}
      id="prescription-print-area"
      className="bg-white w-[21cm] mx-auto shadow-sm print:shadow-none"
      style={{ padding: "1cm" }}
    >
        <div className="flex flex-col h-full space-y-4 relative z-10">

         {/* Header: Doctor Left, Logo Center, Patient Right */}
       <header className="mb-6">
  {/* Top Row: Doctor Info + Logo */}
 <div className="flex justify-between items-start mb-2">
  {showDoctorInfo && (
    <>
      {/* Doctor Info (Left) */}
      <div className="flex flex-col gap-0.5 text-black text-sm">
        <h1 className="text-lg font-bold">
          {mergedDoctorInfo.name || "Dr. Name"}
        </h1>

        {mergedDoctorInfo.qualification && (
          <p className="font-medium">{mergedDoctorInfo.qualification}</p>
        )}

        {mergedDoctorInfo.clinic && <p>{mergedDoctorInfo.clinic}</p>}

        {mergedDoctorInfo.address && <p>{mergedDoctorInfo.address}</p>}

        <p>Phone: {mergedDoctorInfo.phone || "—"}</p>
      </div>

      {/* Logo (Right) */}
      <div className="flex flex-col items-center justify-center">
        <Logo className="w-10 h-8" />
        <span className="text-xl font-bold">
          NEXUS <span className="text-gray-400 text-sm align-middle">Rx</span>
        </span>
      </div>
    </>
  )}
</div>


  {/* Horizontal Line */}
  <hr className="border-gray-300 mb-4" />

  {/* Patient Info Section */}
  {showPatientInfo && (
    <div className="border border-gray-200 p-4 max-w-xl mx-auto rounded-sm bg-white text-center">
      <div className="flex justify-center gap-6 text-sm mb-2">
        <span className="font-medium">Patient Name: {patientSnapshot?.name || "—"}</span>
        <span className="font-medium">Age: {patientSnapshot?.age ?? "—"}</span>
        <span className="font-medium">Gender: {patientSnapshot?.gender || "—"}</span>
      </div>
      <div className="flex justify-center gap-6 text-sm">
        <span>Phone: {patientSnapshot?.phone || "—"}</span>
        <span>Date: {today}</span>
      </div>
    </div>
  )}
</header>



        {/* PATIENT HISTORY */}
        <section className="space-y-2">
          {complaints && (
            <p>
              <span className="font-semibold">Complaints:</span>{" "}
              {complaints}
            </p>
          )}

          {chronicDiseases?.length > 0 && (
            <p>
              <span className="font-semibold">Chronic Diseases:</span>{" "}
              {chronicDiseases.join(", ")}
            </p>
          )}

          {/* {caseHistory && (
            <p>
              <span className="font-semibold">Case History:</span>{" "}
              {caseHistory}
            </p>
          )} */}
        </section>

        {/* FINDINGS */}
        <section className="space-y-2">
          {vitals?.length > 0 && (
            <p>
              <span className="font-semibold">Vitals:</span>{" "}
              {vitals.map(v => `${v.name}, ${v.result} ${v.unit}`).join(" | ")}
            </p>
          )}
          
   <br></br><hr className="border-gray-300 mb-4" />
          {diagnosis?.length > 0 && (
            <p>
              <span className="font-semibold">Diagnosis:</span>{" "}
              {diagnosis.map(d => d.text).join(", ")}
            </p>
          )}
        </section>
   <br></br><hr className="border-gray-300 mb-4" />
        {/* TESTS */}
        {tests?.length > 0 && (
          <section>
            <p className="font-semibold">Tests Advised:</p>
            <ul className="list-disc list-inside">
              {tests.map((t, i) => (
                <li key={i}>
                  {t.testName}
                  {t.testType && ` (${t.testType})`}
                  {t.advice && ` — ${t.advice}`}
                </li>
              ))}
            </ul>
          </section>
        )}
   <br></br><hr className="border-gray-300 mb-4" /><br></br>
        {/* MEDICATIONS */}
        {medicines?.length > 0 && (
          <section>
            <p className="font-semibold mb-2">Medications:</p>
            <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">#</th>
                  <th className="p-2 text-left">Medicine</th>
                  <th className="p-2 text-left">Dose</th>
                  <th className="p-2 text-left">Timing</th>
                  <th className="p-2 text-left">Duration</th>
                  <th className="p-2 text-left">Instruction</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((m, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2 font-medium">
                      {m.medicineName}{" "}
                      <span className="text-xs">({m.medicineType})</span>
                    </td>
                    <td className="p-2">{m.dose} {m.doseUnit}</td>
                    <td className="p-2">{m.time || "—"}</td>
                    <td className="p-2">{m.duration}, {m.durationUnit}</td>
                    <td className="p-2">{m.advice || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
       <br></br>
        {/* ADVICE */}
        {(generalAdvice || surgeryAdvice) && (
          <section className="space-y-1">
            {generalAdvice && (
              <p>
                <span className="font-semibold">Advice:</span>{" "}
                {generalAdvice}
              </p>
            )}
  <hr className="border-gray-300 mb-4" /><br></br>
            {surgeryAdvice && (
              <p>
                <span className="font-semibold text-rose-600">Surgery Note:</span>{" "}
                {surgeryAdvice}
              </p>
            )}
          </section>
        )}

{/* FOLLOW-UP */}
{followUp?.required && (
  <section className="space-y-1">
    <p className="font-semibold">Follow-up:</p>

    {(followUp.month || followUp.time) && (
      <p>
        {followUp.month ?? ""}
        {followUp.time && ` at ${followUp.time}`}
      </p>
    )}

    {followUp.notes && (
      <p>
        <span className="font-medium">Notes:</span>{" "}
        {followUp.notes}
      </p>
    )}
  </section>
)}


        {/* FOOTER */}
        {showFooter && (
          <footer className="pt-8 flex justify-end">
            <div className="text-center">
              {doctorInfo?.signatureUrl && (
                <img src={doctorInfo.signatureUrl} className="h-14 mx-auto mb-1" />
              )}
              <div className="w-48 border-b-2 mx-auto"></div>
              <p className="text-sm font-medium mt-1">Doctor’s Signature</p>
              <p className="text-xs">{doctorInfo?.name || "Doctor Name"}</p>
            </div>
          </footer>
        )}
      </div>
    </div>
  </div>
</DashboardLayout>





  );
}
