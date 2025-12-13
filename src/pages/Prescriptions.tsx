import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Plus, Printer } from "lucide-react";
import PrescriptionPrint from "@/components/PrescriptionPrint";
import { useReactToPrint } from 'react-to-print';

interface Patient {
  id: string;
  full_name: string;
  phone: string;
  age: number;
  gender: string;
}

const Prescriptions = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  const [showDoctorInfo, setShowDoctorInfo] = useState(false);
  const [showPatientInfo, setShowPatientInfo] = useState(false);
  const [showBottomInfo, setShowBottomInfo] = useState(false);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  const [formData, setFormData] = useState({
    patient_id: "",
    patient_name: "",
    phone: "",
    age: 0,
    gender: "",
    complaints: "",
    chronic_diseases: {
      hypertension: false,
      diabetes: false,
      heart_failure: false,
      type2dm: false,
      dyslipidemia: false,
      smoking: false,
      family_history: false,
      asthma: false,
      migraine: false,
      arthritis: false,
    },
    vitals_name: "",
    vitals_result: "",
    diagnosis: "",
    test_name: "",
    test_message: "",
    medicine_name: "",
    dose: "",
    type: "",
    timing: "",
    d_unit: "",
    duration: "",
    frequency: "",
    instructions: "",
    general_advice: "",
    referral: "",
    follow_up: "",
    follow_up_time: "",
    surgery_advice: "",
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setIsLoading(true);

    const { data: patientsData } = await supabase
      .from("patients")
      .select("id, full_name, phone, age, gender")
      .eq("doctor_id", user.id);

    setPatients(patientsData || []);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    const { error } = await supabase.from("prescriptions").insert({
      doctor_id: user.id,
      patient_id: formData.patient_id,
      diagnosis: formData.diagnosis,
      medications: formData.medicine_name,
      instructions: formData.general_advice || null,
    });

    if (error) {
      toast.error("Failed to add prescription");
    } else {
      toast.success("Prescription added successfully");
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      patient_id: "",
      patient_name: "",
      phone: "",
      age: 0,
      gender: "",
      complaints: "",
      chronic_diseases: {
        hypertension: false,
        diabetes: false,
        heart_failure: false,
        type2dm: false,
        dyslipidemia: false,
        smoking: false,
        family_history: false,
        asthma: false,
        migraine: false,
        arthritis: false,
      },
      vitals_name: "",
      vitals_result: "",
      diagnosis: "",
      test_name: "",
      test_message: "",
      medicine_name: "",
      dose: "",
      type: "",
      timing: "",
      d_unit: "",
      duration: "",
      frequency: "",
      instructions: "",
      general_advice: "",
      referral: "",
      follow_up: "",
      follow_up_time: "",
      surgery_advice: "",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Hidden print component */}
        <div style={{ display: 'none' }}>
          <div ref={printRef}>
            <PrescriptionPrint prescriptionData={formData} />
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            {/* Top Controls */}
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <Button
                onClick={() => handlePrint()}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-sm">doctor profile info</span>
                <Switch
                  checked={showDoctorInfo}
                  onCheckedChange={setShowDoctorInfo}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm">patient profile info</span>
                <Switch
                  checked={showPatientInfo}
                  onCheckedChange={setShowPatientInfo}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm">Bottom info</span>
                <Switch
                  checked={showBottomInfo}
                  onCheckedChange={setShowBottomInfo}
                />
              </div>
            </div>

            {/* Prescription Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Patient Info Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Patient Name</Label>
                  <Select
                    value={formData.patient_id}
                    onValueChange={(value) => {
                      const patient = patients.find(p => p.id === value);
                      if (patient) {
                        setFormData({
                          ...formData,
                          patient_id: value,
                          patient_name: patient.full_name,
                          phone: patient.phone,
                          age: patient.age,
                          gender: patient.gender,
                        });
                      }
                    }}
                  >
                    <SelectTrigger className="bg-blue-50">
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Phone number</Label>
                  <Input value={formData.phone} readOnly className="bg-blue-50" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Patient Gender</Label>
                  <Select value={formData.gender} disabled>
                    <SelectTrigger className="bg-blue-50">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Patient Age</Label>
                  <Input type="number" value={formData.age} readOnly className="bg-blue-50" />
                </div>
              </div>

              {/* Complaints */}
              <div className="space-y-2">
                <Label>Complaints</Label>
                <Textarea
                  value={formData.complaints}
                  onChange={(e) => setFormData({ ...formData, complaints: e.target.value })}
                  rows={3}
                  className="bg-blue-50"
                />
              </div>

              {/* Chronic Disease */}
              <div className="space-y-2">
                <Label>Chronic Disease</Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-blue-50 p-4 rounded-md border">
                  {Object.keys(formData.chronic_diseases).map((key) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="text-sm capitalize">{key.replace(/_/g, " ")}</span>
                      <Switch
                        checked={formData.chronic_diseases[key as keyof typeof formData.chronic_diseases]}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            chronic_diseases: {
                              ...formData.chronic_diseases,
                              [key]: checked,
                            },
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Clinical Notes */}
              <div className="space-y-2">
                <Label>Clinical Notes</Label>
                <div className="flex items-center gap-2">
                  <Select value={formData.vitals_name} onValueChange={(value) => setFormData({ ...formData, vitals_name: value })}>
                    <SelectTrigger className="w-[150px] bg-blue-50">
                      <SelectValue placeholder="Vitals name" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bp">Blood Pressure</SelectItem>
                      <SelectItem value="temp">Temperature</SelectItem>
                      <SelectItem value="pulse">Pulse</SelectItem>
                      <SelectItem value="spo2">SPO2</SelectItem>
                    </SelectContent>
                  </Select>
                  <span>Result</span>
                  <Input
                    placeholder=""
                    value={formData.vitals_result}
                    onChange={(e) => setFormData({ ...formData, vitals_result: e.target.value })}
                    className="w-[150px] bg-blue-50"
                  />
                  <Button type="button" variant="ghost" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="space-y-2">
                <Label>Diagnosis</Label>
                <Textarea
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  rows={3}
                  className="bg-blue-50"
                />
              </div>

              {/* Test */}
              <div className="space-y-2">
                <Label>Test</Label>
                <div className="flex items-center gap-2">
                  <span>Test name</span>
                  <Input
                    value={formData.test_name}
                    onChange={(e) => setFormData({ ...formData, test_name: e.target.value })}
                    className="w-[200px] bg-blue-50"
                  />
                  <span>Message</span>
                  <Input
                    value={formData.test_message}
                    onChange={(e) => setFormData({ ...formData, test_message: e.target.value })}
                    className="flex-1 bg-blue-50"
                  />
                  <Button type="button" variant="ghost" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Medicine */}
              <div className="space-y-2">
                <Label>Medicine</Label>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Medicine name</span>
                    <Input
                      value={formData.medicine_name}
                      onChange={(e) => setFormData({ ...formData, medicine_name: e.target.value })}
                      className="w-[130px] bg-blue-50"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Dose</span>
                    <Input
                      value={formData.dose}
                      onChange={(e) => setFormData({ ...formData, dose: e.target.value })}
                      className="w-[60px] bg-blue-50"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Type</span>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger className="w-[90px] bg-blue-50">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tablet">Tablet</SelectItem>
                        <SelectItem value="syrup">Syrup</SelectItem>
                        <SelectItem value="injection">Injection</SelectItem>
                        <SelectItem value="capsule">Capsule</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Timing</span>
                    <Select value={formData.timing} onValueChange={(value) => setFormData({ ...formData, timing: value })}>
                      <SelectTrigger className="w-[90px] bg-blue-50">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="before_food">Before Food</SelectItem>
                        <SelectItem value="after_food">After Food</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">D-Unit</span>
                    <Select value={formData.d_unit} onValueChange={(value) => setFormData({ ...formData, d_unit: value })}>
                      <SelectTrigger className="w-[80px] bg-blue-50">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="weeks">Weeks</SelectItem>
                        <SelectItem value="months">Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Duration</span>
                    <Select value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
                      <SelectTrigger className="w-[80px] bg-blue-50">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="7">7</SelectItem>
                        <SelectItem value="14">14</SelectItem>
                        <SelectItem value="30">30</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Frequency</span>
                    <Select value={formData.frequency} onValueChange={(value) => setFormData({ ...formData, frequency: value })}>
                      <SelectTrigger className="w-[80px] bg-blue-50">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-0-0">1-0-0</SelectItem>
                        <SelectItem value="0-1-0">0-1-0</SelectItem>
                        <SelectItem value="0-0-1">0-0-1</SelectItem>
                        <SelectItem value="1-1-0">1-1-0</SelectItem>
                        <SelectItem value="1-0-1">1-0-1</SelectItem>
                        <SelectItem value="0-1-1">0-1-1</SelectItem>
                        <SelectItem value="1-1-1">1-1-1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Instructions</span>
                    <Input
                      value={formData.instructions}
                      onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                      className="w-[120px] bg-blue-50"
                    />
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="mt-5">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* General Advice */}
              <div className="space-y-2">
                <Label>General Advice</Label>
                <Textarea
                  value={formData.general_advice}
                  onChange={(e) => setFormData({ ...formData, general_advice: e.target.value })}
                  rows={3}
                  className="bg-blue-50"
                />
              </div>

              {/* Referral and Follow up */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Referral</Label>
                  <Input
                    placeholder="Name of any Doctor or Hospital"
                    value={formData.referral}
                    onChange={(e) => setFormData({ ...formData, referral: e.target.value })}
                    className="bg-blue-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Follow up</Label>
                  <Input
                    type="date"
                    value={formData.follow_up}
                    onChange={(e) => setFormData({ ...formData, follow_up: e.target.value })}
                    className="bg-blue-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Follow up Time</Label>
                  <Input
                    type="time"
                    value={formData.follow_up_time}
                    onChange={(e) => setFormData({ ...formData, follow_up_time: e.target.value })}
                    className="bg-blue-50"
                  />
                </div>
              </div>

              {/* Surgery Advice */}
              <div className="space-y-2">
                <Label>Surgery Advice</Label>
                <Textarea
                  value={formData.surgery_advice}
                  onChange={(e) => setFormData({ ...formData, surgery_advice: e.target.value })}
                  rows={3}
                  className="bg-blue-50"
                />
              </div>

              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Done
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Prescriptions;
