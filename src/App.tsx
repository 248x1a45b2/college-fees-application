/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CollegeFeesProvider, useCollegeFees } from './context/CollegeFeesContext';
import { DeviceFrame } from './components/common/DeviceFrame';
import { SplashScreen } from './components/screens/SplashScreen';
import { AuthScreen } from './components/screens/AuthScreen';
import { StudentDashboardScreen } from './components/screens/StudentDashboardScreen';
import { StudentDetailsScreen } from './components/screens/StudentDetailsScreen';
import { FeeDetailsScreen } from './components/screens/FeeDetailsScreen';
import { PaymentScreen } from './components/screens/PaymentScreen';
import { PaymentHistoryScreen } from './components/screens/PaymentHistoryScreen';
import { DigitalReceiptScreen } from './components/screens/DigitalReceiptScreen';
import { AdminDashboardScreen } from './components/screens/AdminDashboardScreen';
import { ReportsScreen } from './components/screens/ReportsScreen';
import { TeamMembersScreen } from './components/screens/TeamMembersScreen';
import { FlutterSourceCodeModal } from './components/modals/FlutterSourceCodeModal';

const AppScreenRouter: React.FC = () => {
  const { currentScreen } = useCollegeFees();

  switch (currentScreen) {
    case 'splash':
      return <SplashScreen />;
    case 'login':
      return <AuthScreen />;
    case 'student_dashboard':
      return <StudentDashboardScreen />;
    case 'student_details':
      return <StudentDetailsScreen />;
    case 'fee_details':
      return <FeeDetailsScreen />;
    case 'payment':
      return <PaymentScreen />;
    case 'payment_history':
      return <PaymentHistoryScreen />;
    case 'digital_receipt':
      return <DigitalReceiptScreen />;
    case 'admin_dashboard':
      return <AdminDashboardScreen />;
    case 'reports':
      return <ReportsScreen />;
    case 'team_members':
      return <TeamMembersScreen />;
    default:
      return <StudentDashboardScreen />;
  }
};

export default function App() {
  return (
    <CollegeFeesProvider>
      <DeviceFrame>
        <AppScreenRouter />
      </DeviceFrame>
      <FlutterSourceCodeModal />
    </CollegeFeesProvider>
  );
}
