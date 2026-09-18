import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  signOut as fbSignOut,
  GoogleAuthProvider,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { DriveFileItem } from '../types';

export const GOOGLE_WORKSPACE_SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
];

// Initialize Firebase App safely (reuse if already initialized)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
for (const scope of GOOGLE_WORKSPACE_SCOPES) {
  provider.addScope(scope);
}
// Force account selection prompt so users can easily pick their account
provider.setCustomParameters({
  prompt: 'select_account',
});

// Cache the access token and user in memory only (MANDATORY: never in localStorage)
let cachedAccessToken: string | null = null;
let cachedUser: FirebaseUser | null = null;
let isSigningIn = false;

type AuthChangeListener = (user: FirebaseUser | null, token: string | null) => void;
const listeners: Set<AuthChangeListener> = new Set();

const notifyListeners = () => {
  listeners.forEach((listener) => {
    try {
      listener(cachedUser, cachedAccessToken);
    } catch (e) {
      console.error('Error notifying auth listener:', e);
    }
  });
};

// Initialize auth state listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    cachedUser = user;
    // If user is present but we don't have token cached yet (e.g. page refresh),
    // we notify listeners that user is logged in, but token may require user interaction or re-authentication
    notifyListeners();
  } else {
    cachedUser = null;
    cachedAccessToken = null;
    notifyListeners();
  }
});

