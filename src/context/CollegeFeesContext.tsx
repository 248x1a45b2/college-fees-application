import React, { createContext, useContext, useEffect, useState } from 'react';
import { COLLEGE_INFO, INITIAL_FEE_STRUCTURES, INITIAL_STUDENTS, INITIAL_TEAM_MEMBERS, INITIAL_TRANSACTIONS } from '../data/initialData';
import { FeeItem, FeeReminder, FeeStructure, PaymentMethod, ScreenId, Student, TeamMember, Transaction, UserRole } from '../types';

interface PaymentPayload {
  studentId: string;
  amount: number;
  method: PaymentMethod;
  methodDetails: string;
  feeCategory: string;
  feeItemId?: string;
  notes?: string;
}

interface CollegeFeesContextType {
  // Navigation & Role
  userRole: UserRole;
  currentScreen: ScreenId;
  navigateTo: (screen: ScreenId, params?: { receipt?: Transaction; paymentConfig?: { category?: string; suggestedAmount?: number; feeItemId?: string } }) => void;
  goBack: () => void;
  historyStack: ScreenId[];
  
  // App view settings
  viewMode: 'mobile' | 'responsive';
  toggleViewMode: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Active User / Auth
  currentStudent: Student | null;
  setCurrentStudent: (student: Student | null) => void;
  login: (role: UserRole, identifier: string) => boolean;
  logout: () => void;
  registerStudent: (data: Partial<Student>) => Student;

  // Core Data
  collegeInfo: typeof COLLEGE_INFO;
  students: Student[];
  feeStructures: FeeStructure[];
  transactions: Transaction[];
  reminders: FeeReminder[];
  teamMembers: TeamMember[];
  selectedReceipt: Transaction | null;
  pendingPaymentConfig: { category?: string; suggestedAmount?: number; feeItemId?: string } | null;

  // Actions
  processPayment: (payload: PaymentPayload) => Promise<Transaction>;
  addStudent: (studentData: Omit<Student, 'id' | 'feeItems'>) => Student;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addFeeStructure: (structure: Omit<FeeStructure, 'id'>) => void;
  updateFeeStructure: (id: string, updates: Partial<FeeStructure>) => void;
  deleteFeeStructure: (id: string) => void;
  sendFeeReminder: (studentId: string, channel: 'sms' | 'email' | 'push') => FeeReminder;
  sendBulkFeeReminders: (channel: 'sms' | 'email' | 'push') => number;
  addTeamMember: (member: Omit<TeamMember, 'id'>) => TeamMember;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;
  viewReceipt: (transaction: Transaction) => void;
  resetToDemoData: () => void;

  // Flutter Export Modal
  isFlutterModalOpen: boolean;
  setIsFlutterModalOpen: (open: boolean) => void;
}

const CollegeFeesContext = createContext<CollegeFeesContextType | undefined>(undefined);

