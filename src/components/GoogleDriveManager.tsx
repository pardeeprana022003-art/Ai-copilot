import React, { useState, useEffect, useCallback } from 'react';
import {
  HardDrive,
  UploadCloud,
  FileText,
  Users,
  Calendar,
  ExternalLink,
  Trash2,
  Eye,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Shield,
  FileSpreadsheet,
  DownloadCloud,
  FileJson,
  Database,
  Lock,
  ArrowUpRight,
  LogOut,
  X,
} from 'lucide-react';
import { googleDriveService } from '../services/googleDriveService';
import { DriveFileItem, BusinessProfile, CustomerRecord, ReviewItem, ActionTask, ConversationThread } from '../types';

interface GoogleDriveManagerProps {
  business: BusinessProfile | null;
  customers: CustomerRecord[];
  conversations: ConversationThread[];
  reviews: ReviewItem[];
  tasks: ActionTask[];
  onDataRestored?: () => void;
  onClose?: () => void;
}

export const GoogleDriveManager: React.FC<GoogleDriveManagerProps> = ({
  business,
  customers,
  conversations,
  reviews,
  tasks,
  onDataRestored,
  onClose,
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(googleDriveService.isConnected());
  const [googleUser, setGoogleUser] = useState<any>(googleDriveService.getUser());
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [isExportingAudit, setIsExportingAudit] = useState(false);
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // File preview modal
  const [previewFile, setPreviewFile] = useState<DriveFileItem | null>(null);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  // Delete confirmation modal (MANDATORY User Confirmation for Destructive Operations)
  const [fileToDelete, setFileToDelete] = useState<DriveFileItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Subscribe to auth state
  useEffect(() => {
    const unsubscribe = googleDriveService.onAuthChange((user, token) => {
      setIsConnected(Boolean(token));
      setGoogleUser(user);
    });
    return unsubscribe;
  }, []);

  const loadFiles = useCallback(async () => {
    if (!googleDriveService.isConnected()) return;
    setIsLoadingFiles(true);
    try {
      const files = await googleDriveService.listDriveFiles();
      setDriveFiles(files);
    } catch (err: any) {
      console.error('Failed to list files:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to load files from Google Drive',
      });
    } finally {
      setIsLoadingFiles(false);
    }
  }, []);

  useEffect(() => {
    if (isConnected) {
      loadFiles();
    } else {
      setDriveFiles([]);
    }
  }, [isConnected, loadFiles]);

  const handleConnectGoogle = async () => {
    setIsLoadingAuth(true);
    setStatusMessage(null);
    try {
      const res = await googleDriveService.signInWithGoogle();
      setIsConnected(true);
      setGoogleUser(res.user);
      setStatusMessage({
        type: 'success',
        text: `Connected to Google Drive as ${res.user.email || 'authorized user'}.`,
      });
      await loadFiles();
    } catch (err: any) {
      console.error('Google Drive auth failed:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to sign in with Google.',
      });
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleDisconnectGoogle = async () => {
    await googleDriveService.signOut();
    setIsConnected(false);
    setGoogleUser(null);
    setDriveFiles([]);
    setStatusMessage({
      type: 'success',
      text: 'Disconnected Google Drive account.',
    });
  };

  // Full Business JSON Backup
  const handleCreateFullBackup = async () => {
    if (!business) return;
    setIsBackingUp(true);
    setStatusMessage(null);
    try {
      const snapshot = {
        business,
        customers,
        conversations,
        reviews,
        tasks,
        analytics: {
          exportedAt: new Date().toISOString(),
          customerCount: customers.length,
          activeConversations: conversations.length,
          reviewsCount: reviews.length,
        },
      };

      const file = await googleDriveService.backupBusinessToDrive(business.name, snapshot);
      setDriveFiles((prev) => [file, ...prev]);
      setStatusMessage({
        type: 'success',
        text: `Successfully backed up business data to Google Drive (${file.name})`,
      });
    } catch (err: any) {
      console.error('Backup failed:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to create backup in Google Drive',
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  // Export Customers CSV
  const handleExportCustomersCSV = async () => {
    if (!business) return;
    setIsExportingCSV(true);
    setStatusMessage(null);
    try {
      const file = await googleDriveService.exportCustomersToDrive(business.name, customers);
      setDriveFiles((prev) => [file, ...prev]);
      setStatusMessage({
        type: 'success',
        text: `Exported ${customers.length} customer records to Google Drive (${file.name})`,
      });
    } catch (err: any) {
      console.error('CSV export failed:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to export customer records to Google Drive',
      });
    } finally {
      setIsExportingCSV(false);
    }
  };

  // Export AI Strategic Audit Report (Markdown)
  const handleExportAuditReport = async () => {
    if (!business) return;
    setIsExportingAudit(true);
    setStatusMessage(null);
    try {
      const markdown = `# Executive Business & Operational Audit: ${business.name}
**Date of Audit:** ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}  
**Operating Category:** ${business.category}  
**Location:** ${business.location}  
**Monthly Revenue:** ₹${(business.monthlyRevenue || 0).toLocaleString('en-IN')}  

---

## 1. Executive Summary & Health Index
- **Total Registered Customers:** ${customers.length}
- **High-Value Champions:** ${customers.filter((c) => c.status === 'High Value').length}
- **At-Risk / Dormant Accounts:** ${customers.filter((c) => (c.daysSinceLastPurchase || 0) > 45).length}
- **Average Customer Rating:** ${business.avgRating || 4.8} / 5.0 (${reviews.length} reviews analyzed)
- **Active Dialogue Threads:** ${conversations.length} inquiries across WhatsApp and Web

---

## 2. Customer Retention & Churn Analysis
| Status | Count | Revenue Contribution (Est) |
|---|---|---|
| High Value | ${customers.filter((c) => c.status === 'High Value').length} | ~55% of recurring monthly receipts |
| Active Regular | ${customers.filter((c) => c.status === 'Active').length} | ~35% steady volume |
| Inactive / At Risk | ${customers.filter((c) => (c.daysSinceLastPurchase || 0) > 45).length} | Untapped reactivation opportunity |

---

## 3. Autonomous Operational Tasks
- **Pending Actions in Queue:** ${tasks.filter((t) => t.status === 'pending').length}
- **Approved / Completed Tasks:** ${tasks.filter((t) => t.status === 'approved' || t.status === 'completed').length}

*Generated automatically by AI Business Autopilot for Google Drive Storage Vault.*
`;

      const file = await googleDriveService.exportAuditReportToDrive(business.name, markdown);
      setDriveFiles((prev) => [file, ...prev]);
      setStatusMessage({
        type: 'success',
        text: `Saved AI Strategic Audit report to Google Drive (${file.name})`,
      });
    } catch (err: any) {
      console.error('Audit report export failed:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to save AI report to Google Drive',
      });
    } finally {
      setIsExportingAudit(false);
    }
  };

  // Preview file content
  const handleOpenPreview = async (file: DriveFileItem) => {
    setPreviewFile(file);
    setIsLoadingPreview(true);
    setPreviewContent('');
    try {
      const content = await googleDriveService.readFileContent(file.id);
      setPreviewContent(content);
    } catch (err: any) {
      setPreviewContent(`Error reading file: ${err.message}`);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  // Delete file (confirmed in modal)
  const handleConfirmDelete = async () => {
    if (!fileToDelete) return;
    setIsDeleting(true);
    try {
      await googleDriveService.deleteFile(fileToDelete.id);
      setDriveFiles((prev) => prev.filter((f) => f.id !== fileToDelete.id));
      setStatusMessage({
        type: 'success',
        text: `Permanently removed "${fileToDelete.name}" from Google Drive.`,
      });
      setFileToDelete(null);
    } catch (err: any) {
      console.error('Delete failed:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to delete file from Google Drive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const formatFileSize = (bytes?: string | number) => {
    if (!bytes) return 'Unknown size';
    const num = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;
    if (isNaN(num)) return 'Unknown size';
    if (num < 1024) return `${num} B`;
    if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
    return `${(num / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFileBadge = (mimeType: string, name: string) => {
    if (name.endsWith('.json') || mimeType.includes('json')) {
      return {
        label: 'Full Snapshot JSON',
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        icon: FileJson,
      };
    }
    if (name.endsWith('.csv') || mimeType.includes('csv')) {
      return {
        label: 'Customers CSV',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: FileSpreadsheet,
      };
    }
    if (name.endsWith('.md') || mimeType.includes('markdown') || mimeType.includes('text')) {
      return {
        label: 'Strategic Report',
        color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        icon: FileText,
      };
    }
    return {
      label: 'Document',
      color: 'bg-slate-100 text-slate-800 border-slate-200',
      icon: HardDrive,
    };
  };

  return (
    <div id="google-drive-manager" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-xs shrink-0">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Google Drive Cloud Storage</h2>
              {isConnected ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Not Connected
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Sync and archive your business catalog, customer database, conversation logs, and AI audit reports directly into your personal or company Google Drive account.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
            title="Close Storage Manager"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Status Notifications */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-sm ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-xs font-semibold underline hover:opacity-75 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Connection Panel */}
      {!isConnected ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center max-w-2xl mx-auto shadow-xs">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <HardDrive className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Connect Your Google Drive Account</h3>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Securely link Google Drive to enable automated business backups, export customer directories, and store strategic AI audits. The app only accesses files it creates (<code>drive.file</code> scope).
          </p>

          {/* Official Google Sign-in styled button */}
          <div className="flex justify-center">
            <button
              id="google-drive-auth-btn"
              onClick={handleConnectGoogle}
              disabled={isLoadingAuth}
              className="inline-flex items-center gap-3 px-6 py-3 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoadingAuth ? (
                <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
              )}
              <span>{isLoadingAuth ? 'Connecting to Google...' : 'Sign in with Google to Connect Drive'}</span>
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              Encrypted OAuth 2.0
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              Limited Scope (drive.file)
            </span>
          </div>
        </div>
      ) : (
        <>
          {/* Active Account Details & Quick Actions Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Account Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
                  <span>Connected Account</span>
                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Active Session
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {googleUser?.photoURL ? (
                    <img
                      src={googleUser.photoURL}
                      alt="Google User"
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-full border border-slate-200"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-base">
                      {(googleUser?.displayName || googleUser?.email || 'G').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {googleUser?.displayName || 'Google Account'}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{googleUser?.email}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Drive Vault Items:</span>
                  <span className="font-bold text-slate-800">{driveFiles.length} files</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={loadFiles}
                  disabled={isLoadingFiles}
                  className="text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFiles ? 'animate-spin' : ''}`} />
                  Refresh Files
                </button>
                <button
                  onClick={handleDisconnectGoogle}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Disconnect
                </button>
              </div>
            </div>

            {/* Quick Export Actions */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                  1-Click Drive Storage &amp; Sync
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Full Backup */}
                  <button
                    id="btn-create-full-backup"
                    onClick={handleCreateFullBackup}
                    disabled={isBackingUp || !business}
                    className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-left transition-all group cursor-pointer disabled:opacity-50"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                      {isBackingUp ? (
                        <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Database className="w-4 h-4" />
                      )}
                    </div>
                    <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-900">
                      Full Business Backup
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Snapshots customers, chats, reviews &amp; revenue into JSON.
                    </p>
                  </button>

                  {/* Customer CSV Export */}
                  <button
                    id="btn-export-customers-csv"
                    onClick={handleExportCustomersCSV}
                    disabled={isExportingCSV || !business}
                    className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 text-left transition-all group cursor-pointer disabled:opacity-50"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                      {isExportingCSV ? (
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FileSpreadsheet className="w-4 h-4" />
                      )}
                    </div>
                    <div className="text-sm font-bold text-slate-900 group-hover:text-blue-900">
                      Sync Customers (CSV)
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Exports directory with purchase volume and contact info.
                    </p>
                  </button>

                  {/* AI Strategic Audit Markdown */}
                  <button
                    id="btn-export-strategic-audit"
                    onClick={handleExportAuditReport}
                    disabled={isExportingAudit || !business}
                    className="p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 text-left transition-all group cursor-pointer disabled:opacity-50"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                      {isExportingAudit ? (
                        <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                    </div>
                    <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-900">
                      AI Strategic Audit
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Generates executive markdown audit for strategic review.
                    </p>
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Files are saved directly into your root Google Drive folder.
                </span>
                <span className="text-slate-400">Target Workspace: {business?.name || 'Store'}</span>
              </div>
            </div>
          </div>

          {/* Files List Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Google Drive Files Vault</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  All backups and reports saved by this application in your Google Drive.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                  {driveFiles.length} file{driveFiles.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>

            {isLoadingFiles ? (
              <div className="p-12 text-center">
                <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-slate-500">Querying Google Drive files...</p>
              </div>
            ) : driveFiles.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <HardDrive className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">No backups saved yet</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                  Use the quick export buttons above to create your first business snapshot or customer spreadsheet in Google Drive.
                </p>
                <button
                  onClick={handleCreateFullBackup}
                  disabled={isBackingUp || !business}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                >
                  <UploadCloud className="w-4 h-4" />
                  Create First Backup Now
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                      <th className="py-3 px-4">File Name</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Size</th>
                      <th className="py-3 px-4">Last Modified</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {driveFiles.map((file) => {
                      const badge = getFileBadge(file.mimeType, file.name);
                      const BadgeIcon = badge.icon;
                      return (
                        <tr key={file.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                                <BadgeIcon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="font-semibold text-slate-900 truncate max-w-xs sm:max-w-md">
                                  {file.name}
                                </div>
                                {file.description && (
                                  <div className="text-[11px] text-slate-400 truncate max-w-xs">
                                    {file.description}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${badge.color}`}
                            >
                              {badge.label}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-mono">
                            {formatFileSize(file.size)}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                            {file.modifiedTime ? new Date(file.modifiedTime).toLocaleString() : 'N/A'}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-right">
                            <div className="inline-flex items-center gap-1">
                              {/* Open in Drive */}
                              {file.webViewLink && (
                                <a
                                  href={file.webViewLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors inline-flex items-center gap-1"
                                  title="Open in Google Drive"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}

                              {/* Preview File */}
                              <button
                                onClick={() => handleOpenPreview(file)}
                                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                title="Inspect Backup Content"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Delete File with Mandatory Confirmation */}
                              <button
                                onClick={() => setFileToDelete(file)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete from Google Drive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* MANDATORY USER CONFIRMATION DIALOG FOR DESTRUCTIVE ACTION (DELETION)  */}
      {/* --------------------------------------------------------------------- */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Delete file from Google Drive?
            </h3>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-slate-900 break-all">{fileToDelete.name}</strong> from your
              Google Drive? This action cannot be undone.
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl mb-6 text-xs text-slate-500 space-y-1">
              <div><strong>File ID:</strong> <span className="font-mono">{fileToDelete.id}</span></div>
              <div><strong>Size:</strong> {formatFileSize(fileToDelete.size)}</div>
              <div><strong>Last Modified:</strong> {fileToDelete.modifiedTime ? new Date(fileToDelete.modifiedTime).toLocaleString() : 'N/A'}</div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setFileToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-delete-drive-file"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>{isDeleting ? 'Deleting...' : 'Yes, Delete from Drive'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* FILE INSPECTION / PREVIEW MODAL                                        */}
      {/* --------------------------------------------------------------------- */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{previewFile.name}</h4>
                  <p className="text-xs text-slate-500">
                    {formatFileSize(previewFile.size)} • {previewFile.modifiedTime ? new Date(previewFile.modifiedTime).toLocaleString() : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {previewFile.webViewLink && (
                  <a
                    href={previewFile.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 border border-indigo-200 rounded-lg"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open in Drive
                  </a>
                )}
                <button
                  onClick={() => setPreviewFile(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-5 overflow-y-auto flex-1 bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed">
              {isLoadingPreview ? (
                <div className="p-12 text-center text-slate-400">
                  <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Loading file stream from Google Drive...
                </div>
              ) : (
                <pre className="whitespace-pre-wrap break-words">{previewContent}</pre>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500">
              <span>Read-only inspection of Google Drive backup artifact.</span>
              <button
                onClick={() => setPreviewFile(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