export const googleDriveService = {
  /**
   * Subscribe to Google Auth changes
   */
  onAuthChange(callback: AuthChangeListener): () => void {
    listeners.add(callback);
    // Immediate notification
    callback(cachedUser, cachedAccessToken);
    return () => {
      listeners.delete(callback);
    };
  },

  /**
   * Get current cached access token (in-memory)
   */
  getAccessToken(): string | null {
    return cachedAccessToken;
  },

  /**
   * Get current Google Firebase User
   */
  getUser(): FirebaseUser | null {
    return cachedUser || auth.currentUser;
  },

  /**
   * Check if user is authenticated with Google Drive token
   */
  isConnected(): boolean {
    return Boolean(cachedAccessToken);
  },

  /**
   * Sign in with Google Popup and obtain Drive OAuth access token
   */
  async signInWithGoogle(): Promise<{ user: FirebaseUser; accessToken: string }> {
    if (isSigningIn) {
      throw new Error('Sign-in is already in progress');
    }
    isSigningIn = true;
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (!credential?.accessToken) {
        throw new Error('Google Drive access token was not returned by OAuth provider');
      }

      cachedAccessToken = credential.accessToken;
      cachedUser = result.user;
      notifyListeners();
      return { user: result.user, accessToken: cachedAccessToken };
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      throw err;
    } finally {
      isSigningIn = false;
    }
  },

  /**
   * Disconnect / Sign out from Google Drive
   */
  async signOut(): Promise<void> {
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.warn('Sign out warning:', e);
    } finally {
      cachedAccessToken = null;
      cachedUser = null;
      notifyListeners();
    }
  },

  /**
   * List files created by this app in Google Drive
   */
  async listDriveFiles(): Promise<DriveFileItem[]> {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('Google Drive is not connected. Please connect your Google account first.');
    }

    const query = encodeURIComponent("trashed = false");
    const fields = encodeURIComponent(
      'files(id, name, mimeType, size, modifiedTime, createdTime, webViewLink, webContentLink, description)'
    );

    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&orderBy=modifiedTime%20desc&pageSize=50`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      if (res.status === 401) {
        cachedAccessToken = null;
        notifyListeners();
        throw new Error('Google Drive session expired. Please reconnect your Google account.');
      }
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error?.message || `Failed to fetch Google Drive files (HTTP ${res.status})`);
    }

    const data = await res.json();
    return data.files || [];
  },

  /**
   * Upload a file (JSON, CSV, or Markdown) to Google Drive using multipart upload
   */
  async uploadFile(options: {
    name: string;
    content: string;
    mimeType: string;
    description?: string;
  }): Promise<DriveFileItem> {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('Google Drive is not connected. Please connect your Google account first.');
    }

    const metadata = {
      name: options.name,
      mimeType: options.mimeType,
      description: options.description || 'Saved from AI Business Autopilot',
    };

    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      `Content-Type: ${options.mimeType}; charset=UTF-8\r\n\r\n` +
      options.content +
      closeDelimiter;

    const res = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size,modifiedTime,createdTime,webViewLink,webContentLink,description',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body: multipartRequestBody,
      }
    );

    if (!res.ok) {
      if (res.status === 401) {
        cachedAccessToken = null;
        notifyListeners();
        throw new Error('Google Drive session expired. Please reconnect your Google account.');
      }
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error?.message || `Failed to upload file to Google Drive (HTTP ${res.status})`);
    }

    return await res.json();
  },

  /**
   * Read contents of a file from Google Drive
   */
  async readFileContent(fileId: string): Promise<string> {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('Google Drive is not connected. Please connect your Google account first.');
    }

    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        cachedAccessToken = null;
        notifyListeners();
        throw new Error('Google Drive session expired. Please reconnect your Google account.');
      }
      throw new Error(`Failed to download file from Google Drive (HTTP ${res.status})`);
    }

    return await res.text();
  },

  /**
   * Delete a file from Google Drive
   * (UI MUST present explicit user confirmation before calling this)
   */
  async deleteFile(fileId: string): Promise<void> {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('Google Drive is not connected. Please connect your Google account first.');
    }

    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        cachedAccessToken = null;
        notifyListeners();
        throw new Error('Google Drive session expired. Please reconnect your Google account.');
      }
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error?.message || `Failed to delete file from Google Drive (HTTP ${res.status})`);
    }
  },

  /**
   * Helper: Export full business snapshot to Google Drive
   */
  async backupBusinessToDrive(businessName: string, snapshotData: any): Promise<DriveFileItem> {
    const cleanName = (businessName || 'Business').replace(/[^a-zA-Z0-9]/g, '_');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `AutoPilot_Backup_${cleanName}_${timestamp}.json`;

    const backupPayload = {
      meta: {
        app: 'AI Business Autopilot',
        exportedAt: new Date().toISOString(),
        version: '1.0',
        businessName,
      },
      ...snapshotData,
    };

    return await this.uploadFile({
      name: filename,
      content: JSON.stringify(backupPayload, null, 2),
      mimeType: 'application/json',
      description: `Full data backup for ${businessName} saved by AI Business Autopilot.`,
    });
  },

  /**
   * Helper: Export customers list as CSV to Google Drive
   */
  async exportCustomersToDrive(businessName: string, customers: any[]): Promise<DriveFileItem> {
    const cleanName = (businessName || 'Business').replace(/[^a-zA-Z0-9]/g, '_');
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `Customers_${cleanName}_${dateStr}.csv`;

    // Build CSV
    const headers = [
      'Customer ID',
      'Name',
      'Phone',
      'Email',
      'Status',
      'Total Spend (INR)',
      'Total Visits',
      'Days Inactive',
      'Favorite Items / Services',
      'Notes',
    ];

    const rows = customers.map((c) => [
      `"${c.id || ''}"`,
      `"${(c.name || '').replace(/"/g, '""')}"`,
      `"${(c.phone || '').replace(/"/g, '""')}"`,
      `"${(c.email || '').replace(/"/g, '""')}"`,
      `"${c.status || 'Active'}"`,
      c.totalSpendINR || c.totalSpend || 0,
      c.totalPurchases || c.totalOrders || 0,
      c.daysSinceLastPurchase || 0,
      `"${(c.favoriteItems || c.favoriteServices || '').replace(/"/g, '""')}"`,
      `"${(c.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    return await this.uploadFile({
      name: filename,
      content: csvContent,
      mimeType: 'text/csv',
      description: `Customer directory export for ${businessName} (${customers.length} records).`,
    });
  },

  /**
   * Helper: Export AI Strategic Audit Report to Google Drive
   */
  async exportAuditReportToDrive(businessName: string, markdownContent: string): Promise<DriveFileItem> {
    const cleanName = (businessName || 'Business').replace(/[^a-zA-Z0-9]/g, '_');
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `AI_Strategic_Audit_${cleanName}_${dateStr}.md`;

    return await this.uploadFile({
      name: filename,
      content: markdownContent,
      mimeType: 'text/markdown',
      description: `Executive strategic audit report for ${businessName} generated by AI Copilot.`,
    });
  },
};
