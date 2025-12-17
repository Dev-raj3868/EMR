// import { useState, useEffect, useRef } from "react";
// import DashboardLayout from "@/components/DashboardLayout";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
// import { supabase } from "@/integrations/supabase/client";
// import { useAuth } from "@/hooks/useAuth";
// import { toast } from "sonner";
// import { Plus, Printer, Search } from "lucide-react";
// import PrescriptionPrint from "@/components/PrescriptionPrint";
// import { useReactToPrint } from 'react-to-print';

// interface Patient {
//   id: string;
//   full_name: string;
//   phone: string;
//   age: number;
//   gender: string;
//   address?: string;
// }

// const Prescriptions = () => {
//   const { user } = useAuth();
//   const [patients, setPatients] = useState<Patient[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const printRef = useRef<HTMLDivElement>(null);

//   const [showDoctorInfo, setShowDoctorInfo] = useState(false);
//   const [showPatientInfo, setShowPatientInfo] = useState(false);
//   const [showBottomInfo, setShowBottomInfo] = useState(false);
  
//   // Patient mode: 'new' or 'existing'
//   const [patientMode, setPatientMode] = useState<'new' | 'existing'>('existing');
//   const [phoneSearch, setPhoneSearch] = useState("");
//   const [isSearching, setIsSearching] = useState(false);
//   const [searchSuggestions, setSearchSuggestions] = useState<Patient[]>([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [newPatientData, setNewPatientData] = useState({
//     full_name: "",
//     phone: "",
//     age: "",
//     gender: "",
//     address: "",
//   });

//   const handlePrint = useReactToPrint({
//     contentRef: printRef,
//   });

//   const [formData, setFormData] = useState({
//     patient_id: "",
//     patient_name: "",
//     phone: "",
//     age: 0,
//     gender: "",
//     complaints: "",
//     chronic_diseases: {
//       hypertension: false,
//       diabetes: false,
//       heart_failure: false,
//       type2dm: false,
//       dyslipidemia: false,
//       smoking: false,
//       family_history: false,
//       asthma: false,
//       migraine: false,
//       arthritis: false,
//     },
//     vitals_name: "",
//     vitals_result: "",
//     diagnosis: "",
//     test_name: "",
//     test_message: "",
//     medicine_name: "",
//     dose: "",
//     type: "",
//     timing: "",
//     d_unit: "",
//     duration: "",
//     frequency: "",
//     instructions: "",
//     general_advice: "",
//     referral: "",
//     follow_up: "",
//     follow_up_time: "",
//     surgery_advice: "",
//   });

//   useEffect(() => {
//     fetchData();
//   }, [user]);

//   const fetchData = async () => {
//     if (!user) return;
//     setIsLoading(true);

//     const { data: patientsData } = await supabase
//       .from("patients")
//       .select("id, full_name, phone, age, gender")
//       .eq("doctor_id", user.id);

//     setPatients(patientsData || []);
//     setIsLoading(false);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!user) return;

//     const { error } = await supabase.from("prescriptions").insert({
//       doctor_id: user.id,
//       patient_id: formData.patient_id,
//       diagnosis: formData.diagnosis,
//       medications: formData.medicine_name,
//       instructions: formData.general_advice || null,
//     });

//     if (error) {
//       toast.error("Failed to add prescription");
//     } else {
//       toast.success("Prescription added successfully");
//       resetForm();
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       patient_id: "",
//       patient_name: "",
//       phone: "",
//       age: 0,
//       gender: "",
//       complaints: "",
//       chronic_diseases: {
//         hypertension: false,
//         diabetes: false,
//         heart_failure: false,
//         type2dm: false,
//         dyslipidemia: false,
//         smoking: false,
//         family_history: false,
//         asthma: false,
//         migraine: false,
//         arthritis: false,
//       },
//       vitals_name: "",
//       vitals_result: "",
//       diagnosis: "",
//       test_name: "",
//       test_message: "",
//       medicine_name: "",
//       dose: "",
//       type: "",
//       timing: "",
//       d_unit: "",
//       duration: "",
//       frequency: "",
//       instructions: "",
//       general_advice: "",
//       referral: "",
//       follow_up: "",
//       follow_up_time: "",
//       surgery_advice: "",
//     });
//     setNewPatientData({
//       full_name: "",
//       phone: "",
//       age: "",
//       gender: "",
//       address: "",
//     });
//     setPhoneSearch("");
//   };

//   // Search patient suggestions by phone number
//   const searchPatientSuggestions = async (searchValue: string) => {
//     if (!searchValue.trim() || !user) {
//       setSearchSuggestions([]);
//       setShowSuggestions(false);
//       return;
//     }
    
//     setIsSearching(true);
//     const { data, error } = await supabase
//       .from("patients")
//       .select("id, full_name, phone, age, gender, address")
//       .eq("doctor_id", user.id)
//       .ilike("phone", `%${searchValue.trim()}%`)
//       .limit(5);
    
//     setIsSearching(false);
    
//     if (error) {
//       return;
//     }
    
//     setSearchSuggestions(data || []);
//     setShowSuggestions((data || []).length > 0);
//   };

