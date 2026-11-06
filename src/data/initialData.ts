import { CollegeInfo, FeeStructure, Student, TeamMember, Transaction } from '../types';

export const COLLEGE_INFO: CollegeInfo = {
  name: 'Kallam Haranadha Reddy Institute of Technology',
  code: 'KHIT-GNT-522019',
  affiliation: 'Autonomous Institution · Affiliated to JNTUK, Kakinada & Approved by AICTE',
  accreditation: 'Accredited by NAAC with A Grade & NBA Accredited',
  address: 'NH-16, Chowdavaram, Guntur - 522019, Andhra Pradesh, India',
  phone: '+91 (0863) 2293336',
  email: 'accounts@khitguntur.ac.in',
  website: 'www.khitguntur.ac.in'
};

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Rahul Indla',
    rollNumber: '24CS089',
    role: 'Project Lead & Full-Stack Developer',
    branch: 'Computer Science & Engineering',
    year: 3,
    section: 'A',
    email: 'indlarahul2006@gmail.com',
    phone: '+91 98480 22341',
    contributions: [
      'Project Architecture & System Design',
      'Flutter & React State Management',
      'UPI & Multi-Channel Payment Gateway Integration',
      'Digital E-Receipt Generation Engine'
    ],
    github: 'https://github.com/rahulindla',
    linkedin: 'https://linkedin.com/in/rahulindla'
  },
  {
    id: 'tm-2',
    name: 'Ananya Sharma',
    rollNumber: '24CS104',
    role: 'Frontend & UI/UX Specialist',
    branch: 'Computer Science & Engineering',
    year: 3,
    section: 'A',
    email: 'ananya.s@khitguntur.ac.in',
    phone: '+91 98112 34567',
    contributions: [
      'Material 3 & Android UI Implementation',
      'Interactive Student Dashboard Charts',
      'Form Validations & Accessibility Design',
      'Mobile Touch-First Ergonomics'
    ],
    github: 'https://github.com/ananyasharma',
    linkedin: 'https://linkedin.com/in/ananyasharma'
  },
  {
    id: 'tm-3',
    name: 'Karthik Varma',
    rollNumber: '24EC042',
    role: 'Backend & Security Architect',
    branch: 'Electronics & Communication',
    year: 3,
    section: 'A',
    email: 'karthik.v@khitguntur.ac.in',
    phone: '+91 97001 88231',
    contributions: [
      'Fee Structure & Ledger Database Schema',
      '256-Bit SSL Gateway Handshake Simulation',
      'Automated SMS & Email Due Reminder Dispatcher',
      'Transaction Reference & Audit Logs'
    ],
    github: 'https://github.com/karthikvarma',
    linkedin: 'https://linkedin.com/in/karthikvarma'
  },
  {
    id: 'tm-4',
    name: 'Pooja Reddy',
    rollNumber: '25ME018',
    role: 'QA & Systems Analyst',
    branch: 'Mechanical Engineering',
    year: 2,
    section: 'A',
    email: 'pooja.r@khitguntur.ac.in',
    phone: '+91 96541 23890',
    contributions: [
      'Fee Head Breakdown & Defaulter Tracking',
      'CSV Report Generator & Print Formatting',
      'Widget & Unit Test Scenarios',
      'Role-Based Authorization Testing'
    ],
    github: 'https://github.com/poojareddy',
    linkedin: 'https://linkedin.com/in/poojareddy'
  },
  {
    id: 'tm-guide',
    name: 'Dr. K. Venkateswara Rao, Ph.D.',
    rollNumber: 'FAC-CSE-012',
    role: 'Project Guide & Faculty Mentor',
    branch: 'Computer Science & Engineering',
    year: 0,
    section: 'Faculty',
    email: 'hod.cse@khitguntur.ac.in',
    phone: '+91 (0863) 2293336 Ext 201',
    isGuide: true,
    designation: 'Professor & Head of Department (CSE), KHIT',
    contributions: [
      'Academic Mentorship & Project Supervision',
      'Compliance with University Standards (JNTUK & AICTE)',
      'Security Best Practices & Financial Audit Validation'
    ]
  }
];

