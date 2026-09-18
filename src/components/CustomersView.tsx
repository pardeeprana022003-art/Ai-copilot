import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Phone,
  Mail,
  IndianRupee,
  ShoppingBag,
  Sparkles,
  Send,
  Clock,
  ArrowRight,
  CheckCircle2,
  X,
  Plus,
  Upload,
  FileText,
  AlertCircle,
  Download,
} from 'lucide-react';
import { Customer, CustomerStatus } from '../types';
import { apiService, CustomerMessageResult } from '../services/apiService';

interface CustomersViewProps {
  customers: Customer[];
  businessName: string;
  businessId: string;
  onCustomerAdded?: (customer: Customer) => void;
  onCustomersImported?: (count: number) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  businessName,
  businessId,
  onCustomerAdded,
  onCustomersImported,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Add Customer Form state
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustStatus, setNewCustStatus] = useState<CustomerStatus>('Active');
  const [newCustSpend, setNewCustSpend] = useState('');
  const [newCustNotes, setNewCustNotes] = useState('');
  const [newCustFavs, setNewCustFavs] = useState('');
  const [isSavingCustomer, setIsSavingCustomer] = useState(false);
  const [addCustomerError, setAddCustomerError] = useState<string | null>(null);

  // CSV Import state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);

  // AI Message generation state
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
  const [generatedMessageResult, setGeneratedMessageResult] = useState<CustomerMessageResult | null>(null);
  const [sentSuccessBanner, setSentSuccessBanner] = useState<string | null>(null);

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: CustomerStatus) => {
    switch (status) {
      case 'High Value':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'At Risk':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Inactive':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'New':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleGenerateMessage = async (customer: Customer) => {
    setIsGeneratingMessage(true);
    setGeneratedMessageResult(null);
    try {
      const res = await apiService.generateCustomerMessage(businessId, customer.id);
      if (res && res.data) {
        setGeneratedMessageResult(res.data);
      }
    } catch (err) {
      console.error('Failed to generate message:', err);
    } finally {
      setIsGeneratingMessage(false);
    }
  };

  const handleSendDraft = (customer: Customer) => {
    setSentSuccessBanner(
      `Dispatched message to ${customer.name} via ${generatedMessageResult?.channel || 'WhatsApp'}.`
    );
    setActiveCustomer(null);
    setGeneratedMessageResult(null);
    setTimeout(() => {
      setSentSuccessBanner(null);
    }, 4500);
  };

  // Add Customer Handler
  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim() || !newCustPhone.trim()) {
      setAddCustomerError('Name and phone number are required.');
      return;
    }

    setIsSavingCustomer(true);
    setAddCustomerError(null);
    try {
      const res = await apiService.addCustomer(businessId, {
        name: newCustName.trim(),
        phone: newCustPhone.trim(),
        email: newCustEmail.trim(),
        status: newCustStatus,
        totalSpend: Number(newCustSpend) || 0,
        notes: newCustNotes.trim(),
        favoriteItems: newCustFavs.trim(),
      });

      if (onCustomerAdded && res.customer) {
        onCustomerAdded(res.customer);
      }

      setShowAddModal(false);
      setNewCustName('');
      setNewCustPhone('');
      setNewCustEmail('');
      setNewCustSpend('');
      setNewCustNotes('');
      setNewCustFavs('');
    } catch (err: any) {
      setAddCustomerError(err.message || 'Failed to add customer.');
    } finally {
      setIsSavingCustomer(false);
    }
  };

  // CSV Parsing Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);
    setImportError(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
        if (lines.length < 2) {
          setImportError('CSV file must have at least a header row and 1 data row.');
          return;
        }

        const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/["']/g, ''));
        const nameIdx = headers.findIndex((h) => h.includes('name'));
        const phoneIdx = headers.findIndex((h) => h.includes('phone') || h.includes('mobile'));
        const emailIdx = headers.findIndex((h) => h.includes('email'));
        const spendIdx = headers.findIndex((h) => h.includes('spend') || h.includes('revenue') || h.includes('amount'));
        const notesIdx = headers.findIndex((h) => h.includes('note') || h.includes('item'));

        const rows: any[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map((c) => c.trim().replace(/["']/g, ''));
          const name = nameIdx !== -1 ? cols[nameIdx] : cols[0];
          const phone = phoneIdx !== -1 ? cols[phoneIdx] : cols[1];
          const email = emailIdx !== -1 ? cols[emailIdx] : cols[2];
          const totalSpend = spendIdx !== -1 ? Number(cols[spendIdx]) || 0 : 0;
          const notes = notesIdx !== -1 ? cols[notesIdx] : '';

          if (name && (phone || email)) {
            rows.push({
              name,
              phone: phone || '+91 98450 00000',
              email: email || '',
              totalSpend,
              notes,
              status: totalSpend > 5000 ? 'High Value' : 'Active',
            });
          }
        }

        if (rows.length === 0) {
          setImportError('No valid customer rows could be parsed. Check column formatting.');
        } else {
          setParsedRows(rows);
        }
      } catch (err) {
        setImportError('Failed to parse CSV file. Ensure it is standard comma-separated text.');
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = async () => {
    if (parsedRows.length === 0) return;
    setIsImporting(true);
    setImportError(null);
    try {
      const res = await apiService.importCustomersCSV(businessId, parsedRows);
      if (onCustomersImported) {
        onCustomersImported(res.importedCount || parsedRows.length);
      }
      setImportSuccessMsg(`Successfully imported ${res.importedCount || parsedRows.length} customers!`);
      setTimeout(() => {
        setShowImportModal(false);
        setParsedRows([]);
        setCsvFile(null);
        setImportSuccessMsg(null);
      }, 1500);
    } catch (err: any) {
      setImportError(err.message || 'Failed to import customers.');
    } finally {
      setIsImporting(false);
    }
  };

  const loadSampleCSV = () => {
    const sampleRows = [
      { name: 'Kavita Iyer', phone: '+91 98201 88910', email: 'kavita.i@gmail.com', totalSpend: 4200, notes: 'Prefers weekend slots', status: 'Active' },
      { name: 'Arjun Nambiar', phone: '+91 98451 22301', email: 'arjun.n@tech.com', totalSpend: 8500, notes: 'Corporate bulk client', status: 'High Value' },
      { name: 'Divya Reddy', phone: '+91 99001 44521', email: 'divya.r@outlook.com', totalSpend: 1500, notes: 'Visited once 45 days ago', status: 'At Risk' },
    ];
    setParsedRows(sampleRows);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner if message sent */}
      {sentSuccessBanner && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs font-semibold">{sentSuccessBanner}</span>
          </div>
          <button
            onClick={() => setSentSuccessBanner(null)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">Customer CRM</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
              {customers.length} Profiles Tracked
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Private customer registry for {businessName} with AI behavior tracking &amp; re-engagement drafting
          </p>
        </div>

        {/* Action buttons & Search */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Filters Bar (Only show if customers exist) */}
      {customers.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, phone, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer"
          >
            <option value="all">All Segments ({customers.length})</option>
            <option value="High Value">High Value</option>
            <option value="Active">Active</option>
            <option value="At Risk">At Risk</option>
            <option value="Inactive">Inactive</option>
            <option value="New">New</option>
          </select>
        </div>
      )}

      {/* EMPTY STATE (Requirement 15) */}
      {customers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 border border-indigo-100">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No customers yet</h3>
          <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
            Your customer registry is currently empty. Add your first customer profile manually or upload a CSV file
            exported from your POS, phonebook, or spreadsheet to activate automated purchase tracking and AI
            re-engagement.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setShowImportModal(true)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-2xs"
            >
              <Upload className="w-4 h-4 text-indigo-600" />
              <span>Import Customers (CSV)</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Customer</span>
            </button>
          </div>
        </div>
      ) : (
        /* Customer Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Last Visit</th>
                  <th className="px-4 py-3">Total Spend</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Notes &amp; Preferences</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    onClick={() => {
                      setActiveCustomer(customer);
                      setGeneratedMessageResult(null);
                    }}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                          {customer.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {customer.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {customer.totalPurchases || 1} lifetime orders
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-slate-600">
                      <div className="font-mono text-[11px]">{customer.phone}</div>
                      <div className="text-slate-400 text-[10px] truncate max-w-[130px]">
                        {customer.email || 'No email provided'}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="text-slate-900 font-medium">{customer.lastInteraction || 'Recent'}</div>
                      <div className="text-[10px] text-slate-400">
                        {customer.daysSinceLastPurchase !== undefined ? `${customer.daysSinceLastPurchase} days ago` : 'Active'}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">
                        ₹{(customer.totalSpendINR || customer.totalSpend || 0).toLocaleString('en-IN')}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                          customer.status
                        )}`}
                      >
                        {customer.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 max-w-xs text-slate-600">
                      <div className="truncate font-medium">{customer.favoriteItems || customer.notes || 'General customer'}</div>
                      <div className="text-[10px] text-slate-400 truncate">{customer.notes || 'No special notes'}</div>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveCustomer(customer);
                          handleGenerateMessage(customer);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs inline-flex items-center gap-1 transition cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>AI Message</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AI Customer Message Drawer */}
      {activeCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto p-6 animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm">
                    {activeCustomer.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{activeCustomer.name}</h3>
                    <div className="text-[11px] text-slate-500">{activeCustomer.phone}</div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveCustomer(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 my-4">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Spend</div>
                  <div className="text-base font-black text-slate-900 mt-0.5">
                    ₹{(activeCustomer.totalSpendINR || activeCustomer.totalSpend || 0).toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Segment</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">{activeCustomer.status}</div>
                </div>
              </div>

              {/* AI Draft Box */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Personalized Re-Engagement Draft</span>
                  </span>
                  <button
                    onClick={() => handleGenerateMessage(activeCustomer)}
                    disabled={isGeneratingMessage}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    {isGeneratingMessage ? 'Generating...' : 'Regenerate'}
                  </button>
                </div>

                {isGeneratingMessage ? (
                  <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 text-center">
                    <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-xs text-slate-500">
                      Crafting tailored message based on past purchases &amp; preferences...
                    </p>
                  </div>
                ) : generatedMessageResult ? (
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900">
                        <span>Channel: {generatedMessageResult.channel}</span>
                        <span className="text-emerald-700">{generatedMessageResult.estimatedOpportunity}</span>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-emerald-200 text-slate-900 text-xs whitespace-pre-wrap leading-relaxed shadow-2xs font-sans">
                        {generatedMessageResult.message}
                      </div>
                      <p className="text-[10px] text-emerald-800">
                        <strong>Strategy:</strong> {generatedMessageResult.strategy}
                      </p>
                    </div>

                    <button
                      onClick={() => handleSendDraft(activeCustomer)}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Approve &amp; Send Message</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center">
                    <p className="text-xs text-slate-500 mb-3">
                      Click below to generate a tailored WhatsApp re-engagement message.
                    </p>
                    <button
                      onClick={() => handleGenerateMessage(activeCustomer)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate Draft</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
              Requires 1-click human approval before real customer delivery.
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-base text-slate-900">Add Customer to {businessName}</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {addCustomerError && (
              <div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{addCustomerError}</span>
              </div>
            )}

            <form onSubmit={handleSaveCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Phone / WhatsApp <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  placeholder="+91 98450 12345"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={newCustEmail}
                  onChange={(e) => setNewCustEmail(e.target.value)}
                  placeholder="customer@gmail.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Segment Status</label>
                  <select
                    value={newCustStatus}
                    onChange={(e) => setNewCustStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="High Value">High Value</option>
                    <option value="At Risk">At Risk</option>
                    <option value="New">New</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Spend (₹)</label>
                  <input
                    type="number"
                    value={newCustSpend}
                    onChange={(e) => setNewCustSpend(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Favorite Offerings / Services</label>
                <input
                  type="text"
                  value={newCustFavs}
                  onChange={(e) => setNewCustFavs(e.target.value)}
                  placeholder="e.g. Keratin treatment, Cappuccino, Consultation"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Internal Notes</label>
                <textarea
                  rows={2}
                  value={newCustNotes}
                  onChange={(e) => setNewCustNotes(e.target.value)}
                  placeholder="Preferences, preferred times, or history..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingCustomer}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {isSavingCustomer ? 'Saving...' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal (Requirement 12) */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">Import Customers CSV</h3>
                <p className="text-xs text-slate-500">Upload customer data into {businessName}</p>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {importError && (
              <div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{importError}</span>
              </div>
            )}

            {importSuccessMsg ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">{importSuccessMsg}</h4>
                <p className="text-xs text-slate-500">All records tagged and isolated for {businessName}.</p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* File picker */}
                <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-6 text-center transition bg-slate-50">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">Choose a CSV file or drag &amp; drop</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Columns supported: <code>name</code>, <code>phone</code>, <code>email</code>, <code>totalSpend</code>, <code>notes</code>
                  </p>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="mt-3 text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Want to test quickly?</span>
                  <button
                    type="button"
                    onClick={loadSampleCSV}
                    className="text-indigo-600 font-semibold hover:underline cursor-pointer"
                  >
                    Load 3 Sample Indian SME Customer Rows
                  </button>
                </div>

                {/* Preview table */}
                {parsedRows.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-slate-900">
                        Parsed Preview ({parsedRows.length} rows ready)
                      </span>
                    </div>
                    <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-left text-[11px]">
                        <thead className="bg-slate-100 text-slate-600">
                          <tr>
                            <th className="p-2">Name</th>
                            <th className="p-2">Phone</th>
                            <th className="p-2">Email</th>
                            <th className="p-2">Spend</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {parsedRows.slice(0, 5).map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="p-2 font-medium text-slate-900">{row.name}</td>
                              <td className="p-2 text-slate-600">{row.phone}</td>
                              <td className="p-2 text-slate-400 truncate max-w-[100px]">{row.email || '—'}</td>
                              <td className="p-2 font-semibold">₹{row.totalSpend}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowImportModal(false)}
                    className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={parsedRows.length === 0 || isImporting}
                    onClick={handleConfirmImport}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold disabled:opacity-50 cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    {isImporting ? 'Importing...' : `Import ${parsedRows.length} Customers`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