//   // Select patient from suggestions
//   const selectPatient = (patient: Patient) => {
//     setFormData({
//       ...formData,
//       patient_id: patient.id,
//       patient_name: patient.full_name,
//       phone: patient.phone,
//       age: patient.age,
//       gender: patient.gender,
//     });
//     setPhoneSearch(patient.phone);
//     setShowSuggestions(false);
//     toast.success("Patient selected!");
//   };

//   // Add new patient
//   const addNewPatient = async () => {
//     if (!user) return;
    
//     if (!newPatientData.full_name || !newPatientData.phone || !newPatientData.gender || !newPatientData.age) {
//       toast.error("Please fill all required fields");
//       return;
//     }

//     const { data, error } = await supabase
//       .from("patients")
//       .insert({
//         doctor_id: user.id,
//         full_name: newPatientData.full_name,
//         phone: newPatientData.phone,
//         age: parseInt(newPatientData.age),
//         gender: newPatientData.gender,
//         address: newPatientData.address || null,
//       })
//       .select()
//       .single();

//     if (error) {
//       toast.error("Failed to add patient");
//       return;
//     }

//     if (data) {
//       setFormData({
//         ...formData,
//         patient_id: data.id,
//         patient_name: data.full_name,
//         phone: data.phone,
//         age: data.age,
//         gender: data.gender,
//       });
//       toast.success("Patient added successfully!");
//       fetchData();
//     }
//   };

//   return (
//     <DashboardLayout>
//       <div className="space-y-6">
//         {/* Hidden print component */}
//         <div style={{ display: 'none' }}>
//           <div ref={printRef}>
//             <PrescriptionPrint prescriptionData={formData} />
//           </div>
//         </div>

//         <Card>
//           <CardContent className="p-6">
//             {/* Top Controls */}
//             <div className="flex items-center gap-4 mb-6 flex-wrap">
//               <Button
//                 onClick={() => handlePrint()}
//                 className="bg-red-500 hover:bg-red-600 text-white"
//               >
//                 <Printer className="mr-2 h-4 w-4" />
//                 Print
//               </Button>

//               <div className="flex items-center gap-2">
//                 <span className="text-sm">doctor profile info</span>
//                 <Switch
//                   checked={showDoctorInfo}
//                   onCheckedChange={setShowDoctorInfo}
//                 />
//               </div>

//               <div className="flex items-center gap-2">
//                 <span className="text-sm">patient profile info</span>
//                 <Switch
//                   checked={showPatientInfo}
//                   onCheckedChange={setShowPatientInfo}
//                 />
//               </div>

//               <div className="flex items-center gap-2">
//                 <span className="text-sm">Bottom info</span>
//                 <Switch
//                   checked={showBottomInfo}
//                   onCheckedChange={setShowBottomInfo}
//                 />
//               </div>
//             </div>

//             {/* Prescription Form */}
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Patient Information Section */}
//               <div className="space-y-4">
//                 <div className="flex items-center gap-4">
//                   <span className="font-medium text-foreground">Patient Information</span>
//                   <div className="flex items-center gap-2">
//                     <span className={`text-sm ${patientMode === 'new' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
//                       New Patient
//                     </span>
//                     <Switch
//                       checked={patientMode === 'existing'}
//                       onCheckedChange={(checked) => setPatientMode(checked ? 'existing' : 'new')}
//                       className="data-[state=checked]:bg-secondary data-[state=unchecked]:bg-muted"
//                     />
//                     <span className={`text-sm ${patientMode === 'existing' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
//                       Existing Patient
//                     </span>
//                   </div>
//                 </div>

