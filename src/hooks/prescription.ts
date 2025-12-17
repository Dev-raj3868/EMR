
export interface Patient {
  id: string;
  name: string;
  phone: string;
  age: number | null;
  gender: string;
  address: string | null;
  bloodGroup: string | null;
  medicalHistory: string | null;
  createdAt: string;
}

//  patient info saved with prescription
export interface PatientSnapshot {
  name: string;
  phone: string;
  age: number | null;
  gender: string;
  address?: string | null;
  bloodGroup?: string | null;
  medicalHistory?: string | null;
}

// Doctor information for prescription header
export interface DoctorInfo {
  name?: string;
  qualification?: string;
  clinic?: string;
  address?: string;
  phone?: string;
  signatureUrl?: string | null;
}

// Vital signs entry
export interface Vital {
  name: string;
  result: string;
  unit: string;
}

// Diagnosis/Test entry
export interface DiagnosisItem {
  text: string;
}

// Complaint entry
export interface ComplaintItem {
  text: string;
}

// Test entry
export interface TestItem {
  testName: string;
  testType: string;
  advice: string;
}

// Medicine entry 
export interface MedicineItem {
  medicineName: string;
  medicineType: string;
  dose: string;
  doseUnit: string;
  advice: string;
  time: string;
  duration: string;
  durationUnit: string;
}

// Follow-up information
export interface FollowUp {
  required: boolean;
  // date: string;
    month: string;

  time: string;
  notes: string;
}

// Complete prescription data structure
export interface Prescription {
  id: string;
  patientId: string;
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
  createdAt: string;
  updatedAt: string;
}

// Chronic disease options
export const CHRONIC_DISEASE_OPTIONS = [
  "Hypertension",
  "Diabetes",
  "Heart Failure",
  "Type 2 DM",
  "Dyslipidemia",
  "Smoking",
  "Family History",
  "Asthma",
  "Migraine",
  "Arthritis",
] as const;

// Vital options
export const VITAL_OPTIONS = [
  "Blood Pressure",
  "Heart Rate",
  "Pulse Rate",
  "Respiratory Rate",
  "Pulse Pressure",
  "Oxygen Saturation",
  "Pulse Rhythm",
  "SpO2",
  "Blood Glucose Levels",
  "Height",
  "Weight",
  "GCS",
  "Temperature",
  "Capnography",
  "Skin Color",
] as const;

// Medicine type options
export const MEDICINE_TYPES = [
  "Tablet",
  "Capsule",
  "Syrup",
  "Injection",
  "Cream",
  "Ointment",
  "Drops",
  "Suspension",
  "Inhaler",
  "Powder",
  "Gel",
  "Solution",
  "Spray",
] as const;

// Duration unit options
export const DOSE_FREQUENCIES = [
  "1-1-1",
  "1-1-0",
  "1-0-1",
  "1-0-0",
  "0-1-1",
  "0-1-0",
  "0-0-1",
  "4-T",
  "Q-1-H",
  "Q-2-H",
  "Q-3-H",
  "Q-4-H",
  "Q-6-H",
  "Q-8-H",
  "Q-12-H",
  "SOS",
] as const;


// Dose unit options
export const DOSE_UNITS = ["mg", "ml", "g", "units", "puffs"] as const;

// Blood group options
export const BLOOD_GROUP_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

// Gender options
export const GENDER_OPTIONS = ["Male", "Female", "Other"] as const;


// Timing options
export const TIMING_OPTIONS = ["After Meal","Before Meal","Before Breakfast","Before Meal","Before Dinner",
  "Before Lunch","After Lunch","Bedtime","Fasting"] as const;