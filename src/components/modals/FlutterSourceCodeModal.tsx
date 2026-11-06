import React, { useState } from 'react';
import { useCollegeFees } from '../../context/CollegeFeesContext';
import { 
  X, 
  Code2, 
  FolderTree, 
  Copy, 
  Check, 
  Terminal, 
  Smartphone, 
  FileCode, 
  Download,
  BookOpen
} from 'lucide-react';

export const FlutterSourceCodeModal: React.FC = () => {
  const { isFlutterModalOpen, setIsFlutterModalOpen } = useCollegeFees();
  const [selectedFile, setSelectedFile] = useState<string>('pubspec.yaml');
  const [copied, setCopied] = useState(false);

  if (!isFlutterModalOpen) return null;

  const flutterFiles: Record<string, { title: string; path: string; language: string; content: string }> = {
    'pubspec.yaml': {
      title: 'pubspec.yaml',
      path: 'pubspec.yaml',
      language: 'yaml',
      content: `name: college_fees_manager
description: "A modern Android application for College Fees Management built with Flutter & Dart."
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.3.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.8
  provider: ^6.1.2
  intl: ^0.19.0
  shared_preferences: ^2.2.3
  sqflite: ^2.3.3+1
  path: ^1.9.0
  pdf: ^3.10.8
  printing: ^5.13.1
  qr_flutter: ^4.1.0
  uuid: ^4.4.0
  flutter_local_notifications: ^17.1.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/images/
    - assets/icons/
`
    },
    'main.dart': {
      title: 'main.dart',
      path: 'lib/main.dart',
      language: 'dart',
      content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/auth_provider.dart';
import 'providers/fee_provider.dart';
import 'screens/splash_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => FeeProvider()..initDatabase()),
      ],
      child: const CollegeFeesApp(),
    ),
  );
}

class CollegeFeesApp extends StatelessWidget {
  const CollegeFeesApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'College Fees Manager',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF1E40AF),
          primary: const Color(0xFF1E40AF),
          secondary: const Color(0xFF2563EB),
          surface: Colors.white,
        ),
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF1E40AF),
          foregroundColor: Colors.white,
          elevation: 0,
        ),
      ),
      home: const SplashScreen(),
    );
  }
}
`
    },
    'student.dart': {
      title: 'student.dart',
      path: 'lib/models/student.dart',
      language: 'dart',
      content: `class Student {
  final String id;
  final String rollNumber;
  final String name;
  final String email;
  final String phone;
  final String branch;
  final int year;
  final String section;
  final int semester;
  final int admissionYear;
  final String parentName;
  final String parentPhone;
  final bool hostelResident;
  final bool busUser;

  Student({
    required this.id,
    required this.rollNumber,
    required this.name,
    required this.email,
    required this.phone,
    required this.branch,
    required this.year,
    required this.section,
    required this.semester,
    required this.admissionYear,
    required this.parentName,
    required this.parentPhone,
    required this.hostelResident,
    required this.busUser,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'rollNumber': rollNumber,
      'name': name,
      'email': email,
      'phone': phone,
      'branch': branch,
      'year': year,
      'section': section,
      'semester': semester,
      'admissionYear': admissionYear,
      'parentName': parentName,
      'parentPhone': parentPhone,
      'hostelResident': hostelResident ? 1 : 0,
      'busUser': busUser ? 1 : 0,
    };
  }

  factory Student.fromMap(Map<String, dynamic> map) {
    return Student(
      id: map['id'],
      rollNumber: map['rollNumber'],
      name: map['name'],
      email: map['email'],
      phone: map['phone'],
      branch: map['branch'],
      year: map['year'],
      section: map['section'],
      semester: map['semester'],
      admissionYear: map['admissionYear'],
      parentName: map['parentName'],
      parentPhone: map['parentPhone'],
      hostelResident: map['hostelResident'] == 1,
      busUser: map['busUser'] == 1,
    );
  }
}
`
    },
    'fee_provider.dart': {
      title: 'fee_provider.dart',
      path: 'lib/providers/fee_provider.dart',
      language: 'dart',
      content: `import 'package:flutter/foundation.dart';
import '../models/student.dart';
import '../models/transaction_model.dart';
import '../services/database_service.dart';

class FeeProvider with ChangeNotifier {
  final DatabaseService _dbService = DatabaseService();
  List<Student> _students = [];
  List<TransactionModel> _transactions = [];
  bool _isLoading = false;

