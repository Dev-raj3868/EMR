import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Search, Eye, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface Prescription {
  id: string;
  patient_id: string;
  diagnosis: string;
  medications: string;
  instructions: string | null;
  created_at: string;
  patients: {
    id: string;
    full_name: string;
    phone: string;
  } | null;
}

const ManageRecords = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    if (user) {
      fetchPrescriptions();
    }
  }, [user]);

  useEffect(() => {
    filterPrescriptions();
  }, [searchTerm, prescriptions]);

  const fetchPrescriptions = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("prescriptions")
      .select(`
        id,
        patient_id,
        diagnosis,
        medications,
        instructions,
        created_at,
        patients (
          id,
          full_name,
          phone
        )
      `)
      .eq("doctor_id", user?.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPrescriptions(data);
      setFilteredPrescriptions(data);
    }
    setIsLoading(false);
  };

  const filterPrescriptions = () => {
    if (!searchTerm.trim()) {
      setFilteredPrescriptions(prescriptions);
      return;
    }
    
    const filtered = prescriptions.filter((p) =>
      p.patients?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.patients?.phone.includes(searchTerm) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPrescriptions(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredPrescriptions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredPrescriptions.slice(startIndex, startIndex + itemsPerPage);

  const viewPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Records</h1>
          <p className="text-muted-foreground">View and search prescription records</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Prescription Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Search Section */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name, phone or prescription ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Table */}
            {isLoading ? (
              <p className="text-center py-8 text-muted-foreground">Loading...</p>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Prescription ID</TableHead>
                        <TableHead>Patient ID</TableHead>
                        <TableHead>Patient Name</TableHead>
                        <TableHead>Phone Number</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No records found
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedData.map((prescription) => (
                          <TableRow key={prescription.id}>
                            <TableCell className="font-mono text-xs">
                              {prescription.id.slice(0, 8)}...
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {prescription.patient_id?.slice(0, 8)}...
                            </TableCell>
                            <TableCell>{prescription.patients?.full_name || "N/A"}</TableCell>
                            <TableCell>{prescription.patients?.phone || "N/A"}</TableCell>
                            <TableCell>
                              {format(new Date(prescription.created_at), "dd/MM/yyyy")}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => viewPrescription(prescription)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredPrescriptions.length)} of {filteredPrescriptions.length} records
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* View Prescription Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Prescription Details</DialogTitle>
            </DialogHeader>
            {selectedPrescription && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Prescription ID</p>
                    <p className="font-mono text-sm">{selectedPrescription.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p>{format(new Date(selectedPrescription.created_at), "dd/MM/yyyy HH:mm")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Patient Name</p>
                    <p>{selectedPrescription.patients?.full_name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p>{selectedPrescription.patients?.phone || "N/A"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Diagnosis</p>
                  <p className="bg-muted p-2 rounded">{selectedPrescription.diagnosis}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Medications</p>
                  <p className="bg-muted p-2 rounded whitespace-pre-wrap">{selectedPrescription.medications}</p>
                </div>
                {selectedPrescription.instructions && (
                  <div>
                    <p className="text-sm text-muted-foreground">Instructions</p>
                    <p className="bg-muted p-2 rounded">{selectedPrescription.instructions}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ManageRecords;
