import React, { useState } from 'react';
import { useCollegeFees } from '../../context/CollegeFeesContext';
import { X, Layers, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { FeeStructure } from '../../types';

interface ManageFeeStructureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManageFeeStructureModal: React.FC<ManageFeeStructureModalProps> = ({ isOpen, onClose }) => {
  const { feeStructures, addFeeStructure, deleteFeeStructure } = useCollegeFees();
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New form state
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [year, setYear] = useState(1);
  const [tuitionFee, setTuitionFee] = useState(85000);
  const [examFee, setExamFee] = useState(3500);
  const [hostelFee, setHostelFee] = useState(42000);
  const [labLibraryFee, setLabLibraryFee] = useState(12000);
  const [transportFee, setTransportFee] = useState(18000);
  const [otherCharges, setOtherCharges] = useState(4500);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addFeeStructure({
      branch,
      year: Number(year),
      tuitionFee: Number(tuitionFee),
      examFee: Number(examFee),
      hostelFee: Number(hostelFee),
      labLibraryFee: Number(labLibraryFee),
      transportFee: Number(transportFee),
      otherCharges: Number(otherCharges),
      academicYear: '2026-2027'
    });
    setIsAddingNew(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Manage College Fee Structures (AY 2026-27)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
          {!isAddingNew ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">
                  Configured Branch & Year Fee Tiers ({feeStructures.length})
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(true)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs flex items-center gap-1 shadow-xs hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Fee Tier</span>
                </button>
              </div>

              <div className="space-y-3">
                {feeStructures.map((fs) => {
                  const baseTotal = fs.tuitionFee + fs.examFee + fs.labLibraryFee + fs.otherCharges;
                  return (
                    <div
                      key={fs.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-xs">
                            {fs.branch} · Year {fs.year}
                          </span>
                          <span className="text-[10px] font-mono bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-sm">
                            {fs.academicYear}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-0.5 text-[11px] text-slate-600 dark:text-slate-400">
                          <span>Tuition: <strong>₹{fs.tuitionFee.toLocaleString('en-IN')}</strong></span>
                          <span>Exam: <strong>₹{fs.examFee.toLocaleString('en-IN')}</strong></span>
                          <span>Lab/Library: <strong>₹{fs.labLibraryFee.toLocaleString('en-IN')}</strong></span>
                          <span>Hostel: <strong>₹{fs.hostelFee.toLocaleString('en-IN')}</strong></span>
                          <span>Transport: <strong>₹{fs.transportFee.toLocaleString('en-IN')}</strong></span>
                          <span>Amenities: <strong>₹{fs.otherCharges.toLocaleString('en-IN')}</strong></span>
                        </div>
                        <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold pt-1">
                          Base College Fee: ₹{baseTotal.toLocaleString('en-IN')} + optional amenities
                        </div>
                      </div>

                      {feeStructures.length > 1 && (
                        <button
                          type="button"
                          onClick={() => deleteFeeStructure(fs.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete fee tier"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* Add Form */
            <form onSubmit={handleCreate} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Branch
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                  >
                    <option value="Computer Science & Engineering">CSE</option>
                    <option value="Electronics & Communication">ECE</option>
                    <option value="Mechanical Engineering">Mechanical</option>
                    <option value="Information Technology">IT</option>
                    <option value="Civil Engineering">Civil</option>
                    <option value="Artificial Intelligence & DS">AI & DS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                  >
                    <option value={1}>Year 1</option>
                    <option value={2}>Year 2</option>
                    <option value={3}>Year 3</option>
                    <option value={4}>Year 4</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Tuition Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={tuitionFee}
                    onChange={(e) => setTuitionFee(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Exam Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={examFee}
                    onChange={(e) => setExamFee(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Hostel & Boarding Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={hostelFee}
                    onChange={(e) => setHostelFee(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Lab & Library Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={labLibraryFee}
                    onChange={(e) => setLabLibraryFee(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Bus Transport Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={transportFee}
                    onChange={(e) => setTransportFee(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Sports & Amenities Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={otherCharges}
                    onChange={(e) => setOtherCharges(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Save Structure</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