  List<Student> get students => _students;
  List<TransactionModel> get transactions => _transactions;
  bool get isLoading => _isLoading;

  Future<void> initDatabase() async {
    _isLoading = true;
    notifyListeners();
    await _dbService.initDb();
    _students = await _dbService.getStudents();
    _transactions = await _dbService.getTransactions();
    _isLoading = false;
    notifyListeners();
  }

  Future<void> processPayment({
    required String studentId,
    required double amount,
    required String method,
    required String category,
  }) async {
    final tx = TransactionModel(
      id: 'tx-\${DateTime.now().millisecondsSinceEpoch}',
      receiptNumber: 'AITS/REC/\${DateTime.now().year}/\${DateTime.now().millisecond}',
      transactionReference: 'PAY_\${method.toUpperCase()}_\${DateTime.now().millisecondsSinceEpoch}',
      studentId: studentId,
      amount: amount,
      paymentMethod: method,
      feeCategory: category,
      date: DateTime.now().toIso8601String(),
      status: 'success',
    );

    await _dbService.insertTransaction(tx);
    _transactions.insert(0, tx);
    notifyListeners();
  }
}
`
    },
    'payment_screen.dart': {
      title: 'payment_screen.dart',
      path: 'lib/screens/payment_screen.dart',
      language: 'dart',
      content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/fee_provider.dart';
import 'digital_receipt_screen.dart';

class PaymentScreen extends StatefulWidget {
  final String studentId;
  final double defaultAmount;
  final String feeCategory;

  const PaymentScreen({
    super.key,
    required this.studentId,
    required this.defaultAmount,
    required this.feeCategory,
  });

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  String _selectedMethod = 'upi';
  late TextEditingController _amountController;
  bool _isProcessing = false;

  @override
  void initState() {
    super.initState();
    _amountController = TextEditingController(text: widget.defaultAmount.toInt().toString());
  }

  void _submitPayment() async {
    setState(() => _isProcessing = true);
    final amount = double.tryParse(_amountController.text) ?? widget.defaultAmount;

    await Future.delayed(const Duration(seconds: 2)); // Simulate gateway
    if (!mounted) return;

    await context.read<FeeProvider>().processPayment(
      studentId: widget.studentId,
      amount: amount,
      method: _selectedMethod,
      category: widget.feeCategory,
    );

    setState(() => _isProcessing = false);

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (_) => const DigitalReceiptScreen(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Fee Payment Gateway')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Card(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    Text('Category: \${widget.feeCategory}', style: const TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 12),
                    TextField(
                      controller: _amountController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(
                        labelText: 'Payment Amount (₹)',
                        prefixText: '₹ ',
                        border: OutlineInputBorder(),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _isProcessing ? null : _submitPayment,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF1E40AF),
                foregroundColor: Colors.white,
                minimumSize: const Size.fromHeight(50),
              ),
              child: _isProcessing
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text('Authorize & Pay Now'),
            ),
          ],
        ),
      ),
    );
  }
}
`
    },
    'team_members_screen.dart': {
      title: 'team_members_screen.dart',
      path: 'lib/screens/team_members_screen.dart',
      language: 'dart',
      content: `import 'package:flutter/material.dart';

class TeamMembersScreen extends StatelessWidget {
  const TeamMembersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('KHIT Project Team'),
        backgroundColor: const Color(0xFF1E40AF),
        foregroundColor: Colors.white,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            color: const Color(0xFF1E40AF),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: const Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                children: [
                  Text(
                    'Kallam Haranadha Reddy Institute of Technology (KHIT)',
                    style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                    textAlign: TextAlign.center,
                  ),
                  SizedBox(height: 6),
                  Text(
                    'Department of Computer Science & Engineering',
                    style: TextStyle(color: Colors.white70, fontSize: 13),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          const Text('PROJECT GUIDE', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.grey)),
          const SizedBox(height: 6),
          const Card(
            child: ListTile(
              leading: CircleAvatar(backgroundColor: Color(0xFF1E40AF), child: Icon(Icons.school, color: Colors.white)),
              title: Text('Dr. K. Venkateswara Rao, Ph.D.', style: TextStyle(fontWeight: FontWeight.bold)),
              subtitle: Text('Faculty Mentor · Professor & HOD (CSE), KHIT'),
            ),
          ),
          const SizedBox(height: 16),
          const Text('STUDENT DEVELOPMENT TEAM', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.grey)),
          const SizedBox(height: 6),
          const Card(
            child: ListTile(
              leading: CircleAvatar(child: Text('RI')),
              title: Text('Rahul Indla (24CS089)', style: TextStyle(fontWeight: FontWeight.bold)),
              subtitle: Text('Project Lead & Full Stack Developer'),
            ),
          ),
          const Card(
            child: ListTile(
              leading: CircleAvatar(child: Text('AS')),
              title: Text('Ananya Sharma (24CS104)'),
              subtitle: Text('Frontend & UI/UX Specialist'),
            ),
          ),
          const Card(
            child: ListTile(
              leading: CircleAvatar(child: Text('KV')),
              title: Text('Karthik Varma (24EC042)'),
              subtitle: Text('Backend & Security Architect'),
            ),
          ),
          const Card(
            child: ListTile(
              leading: CircleAvatar(child: Text('PR')),
              title: Text('Pooja Reddy (25ME018)'),
              subtitle: Text('QA & Systems Analyst'),
            ),
          ),
        ],
      ),
    );
  }
}
`
    },
    'apk_instructions.md': {
      title: 'Build APK Instructions',
      path: 'docs/BUILD_ANDROID_APK.md',
      language: 'markdown',
      content: `# Android APK Build Instructions for College Fees Manager

### Prerequisites:
1. Flutter SDK (3.35.0+) installed & in PATH
2. Android Studio with Android SDK (API 34) & Command-line tools
3. Java JDK 17+ installed

### Step 1: Initialize Flutter Project
\`\`\`bash
# Create directory and initialize project
mkdir college_fees_manager
cd college_fees_manager
flutter create --org com.apexinstitute.fees .
\`\`\`

### Step 2: Install Required Dependencies
\`\`\`bash
flutter pub add provider intl shared_preferences sqflite path pdf printing qr_flutter uuid flutter_local_notifications
\`\`\`

### Step 3: Run Widget Tests
\`\`\`bash
flutter test
\`\`\`

### Step 4: Run on Android Emulator or Connected Device
\`\`\`bash
flutter run -d android
\`\`\`

### Step 5: Build Release APK
\`\`\`bash
# Build universal Release APK:
flutter build apk --release

# The compiled APK is saved at:
# build/app/outputs/flutter-apk/app-release.apk

# Or build split per-ABI APKs (smaller file size):
flutter build apk --split-per-abi
\`\`\`
`
    }
  };

  const currentFileData = flutterFiles[selectedFile] || flutterFiles['pubspec.yaml'];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFileData.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 text-slate-100 rounded-2xl max-w-4xl w-full border border-slate-700 shadow-2xl overflow-hidden flex flex-col h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>Flutter 3.35+ & Dart Codebase</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
                  Android APK Ready
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Organized models, providers, services, UI screens, and APK build commands.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsFlutterModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Two-Column Explorer */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left File Tree Sidebar */}
          <div className="w-52 sm:w-60 bg-slate-950 border-r border-slate-800 p-3 overflow-y-auto space-y-1 text-xs shrink-0">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-2 px-2">
              Project Structure
            </span>

            {Object.keys(flutterFiles).map((key) => {
              const file = flutterFiles[key];
              const isSelected = selectedFile === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedFile(key)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2 transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{file.title}</span>
                </button>
              );
            })}

            <div className="pt-4 border-t border-slate-800 mt-4 px-2 space-y-1.5 text-[11px] text-slate-400">
              <span className="font-bold text-slate-300 block">Architecture Highlights:</span>
              <p>• State: Provider (ChangeNotifier)</p>
              <p>• Local DB: SQLite (sqflite)</p>
              <p>• Receipts: PDF & Printing</p>
              <p>• QR Codes: qr_flutter</p>
            </div>
          </div>

          {/* Right Code Display Area */}
          <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
            <div className="px-4 py-2 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">{currentFileData.path}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <pre className="flex-1 p-4 overflow-auto text-xs font-mono leading-relaxed text-slate-200 bg-slate-900/90 select-text">
              <code>{currentFileData.content}</code>
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-mono">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Run: flutter build apk --release</span>
          </div>

          <button
            type="button"
            onClick={() => setIsFlutterModalOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium"
          >
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
};
