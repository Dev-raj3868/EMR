import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { MedicineItem } from "@/hooks/prescription";
import { MEDICINE_TYPES, DOSE_UNITS, DOSE_FREQUENCIES, TIMING_OPTIONS } from "@/hooks/prescription";

interface MedicinesSectionProps {
  medicines: MedicineItem[];
  onMedicinesChange: (medicines: MedicineItem[]) => void;
}

const emptyMedicine: MedicineItem = {
  medicineName: "",
  medicineType: "",
  dose: "",
  doseUnit: "",
  advice: "",
  time: "",
  duration: "",
  durationUnit: "",
};

export function MedicinesSection({ medicines, onMedicinesChange }: MedicinesSectionProps) {
  const [draft, setDraft] = useState<MedicineItem>({ ...emptyMedicine });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const updateDraft = (field: keyof MedicineItem, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddMedicine = () => {
    if (!draft.medicineName.trim()) return;

    if (editingIndex !== null) {
      const updated = medicines.map((m, i) => (i === editingIndex ? draft : m));
      onMedicinesChange(updated);
      setEditingIndex(null);
    } else {
      onMedicinesChange([...medicines, draft]);
    }

    setDraft({ ...emptyMedicine });
  };

  const handleEdit = (index: number) => {
    setDraft({ ...medicines[index] });
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    onMedicinesChange(medicines.filter((_, i) => i !== index));
    if (editingIndex === index) setDraft({ ...emptyMedicine });
    setEditingIndex(null);
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setDraft({ ...emptyMedicine });
  };

  return (
  <div className="bg-card p-4 overflow-x-auto rounded-md">
    {/* <h3 className="font-semibold text-sm mb-3">Medicines</h3> */}

    {/* Medicine Form */}
    <div className="flex items-end gap-2 flex-wrap">

      {/* Medicine Name */}
      <div className="flex flex-col w-[140px]">
        <Label className=" font-semibold text-sm mb-3">
          Medicine Name*
        </Label>
        <Input
          value={draft.medicineName}
          onChange={(e) => updateDraft("medicineName", e.target.value)}
          className="h-8 text-sm px-2"
        />
      </div>

      {/* Type */}
      <div className="flex flex-col w-[90px]">
        <Label className=" font-semibold text-sm mb-3">
          Type
        </Label>
        <Input
          list="medicine-type-options"
          value={draft.medicineType}
          onChange={(e) => updateDraft("medicineType", e.target.value)}
          className="h-8 text-sm px-2"
        />
        <datalist id="medicine-type-options">
          {MEDICINE_TYPES.map((type) => (
            <option key={type} value={type} />
          ))}
        </datalist>
      </div>

      {/* Dose + Unit */}
      <div className="flex flex-col w-[130px]">
        <Label className=" font-semibold text-sm mb-3">
          Dose
        </Label>
        <div className="flex gap-1">
          <Input
            value={draft.dose}
            onChange={(e) => updateDraft("dose", e.target.value)}
            className="h-8 text-sm px-2 flex-1"
          />
          <Input
            list="dose-unit-options"
            value={draft.doseUnit}
            onChange={(e) => updateDraft("doseUnit", e.target.value)}
            className="h-8 text-sm px-2 w-[50px]"
          />
        </div>
        <datalist id="dose-unit-options">
          {DOSE_UNITS.map((unit) => (
            <option key={unit} value={unit} />
          ))}
        </datalist>
      </div>

      {/* Timing */}
      <div className="flex flex-col w-[110px]">
        <Label className=" font-semibold text-sm mb-3">
          Timing
        </Label>
        <Input
          list="timing-options"
          value={draft.time}
          onChange={(e) => updateDraft("time", e.target.value)}
          className="h-8 text-sm px-2"
        />
        <datalist id="timing-options">
          {TIMING_OPTIONS.map((t, i) => (
            <option key={`${t}-${i}`} value={t} />
          ))}
        </datalist>
      </div>

      {/* Duration */}
      <div className="flex flex-col w-[80px]">
        <Label className=" font-semibold text-sm mb-3">
          Days
        </Label>
        <Input
          value={draft.duration}
          onChange={(e) => updateDraft("duration", e.target.value)}
          className="h-8 text-sm px-2"
        />
      </div>

      {/* Frequency */}
      <div className="flex flex-col w-[80px]">
        <Label className=" font-semibold text-sm mb-3">
          Freq
        </Label>
        <Input
          list="dose-frequency-options"
          value={draft.durationUnit}
          onChange={(e) => updateDraft("durationUnit", e.target.value)}
          className="h-8 text-sm px-2"
        />
        <datalist id="dose-frequency-options">
          {DOSE_FREQUENCIES.map((unit) => (
            <option key={unit} value={unit} />
          ))}
        </datalist>
      </div>

      {/* Instructions */}
      <div className="flex flex-col w-[160px]">
        <Label className=" font-semibold text-sm mb-3">
          Instructions
        </Label>
        <Input
          value={draft.advice}
          onChange={(e) => updateDraft("advice", e.target.value)}
          className="h-8 text-sm px-2"
        />
      </div>

      {/* Add / Update / Cancel */}
      <div className="flex gap-2 pb-[2px]">
        <Button
          size="sm"
          onClick={handleAddMedicine}
          disabled={!draft.medicineName.trim()}
          className="h-8"
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          {editingIndex !== null ? "Update" : "Add"}
        </Button>

        {editingIndex !== null && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            className="h-8"
          >
            Cancel
          </Button>
        )}
      </div>
    </div>

    {/* Medicines List (unchanged) */}
    {medicines.length > 0 && (
      <div className="space-y-2 mt-4">
        {medicines.map((med, index) => (
          <div
            key={index}
            className="flex items-start justify-between bg-secondary p-3 rounded-md"
          >
            <div className="flex-1">
              <div className="font-medium">
                {med.medicineName}
                <span className="text-muted-foreground font-normal">
                  {" "}({med.medicineType})
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {med.dose && `${med.dose} ${med.doseUnit}`}
                {med.time && ` • ${med.time}`}
                {med.duration && ` • ${med.duration} ${med.durationUnit}`}
              </div>
              {med.advice && (
                <div className="text-sm text-muted-foreground italic mt-1">
                  {med.advice}
                </div>
              )}
            </div>
            <div className="flex gap-1 ml-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(index)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

}