//                 {patientMode === 'existing' ? (
//                   /* Existing Patient - Search by Phone */
//                   <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//                     <div className="space-y-1 relative">
//                       <Label className="text-sm">Phone Number<span className="text-destructive">*</span></Label>
//                       <div className="relative">
//                         <Input
//                           placeholder="Search by phone number..."
//                           value={phoneSearch}
//                           onChange={(e) => {
//                             setPhoneSearch(e.target.value);
//                             searchPatientSuggestions(e.target.value);
//                           }}
//                           onFocus={() => searchSuggestions.length > 0 && setShowSuggestions(true)}
//                           onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
//                           className="border-primary/50 focus:border-primary pr-10"
//                         />
//                         <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                       </div>
//                       {showSuggestions && searchSuggestions.length > 0 && (
//                         <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-card border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
//                           {searchSuggestions.map((patient) => (
//                             <button
//                               key={patient.id}
//                               type="button"
//                               onClick={() => selectPatient(patient)}
//                               className="w-full px-3 py-2 text-left hover:bg-muted transition-colors border-b border-border/50 last:border-0"
//                             >
//                               <div className="font-medium text-sm">{patient.full_name}</div>
//                               <div className="text-xs text-muted-foreground">{patient.phone} • {patient.age}yrs • {patient.gender}</div>
//                             </button>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                     <div className="space-y-1">
//                       <Label className="text-sm">Patient Name<span className="text-destructive">*</span></Label>
//                       <Input
//                         placeholder="Enter name"
//                         value={formData.patient_name}
//                         readOnly
//                         className="bg-muted/50"
//                       />
//                     </div>
//                     <div className="space-y-1">
//                       <Label className="text-sm">Gender<span className="text-destructive">*</span></Label>
//                       <Select value={formData.gender} disabled>
//                         <SelectTrigger className="bg-muted/50">
//                           <SelectValue placeholder="Select Gender" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="male">Male</SelectItem>
//                           <SelectItem value="female">Female</SelectItem>
//                           <SelectItem value="other">Other</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div className="space-y-1">
//                       <Label className="text-sm">Age<span className="text-destructive">*</span></Label>
//                       <Input
//                         placeholder="Age"
//                         value={formData.age || ""}
//                         readOnly
//                         className="bg-muted/50"
//                       />
//                     </div>
//                     <div className="space-y-1">
//                       <Label className="text-sm">Address<span className="text-destructive">*</span></Label>
//                       <Input
//                         placeholder="Address"
//                         value={formData.phone}
//                         readOnly
//                         className="bg-muted/50"
//                       />
//                     </div>
//                   </div>
//                 ) : (
//                   /* New Patient Form */
//                   <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//                     <div className="space-y-1">
//                       <Label className="text-sm">Phone Number<span className="text-destructive">*</span></Label>
//                       <Input
//                         placeholder="+91 XXXXX XXXXX"
//                         value={newPatientData.phone}
//                         onChange={(e) => setNewPatientData({ ...newPatientData, phone: e.target.value })}
//                         className="border-primary/50 focus:border-primary"
//                       />
//                     </div>
//                     <div className="space-y-1">
//                       <Label className="text-sm">Patient Name<span className="text-destructive">*</span></Label>
//                       <Input
//                         placeholder="Enter name"
//                         value={newPatientData.full_name}
//                         onChange={(e) => setNewPatientData({ ...newPatientData, full_name: e.target.value })}
//                       />
//                     </div>
//                     <div className="space-y-1">
//                       <Label className="text-sm">Gender<span className="text-destructive">*</span></Label>
//                       <Select
//                         value={newPatientData.gender}
//                         onValueChange={(value) => setNewPatientData({ ...newPatientData, gender: value })}
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select Gender" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="male">Male</SelectItem>
//                           <SelectItem value="female">Female</SelectItem>
//                           <SelectItem value="other">Other</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div className="space-y-1">
//                       <Label className="text-sm">Age<span className="text-destructive">*</span></Label>
//                       <Input
//                         placeholder="Age"
//                         type="number"
//                         value={newPatientData.age}
//                         onChange={(e) => setNewPatientData({ ...newPatientData, age: e.target.value })}
//                       />
//                     </div>
//                     <div className="space-y-1">
//                       <Label className="text-sm">Address<span className="text-destructive">*</span></Label>
//                       <Input
//                         placeholder="Address"
//                         value={newPatientData.address}
//                         onChange={(e) => setNewPatientData({ ...newPatientData, address: e.target.value })}
//                       />
//                     </div>
//                   </div>
//                 )}
                
//                 {patientMode === 'new' && (
//                   <Button type="button" onClick={addNewPatient} variant="outline" size="sm">
//                     Save Patient
//                   </Button>
//                 )}
//               </div>

//               {/* Complaints */}
//               <div className="space-y-2">
//                 <Label>Complaints</Label>
//                 <Textarea
//                   value={formData.complaints}
//                   onChange={(e) => setFormData({ ...formData, complaints: e.target.value })}
//                   rows={3}
//                   className="bg-blue-50"
//                 />
//               </div>

//               {/* Chronic Disease */}
//               <div className="space-y-2">
//                 <Label>Chronic Disease</Label>
//                 <div className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-blue-50 p-4 rounded-md border">
//                   {Object.keys(formData.chronic_diseases).map((key) => (
//                     <div key={key} className="flex items-center gap-2">
//                       <span className="text-sm capitalize">{key.replace(/_/g, " ")}</span>
//                       <Switch
//                         checked={formData.chronic_diseases[key as keyof typeof formData.chronic_diseases]}
//                         onCheckedChange={(checked) =>
//                           setFormData({
//                             ...formData,
//                             chronic_diseases: {
//                               ...formData.chronic_diseases,
//                               [key]: checked,
//                             },
//                           })
//                         }
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Clinical Notes */}
//               <div className="space-y-2">
//                 <Label>Clinical Notes</Label>
//                 <div className="flex items-center gap-2">
//                   <Select value={formData.vitals_name} onValueChange={(value) => setFormData({ ...formData, vitals_name: value })}>
//                     <SelectTrigger className="w-[150px] bg-blue-50">
//                       <SelectValue placeholder="Vitals name" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="bp">Blood Pressure</SelectItem>
//                       <SelectItem value="temp">Temperature</SelectItem>
//                       <SelectItem value="pulse">Pulse</SelectItem>
//                       <SelectItem value="spo2">SPO2</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <span>Result</span>
//                   <Input
//                     placeholder=""
//                     value={formData.vitals_result}
//                     onChange={(e) => setFormData({ ...formData, vitals_result: e.target.value })}
//                     className="w-[150px] bg-blue-50"
//                   />
//                   <Button type="button" variant="ghost" size="icon">
//                     <Plus className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>