export const CollegeFeesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('splash');
  const [historyStack, setHistoryStack] = useState<ScreenId[]>(['splash']);
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [viewMode, setViewMode] = useState<'mobile' | 'responsive'>('mobile');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isFlutterModalOpen, setIsFlutterModalOpen] = useState<boolean>(false);

  // Core Data State with LocalStorage
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('cfm_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>(() => {
    const saved = localStorage.getItem('cfm_fee_structures');
    return saved ? JSON.parse(saved) : INITIAL_FEE_STRUCTURES;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('cfm_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [reminders, setReminders] = useState<FeeReminder[]>(() => {
    const saved = localStorage.getItem('cfm_reminders');
    return saved ? JSON.parse(saved) : [];
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('cfm_team_members');
    return saved ? JSON.parse(saved) : INITIAL_TEAM_MEMBERS;
  });

  // Current logged in student
  const [currentStudent, setCurrentStudent] = useState<Student | null>(() => {
    return students[0] || null;
  });

  const [selectedReceipt, setSelectedReceipt] = useState<Transaction | null>(() => {
    return transactions[0] || null;
  });

  const [pendingPaymentConfig, setPendingPaymentConfig] = useState<{ category?: string; suggestedAmount?: number; feeItemId?: string } | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('cfm_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('cfm_fee_structures', JSON.stringify(feeStructures));
  }, [feeStructures]);

  useEffect(() => {
    localStorage.setItem('cfm_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('cfm_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('cfm_team_members', JSON.stringify(teamMembers));
  }, [teamMembers]);

  // Keep currentStudent in sync if students list changes
  useEffect(() => {
    if (currentStudent) {
      const updated = students.find((s) => s.id === currentStudent.id);
      if (updated) setCurrentStudent(updated);
    }
  }, [students]);

  // Apply dark class to document root
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'mobile' ? 'responsive' : 'mobile'));
  };

  const navigateTo = (
    screen: ScreenId,
    params?: { receipt?: Transaction; paymentConfig?: { category?: string; suggestedAmount?: number; feeItemId?: string } }
  ) => {
    if (params?.receipt) {
      setSelectedReceipt(params.receipt);
    }
    if (params?.paymentConfig) {
      setPendingPaymentConfig(params.paymentConfig);
    }
    setHistoryStack((prev) => [...prev, screen]);
    setCurrentScreen(screen);
  };

  const goBack = () => {
    if (historyStack.length > 1) {
      const newStack = [...historyStack];
      newStack.pop();
      const prevScreen = newStack[newStack.length - 1];
      setHistoryStack(newStack);
      setCurrentScreen(prevScreen);
    } else {
      setCurrentScreen(userRole === 'admin' ? 'admin_dashboard' : 'student_dashboard');
    }
  };

  const login = (role: UserRole, identifier: string): boolean => {
    setUserRole(role);
    if (role === 'admin') {
      setCurrentScreen('admin_dashboard');
      setHistoryStack(['admin_dashboard']);
      return true;
    } else {
      const cleanId = identifier.trim().toLowerCase();
      const matched = students.find(
        (s) => s.rollNumber.toLowerCase() === cleanId || s.email.toLowerCase() === cleanId || s.name.toLowerCase().includes(cleanId)
      );
      if (matched) {
        setCurrentStudent(matched);
        setCurrentScreen('student_dashboard');
        setHistoryStack(['student_dashboard']);
        return true;
      } else {
        // Fallback to first student if not matched
        setCurrentStudent(students[0]);
        setCurrentScreen('student_dashboard');
        setHistoryStack(['student_dashboard']);
        return true;
      }
    }
  };

  const logout = () => {
    setCurrentScreen('login');
    setHistoryStack(['login']);
  };

  const registerStudent = (data: Partial<Student>): Student => {
    // Generate new student ID
    const newId = `std-${Date.now().toString().slice(-4)}`;
    const branch = data.branch || 'Computer Science & Engineering';
    const year = data.year || 1;
    
    // Find matching fee structure
    const fs = feeStructures.find((f) => f.branch === branch && f.year === year) || feeStructures[0];
    
    const initialFeeItems: FeeItem[] = [
      {
        id: `fi-${Date.now()}-1`,
        category: 'Tuition',
        amount: fs ? fs.tuitionFee : 80000,
        paidAmount: 0,
        dueDate: '2026-09-30',
        status: 'pending',
        description: `Academic Year 2026-27 Tuition Fee`
      },
      {
        id: `fi-${Date.now()}-2`,
        category: 'Examination',
        amount: fs ? fs.examFee : 3500,
        paidAmount: 0,
        dueDate: '2026-11-15',
        status: 'pending',
        description: 'Semester Regular Examination Fee'
      },
      {
        id: `fi-${Date.now()}-3`,
        category: 'Library & Lab',
        amount: fs ? fs.labLibraryFee : 10000,
        paidAmount: 0,
        dueDate: '2026-10-15',
        status: 'pending',
        description: 'Laboratory & Digital Library Access'
      }
    ];

    if (data.hostelResident) {
      initialFeeItems.push({
        id: `fi-${Date.now()}-4`,
        category: 'Hostel',
        amount: fs ? fs.hostelFee : 42000,
        paidAmount: 0,
        dueDate: '2026-10-30',
        status: 'pending',
        description: 'Hostel Room & Mess Boarding Fee'
      });
    }

    if (data.busUser) {
      initialFeeItems.push({
        id: `fi-${Date.now()}-5`,
        category: 'Transport',
        amount: fs ? fs.transportFee : 18000,
        paidAmount: 0,
        dueDate: '2026-10-10',
        status: 'pending',
        description: 'College AC Bus Transport Service'
      });
    }

    const newStudent: Student = {
      id: newId,
      rollNumber: data.rollNumber || `26CS${Math.floor(100 + Math.random() * 900)}`,
      name: data.name || 'New Student',
      email: data.email || 'student@college.edu.in',
      phone: data.phone || '+91 98000 00000',
      branch,
      year,
      section: data.section || 'A',
      semester: (year - 1) * 2 + 1,
      admissionYear: 2026,
      parentName: data.parentName || 'Parent Name',
      parentPhone: data.parentPhone || '+91 94000 00000',
      address: data.address || 'Hyderabad, Telangana',
      hostelResident: !!data.hostelResident,
      busUser: !!data.busUser,
      feeItems: initialFeeItems
    };

    setStudents((prev) => [newStudent, ...prev]);
    setCurrentStudent(newStudent);
    return newStudent;
  };

  const processPayment = async (payload: PaymentPayload): Promise<Transaction> => {
    // Generate authentic transaction & receipt credentials
    const receiptNum = `AITS/REC/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;
    const refNum = `PAY_${payload.method.toUpperCase()}_${Date.now()}`;
    const targetStudent = students.find((s) => s.id === payload.studentId) || currentStudent;

    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      receiptNumber: receiptNum,
      transactionReference: refNum,
      studentId: payload.studentId,
      studentRoll: targetStudent ? targetStudent.rollNumber : '24CS089',
      studentName: targetStudent ? targetStudent.name : 'Rahul Indla',
      branch: targetStudent ? targetStudent.branch : 'Computer Science & Engineering',
      amount: payload.amount,
      paymentMethod: payload.method,
      paymentMethodDetails: payload.methodDetails,
      feeCategory: payload.feeCategory,
      date: new Date().toISOString(),
      status: 'success',
      academicYear: '2026-2027',
      notes: payload.notes || 'Online Payment Gateway Clearance'
    };

    // Update Student feeItems
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id !== payload.studentId) return student;

        let remainingToApply = payload.amount;
        const updatedFeeItems = student.feeItems.map((item) => {
          // If specific fee item targeted
          if (payload.feeItemId && item.id === payload.feeItemId) {
            const newPaid = Math.min(item.amount, item.paidAmount + payload.amount);
            return {
              ...item,
              paidAmount: newPaid,
              status: newPaid >= item.amount ? ('paid' as const) : ('pending' as const)
            };
          }

          // If general payment and not specific item, distribute across pending items
          if (!payload.feeItemId && remainingToApply > 0 && item.paidAmount < item.amount) {
            const need = item.amount - item.paidAmount;
            const pay = Math.min(need, remainingToApply);
            remainingToApply -= pay;
            const newPaid = item.paidAmount + pay;
            return {
              ...item,
              paidAmount: newPaid,
              status: newPaid >= item.amount ? ('paid' as const) : ('pending' as const)
            };
          }

          return item;
        });

        return {
          ...student,
          feeItems: updatedFeeItems
        };
      })
    );

    // Append to transactions
    setTransactions((prev) => [newTransaction, ...prev]);
    setSelectedReceipt(newTransaction);
    return newTransaction;
  };

  const addStudent = (studentData: Omit<Student, 'id' | 'feeItems'>): Student => {
    return registerStudent(studentData);
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id !== id) return student;
        return { ...student, ...updates };
      })
    );
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const addFeeStructure = (structure: Omit<FeeStructure, 'id'>) => {
    const newFs: FeeStructure = {
      ...structure,
      id: `fs-${Date.now()}`
    };
    setFeeStructures((prev) => [...prev, newFs]);
  };

  const updateFeeStructure = (id: string, updates: Partial<FeeStructure>) => {
    setFeeStructures((prev) =>
      prev.map((fs) => {
        if (fs.id !== id) return fs;
        return { ...fs, ...updates };
      })
    );
  };

  const deleteFeeStructure = (id: string) => {
    setFeeStructures((prev) => prev.filter((fs) => fs.id !== id));
  };

  const sendFeeReminder = (studentId: string, channel: 'sms' | 'email' | 'push'): FeeReminder => {
    const student = students.find((s) => s.id === studentId);
    if (!student) throw new Error('Student not found');

    const pendingAmount = student.feeItems.reduce((acc, curr) => acc + (curr.amount - curr.paidAmount), 0);
    const earliestPending = student.feeItems.find((f) => f.paidAmount < f.amount);

    const newReminder: FeeReminder = {
      id: `rem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      studentId: student.id,
      studentRoll: student.rollNumber,
      studentName: student.name,
      amountDue: pendingAmount,
      dueDate: earliestPending ? earliestPending.dueDate : '2026-11-30',
      channel,
      sentAt: new Date().toISOString(),
      status: 'delivered'
    };

    setReminders((prev) => [newReminder, ...prev]);
    return newReminder;
  };

  const sendBulkFeeReminders = (channel: 'sms' | 'email' | 'push'): number => {
    const studentsWithPending = students.filter((s) => {
      const pending = s.feeItems.reduce((acc, curr) => acc + (curr.amount - curr.paidAmount), 0);
      return pending > 0;
    });

    const newReminders: FeeReminder[] = studentsWithPending.map((student) => {
      const pendingAmount = student.feeItems.reduce((acc, curr) => acc + (curr.amount - curr.paidAmount), 0);
      const earliestPending = student.feeItems.find((f) => f.paidAmount < f.amount);
      return {
        id: `rem-${Date.now()}-${student.id}`,
        studentId: student.id,
        studentRoll: student.rollNumber,
        studentName: student.name,
        amountDue: pendingAmount,
        dueDate: earliestPending ? earliestPending.dueDate : '2026-11-30',
        channel,
        sentAt: new Date().toISOString(),
        status: 'delivered'
      };
    });

    setReminders((prev) => [...newReminders, ...prev]);
    return newReminders.length;
  };

  const addTeamMember = (memberData: Omit<TeamMember, 'id'>): TeamMember => {
    const newMember: TeamMember = {
      ...memberData,
      id: `tm-${Date.now()}`
    };
    setTeamMembers((prev) => [...prev, newMember]);
    return newMember;
  };

  const updateTeamMember = (id: string, updates: Partial<TeamMember>) => {
    setTeamMembers((prev) =>
      prev.map((tm) => (tm.id === id ? { ...tm, ...updates } : tm))
    );
  };

  const deleteTeamMember = (id: string) => {
    setTeamMembers((prev) => prev.filter((tm) => tm.id !== id));
  };

  const viewReceipt = (transaction: Transaction) => {
    setSelectedReceipt(transaction);
    navigateTo('digital_receipt', { receipt: transaction });
  };

  const resetToDemoData = () => {
    setStudents(INITIAL_STUDENTS);
    setFeeStructures(INITIAL_FEE_STRUCTURES);
    setTransactions(INITIAL_TRANSACTIONS);
    setReminders([]);
    setTeamMembers(INITIAL_TEAM_MEMBERS);
    setCurrentStudent(INITIAL_STUDENTS[0]);
    setSelectedReceipt(INITIAL_TRANSACTIONS[0]);
    localStorage.removeItem('cfm_students');
    localStorage.removeItem('cfm_fee_structures');
    localStorage.removeItem('cfm_transactions');
    localStorage.removeItem('cfm_reminders');
    localStorage.removeItem('cfm_team_members');
  };

  return (
    <CollegeFeesContext.Provider
      value={{
        userRole,
        currentScreen,
        navigateTo,
        goBack,
        historyStack,
        viewMode,
        toggleViewMode,
        theme,
        toggleTheme,
        currentStudent,
        setCurrentStudent,
        login,
        logout,
        registerStudent,
        collegeInfo: COLLEGE_INFO,
        students,
        feeStructures,
        transactions,
        reminders,
        teamMembers,
        selectedReceipt,
        pendingPaymentConfig,
        processPayment,
        addStudent,
        updateStudent,
        deleteStudent,
        addFeeStructure,
        updateFeeStructure,
        deleteFeeStructure,
        sendFeeReminder,
        sendBulkFeeReminders,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        viewReceipt,
        resetToDemoData,
        isFlutterModalOpen,
        setIsFlutterModalOpen
      }}
    >
      {children}
    </CollegeFeesContext.Provider>
  );
};

export const useCollegeFees = () => {
  const context = useContext(CollegeFeesContext);
  if (!context) {
    throw new Error('useCollegeFees must be used within a CollegeFeesProvider');
  }
  return context;
};
