export type UserRole = 'student' | 'admin';

export type ScreenId = 
  | 'splash'
  | 'login'
  | 'student_dashboard'
  | 'student_details'
  | 'fee_details'
  | 'payment'
  | 'payment_history'
  | 'digital_receipt'
  | 'admin_dashboard'
  | 'reports'
  | 'team_members';

export interface TeamMember {
  id: string;
  name: string;
  rollNumber: string;
  role: string;
  branch: string;
  year: number;
  section: string;
  email: string;
  phone?: string;
  contributions: string[];
  isGuide?: boolean;
  designation?: string;
  github?: string;
  linkedin?: string;
}

export interface FeeItem {
  id: string;
  category: 'Tuition' | 'Hostel' | 'Examination' | 'Library & Lab' | 'Transport' | 'Sports & Amenities';
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  paidAmount: number;
  description?: string;
}

export interface Student {
  id: string;
  rollNumber: string;
  name: string;
  email: string;
  phone: string;
  branch: string; // e.g. "Computer Science & Engineering"
  year: number; // 1, 2, 3, 4
  section: string; // "A", "B", "C"
  semester: number; // 1 to 8
  admissionYear: number;
  parentName: string;
  parentPhone: string;
  address: string;
  hostelResident: boolean;
  busUser: boolean;
  avatarUrl?: string;
  feeItems: FeeItem[];
}

export interface FeeStructure {
  id: string;
  branch: string;
  year: number;
  tuitionFee: number;
  examFee: number;
  hostelFee: number;
  labLibraryFee: number;
  transportFee: number;
  otherCharges: number;
  academicYear: string; // e.g. "2026-2027"
}

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'qr';

export interface Transaction {
  id: string;
  receiptNumber: string;
  transactionReference: string;
  studentId: string;
  studentRoll: string;
  studentName: string;
  branch: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentMethodDetails?: string; // e.g., "UPI: rahul@okhdfcbank" or "Visa ending 4242"
  feeCategory: string; // "Tuition Fee", "Full College Fee", "Hostel Fee", etc.
  date: string; // ISO string
  status: 'success' | 'failed' | 'pending';
  academicYear: string;
  notes?: string;
}

export interface FeeReminder {
  id: string;
  studentId: string;
  studentRoll: string;
  studentName: string;
  amountDue: number;
  dueDate: string;
  channel: 'sms' | 'email' | 'push';
  sentAt: string;
  status: 'delivered' | 'sent';
}

export interface CollegeInfo {
  name: string;
  code: string;
  affiliation: string;
  accreditation: string;
  address: string;
  phone: string;
  email: string;
  website: string;
}