//               {/* Diagnosis */}
//               <div className="space-y-2">
//                 <Label>Diagnosis</Label>
//                 <Textarea
//                   value={formData.diagnosis}
//                   onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
//                   rows={3}
//                   className="bg-blue-50"
//                 />
//               </div>

//               {/* Test */}
//               <div className="space-y-2">
//                 <Label>Test</Label>
//                 <div className="flex items-center gap-2">
//                   <span>Test name</span>
//                   <Input
//                     value={formData.test_name}
//                     onChange={(e) => setFormData({ ...formData, test_name: e.target.value })}
//                     className="w-[200px] bg-blue-50"
//                   />
//                   <span>Message</span>
//                   <Input
//                     value={formData.test_message}
//                     onChange={(e) => setFormData({ ...formData, test_message: e.target.value })}
//                     className="flex-1 bg-blue-50"
//                   />
//                   <Button type="button" variant="ghost" size="icon">
//                     <Plus className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>

//               {/* Medicine */}
//               <div className="space-y-2">
//                 <Label>Medicine</Label>
//                 <div className="flex items-center gap-2 flex-wrap">
//                   <div className="space-y-1">
//                     <span className="text-xs text-muted-foreground">Medicine name</span>
//                     <Input
//                       value={formData.medicine_name}
//                       onChange={(e) => setFormData({ ...formData, medicine_name: e.target.value })}
//                       className="w-[130px] bg-blue-50"
//                     />
//                   </div>
//                   <div className="space-y-1">
//                     <span className="text-xs text-muted-foreground">Dose</span>
//                     <Input
//                       value={formData.dose}
//                       onChange={(e) => setFormData({ ...formData, dose: e.target.value })}
//                       className="w-[60px] bg-blue-50"
//                     />
//                   </div>
//                   <div className="space-y-1">
//                     <span className="text-xs text-muted-foreground">Type</span>
//                     <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
//                       <SelectTrigger className="w-[90px] bg-blue-50">
//                         <SelectValue placeholder="Select" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="tablet">Tablet</SelectItem>
//                         <SelectItem value="syrup">Syrup</SelectItem>
//                         <SelectItem value="injection">Injection</SelectItem>
//                         <SelectItem value="capsule">Capsule</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-1">
//                     <span className="text-xs text-muted-foreground">Timing</span>
//                     <Select value={formData.timing} onValueChange={(value) => setFormData({ ...formData, timing: value })}>
//                       <SelectTrigger className="w-[90px] bg-blue-50">
//                         <SelectValue placeholder="Select" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="before_food">Before Food</SelectItem>
//                         <SelectItem value="after_food">After Food</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-1">
//                     <span className="text-xs text-muted-foreground">D-Unit</span>
//                     <Select value={formData.d_unit} onValueChange={(value) => setFormData({ ...formData, d_unit: value })}>
//                       <SelectTrigger className="w-[80px] bg-blue-50">
//                         <SelectValue placeholder="Select" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="days">Days</SelectItem>
//                         <SelectItem value="weeks">Weeks</SelectItem>
//                         <SelectItem value="months">Months</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-1">
//                     <span className="text-xs text-muted-foreground">Duration</span>
//                     <Select value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
//                       <SelectTrigger className="w-[80px] bg-blue-50">
//                         <SelectValue placeholder="Select" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="3">3</SelectItem>
//                         <SelectItem value="5">5</SelectItem>
//                         <SelectItem value="7">7</SelectItem>
//                         <SelectItem value="14">14</SelectItem>
//                         <SelectItem value="30">30</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-1">
//                     <span className="text-xs text-muted-foreground">Frequency</span>
//                     <Select value={formData.frequency} onValueChange={(value) => setFormData({ ...formData, frequency: value })}>
//                       <SelectTrigger className="w-[80px] bg-blue-50">
//                         <SelectValue placeholder="Select" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="1-0-0">1-0-0</SelectItem>
//                         <SelectItem value="0-1-0">0-1-0</SelectItem>
//                         <SelectItem value="0-0-1">0-0-1</SelectItem>
//                         <SelectItem value="1-1-0">1-1-0</SelectItem>
//                         <SelectItem value="1-0-1">1-0-1</SelectItem>
//                         <SelectItem value="0-1-1">0-1-1</SelectItem>
//                         <SelectItem value="1-1-1">1-1-1</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-1">
//                     <span className="text-xs text-muted-foreground">Instructions</span>
//                     <Input
//                       value={formData.instructions}
//                       onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
//                       className="w-[120px] bg-blue-50"
//                     />
//                   </div>
//                   <Button type="button" variant="ghost" size="icon" className="mt-5">
//                     <Plus className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>

//               {/* General Advice */}
//               <div className="space-y-2">
//                 <Label>General Advice</Label>
//                 <Textarea
//                   value={formData.general_advice}
//                   onChange={(e) => setFormData({ ...formData, general_advice: e.target.value })}
//                   rows={3}
//                   className="bg-blue-50"
//                 />
//               </div>