export const INITIAL_FEE_STRUCTURES: FeeStructure[] = [
  {
    id: 'fs-cse-3',
    branch: 'Computer Science & Engineering',
    year: 3,
    tuitionFee: 85000,
    examFee: 3500,
    hostelFee: 42000,
    labLibraryFee: 12000,
    transportFee: 18000,
    otherCharges: 4500,
    academicYear: '2026-2027'
  },
  {
    id: 'fs-ece-3',
    branch: 'Electronics & Communication',
    year: 3,
    tuitionFee: 78000,
    examFee: 3500,
    hostelFee: 42000,
    labLibraryFee: 11000,
    transportFee: 18000,
    otherCharges: 4000,
    academicYear: '2026-2027'
  },
  {
    id: 'fs-me-2',
    branch: 'Mechanical Engineering',
    year: 2,
    tuitionFee: 70000,
    examFee: 3500,
    hostelFee: 42000,
    labLibraryFee: 10000,
    transportFee: 18000,
    otherCharges: 3500,
    academicYear: '2026-2027'
  },
  {
    id: 'fs-it-4',
    branch: 'Information Technology',
    year: 4,
    tuitionFee: 82000,
    examFee: 4000,
    hostelFee: 42000,
    labLibraryFee: 12000,
    transportFee: 18000,
    otherCharges: 5000,
    academicYear: '2026-2027'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-2101',
    rollNumber: '24CS089',
    name: 'Rahul Indla',
    email: 'rahul.indla24@college.edu.in',
    phone: '+91 98480 22341',
    branch: 'Computer Science & Engineering',
    year: 3,
    section: 'A',
    semester: 5,
    admissionYear: 2024,
    parentName: 'Venkatesh Indla',
    parentPhone: '+91 94401 55678',
    address: 'Flat 402, Sri Sai Nilayam, Madhapur, Hyderabad, Telangana',
    hostelResident: true,
    busUser: false,
    feeItems: [
      {
        id: 'fi-101',
        category: 'Tuition',
        amount: 85000,
        paidAmount: 85000,
        dueDate: '2026-08-30',
        status: 'paid',
        description: 'Semester V & VI Academic Tuition Fee'
      },
      {
        id: 'fi-102',
        category: 'Hostel',
        amount: 42000,
        paidAmount: 20000,
        dueDate: '2026-11-20',
        status: 'pending',
        description: 'Campus Hostel Accommodation & Mess Boarding'
      },
      {
        id: 'fi-103',
        category: 'Examination',
        amount: 3500,
        paidAmount: 0,
        dueDate: '2026-11-15',
        status: 'pending',
        description: 'Odd Semester End Regular Examination Fee'
      },
      {
        id: 'fi-104',
        category: 'Library & Lab',
        amount: 12000,
        paidAmount: 12000,
        dueDate: '2026-09-10',
        status: 'paid',
        description: 'Advanced Cloud Computing & AI Lab Access'
      },
      {
        id: 'fi-105',
        category: 'Sports & Amenities',
        amount: 4500,
        paidAmount: 0,
        dueDate: '2026-12-05',
        status: 'pending',
        description: 'Annual Sports Complex, Gym & Tech Fest Levy'
      }
    ]
  },
  {
    id: 'std-2102',
    rollNumber: '24CS104',
    name: 'Ananya Sharma',
    email: 'ananya.s@college.edu.in',
    phone: '+91 98112 34567',
    branch: 'Computer Science & Engineering',
    year: 3,
    section: 'B',
    semester: 5,
    admissionYear: 2024,
    parentName: 'Ramesh Sharma',
    parentPhone: '+91 98110 98765',
    address: 'Plot 12, Jubilee Hills, Hyderabad',
    hostelResident: false,
    busUser: true,
    feeItems: [
      {
        id: 'fi-201',
        category: 'Tuition',
        amount: 85000,
        paidAmount: 85000,
        dueDate: '2026-08-30',
        status: 'paid',
        description: 'Semester V & VI Academic Tuition'
      },
      {
        id: 'fi-202',
        category: 'Examination',
        amount: 3500,
        paidAmount: 3500,
        dueDate: '2026-11-15',
        status: 'paid',
        description: 'Semester End Regular Examination Fee'
      },
      {
        id: 'fi-203',
        category: 'Transport',
        amount: 18000,
        paidAmount: 18000,
        dueDate: '2026-09-15',
        status: 'paid',
        description: 'College Route 7 AC Bus Service'
      },
      {
        id: 'fi-204',
        category: 'Library & Lab',
        amount: 12000,
        paidAmount: 12000,
        dueDate: '2026-09-10',
        status: 'paid',
        description: 'Library Digital Journals & Lab Maintenance'
      }
    ]
  },
  {
    id: 'std-2103',
    rollNumber: '24EC042',
    name: 'Karthik Varma',
    email: 'karthik.v@college.edu.in',
    phone: '+91 97001 88231',
    branch: 'Electronics & Communication',
    year: 3,
    section: 'A',
    semester: 5,
    admissionYear: 2024,
    parentName: 'Satyanarayana Varma',
    parentPhone: '+91 97000 11223',
    address: 'H.No 3-4-89, Begumpet, Secunderabad',
    hostelResident: true,
    busUser: false,
    feeItems: [
      {
        id: 'fi-301',
        category: 'Tuition',
        amount: 78000,
        paidAmount: 38000,
        dueDate: '2026-09-30',
        status: 'overdue',
        description: 'Annual Academic Tuition Fee'
      },
      {
        id: 'fi-302',
        category: 'Hostel',
        amount: 42000,
        paidAmount: 0,
        dueDate: '2026-10-15',
        status: 'overdue',
        description: 'Hostel Block B Accommodation'
      },
      {
        id: 'fi-303',
        category: 'Examination',
        amount: 3500,
        paidAmount: 0,
        dueDate: '2026-11-15',
        status: 'pending',
        description: 'Semester Examination Fee'
      }
    ]
  },
  {
    id: 'std-2104',
    rollNumber: '25ME018',
    name: 'Pooja Reddy',
    email: 'pooja.r@college.edu.in',
    phone: '+91 96541 23890',
    branch: 'Mechanical Engineering',
    year: 2,
    section: 'A',
    semester: 3,
    admissionYear: 2025,
    parentName: 'Surender Reddy',
    parentPhone: '+91 96540 99887',
    address: 'Road No 3, Banjara Hills, Hyderabad',
    hostelResident: false,
    busUser: true,
    feeItems: [
      {
        id: 'fi-401',
        category: 'Tuition',
        amount: 70000,
        paidAmount: 70000,
        dueDate: '2026-08-30',
        status: 'paid',
        description: 'Year 2 Tuition Fee'
      },
      {
        id: 'fi-402',
        category: 'Transport',
        amount: 18000,
        paidAmount: 9000,
        dueDate: '2026-11-25',
        status: 'pending',
        description: 'Campus Bus Transport Fee'
      },
      {
        id: 'fi-403',
        category: 'Examination',
        amount: 3500,
        paidAmount: 3500,
        dueDate: '2026-11-15',
        status: 'paid',
        description: 'Year 2 Semester 3 Exam Fee'
      }
    ]
  },
  {
    id: 'std-2105',
    rollNumber: '23IT009',
    name: 'Vikram Malhotra',
    email: 'vikram.m@college.edu.in',
    phone: '+91 95021 34112',
    branch: 'Information Technology',
    year: 4,
    section: 'B',
    semester: 7,
    admissionYear: 2023,
    parentName: 'Sunil Malhotra',
    parentPhone: '+91 95020 77665',
    address: 'Gachibowli Outer Ring Road, Hyderabad',
    hostelResident: true,
    busUser: false,
    feeItems: [
      {
        id: 'fi-501',
        category: 'Tuition',
        amount: 82000,
        paidAmount: 82000,
        dueDate: '2026-08-30',
        status: 'paid',
        description: 'Final Year Tuition & Placement Training'
      },
      {
        id: 'fi-502',
        category: 'Hostel',
        amount: 42000,
        paidAmount: 42000,
        dueDate: '2026-10-15',
        status: 'paid',
        description: 'Final Year Senior Hostel Unit'
      },
      {
        id: 'fi-503',
        category: 'Examination',
        amount: 4000,
        paidAmount: 4000,
        dueDate: '2026-11-15',
        status: 'paid',
        description: 'Semester 7 & Project Viva Examination'
      }
    ]
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-901',
    receiptNumber: 'AITS/REC/2026/0891',
    transactionReference: 'PAY_UPI_883921092837',
    studentId: 'std-2101',
    studentRoll: '24CS089',
    studentName: 'Rahul Indla',
    branch: 'Computer Science & Engineering',
    amount: 85000,
    paymentMethod: 'upi',
    paymentMethodDetails: 'GPay · rahul.indla@okhdfcbank',
    feeCategory: 'Tuition Fee (Sem V & VI)',
    date: '2026-08-25T14:32:10Z',
    status: 'success',
    academicYear: '2026-2027',
    notes: 'Online fee payment via Student Mobile Portal'
  },
  {
    id: 'tx-902',
    receiptNumber: 'AITS/REC/2026/0892',
    transactionReference: 'PAY_CARD_554109287102',
    studentId: 'std-2101',
    studentRoll: '24CS089',
    studentName: 'Rahul Indla',
    branch: 'Computer Science & Engineering',
    amount: 12000,
    paymentMethod: 'card',
    paymentMethodDetails: 'Mastercard ending in 9012',
    feeCategory: 'Library & Lab Access Fee',
    date: '2026-09-08T10:15:44Z',
    status: 'success',
    academicYear: '2026-2027',
    notes: 'Direct online payment gateway'
  },
  {
    id: 'tx-903',
    receiptNumber: 'AITS/REC/2026/0893',
    transactionReference: 'PAY_UPI_110948273641',
    studentId: 'std-2101',
    studentRoll: '24CS089',
    studentName: 'Rahul Indla',
    branch: 'Computer Science & Engineering',
    amount: 20000,
    paymentMethod: 'upi',
    paymentMethodDetails: 'PhonePe · 9848022341@ybl',
    feeCategory: 'Hostel Accommodation (Part 1)',
    date: '2026-10-02T16:45:19Z',
    status: 'success',
    academicYear: '2026-2027',
    notes: 'Hostel Term 1 partial settlement'
  },
  {
    id: 'tx-904',
    receiptNumber: 'AITS/REC/2026/0754',
    transactionReference: 'PAY_NB_HDFC_991823712',
    studentId: 'std-2102',
    studentRoll: '24CS104',
    studentName: 'Ananya Sharma',
    branch: 'Computer Science & Engineering',
    amount: 118500,
    paymentMethod: 'netbanking',
    paymentMethodDetails: 'HDFC Corporate NetBanking',
    feeCategory: 'Complete Term Fees (Tuition + Exam + Bus + Lab)',
    date: '2026-08-20T11:20:00Z',
    status: 'success',
    academicYear: '2026-2027',
    notes: 'Full fee clearance for Academic Year 2026-27'
  },
  {
    id: 'tx-905',
    receiptNumber: 'AITS/REC/2026/0612',
    transactionReference: 'PAY_QR_882736192019',
    studentId: 'std-2104',
    studentRoll: '25ME018',
    studentName: 'Pooja Reddy',
    branch: 'Mechanical Engineering',
    amount: 70000,
    paymentMethod: 'qr',
    paymentMethodDetails: 'Static Dynamic Campus QR · Paytm',
    feeCategory: 'Year 2 Tuition Fee',
    date: '2026-08-28T09:40:22Z',
    status: 'success',
    academicYear: '2026-2027',
    notes: 'Counter dynamic QR scan payment'
  }
];
