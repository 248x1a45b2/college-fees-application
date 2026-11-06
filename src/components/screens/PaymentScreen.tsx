import React, { useState } from 'react';
import { useCollegeFees } from '../../context/CollegeFeesContext';
import { TopAppBar, BottomNavBar } from '../common/AppNavigation';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  QrCode, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PaymentMethod } from '../../types';

export const PaymentScreen: React.FC = () => {
  const { currentStudent, pendingPaymentConfig, processPayment, navigateTo, goBack } = useCollegeFees();

  if (!currentStudent) {
    return (
      <div className="flex-1 flex flex-col justify-between">
        <TopAppBar title="Payment Gateway" showBack onBack={goBack} />
        <div className="p-6 text-center text-sm text-slate-500">No student profile selected.</div>
        <BottomNavBar />
      </div>
    );
  }

  // Calculate default amount
  const totalFees = currentStudent.feeItems.reduce((acc, curr) => acc + curr.amount, 0);
  const paidFees = currentStudent.feeItems.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const totalRemaining = Math.max(0, totalFees - paidFees);

  const initialAmount = pendingPaymentConfig?.suggestedAmount ?? (totalRemaining > 0 ? totalRemaining : 5000);
  const initialCategory = pendingPaymentConfig?.category ?? (pendingPaymentConfig?.feeItemId ? 'Selected Fee Head' : 'Tuition & College Fees');

  const [paymentAmount, setPaymentAmount] = useState<number>(initialAmount);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('upi');
  const [feeCategory, setFeeCategory] = useState<string>(initialCategory);
  
  // Specific method inputs
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'id'>('gpay');
  const [upiId, setUpiId] = useState('rahul.indla@okhdfcbank');
  
  const [cardNumber, setCardNumber] = useState('4532 8920 1204 9012');
  const [cardHolder, setCardHolder] = useState(currentStudent.name.toUpperCase());
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('781');
  
  const [bankName, setBankName] = useState('HDFC Bank');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    if (paymentAmount <= 0) {
      setPaymentError('Please enter a valid payment amount greater than ₹0.');
      return;
    }

    setIsProcessing(true);

    // Simulate Payment Gateway Network Handshake (1.4 seconds)
    setTimeout(async () => {
      if (simulateFailure) {
        setIsProcessing(false);
        setPaymentError('Payment Failed: Bank server timed out. (Simulated Failure Mode). Your account was not charged.');
        return;
      }

      let methodDetails = '';
      if (selectedMethod === 'upi') {
        methodDetails = upiApp === 'id' ? `UPI ID: ${upiId}` : `${upiApp.toUpperCase()} · ${upiId}`;
      } else if (selectedMethod === 'card') {
        methodDetails = `Card: •••• ${cardNumber.slice(-4)} (${cardHolder})`;
      } else if (selectedMethod === 'netbanking') {
        methodDetails = `Net Banking: ${bankName}`;
      } else {
        methodDetails = `Campus Dynamic QR Payment`;
      }

      try {
        const transaction = await processPayment({
          studentId: currentStudent.id,
          amount: paymentAmount,
          method: selectedMethod,
          methodDetails,
          feeCategory,
          feeItemId: pendingPaymentConfig?.feeItemId
        });

        // Fire celebration confetti
        try {
          confetti({
            particleCount: 65,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore if canvas-confetti is not loaded
        }

        setIsProcessing(false);
        // Navigate directly to Screen 8: Digital Receipt Screen
        navigateTo('digital_receipt', { receipt: transaction });
      } catch (err) {
        setIsProcessing(false);
        setPaymentError('An unexpected gateway error occurred. Please retry.');
      }
    }, 1400);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <TopAppBar
        title="Payment Gateway"
        subtitle="Secure College Fee Payment"
        showBack
        onBack={goBack}
      />

      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-6">
        {/* Payment Order Summary Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between mb-3 text-xs text-slate-500 dark:text-slate-400">
            <span>Student: <strong className="text-slate-900 dark:text-white font-semibold">{currentStudent.name}</strong></span>
            <span className="font-mono">{currentStudent.rollNumber}</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                Fee Category / Description
              </label>
              <input
                type="text"
                value={feeCategory}
                onChange={(e) => setFeeCategory(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-medium"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                  Payment Amount (₹)
                </label>
                {totalRemaining > 0 && (
                  <button
                    type="button"
                    onClick={() => setPaymentAmount(totalRemaining)}
                    className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                  >
                    Pay Full Pending (₹{totalRemaining.toLocaleString('en-IN')})
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                  ₹
                </div>
                <input
                  type="number"
                  min={100}
                  max={250000}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 text-base font-bold font-mono tabular-nums rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Error Feedback */}
        {paymentError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block">Transaction Unsuccessful</span>
              <span className="text-[11px]">{paymentError}</span>
            </div>
          </div>
        )}

        {/* Payment Methods Tabs */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
            Choose Payment Method
          </h3>

          <div className="grid grid-cols-4 gap-2 mb-4">
            <button
              type="button"
              onClick={() => setSelectedMethod('upi')}
              className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                selectedMethod === 'upi'
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span className="text-[10px] tracking-tight">UPI Apps</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('card')}
              className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                selectedMethod === 'card'
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span className="text-[10px] tracking-tight">Debit/Credit</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('netbanking')}
              className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                selectedMethod === 'netbanking'
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span className="text-[10px] tracking-tight">NetBanking</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('qr')}
              className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                selectedMethod === 'qr'
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span className="text-[10px] tracking-tight">Scan QR</span>
            </button>
          </div>

          {/* Form for Method 1: UPI */}
          {selectedMethod === 'upi' && (
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'gpay', name: 'Google Pay' },
                  { id: 'phonepe', name: 'PhonePe' },
                  { id: 'paytm', name: 'Paytm' },
                  { id: 'id', name: 'Other UPI' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setUpiApp(item.id as any);
                      if (item.id === 'gpay') setUpiId('rahul.indla@okhdfcbank');
                      if (item.id === 'phonepe') setUpiId('9848022341@ybl');
                      if (item.id === 'paytm') setUpiId('9848022341@paytm');
                    }}
                    className={`py-1.5 px-1 rounded-lg text-[10px] font-semibold border text-center truncate ${
                      upiApp === item.id
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Virtual Payment Address (VPA / UPI ID)
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="name@bank"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono"
                />
              </div>
            </div>
          )}

          {/* Form for Method 2: CARD */}
          {selectedMethod === 'card' && (
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  16-Digit Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4532 8920 1204 9012"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Valid Thru (MM/YY)
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="08/28"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    CVV / CVC
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="•••"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form for Method 3: NETBANKING */}
          {selectedMethod === 'netbanking' && (
            <div className="space-y-3 pt-1">
              <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                Select Your Bank
              </label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-medium"
              >
                <option value="HDFC Bank">HDFC Bank</option>
                <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                <option value="ICICI Bank">ICICI Bank</option>
                <option value="Axis Bank">Axis Bank</option>
                <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                <option value="Punjab National Bank">Punjab National Bank</option>
              </select>
              <p className="text-[11px] text-slate-500">
                You will be seamlessly authorized through your bank&apos;s corporate payment gateway.
              </p>
            </div>
          )}

          {/* Form for Method 4: QR CODE */}
          {selectedMethod === 'qr' && (
            <div className="text-center py-2 space-y-3">
              <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                <QrCode className="w-24 h-24 text-slate-800" />
                <span className="text-[9px] font-mono text-slate-500 mt-1">UPI Dynamic QR</span>
              </div>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Open any UPI App (Google Pay, PhonePe, Paytm, BHIM) and scan this dynamic college fee QR code.
              </p>
            </div>
          )}
        </div>

        {/* Security & Failure Simulator Toggle */}
        <div className="flex items-center justify-between px-1 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Encrypted Gateway</span>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-500 hover:text-slate-700">
            <input
              type="checkbox"
              checked={simulateFailure}
              onChange={(e) => setSimulateFailure(e.target.checked)}
              className="rounded-xs text-rose-600 focus:ring-rose-500"
            />
            <span>Simulate Error State</span>
          </label>
        </div>

        {/* Pay CTA Button */}
        <button
          type="button"
          disabled={isProcessing}
          onClick={handlePayNow}
          className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-70 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying with Payment Gateway...</span>
            </>
          ) : (
            <>
              <span>Authorize & Pay ₹{paymentAmount.toLocaleString('en-IN')}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      <BottomNavBar />
    </div>
  );
};
