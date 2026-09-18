import { BusinessProfile, Customer, ReviewItem, User } from '../types';

const TOKEN_KEY = 'ai_business_autopilot_token';
const ACTIVE_BIZ_KEY = 'ai_business_autopilot_active_biz';

export interface ScanResult {
  overallScore: number;
  categories: Array<{
    id: string;
    name: string;
    score: number;
    problems: string[];
    opportunity: string;
    recommendedAction: string;
    priority: 'urgent' | 'high' | 'medium' | 'low';
  }>;
}

export interface AnalystResponse {
  answer: string;
  content?: string;
  markdownContent?: string;
  executiveSummary?: string;
  metricHighlight?: string;
  factors?: string[];
  recommendations?: string[];
  followUpPrompts?: string[];
  timestamp: string;
}

export interface CustomerMessageResult {
  channel: string;
  subject: string;
  message: string;
  strategy: string;
  estimatedOpportunity: string;
}

export interface ReviewResponseResult {
  sentiment: 'Positive' | 'Neutral' | 'Negative' | 'Urgent';
  analysis: string;
  suggestedResponse: string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
}

export const apiService = {
  // Session Token Storage
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ACTIVE_BIZ_KEY);
  },

  getActiveBusinessId(): string | null {
    return localStorage.getItem(ACTIVE_BIZ_KEY);
  },

  setActiveBusinessId(businessId: string) {
    localStorage.setItem(ACTIVE_BIZ_KEY, businessId);
  },

  getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const bizId = this.getActiveBusinessId();
    if (bizId) {
      headers['X-Business-Id'] = bizId;
    }
    return headers;
  },

  // ---------------------------------------------------------------------------
  // AUTHENTICATION APIs
  // ---------------------------------------------------------------------------

  async signup(data: { name: string; email: string; password: string; confirmPassword: string }) {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to sign up');
    }
    if (json.token) this.setToken(json.token);
    return json;
  },

  async login(credentials: { email: string; password: string }) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to log in');
    }
    if (json.token) this.setToken(json.token);
    return json;
  },

  async logout() {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });
    } catch (e) {
      console.warn('Logout API error:', e);
    } finally {
      this.clearToken();
    }
  },

  async getMe(): Promise<{ success: boolean; user: User; businesses: BusinessProfile[] }> {
    const res = await fetch('/api/auth/me', {
      headers: this.getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Session expired');
    }
    return json;
  },

  async forgotPassword(email: string) {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return await res.json();
  },

  async resetPassword(resetToken: string, newPassword: string) {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resetToken, newPassword }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to reset password');
    }
    return json;
  },

  async deleteAccount() {
    const res = await fetch('/api/auth/account', {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to delete account');
    }
    this.clearToken();
    return json;
  },

  // ---------------------------------------------------------------------------
  // BUSINESS MANAGEMENT APIs
  // ---------------------------------------------------------------------------

  async onboardBusiness(profile: Partial<BusinessProfile>) {
    const res = await fetch('/api/business/onboard', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(profile),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to complete business onboarding');
    }
    if (json.business?.id) {
      this.setActiveBusinessId(json.business.id);
    }
    return json;
  },

  async getBusinesses(): Promise<{ success: boolean; businesses: BusinessProfile[] }> {
    const res = await fetch('/api/business/list', {
      headers: this.getAuthHeaders(),
    });
    return await res.json();
  },

  async getBusinessBundle(businessId: string) {
    const res = await fetch(`/api/business/${businessId}/bundle`, {
      headers: {
        ...this.getAuthHeaders(),
        'X-Business-Id': businessId,
      },
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to load business data');
    }
    return json;
  },

  async getBusinessData(businessId: string) {
    return this.getBusinessBundle(businessId);
  },

  async executeAction(actionId: string, title?: string, category?: string) {
    const businessId = this.getActiveBusinessId();
    if (businessId) {
      try {
        await this.updateActionTask(businessId, actionId, 'approved');
      } catch (e) {
        console.warn('executeAction failed to update status:', e);
      }
    }
    return { success: true, message: 'Action executed successfully' };
  },

  async updateBusinessProfile(businessId: string, updates: Partial<BusinessProfile>) {
    const res = await fetch(`/api/business/${businessId}/profile`, {
      method: 'PATCH',
      headers: {
        ...this.getAuthHeaders(),
        'X-Business-Id': businessId,
      },
      body: JSON.stringify(updates),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to update business profile');
    }
    return json;
  },

  async updateBusiness(businessId: string, updates: Partial<BusinessProfile>) {
    return this.updateBusinessProfile(businessId, updates);
  },

  async deleteBusiness(businessId: string, confirmBusinessName: string = '') {
    const res = await fetch(`/api/business/${businessId}`, {
      method: 'DELETE',
      headers: {
        ...this.getAuthHeaders(),
        'X-Business-Id': businessId,
      },
      body: JSON.stringify({ confirmBusinessName }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to delete business');
    }
    return json;
  },

  // ---------------------------------------------------------------------------
  // DATA OPERATIONS (CUSTOMERS, CSV IMPORT, CONVERSATIONS, REVIEWS)
  // ---------------------------------------------------------------------------

  async addCustomer(businessId: string, customerData: Partial<Customer>) {
    const res = await fetch(`/api/business/${businessId}/customers`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
        'X-Business-Id': businessId,
      },
      body: JSON.stringify(customerData),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to add customer');
    }
    return json;
  },

  async importCustomersCSV(businessId: string, rows: any[]) {
    const res = await fetch(`/api/business/${businessId}/customers/import`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
        'X-Business-Id': businessId,
      },
      body: JSON.stringify({ customers: rows }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to import customers');
    }
    return json;
  },

  async addConversation(businessId: string, convoData: { customerName: string; customerPhone: string; channel: string; initialMessage: string }) {
    const res = await fetch(`/api/business/${businessId}/conversations`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
        'X-Business-Id': businessId,
      },
      body: JSON.stringify(convoData),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to add conversation');
    }
    return json;
  },

  async addReview(businessId: string, reviewData: { customerName: string; rating: number; content: string; platform?: string }) {
    const res = await fetch(`/api/business/${businessId}/reviews`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
        'X-Business-Id': businessId,
      },
      body: JSON.stringify(reviewData),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to add review');
    }
    return json;
  },

  async updateEmployee(businessId: string, employeeId: string, updates: any) {
    const res = await fetch(`/api/business/${businessId}/employees/${employeeId}`, {
      method: 'PATCH',
      headers: {
        ...this.getAuthHeaders(),
        'X-Business-Id': businessId,
      },
      body: JSON.stringify(updates),
    });
    return await res.json();
  },

  async updateActionTask(businessId: string, actionId: string, status: string) {
    const res = await fetch(`/api/business/${businessId}/actions/${actionId}`, {
      method: 'PATCH',
      headers: {
        ...this.getAuthHeaders(),
        'X-Business-Id': businessId,
      },
      body: JSON.stringify({ status }),
    });
    return await res.json();
  },

  // ---------------------------------------------------------------------------
  // AI INTELLIGENCE APIs (Strictly isolated by businessId)
  // ---------------------------------------------------------------------------

  async scanBusiness(businessId: string): Promise<{ success: boolean; sufficientData: boolean; message?: string; dataNeeded?: string[]; source?: string; data?: ScanResult }> {
    const res = await fetch('/api/ai/scan-business', {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
        'X-Business-Id': businessId,
      },
      body: JSON.stringify({ businessId }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to scan business');
    return json;
  },

  async askBusinessAnalyst(
    businessId: string,
    question: string,
    history?: Array<{ role: 'user' | 'assistant'; text: string }>
  ): Promise<{ success: boolean; source: string; data: AnalystResponse }> {
    const res = await fetch('/api/ai/chat-analyst', {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
        'X-Business-Id': businessId,
      },
      body: JSON.stringify({ businessId, question, history: history || [] }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Analyst query failed');
    return json;
  },

  async generateCustomerMessage(
    businessId: string,
    customerId: string
  ): Promise<{ success: boolean; source: string; data: CustomerMessageResult }> {
    const res = await fetch('/api/ai/generate-customer-message', {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
        'X-Business-Id': businessId,
      },
      body: JSON.stringify({ businessId, customerId }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to generate message');
    return json;
  },

  async generateReviewResponse(
    businessId: string,
    reviewId: string
  ): Promise<{ success: boolean; source: string; data: ReviewResponseResult }> {
    const res = await fetch('/api/ai/generate-review-response', {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
        'X-Business-Id': businessId,
      },
      body: JSON.stringify({ businessId, reviewId }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to generate review response');
    return json;
  },

  async updateIntegration(
    businessId: string,
    integrationId: string,
    status: string,
    config?: any
  ) {
    const res = await fetch(`/api/business/${businessId}/integrations/${integrationId}`, {
      method: 'PATCH',
      headers: {
        ...this.getAuthHeaders(),
        'X-Business-Id': businessId,
      },
      body: JSON.stringify({ status, config }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || 'Failed to update integration');
    return json;
  },

  async sendIntegrationVerificationCode(
    businessId: string,
    channel: 'whatsapp' | 'instagram' | string,
    identifier: string
  ): Promise<{ success: boolean; channel: string; identifier: string; code?: string; message: string; expiresAt: number; deliveryMethod?: string }> {
    const res = await fetch(`/api/business/${businessId}/integrations/verification/send-code`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
        'X-Business-Id': businessId,
      },
      body: JSON.stringify({ channel, identifier }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || 'Failed to send verification code');
    return json;
  },

  async verifyIntegrationCode(
    businessId: string,
    channel: 'whatsapp' | 'instagram' | string,
    identifier: string,
    code: string
  ): Promise<{ success: boolean; channel: string; accountInfo: any; integration: any; message: string }> {
    const res = await fetch(`/api/business/${businessId}/integrations/verification/verify-code`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
        'X-Business-Id': businessId,
      },
      body: JSON.stringify({ channel, identifier, code }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || 'Verification failed');
    return json;
  },

  async disconnectIntegrationChannel(
    businessId: string,
    channel: string
  ): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`/api/business/${businessId}/integrations/verification/disconnect`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
        'X-Business-Id': businessId,
      },
      body: JSON.stringify({ channel }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || 'Failed to disconnect channel');
    return json;
  },

  async sendConversationReply(
    businessId: string,
    convoId: string,
    text: string
  ) {
    const res = await fetch(`/api/business/${businessId}/conversations/${convoId}/messages`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
        'X-Business-Id': businessId,
      },
      body: JSON.stringify({ text }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || 'Failed to send reply');
    return json;
  },

  async sendInboundWebhook(
    businessId: string,
    channel: string,
    data: { customerName: string; customerPhone?: string; message: string }
  ) {
    const res = await fetch(`/api/webhooks/inbound/${businessId}/${channel}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error || 'Failed to receive inbound webhook message');
    return json;
  },
};