//               {/* Referral and Follow up */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="space-y-2">
//                   <Label>Referral</Label>
//                   <Input
//                     placeholder="Name of any Doctor or Hospital"
//                     value={formData.referral}
//                     onChange={(e) => setFormData({ ...formData, referral: e.target.value })}
//                     className="bg-blue-50"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Follow up</Label>
//                   <Input
//                     type="date"
//                     value={formData.follow_up}
//                     onChange={(e) => setFormData({ ...formData, follow_up: e.target.value })}
//                     className="bg-blue-50"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Follow up Time</Label>
//                   <Input
//                     type="time"
//                     value={formData.follow_up_time}
//                     onChange={(e) => setFormData({ ...formData, follow_up_time: e.target.value })}
//                     className="bg-blue-50"
//                   />
//                 </div>
//               </div>

//               {/* Surgery Advice */}
//               <div className="space-y-2">
//                 <Label>Surgery Advice</Label>
//                 <Textarea
//                   value={formData.surgery_advice}
//                   onChange={(e) => setFormData({ ...formData, surgery_advice: e.target.value })}
//                   rows={3}
//                   className="bg-blue-50"
//                 />
//               </div>

//               <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
//                 Done
//               </Button>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default Prescriptions;




import { useState, useEffect, useCallback } from "react";
import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PatientSection } from "@/components/prescriptionfolder/PatientSection";
import { VitalsSection } from "@/components/prescriptionfolder/VitalsSection";
import { MedicinesSection } from "@/components/prescriptionfolder/MedicinesSection";
import { PrescriptionPreview } from "@/components/prescriptionfolder/PrescriptionPreview";
import DashboardLayout from "@/components/DashboardLayout";


// Hooks & Types
import { usePrescriptionStorage } from "@/hooks/usePrescriptionStorage";
import type {
  PatientSnapshot,
  Vital,
  DiagnosisItem,
  TestItem,
  MedicineItem,
  FollowUp,
  Patient,
  DoctorInfo,
} from "@/hooks/prescription";
import { CHRONIC_DISEASE_OPTIONS } from "@/hooks/prescription";
import { Plus, Pencil, Trash2, Save, RotateCcw, ArrowLeft } from "lucide-react";


  // Empty state templates
const emptyPatientSnapshot: PatientSnapshot = {
  name: "",
  phone: "",
  age: null,
  gender: "",
  address: null,
  bloodGroup: null,
  medicalHistory: null,
};

const emptyFollowUp: FollowUp = {
  required: false,
  // date: "",
  month: undefined,
  time: "",
  notes: "",
};

const emptyDoctorInfo: DoctorInfo = {
  name: "",
  qualification: "",
  clinic: "",
  address: "",
  phone: "",
  signatureUrl: null,
};

// Main Prescription Page Component


export default function Prescription() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const storage = usePrescriptionStorage();

    // URL MODE CONTROL
  const prescriptionIdFromUrl = searchParams.get("id");
  const mode = searchParams.get("mode"); // "edit" | "preview"

  const isEditMode = mode === "edit";
  const isPreviewMode = mode === "preview";

  //Patient Information
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [patientSnapshot, setPatientSnapshot] = useState<PatientSnapshot>({ ...emptyPatientSnapshot });
  const [existingPatientMessage, setExistingPatientMessage] = useState("");
  const [doctorInfo, setDoctorInfo] = useState<DoctorInfo>({ ...emptyDoctorInfo });

  // Prescription Data
  const [editingPrescriptionId, setEditingPrescriptionId] = useState<string | null>(null);
  const [complaints, setComplaints] = useState("");
  const [chronicDiseases, setChronicDiseases] = useState<string[]>([]);
  // const [caseHistory, setCaseHistory] = useState("");
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [diagnosis, setDiagnosis] = useState<DiagnosisItem[]>([]);
  const [diagnosisInput, setDiagnosisInput] = useState("");
  const [editingDiagnosisIndex, setEditingDiagnosisIndex] = useState<number | null>(null);
  const [tests, setTests] = useState<TestItem[]>([]);
  const [testInput, setTestInput] = useState("");
  const [medicines, setMedicines] = useState<MedicineItem[]>([]);
  const [generalAdvice, setGeneralAdvice] = useState("");
  const [surgeryAdvice, setSurgeryAdvice] = useState("");
  const [followUp, setFollowUp] = useState<FollowUp>({ ...emptyFollowUp });

  // UI State
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    patient: true,
    complaints: true,
    chronic: true,
    // caseHistory: true,
    vitals: true,
    diagnosis: true,
    tests: true,
    medicines: true,
    advice: true,
    followup: true,
  });


  useEffect(() => {
    // Load doctor info from localStorage
    const savedDoctorInfo = storage.loadDoctorInfo();
    if (savedDoctorInfo) {
      setDoctorInfo(savedDoctorInfo);
    }

 
    const prescriptionId = searchParams.get("id");

if (prescriptionId && (isEditMode || isPreviewMode)) {
  const prescription = storage.getPrescriptionById(prescriptionId);
  if (prescription) {
    setEditingPrescriptionId(prescriptionId);
    setSelectedPatientId(prescription.patientId);
    setPatientSnapshot(prescription.patientSnapshot);
    if (prescription.doctorInfo) setDoctorInfo(prescription.doctorInfo);
    setComplaints(prescription.complaints);
    setChronicDiseases(prescription.chronicDiseases);
    // setCaseHistory(prescription.caseHistory);
    setVitals(prescription.vitals);
    setDiagnosis(prescription.diagnosis);
    setTests(prescription.tests);
    setMedicines(prescription.medicines);
    setGeneralAdvice(prescription.generalAdvice);
    setSurgeryAdvice(prescription.surgeryAdvice);
    setFollowUp(prescription.followUp);
    setExistingPatientMessage(
      isEditMode ? "Editing existing prescription" : "Previewing prescription"
    );
    return;
  }
}

    // Check for patient info from URL params (from patients page)
    const patientId = searchParams.get("patient_id");
    const patientName = searchParams.get("patient_name");
    
    if (patientId && patientName) {
      setSelectedPatientId(patientId);
      setPatientSnapshot({
        name: patientName,
        phone: searchParams.get("patient_phone") || "",
        age: searchParams.get("patient_age") ? parseInt(searchParams.get("patient_age")!, 10) : null,
        gender: searchParams.get("patient_gender") || "",
        address: null,
        bloodGroup: null,
        medicalHistory: null,
      });
      setExistingPatientMessage("Patient loaded from records");
      return;
    }


  }, [searchParams, storage.loadDraft, storage.loadDoctorInfo, storage.getPrescriptionById]);

