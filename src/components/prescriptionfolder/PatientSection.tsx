import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, UserPlus, Check } from "lucide-react";
import type { Patient, PatientSnapshot, DoctorInfo } from "@/hooks/prescription";
import { GENDER_OPTIONS } from "@/hooks/prescription";

interface PatientSectionProps {
  patientSnapshot: PatientSnapshot;
  onPatientChange: (snapshot: PatientSnapshot) => void;
  onPatientSelect: (patient: Patient) => void;
  onSavePatient: () => { patient: Patient; isNew: boolean } | null;
  searchPatients: (query: string) => Patient[];
  selectedPatientId: string;
  existingPatientMessage: string;
  doctorInfo: DoctorInfo;
  onDoctorInfoChange: (info: DoctorInfo) => void;
}

export function PatientSection({
  patientSnapshot,
  onPatientChange,
  onPatientSelect,
  onSavePatient,
  searchPatients,
  selectedPatientId,
  existingPatientMessage,
  doctorInfo,
  onDoctorInfoChange,
}: PatientSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Handle search input changes
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchPatients(searchQuery);
      setSearchResults(results);
      setShowResults(results.length > 0);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery, searchPatients]);

  // Handle patient selection from search results
  const handleSelectPatient = (patient: Patient) => {
    onPatientSelect(patient);
    setSearchQuery("");
    setShowResults(false);
  };

  // Handle form field updates
  const updateField = (field: keyof PatientSnapshot, value: string | number | null) => {
    onPatientChange({ ...patientSnapshot, [field]: value });
  };

  return (
 <div className="border-hidden bg-card p-4 bg-slate-50">
  {/* Top row: 3 columns */}
  <div className="flex flex-wrap lg:flex-nowrap items-center gap-4 mb-4">
    {/* Column 1: Heading */}
    <div className="flex-1 min-w-[150px]">
      <h3 className="font-semibold text-lg">Patient Information</h3>
    </div>

    {/* Column 2: Search Bar */}
    <div className="flex-1 min-w-[200px] relative">
      <Input
        placeholder="Search existing patient (Name, Phone, ID)"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 text-sm w-full"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-48 overflow-y-auto text-sm">
          {searchResults.map((patient) => (
            <button
              key={patient.id}
              type="button"
              className="w-full text-left px-4 py-2 hover:bg-accent transition-colors text-sm"
              onClick={() => handleSelectPatient(patient)}
            >
              <div className="font-medium">{patient.name}</div>
              <div className="text-xs text-muted-foreground">
                {patient.phone} • {patient.age ? `${patient.age} yrs` : ""} • {patient.gender}
                {patient.bloodGroup && ` • ${patient.bloodGroup}`}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>

    {/* Column 3: Existing Patient Toast */}
    {existingPatientMessage && (
      <div className="flex-1 min-w-[150px] flex items-center gap-2 p-2 bg-secondary rounded-md text-xs lg:text-sm">
        <Check className="h-4 w-4 text-primary" />
        <span>{existingPatientMessage}</span>
      </div>
    )}
  </div>

  {/* Patient Fields */}
<div className="flex flex-wrap gap-4 items-start">
  {/* Column 1: Patient Info Fields (90%) */}
  <div className="flex-1 min-w-[250px] lg:w-[90%] flex flex-wrap gap-3 items-end text-xs">
    <div className="flex-1 min-w-[120px]">
      <Label className="text-xs">Full Name *</Label>
      <Input
        placeholder="Enter patient name"
        value={patientSnapshot.name}
        onChange={(e) => updateField("name", e.target.value)}
        className="text-xs h-7 py-1 px-2"
      />
    </div>

    <div className="w-20">
      <Label className="text-xs">Age *</Label>
      <Input
        type="number"
        placeholder="Age"
        value={patientSnapshot.age ?? ""}
        onChange={(e) =>
          updateField("age", e.target.value ? parseInt(e.target.value, 10) : null)
        }
        className="text-xs h-7 py-1 px-2"
      />
    </div>

    <div className="w-28">
      <Label className="text-xs">Gender *</Label>
      <Select
        value={patientSnapshot.gender}
        onValueChange={(value) => updateField("gender", value)}
      >
        <SelectTrigger className="text-xs h-7 py-1 px-2">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent className="text-xs">
          {GENDER_OPTIONS.map((gender) => (
            <SelectItem key={gender} value={gender} className="text-xs">
              {gender}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div className="w-28">
      <Label className="text-xs">Phone *</Label>
      <Input
        placeholder="Phone"
        value={patientSnapshot.phone}
        onChange={(e) => updateField("phone", e.target.value)}
        className="text-xs h-7 py-1 px-2"
      />
    </div>

    <div className="flex-1 min-w-[120px]">
      <Label className="text-xs">Address</Label>
      <Input
        placeholder="Enter address"
        value={patientSnapshot.address || ""}
        onChange={(e) => updateField("address", e.target.value || null)}
        className="text-xs h-7 py-1 px-2"
      />
    </div>
  </div>

  {/* Column 2: Save Button (10%) */}
  <div className="lg:w-[10%] flex items-start mt-2 lg:mt-0">
    {!selectedPatientId && patientSnapshot.name && patientSnapshot.phone ? (
      <Button
        type="button"
        variant="secondary"
        onClick={onSavePatient}
        className="text-xs py-1 px-2 h-8 w-auto"
      >
        <UserPlus className="h-3 w-3 mr-1" />
        Add
      </Button>
    ) : (
      <div className="h-8" />
    )}
  </div>
</div>


</div>


);

}
