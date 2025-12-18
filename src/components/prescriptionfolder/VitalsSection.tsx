import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Vital } from "@/hooks/prescription";
import { VITAL_OPTIONS } from "@/hooks/prescription";

interface VitalsSectionProps {
  vitals: Vital[];
  onVitalsChange: (vitals: Vital[]) => void;
}

export function VitalsSection({ vitals, onVitalsChange }: VitalsSectionProps) {
 
  const [vitalName, setVitalName] = useState("");
  const [vitalResult, setVitalResult] = useState("");
  const [vitalUnit, setVitalUnit] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Add or update vital
  const handleAddVital = () => {
    if (!vitalName.trim() || !vitalResult.trim()) return;

    const newVital: Vital = {
      name: vitalName.trim(),
      result: vitalResult.trim(),
      unit: vitalUnit.trim(),
    };

    if (editingIndex !== null) {
      const updated = vitals.map((v, i) => (i === editingIndex ? newVital : v));
      onVitalsChange(updated);
      setEditingIndex(null);
    } else {
      onVitalsChange([...vitals, newVital]);
    }

    setVitalName("");
    setVitalResult("");
    setVitalUnit("");
  };

  const handleEdit = (index: number) => {
    const vital = vitals[index];
    setVitalName(vital.name);
    setVitalResult(vital.result);
    setVitalUnit(vital.unit);
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    onVitalsChange(vitals.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setVitalName("");
      setVitalResult("");
      setVitalUnit("");
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setVitalName("");
    setVitalResult("");
    setVitalUnit("");
  };

  return (
  <div className="bg-card p-4 rounded-md bg-slate-100">
  {/* <h3 className="font-semibold text-sm mb-3">Vitals</h3> */}

  
  <div className="flex items-start gap-2">

    {/* Vital Name – 20% */}
    <div className="w-[20%]">
      <Label className="font-semibold text-sm mb-3">
        Vitals
      </Label>
      <Input
        list="vital-options"
        value={vitalName}
        onChange={(e) => setVitalName(e.target.value)}
        className="h-8 text-sm px-2"
      />
    </div>

    {/* Result – 10% */}
    <div className="w-[10%]">
      <Label className="font-semibold text-sm mb-3">
        Result
      </Label>
      <Input
        value={vitalResult}
        onChange={(e) => setVitalResult(e.target.value)}
        className="h-8 text-sm px-2"
      />
    </div>

    {/* Unit – 10% */}
    <div className="w-[10%]">
      <Label className="font-semibold text-sm mb-3">
        Unit
      </Label>
      <Input
        value={vitalUnit}
        onChange={(e) => setVitalUnit(e.target.value)}
        className="h-8 text-sm px-2"
      />
    </div>

    {/* Add / Update Button */}
    <div className="flex items-end pt-5">
     <Button
  type="button"
  size="sm"
  onClick={handleAddVital}
  disabled={!vitalName.trim() || !vitalResult.trim()}
  className="h-8"
>
  <Plus className="h-3.5 w-3.5 mr-1" />
  {editingIndex !== null ? "Update" : "Add"}
</Button>

    </div>

    {/* Remaining 50% – Output / Edit / Cancel */}
    <div className="flex-1 flex flex-wrap items-center gap-2 pl-3  min-h-[42px]">

      {vitals.map((vital, index) => (
        <div
          key={index}
          className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-md text-sm"
        >
          <span className="font-medium">
            {vital.name}
          </span>
          <span className="text-muted-foreground">
            {vital.result} {vital.unit}
          </span>

         <Button
  type="button"
  variant="ghost"
  size="icon"
  onClick={() => handleEdit(index)}
  className="h-6 w-6"
>
  <Pencil className="h-3.5 w-3.5" />
</Button>


         <Button
  type="button"
  variant="ghost"
  size="icon"
  onClick={() => handleDelete(index)}
  className="h-6 w-6"
>
  <Trash2 className="h-3.5 w-3.5 text-destructive" />
</Button>

        </div>
      ))}

      {editingIndex !== null && (
       <Button
  type="button"
  size="sm"
  variant="outline"
  onClick={handleCancelEdit}
  className="h-7"
>
  Cancel
</Button>

      )}
    </div>
  </div>

  {/* Vital Options */}
  <datalist id="vital-options">
    {VITAL_OPTIONS.map((option) => (
      <option key={option} value={option} />
    ))}
  </datalist>
</div>

  );
}