// Auto-save draft on data changes
  useEffect(() => {
    if (isPreviewMode) return;
    
    const timer = setTimeout(() => {
      storage.saveDraft({
        patientId: selectedPatientId,
        patientSnapshot,
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
        editingPrescriptionId: editingPrescriptionId || undefined,
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    selectedPatientId,
    patientSnapshot,
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
    editingPrescriptionId,
    storage.saveDraft,
  ]);

  // Save doctor info when it changes
  useEffect(() => {
    if (doctorInfo.signatureUrl || doctorInfo.name) {
      storage.saveDoctorInfo(doctorInfo);
    }
  }, [doctorInfo, storage.saveDoctorInfo]);


//HANDLERS: Patient Management
  const handlePatientSelect = useCallback((patient: Patient) => {
    setSelectedPatientId(patient.id);
    setPatientSnapshot({
      name: patient.name,
      phone: patient.phone,
      age: patient.age,
      gender: patient.gender,
      address: patient.address,
      bloodGroup: patient.bloodGroup,
      medicalHistory: patient.medicalHistory,
    });
    setExistingPatientMessage("Patient is already present, using existing record");
  }, []);

  const handleSavePatient = useCallback(() => {
    if (!patientSnapshot.name || !patientSnapshot.phone) {
      toast.error("Please enter patient name and phone");
      return null;
    }

    const result = storage.addPatient({
      name: patientSnapshot.name,
      phone: patientSnapshot.phone,
      age: patientSnapshot.age,
      gender: patientSnapshot.gender,
      address: patientSnapshot.address || null,
      bloodGroup: patientSnapshot.bloodGroup || null,
      medicalHistory: patientSnapshot.medicalHistory || null,
    });

    setSelectedPatientId(result.patient.id);

    if (result.isNew) {
      toast.success("Patient saved successfully");
      setExistingPatientMessage("");
    } else {
      toast.info("Patient is already present, using existing record");
      setExistingPatientMessage("Patient is already present, using existing record");
    }

    return result;
  }, [patientSnapshot, storage.addPatient]);

  // HANDLERS: Chronic Diseases
  const toggleChronicDisease = useCallback((disease: string) => {
    setChronicDiseases((prev) =>
      prev.includes(disease) ? prev.filter((d) => d !== disease) : [...prev, disease]
    );
  }, []);

  // HANDLERS: Diagnosis
  const addDiagnosis = useCallback(() => {
    if (!diagnosisInput.trim()) return;

    if (editingDiagnosisIndex !== null) {
      setDiagnosis((prev) =>
        prev.map((d, i) => (i === editingDiagnosisIndex ? { text: diagnosisInput.trim() } : d))
      );
      setEditingDiagnosisIndex(null);
    } else {
      setDiagnosis((prev) => [...prev, { text: diagnosisInput.trim() }]);
    }
    setDiagnosisInput("");
  }, [diagnosisInput, editingDiagnosisIndex]);

  const editDiagnosis = useCallback((index: number) => {
    setDiagnosisInput(diagnosis[index].text);
    setEditingDiagnosisIndex(index);
  }, [diagnosis]);

  const removeDiagnosis = useCallback((index: number) => {
    setDiagnosis((prev) => prev.filter((_, i) => i !== index));
    if (editingDiagnosisIndex === index) {
      setEditingDiagnosisIndex(null);
      setDiagnosisInput("");
    }
  }, [editingDiagnosisIndex]);

  // HANDLERS: Tests 
  const addTest = useCallback(() => {
    if (!testInput.trim()) return;
    setTests((prev) => [...prev, { testName: testInput.trim(), testType: "", advice: "" }]);
    setTestInput("");
  }, [testInput]);

  const removeTest = useCallback((index: number) => {
    setTests((prev) => prev.filter((_, i) => i !== index));
  }, []);

  //HANDLERS: Follow-up 
  const updateFollowUp = useCallback((field: keyof FollowUp, value: string | boolean) => {
    setFollowUp((prev) => ({ ...prev, [field]: value }));
  }, []);

  //  HANDLERS: Save Prescription
  const handleSavePrescription = useCallback(() => {
    if (!patientSnapshot.name) {
      toast.error("Please add patient information first");
      return;
    }

    // Ensure patient is saved first
    let patientId = selectedPatientId;
    if (!patientId && patientSnapshot.name && patientSnapshot.phone) {
      const result = storage.addPatient({
        name: patientSnapshot.name,
        phone: patientSnapshot.phone,
        age: patientSnapshot.age,
        gender: patientSnapshot.gender,
        address: patientSnapshot.address || null,
        bloodGroup: patientSnapshot.bloodGroup || null,
        medicalHistory: patientSnapshot.medicalHistory || null,
      });
      patientId = result.patient.id;
      setSelectedPatientId(patientId);
    }

    // Save prescription
    const savedPrescription = storage.savePrescription(
      {
        patientId,
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
      },
      editingPrescriptionId || undefined
    );


    storage.clearDraft();

toast.success("Prescription saved successfully");


navigate(
  `/prescriptions?id=${savedPrescription.id}&mode=preview`,
  { replace: true }
);


  }, [

    selectedPatientId,
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
    editingPrescriptionId,
    storage,
  ]);

  

  const handleEdit = useCallback(() => {
  if (!prescriptionIdFromUrl) return;
  navigate(`/prescriptions?id=${prescriptionIdFromUrl}&mode=edit`);
}, [navigate, prescriptionIdFromUrl]);



  const handleReset = useCallback(() => {
  setSelectedPatientId("");
  setPatientSnapshot({ ...emptyPatientSnapshot });
  setExistingPatientMessage("");
  setEditingPrescriptionId(null);
  setComplaints("");
  setChronicDiseases([]);
  // setCaseHistory("");
  setVitals([]);
  setDiagnosis([]);
  setDiagnosisInput("");
  setTests([]);
  setTestInput("");
  setMedicines([]);
  setGeneralAdvice("");
  setSurgeryAdvice("");
  setFollowUp({ ...emptyFollowUp });

  storage.clearDraft();
  navigate("/prescriptions", { replace: true });
  toast.info("Form reset");
}, [storage, navigate]);

const handleDelete = useCallback(() => {
  if (prescriptionIdFromUrl) {
    storage.deletePrescription(prescriptionIdFromUrl);
  }
  storage.clearDraft();
  toast.success("Prescription deleted");
  handleReset();
}, [prescriptionIdFromUrl, storage, handleReset]);




  if (isPreviewMode && prescriptionIdFromUrl) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4">
        <PrescriptionPreview
          patientSnapshot={patientSnapshot}
          doctorInfo={doctorInfo}
          complaints={complaints}
          chronicDiseases={chronicDiseases}
          // caseHistory={caseHistory}
          vitals={vitals}
          diagnosis={diagnosis}
          tests={tests}
          medicines={medicines}
          generalAdvice={generalAdvice}
          surgeryAdvice={surgeryAdvice}
          followUp={followUp}
          onEdit={() =>
            navigate(`/prescriptions?id=${prescriptionIdFromUrl}&mode=edit`)
          }
          onDelete={handleDelete}
          onReset={handleReset}
        />
      </div>
    </div>
  );
}


  return (
<DashboardLayout>
  <div className="min-h-screen bg-background w-full">
    <div className="container mx-auto py-6 px-[50px]">

      {/* Header (UNCHANGED) */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {editingPrescriptionId ? "Edit Prescription" : "New Prescription"}
          </h1>
          <p className="text-muted-foreground text-sm">
            Fill in the details below and save to preview
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/details")}>
          View All Patients
        </Button>
      </div>

    

      {/* ================= MAIN WHITE CONTAINER ================= */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6 mt-6">
          {/* PATIENT SECTION (UNCHANGED) */}
      <PatientSection
        patientSnapshot={patientSnapshot}
        onPatientChange={setPatientSnapshot}
        onPatientSelect={handlePatientSelect}
        onSavePatient={handleSavePatient}
        searchPatients={storage.searchPatients}
        selectedPatientId={selectedPatientId}
        existingPatientMessage={existingPatientMessage}
        doctorInfo={doctorInfo}
        onDoctorInfoChange={setDoctorInfo}
        
      />

        {/* Complaints – Full Row */}
        <div>
          <Label>Complaints</Label>
          <Textarea
            rows={4}
           
            value={complaints}
            onChange={(e) => setComplaints(e.target.value)}
          />
        </div>

        {/* Case History – Full Row */}
        {/* <div>
          <Label>Case History</Label>
          <Textarea
            rows={4}
            className="mt-2"
            value={caseHistory}
            onChange={(e) => setCaseHistory(e.target.value)}
          />
        </div> */}

        {/* Chronic Diseases – Full Row */}
    <div>
  <Label>Chronic Diseases</Label>

 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mt-3">
  {CHRONIC_DISEASE_OPTIONS.map((disease) => {
    const active = chronicDiseases.includes(disease);

    return (
      <div key={disease} className="flex  font-semibold items-center gap-2 px-2 py-1.5">
        {/* Toggle */}
        <Switch
          checked={active}
          onCheckedChange={() => toggleChronicDisease(disease)}
          className="scale-75 "
        />

        {/* Label */}
        <span className="text-xs leading-tight text-foreground">
          {disease}
        </span>
      </div>
    );
  })}
</div>


</div>



        {/* Vitals – Single Row (No Height) */}
        <div>
          <VitalsSection vitals={vitals} onVitalsChange={setVitals} />
        </div>

        {/* Diagnosis – Full Row */}
       <div>
  <Label>Diagnosis</Label>
       
  <div className="flex gap-2 mt-2">
    <Textarea
      placeholder="Enter diagnosis..."
      value={diagnosisInput}
      onChange={(e) => setDiagnosisInput(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && addDiagnosis()}
    />
    <Button
      type="button"
      onClick={addDiagnosis}
      disabled={!diagnosisInput.trim()}
    >
      <Plus className="h-4 w-4" />
    </Button>
  </div>

  {diagnosis.length > 0 && (
    <div className="space-y-2 mt-3">
      {diagnosis.map((d, i) => (
        <div
          key={i}
          className="flex items-center justify-between bg-secondary p-2 rounded-md"
        >
          <span>{d.text}</span>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => editDiagnosis(i)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeDiagnosis(i)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

        {/* Tests – Full Row */}
<div>
  <Label className="text-sm font-medium">Tests Advised</Label>

  {/* One Row: Input (40%) + List (60%) */}
  <div className="flex items-start gap-3 mt-2">

    {/* Left – 40% Input */}
    <div className="w-[40%] flex gap-2">
      <Input
        placeholder="Enter test name..."
        value={testInput}
        onChange={(e) => setTestInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && addTest()}
        className="h-8 text-sm px-2"
      />

      <Button
        type="button"
        size="sm"
        onClick={addTest}
        disabled={!testInput.trim()}
        className="h-8"
      >
        <Plus className="h-3.5 w-3.5" />
      </Button>
    </div>

    {/* Right – 60% Output */}
    <div className="flex-1 flex flex-wrap gap-2 min-h-[34px]">

      {tests.map((t, i) => (
        <div
          key={i}
          className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-md text-sm"
        >
          <span>{t.testName}</span>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeTest(i)}
            className="h-6 w-6"
          >
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  </div>
</div>



        {/* Medicines – Full Row */}
        <div>
          <MedicinesSection
            medicines={medicines}
            onMedicinesChange={setMedicines}
          />
        </div>

        {/* General Advice (70%) + Follow-up (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">

  {/* General Advice – 70% */}
  <div className="lg:col-span-7">
    <Label>General Advice</Label>
    <Textarea
      rows={3}
      className="mt-2"
      value={generalAdvice}
      onChange={(e) => setGeneralAdvice(e.target.value)}
    />
  </div>

  {/* Follow-up – 30% */}
  <div className="lg:col-span-3">
 <div className="flex items-center gap-3">
  <Label className="text-sm font-medium">
    Follow-up
  </Label>

  <Switch
    checked={followUp.required}
    onCheckedChange={(checked) =>
      updateFollowUp("required", checked)
    }
  />
</div>



   {followUp.required && (
  <div className="mt-3 space-y-2">

    {/* Row 1: Follow-up select + Time */}
    <div className="grid grid-cols-2 gap-2">
      <Input
        list="followup-months"
        placeholder="Select follow-up"
        value={followUp.month ?? ""}
        onChange={(e) =>
          updateFollowUp("month", e.target.value as FollowUp["month"])
        }
      />

      <Input
        type="time"
        value={followUp.time ?? ""}
        onChange={(e) =>
          updateFollowUp("time", e.target.value)
        }
      />
    </div>

    {/* Row 2: Notes */}
    <Input
      placeholder="Notes..."
      value={followUp.notes ?? ""}
      onChange={(e) =>
        updateFollowUp("notes", e.target.value)
      }
    />

    {/* Datalist */}
    <datalist id="followup-months">
      <option value="1 Week" />
      <option value="15 Days" />
      <option value="1 Month" />
      <option value="2 Months" />
      <option value="3 Months" />
      <option value="6 Months" />
      <option value="January" />
      <option value="February" />
      <option value="March" />
      <option value="April" />
      <option value="May" />
      <option value="June" />
      <option value="July" />
      <option value="August" />
      <option value="September" />
      <option value="October" />
      <option value="November" />
      <option value="December" />
    </datalist>
  </div>
)}

  </div>
</div>


        {/* Surgery – Full Row */}
        <div>
          <Label>Surgery Advice</Label>
          <Textarea
            rows={3}
             className="mt-2"
            value={surgeryAdvice}
            onChange={(e) => setSurgeryAdvice(e.target.value)}
          />
        </div>
      </div>

      {/* BUTTONS (UNCHANGED) */}
      <div className="sticky bottom-4 flex justify-end gap-3 pt-4 bg-background/80 backdrop-blur-sm pb-4 px-4 border-t mt-6">
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button onClick={handleSavePrescription}>
          <Save className="h-4 w-4 mr-2" />
          Save & Preview
        </Button>
      </div>
    </div>
  </div>
</DashboardLayout>




  );

}
