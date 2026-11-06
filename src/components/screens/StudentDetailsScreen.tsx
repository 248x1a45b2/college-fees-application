import React, { useState } from 'react';
import { useCollegeFees } from '../../context/CollegeFeesContext';
import { TopAppBar, BottomNavBar } from '../common/AppNavigation';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Calendar, 
  Award, 
  ShieldCheck, 
  AlertCircle, 
  Edit3, 
  Check, 
  Bus, 
  Home
} from 'lucide-react';

export const StudentDetailsScreen: React.FC = () => {
  const { currentStudent, updateStudent, goBack } = useCollegeFees();
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(currentStudent?.phone || '');
  const [parentPhone, setParentPhone] = useState(currentStudent?.parentPhone || '');
  const [address, setAddress] = useState(currentStudent?.address || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!currentStudent) {
    return (
      <div className="flex-1 flex flex-col justify-between">
        <TopAppBar title="Student Profile" showBack onBack={goBack} />
        <div className="p-6 text-center text-sm text-slate-500">No student profile selected.</div>
        <BottomNavBar />
      </div>
    );
  }

  const totalFees = currentStudent.feeItems.reduce((acc, curr) => acc + curr.amount, 0);
  const paidFees = currentStudent.feeItems.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const isAllCleared = paidFees >= totalFees && totalFees > 0;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudent(currentStudent.id, {
      phone,
      parentPhone,
      address
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <TopAppBar
        title="Student Details"
        subtitle={currentStudent.rollNumber}
        showBack
        onBack={goBack}
        rightAction={
          !isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded-lg text-white hover:bg-white/10"
              title="Edit Profile"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              className="px-2.5 py-1 rounded-md bg-white text-blue-900 text-xs font-semibold flex items-center gap-1 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          )
        }
      />

      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-6">
        {/* Profile Identity Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-xs text-center relative">
          <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-bold text-2xl flex items-center justify-center mx-auto mb-2 shadow-md">
            {currentStudent.name.charAt(0)}
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {currentStudent.name}
          </h2>
          <p className="text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
            {currentStudent.rollNumber}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {currentStudent.branch}
          </p>

          {/* Fee Clearance Badge */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border">
            {isAllCleared ? (
              <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Fees Fully Cleared · Exam Hall Ticket Issued</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>Fee Balance Pending (₹{(totalFees - paidFees).toLocaleString('en-IN')})</span>
              </span>
            )}
          </div>
        </div>

        {savedSuccess && (
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-1.5">
            <Check className="w-4 h-4" />
            <span>Profile details updated successfully!</span>
          </div>
        )}

        {/* Academic Details Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
            Academic Information
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Department / Branch</span>
              <span className="font-medium text-slate-900 dark:text-white">{currentStudent.branch}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Current Year & Semester</span>
              <span className="font-medium text-slate-900 dark:text-white">
                Year {currentStudent.year} (Sem {currentStudent.semester})
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Section</span>
              <span className="font-medium text-slate-900 dark:text-white">Section {currentStudent.section}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Admission Year</span>
              <span className="font-medium text-slate-900 dark:text-white">{currentStudent.admissionYear}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Hostel Resident</span>
              <span className="font-medium text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
                <Home className="w-3.5 h-3.5 text-blue-500" />
                {currentStudent.hostelResident ? 'Hosteler (Block B)' : 'Day Scholar'}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Transport Facility</span>
              <span className="font-medium text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
                <Bus className="w-3.5 h-3.5 text-blue-500" />
                {currentStudent.busUser ? 'College Bus (Route 7)' : 'Self Commute'}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Contact & Guardians
            </h3>
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-[11px] text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                Edit Details
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Student Email</span>
                  <span className="font-medium text-slate-900 dark:text-white">{currentStudent.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Student Mobile</span>
                  <span className="font-medium text-slate-900 dark:text-white">{currentStudent.phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Parent / Guardian Name</span>
                  <span className="font-medium text-slate-900 dark:text-white">{currentStudent.parentName}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Parent Emergency Contact</span>
                  <span className="font-medium text-slate-900 dark:text-white">{currentStudent.parentPhone}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Permanent Address</span>
                  <span className="font-medium text-slate-900 dark:text-white">{currentStudent.address}</span>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Student Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Parent Emergency Phone
                </label>
                <input
                  type="text"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Address
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>

              <div className="flex gap-2 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-xs rounded-lg bg-blue-600 text-white font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <BottomNavBar />
    </div>
  );
};
