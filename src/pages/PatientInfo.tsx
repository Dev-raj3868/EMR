

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Hooks & Types
import { usePrescriptionStorage } from "@/hooks/usePrescriptionStorage";
import type { Patient, Prescription } from "@/hooks/prescription";
import { Search, Plus, Eye, Pencil, Trash2, FileText, ArrowLeft, Calendar } from "lucide-react";

export default function PatientInfo() {
  const navigate = useNavigate();
  const storage = usePrescriptionStorage();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPrescriptions, setShowPrescriptions] = useState(false);
  const [deletePatientId, setDeletePatientId] = useState<string | null>(null);
  const [deletePrescriptionId, setDeletePrescriptionId] = useState<string | null>(null);

  // Get all patients
  const patients = storage.getAllPatients();

  // Filter patients based on search
  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return patients;
    const query = searchQuery.toLowerCase();
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.phone.includes(query) ||
        // (p.bloodGroup && p.bloodGroup.toLowerCase().includes(query))
        (p.address && p.address.toLowerCase().includes(query))
    );
  }, [patients, searchQuery]);

  const sortedPatients = useMemo(() => {
  return [...filteredPatients].sort((a, b) => {
    const aLatest = Math.max(
      ...storage
        .getPrescriptionsByPatientId(a.id)
        .map(p => new Date(p.createdAt).getTime()),
      0
    );

    const bLatest = Math.max(
      ...storage
        .getPrescriptionsByPatientId(b.id)
        .map(p => new Date(p.createdAt).getTime()),
      0
    );

    return bLatest - aLatest;
  });
}, [filteredPatients, storage]);


  // Get prescriptions for selected patient
  const patientPrescriptions = useMemo(() => {
    if (!selectedPatient) return [];
    return storage.getPrescriptionsByPatientId(selectedPatient.id);
  }, [selectedPatient, storage]);

  // Format date
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  // Handle view prescriptions
  const handleViewPrescriptions = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowPrescriptions(true);
  };

  // Handle new prescription for patient
  const handleNewPrescription = (patient: Patient) => {
 navigate(
  `/prescriptions?patient_id=${patient.id}&patient_name=${encodeURIComponent(
    patient.name
  )}&patient_phone=${encodeURIComponent(patient.phone)}&patient_age=${
    patient.age || ""
  }&patient_gender=${encodeURIComponent(patient.gender)}`
);

  };

  // Handle edit prescription
const handleEditPrescription = (prescriptionId: string) => {
  setShowPrescriptions(false);
  navigate(`/prescriptions?id=${prescriptionId}&mode=preview`);
};


  // Handle view prescription (read-only)
 const handleViewPrescription = (prescription: Prescription) => {
  navigate(`/prescriptions?id=${prescription.id}&mode=preview`);
};


  // Handle delete patient
  const handleDeletePatient = () => {
    if (deletePatientId) {
      storage.deletePatient(deletePatientId);
      toast.success("Patient deleted successfully");
      setDeletePatientId(null);
      if (selectedPatient?.id === deletePatientId) {
        setShowPrescriptions(false);
        setSelectedPatient(null);
      }
    }
  };

  // Handle delete prescription
  const handleDeletePrescription = () => {
    if (deletePrescriptionId) {
      storage.deletePrescription(deletePrescriptionId);
      toast.success("Prescription deleted");
      setDeletePrescriptionId(null);
    }
  };

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {/* <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/prescriptions")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Patient Records</h1>
              <p className="text-muted-foreground text-sm">
                Manage patients and their prescriptions
              </p>
            </div>
          </div> */}
          <Button onClick={() => navigate("/prescriptions")}>
            <Plus className="h-4 w-4 mr-2" />
            New Prescription
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Patients Table */}
        <Card>
          <CardHeader>
            <CardTitle>Total Registered Patients : {filteredPatients.length}</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredPatients.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No patients found</p>
                <p className="text-sm mt-1">
                  Create a new prescription to add patients
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Phone</TableHead>
                       <TableHead>Address</TableHead>
                      {/* <TableHead>Blood Group</TableHead> */}
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedPatients.map((patient) => {
                      const prescriptionCount = storage.getPrescriptionsByPatientId(patient.id).length;
                      return (
                        <TableRow key={patient.id}>
                          <TableCell className="font-medium">{patient.name}</TableCell>
                          <TableCell>{patient.age ?? "—"}</TableCell>
                          <TableCell>{patient.gender || "—"}</TableCell>
                          <TableCell>{patient.phone}</TableCell>
                           <TableCell>{patient.address || "—"}</TableCell>
                          {/* <TableCell>{patient.bloodGroup || "—"}</TableCell> */}
                          <TableCell>
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewPrescriptions(patient)}
                                title="View Prescriptions"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleNewPrescription(patient)}
                                title="New Prescription"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeletePatientId(patient.id)}
                                title="Delete Patient"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prescriptions Dialog */}
        <Dialog open={showPrescriptions} onOpenChange={setShowPrescriptions}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Prescriptions for {selectedPatient?.name}
              </DialogTitle>
              <DialogDescription>
                {patientPrescriptions.length} prescription(s) found, most recent
              </DialogDescription>
            </DialogHeader>

            {patientPrescriptions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p>No prescriptions yet</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => selectedPatient && handleNewPrescription(selectedPatient)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Prescription
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {patientPrescriptions.map((prescription) => (
                  <div
                    key={prescription.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {formatDate(prescription.createdAt)}
                      </div>
                      <div className="mt-1">
                        {prescription.complaints && (
                          <p className="text-sm truncate max-w-md">
                            <span className="font-medium">Complaint:</span>{" "}
                            {prescription.complaints.slice(0, 100)}
                            {prescription.complaints.length > 100 && "..."}
                          </p>
                        )}
                        {prescription.diagnosis.length > 0 && (
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Diagnosis:</span>{" "}
                            {prescription.diagnosis.map((d) => d.text).join(", ")}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {prescription.medicines.length} medicine(s)
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditPrescription(prescription.id)}
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {/* <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletePrescriptionId(prescription.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button> */}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowPrescriptions(false)}
              >
                Close
              </Button>
              {selectedPatient && (
                <Button onClick={() => handleNewPrescription(selectedPatient)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Prescription
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Patient Confirmation */}
        <AlertDialog open={!!deletePatientId} onOpenChange={() => setDeletePatientId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Patient?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the patient and all their prescriptions.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeletePatient}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Prescription Confirmation */}
        <AlertDialog open={!!deletePrescriptionId} onOpenChange={() => setDeletePrescriptionId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Prescription?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this prescription.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeletePrescription}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
    </DashboardLayout>
  );
}
