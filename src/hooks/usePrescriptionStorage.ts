

import { useState, useEffect, useCallback } from "react";
import type { Patient, Prescription } from "@/hooks/prescription";

// LocalStorage keys
const PATIENTS_KEY = "prescription_patients";
const PRESCRIPTIONS_KEY = "prescription_data";
const DRAFT_KEY = "prescription_draft";
const DOCTOR_INFO_KEY = "doctor_info";

// Generate unique ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export function usePrescriptionStorage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    try {
      const storedPatients = localStorage.getItem(PATIENTS_KEY);
      const storedPrescriptions = localStorage.getItem(PRESCRIPTIONS_KEY);
      
      if (storedPatients) {
        setPatients(JSON.parse(storedPatients));
      }
      if (storedPrescriptions) {
        setPrescriptions(JSON.parse(storedPrescriptions));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save patients to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
    }
  }, [patients, isLoaded]);

  // Save prescriptions to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(PRESCRIPTIONS_KEY, JSON.stringify(prescriptions));
    }
  }, [prescriptions, isLoaded]);

  // Get all patients
  const getAllPatients = useCallback((): Patient[] => {
    return patients;
  }, [patients]);

  // Get all prescriptions
  const getAllPrescriptions = useCallback((): Prescription[] => {
    return prescriptions;
  }, [prescriptions]);

  // Get prescriptions for a specific patient
  const getPrescriptionsByPatientId = useCallback(
    (patientId: string): Prescription[] => {
      return prescriptions
        .filter((p) => p.patientId === patientId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    [prescriptions]
  );

  // Search patients by name, phone, or id
  const searchPatients = useCallback(
    (query: string): Patient[] => {
      if (!query.trim()) return [];
      const lowerQuery = query.toLowerCase();
      return patients.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.phone.includes(query) ||
          p.id.includes(query)
      );
    },
    [patients]
  );

  // Find patient by ID
  const findPatientById = useCallback(
    (id: string): Patient | undefined => {
      return patients.find((p) => p.id === id);
    },
    [patients]
  );

  // Check if patient exists by phone
  const findPatientByPhone = useCallback(
    (phone: string): Patient | undefined => {
      return patients.find((p) => p.phone === phone);
    },
    [patients]
  );

  // Add new patient (returns existing if phone matches)
  const addPatient = useCallback(
    (patientData: Omit<Patient, "id" | "createdAt">): { patient: Patient; isNew: boolean } => {
      // Check for existing patient by phone
      const existing = findPatientByPhone(patientData.phone);
      if (existing) {
        return { patient: existing, isNew: false };
      }

      const newPatient: Patient = {
        ...patientData,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      setPatients((prev) => [...prev, newPatient]);
      return { patient: newPatient, isNew: true };
    },
    [findPatientByPhone]
  );

  // Update existing patient
  const updatePatient = useCallback(
    (id: string, patientData: Partial<Omit<Patient, "id" | "createdAt">>): Patient | null => {
      const index = patients.findIndex((p) => p.id === id);
      if (index === -1) return null;

      const updated: Patient = {
        ...patients[index],
        ...patientData,
      };
      setPatients((prev) => {
        const newList = [...prev];
        newList[index] = updated;
        return newList;
      });
      return updated;
    },
    [patients]
  );

  // Delete patient
  const deletePatient = useCallback((id: string) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
    // Also delete all prescriptions for this patient
    setPrescriptions((prev) => prev.filter((p) => p.patientId !== id));
  }, []);

  // Save prescription (always creates new, allows multiple per patient)
  const savePrescription = useCallback(
    (prescriptionData: Omit<Prescription, "id" | "createdAt" | "updatedAt">, existingId?: string): Prescription => {
      const now = new Date().toISOString();
      
      if (existingId) {
        // Update existing prescription
        const existingIndex = prescriptions.findIndex((p) => p.id === existingId);
        if (existingIndex >= 0) {
          const updated: Prescription = {
            ...prescriptions[existingIndex],
            ...prescriptionData,
            updatedAt: now,
          };
          setPrescriptions((prev) => {
            const newList = [...prev];
            newList[existingIndex] = updated;
            return newList;
          });
          return updated;
        }
      }

      // Create new prescription
      const newPrescription: Prescription = {
        ...prescriptionData,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      setPrescriptions((prev) => [...prev, newPrescription]);
      return newPrescription;
    },
    [prescriptions]
  );

  // Delete prescription by ID
  const deletePrescription = useCallback((id: string) => {
    setPrescriptions((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // Get prescription by ID
  const getPrescriptionById = useCallback(
    (id: string): Prescription | undefined => {
      return prescriptions.find((p) => p.id === id);
    },
    [prescriptions]
  );

  // Get prescription for a patient 
  const getPrescriptionByPatientId = useCallback(
    (patientId: string): Prescription | undefined => {
      return prescriptions.find((p) => p.patientId === patientId);
    },
    [prescriptions]
  );

  //  management
  const saveDraft = useCallback((data: Partial<Prescription> & { editingPrescriptionId?: string }) => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...data, savedAt: new Date().toISOString() }));
  }, []);

  const loadDraft = useCallback((): (Partial<Prescription> & { editingPrescriptionId?: string }) | null => {
    try {
      const draft = localStorage.getItem(DRAFT_KEY);
      return draft ? JSON.parse(draft) : null;
    } catch {
      return null;
    }
  }, []);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
  }, []);

  // Doctor info management
  const saveDoctorInfo = useCallback((info: object) => {
    localStorage.setItem(DOCTOR_INFO_KEY, JSON.stringify(info));
  }, []);

  const loadDoctorInfo = useCallback(() => {
    try {
      const info = localStorage.getItem(DOCTOR_INFO_KEY);
      return info ? JSON.parse(info) : null;
    } catch {
      return null;
    }
  }, []);

  return {
    patients,
    prescriptions,
    isLoaded,
    getAllPatients,
    getAllPrescriptions,
    getPrescriptionsByPatientId,
    searchPatients,
    findPatientById,
    findPatientByPhone,
    addPatient,
    updatePatient,
    deletePatient,
    savePrescription,
    deletePrescription,
    getPrescriptionById,
    getPrescriptionByPatientId,
    saveDraft,
    loadDraft,
    clearDraft,
    saveDoctorInfo,
    loadDoctorInfo,
  };
}
