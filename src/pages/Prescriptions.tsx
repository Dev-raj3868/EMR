import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Plus, Printer, Edit } from "lucide-react";
import PrescriptionPrint from "@/components/PrescriptionPrint";
import { useReactToPrint } from 'react-to-print';

interface Patient {
  id: string;
  full_name: string;
  phone: string;
  age: number;
  gender: string;
}

interface Prescription {
  id: string;
  diagnosis: string;
  medications: string;
  instructions: string | null;
  created_at: string;
  patients: {
    full_name: string;
  };
}

const Prescriptions = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("patient-info");
  const printRef = useRef<HTMLDivElement>(null);
  
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

    const { data: prescriptionsData } = await supabase
      .from("prescriptions")
      .select("*, patients(full_name)")
      .eq("doctor_id", user.id)
      .order("created_at", { ascending: false });

    setPatients(patientsData || []);
    setPrescriptions(prescriptionsData || []);
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
      setIsDialogOpen(false);
      resetForm();
      fetchData();
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Prescriptions</h1>
            <p className="text-muted-foreground">Manage patient prescriptions</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Add Prescription
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Add New Prescription</span>
                  <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>
                </DialogTitle>
              </DialogHeader>

              {/* Hidden print component */}
              <div style={{ display: 'none' }}>
                <div ref={printRef}>
                  <PrescriptionPrint prescriptionData={formData} />
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="patient-info">Patient Info</TabsTrigger>
                    <TabsTrigger value="diagnosis">Diagnosis & Tests</TabsTrigger>
                    <TabsTrigger value="medications">Medications</TabsTrigger>
                  </TabsList>

                <TabsContent value="patient-info" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Patient Name *</Label>
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
                        <SelectTrigger>
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
                      <Label>Phone Number</Label>
                      <Input value={formData.phone} readOnly />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Patient Gender</Label>
                      <Select value={formData.gender} disabled>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Patient Age</Label>
                      <Input type="number" value={formData.age} readOnly />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Complaints</Label>
                    <Textarea
                      value={formData.complaints}
                      onChange={(e) => setFormData({ ...formData, complaints: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Chronic Disease</Label>
                    <div className="grid grid-cols-2 gap-3 bg-blue-50 p-4 rounded-md">
                      {Object.keys(formData.chronic_diseases).map((key) => (
                        <div key={key} className="flex items-center gap-2">
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
                          <Label className="capitalize">{key.replace(/_/g, " ")}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="diagnosis" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Clinical Notes</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Select value={formData.vitals_name} onValueChange={(value) => setFormData({ ...formData, vitals_name: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Vitals name" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bp">Blood Pressure</SelectItem>
                          <SelectItem value="temp">Temperature</SelectItem>
                          <SelectItem value="pulse">Pulse</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Result"
                        value={formData.vitals_result}
                        onChange={(e) => setFormData({ ...formData, vitals_result: e.target.value })}
                      />
                      <Button variant="outline" size="sm">+</Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Diagnosis *</Label>
                    <Textarea
                      value={formData.diagnosis}
                      onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Test</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        placeholder="Test name"
                        value={formData.test_name}
                        onChange={(e) => setFormData({ ...formData, test_name: e.target.value })}
                      />
                      <Input
                        placeholder="Message"
                        value={formData.test_message}
                        onChange={(e) => setFormData({ ...formData, test_message: e.target.value })}
                      />
                      <Button variant="outline" size="sm">+</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="medications" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Medicine</Label>
                    <div className="grid grid-cols-7 gap-2">
                      <Input
                        placeholder="Medicine name"
                        value={formData.medicine_name}
                        onChange={(e) => setFormData({ ...formData, medicine_name: e.target.value })}
                      />
                      <Input
                        placeholder="Dose"
                        value={formData.dose}
                        onChange={(e) => setFormData({ ...formData, dose: e.target.value })}
                      />
                      <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tablet">Tablet</SelectItem>
                          <SelectItem value="syrup">Syrup</SelectItem>
                          <SelectItem value="injection">Injection</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={formData.timing} onValueChange={(value) => setFormData({ ...formData, timing: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Timing" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning</SelectItem>
                          <SelectItem value="afternoon">Afternoon</SelectItem>
                          <SelectItem value="evening">Evening</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3days">3 days</SelectItem>
                          <SelectItem value="7days">7 days</SelectItem>
                          <SelectItem value="14days">14 days</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={formData.frequency} onValueChange={(value) => setFormData({ ...formData, frequency: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="once">Once</SelectItem>
                          <SelectItem value="twice">Twice</SelectItem>
                          <SelectItem value="thrice">Thrice</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Instructions"
                        value={formData.instructions}
                        onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>General Advice</Label>
                    <Textarea
                      value={formData.general_advice}
                      onChange={(e) => setFormData({ ...formData, general_advice: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Referral</Label>
                      <Input
                        placeholder="Name of any Doctor or Hospital"
                        value={formData.referral}
                        onChange={(e) => setFormData({ ...formData, referral: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Follow up</Label>
                      <Input
                        type="date"
                        value={formData.follow_up}
                        onChange={(e) => setFormData({ ...formData, follow_up: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Surgery Advice</Label>
                    <Textarea
                      value={formData.surgery_advice}
                      onChange={(e) => setFormData({ ...formData, surgery_advice: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <Button type="button" onClick={handleSubmit} className="w-full">Done</Button>
                </TabsContent>
              </Tabs>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Prescription History</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading...</p>
            ) : prescriptions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No prescriptions found. Add your first prescription!</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead>Medications</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prescriptions.map((prescription) => (
                    <TableRow key={prescription.id}>
                      <TableCell className="font-medium">{prescription.patients.full_name}</TableCell>
                      <TableCell>{prescription.diagnosis}</TableCell>
                      <TableCell>{prescription.medications}</TableCell>
                      <TableCell>{new Date(prescription.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Printer className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Prescriptions;
