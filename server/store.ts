import crypto from 'crypto';
import {
  BusinessProfile,
  BusinessHealth,
  AIEmployee,
  OpportunityMetric,
  AIInsight,
  ActionTask,
  Customer,
  ConversationThread,
  ReviewItem,
  IntegrationItem,
  TopProduct,
  AnalyticsPeriod,
  AuditLog,
} from '../src/types';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
}

export interface SessionRecord {
  token: string;
  userId: string;
  createdAt: string;
}

export interface BusinessMemberRecord {
  id: string;
  userId: string;
  businessId: string;
  role: 'Owner' | 'Admin' | 'Manager' | 'Staff';
  createdAt: string;
}

export interface BusinessRecord extends BusinessProfile {
  autonomyLevel?: string;
  createdAt: string;
}

export interface StoredCustomer extends Customer {
  businessId: string;
}

export interface StoredConversation extends ConversationThread {
  businessId: string;
}

export interface StoredReview extends ReviewItem {
  businessId: string;
}

export interface StoredActionTask extends ActionTask {
  businessId: string;
}

export interface StoredAIEmployee extends AIEmployee {
  businessId: string;
}

export interface StoredIntegration extends IntegrationItem {
  businessId: string;
}

export interface StoredAuditLog extends AuditLog {
  businessId: string;
}

// In-Memory Multi-Tenant Store with relational foreign keys
class MultiTenantStore {
  public users: Map<string, UserRecord> = new Map();
  public sessions: Map<string, SessionRecord> = new Map();
  public businesses: Map<string, BusinessRecord> = new Map();
  public businessMembers: Map<string, BusinessMemberRecord> = new Map();

  public customers: Map<string, StoredCustomer> = new Map();
  public conversations: Map<string, StoredConversation> = new Map();
  public reviews: Map<string, StoredReview> = new Map();
  public actionTasks: Map<string, StoredActionTask> = new Map();
  public aiEmployees: Map<string, StoredAIEmployee> = new Map();
  public integrations: Map<string, StoredIntegration> = new Map();
  public auditLogs: Map<string, StoredAuditLog> = new Map();

  // Reset tokens for forgot password flow
  public passwordResetTokens: Map<string, { userId: string; expiresAt: number }> = new Map();

  // Verification codes for phone/WhatsApp & Instagram integrations
  public verificationCodes: Map<string, {
    businessId: string;
    channel: string;
    identifier: string;
    code: string;
    expiresAt: number;
    accountDetails?: any;
  }> = new Map();

  public createVerificationCode(businessId: string, channel: string, identifier: string, code: string, accountDetails?: any) {
    const key = `${businessId}_${channel.toLowerCase()}`;
    this.verificationCodes.set(key, {
      businessId,
      channel: channel.toLowerCase(),
      identifier,
      code,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes expiry
      accountDetails,
    });
  }

  public getVerificationCode(businessId: string, channel: string) {
    const key = `${businessId}_${channel.toLowerCase()}`;
    return this.verificationCodes.get(key);
  }

  public removeVerificationCode(businessId: string, channel: string) {
    const key = `${businessId}_${channel.toLowerCase()}`;
    this.verificationCodes.delete(key);
  }

  constructor() {
    this.seedDefaultTestAccounts();
  }

  // Password hashing helpers
  public hashPassword(password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  }

  public generateSalt(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  public generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Seed two distinct test users and businesses for Requirement 28 verification
  private seedDefaultTestAccounts() {
    // 1. Seed User A: ownerA@example.com (Alpha Salon)
    const saltA = this.generateSalt();
    const userA: UserRecord = {
      id: 'usr_owner_a',
      name: 'Aditya Sharma',
      email: 'ownerA@example.com'.toLowerCase(),
      salt: saltA,
      passwordHash: this.hashPassword('password123', saltA),
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    };
    this.users.set(userA.id, userA);

    const bizA: BusinessRecord = {
      id: 'biz_alpha_salon',
      name: 'Alpha Salon',
      category: 'Salon / Spa',
      location: '100 Feet Road, Indiranagar, Bengaluru',
      description: 'Luxury hair styling, organic skincare rituals, and premium bridal treatments.',
      monthlyRevenue: 285000,
      customersCount: 142,
      missedEnquiries: 4,
      avgRating: 4.8,
      reviewsCount: 38,
      inactiveCustomers: 8,
      currency: '₹',
      phone: '+91 97361 85986',
      email: 'contact@alphasalon.in',
      website: 'https://alphasalon.in',
      upiId: 'pardeeprana022003@okicici',
      onboarded: true,
      goals: ['Reduce missed booking enquiries', 'Increase repeat hair therapy packages', 'Improve Google reviews'],
      autonomyLevel: 'require_approval',
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    };
    this.businesses.set(bizA.id, bizA);

    const memberA: BusinessMemberRecord = {
      id: 'bm_owner_a',
      userId: userA.id,
      businessId: bizA.id,
      role: 'Owner',
      createdAt: new Date().toISOString(),
    };
    this.businessMembers.set(memberA.id, memberA);

    // Alpha Salon Customers
    const custA1: StoredCustomer = {
      id: 'cust_a1',
      businessId: bizA.id,
      name: 'Ritu Sen',
      phone: '+91 98201 44520',
      email: 'ritu.sen@gmail.com',
      lastInteraction: '3 days ago',
      daysSinceLastPurchase: 3,
      totalPurchases: 6,
      totalSpendINR: 14500,
      status: 'Active',
      favoriteItems: 'Keratin Hair Spa, Moroccan Oil Treatment',
      notes: 'Prefers senior stylist Priya. Regular every month.',
    };
    const custA2: StoredCustomer = {
      id: 'cust_a2',
      businessId: bizA.id,
      name: 'Sneha Verma',
      phone: '+91 98110 33219',
      email: 'sneha.v@outlook.com',
      lastInteraction: '48 days ago',
      daysSinceLastPurchase: 48,
      totalPurchases: 3,
      totalSpendINR: 8200,
      status: 'At Risk',
      favoriteItems: 'Balayage Color, Hydrating Facial',
      notes: 'Missed scheduled appointment last month.',
    };
    this.customers.set(custA1.id, custA1);
    this.customers.set(custA2.id, custA2);

    // Alpha Salon Reviews
    const revA1: StoredReview = {
      id: 'rev_a1',
      businessId: bizA.id,
      customerName: 'Meera Deshmukh',
      rating: 5,
      content: 'Absolutely wonderful balayage color treatment. Priya took such great care of my hair!',
      date: '2 days ago',
      platform: 'Google Business Profile',
      sentiment: 'Positive',
      responded: true,
      suggestedResponse: 'Thank you Meera! Priya and the entire Alpha Salon team look forward to hosting you again soon.',
    };
    this.reviews.set(revA1.id, revA1);

    // Alpha Salon AI Employees
    this.initializeDefaultEmployees(bizA.id, true);
    this.initializeDefaultIntegrations(bizA.id);

    // 2. Seed User B: ownerB@example.com (Beta Café)
    const saltB = this.generateSalt();
    const userB: UserRecord = {
      id: 'usr_owner_b',
      name: 'Bhavna Patel',
      email: 'ownerB@example.com'.toLowerCase(),
      salt: saltB,
      passwordHash: this.hashPassword('password123', saltB),
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    };
    this.users.set(userB.id, userB);

    const bizB: BusinessRecord = {
      id: 'biz_beta_cafe',
      name: 'Beta Café',
      category: 'Café',
      location: '80 Feet Road, 4th Block, Koramangala, Bengaluru',
      description: 'Artisanal cold brew bar, specialty pour-overs, and handcrafted sourdough tartines.',
      monthlyRevenue: 340000,
      customersCount: 195,
      missedEnquiries: 7,
      avgRating: 4.6,
      reviewsCount: 52,
      inactiveCustomers: 12,
      currency: '₹',
      phone: '+91 98450 22002',
      email: 'team@betacafe.in',
      website: 'https://betacafe.in',
      onboarded: true,
      goals: ['Automate WhatsApp order confirmations', 'Upsell weekend pastry combos', 'Recover dormant coffee club regulars'],
      autonomyLevel: 'require_approval',
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    };
    this.businesses.set(bizB.id, bizB);

    const memberB: BusinessMemberRecord = {
      id: 'bm_owner_b',
      userId: userB.id,
      businessId: bizB.id,
      role: 'Owner',
      createdAt: new Date().toISOString(),
    };
    this.businessMembers.set(memberB.id, memberB);

    // Beta Café Customers (COMPLETELY DIFFERENT from Alpha Salon)
    const custB1: StoredCustomer = {
      id: 'cust_b1',
      businessId: bizB.id,
      name: 'Kabir Mehta',
      phone: '+91 97312 88410',
      email: 'kabir.m@techventures.io',
      lastInteraction: 'Yesterday',
      daysSinceLastPurchase: 1,
      totalPurchases: 14,
      totalSpendINR: 6800,
      status: 'High Value',
      favoriteItems: 'Cascara Tonic, Sourdough Croissant',
      notes: 'Remote tech worker. Visits Monday and Thursday mornings.',
    };
    this.customers.set(custB1.id, custB1);

    const revB1: StoredReview = {
      id: 'rev_b1',
      businessId: bizB.id,
      customerName: 'Ananya Roy',
      rating: 4,
      content: 'The single-origin Ethiopian pourover is remarkable! Wi-Fi was slightly slow during afternoon peak.',
      date: 'Yesterday',
      platform: 'Google Business Profile',
      sentiment: 'Neutral',
      responded: false,
      suggestedResponse: 'Hi Ananya, thank you for the glowing feedback on our Ethiopian pourover! We have upgraded our Wi-Fi access points this week.',
    };
    this.reviews.set(revB1.id, revB1);

    this.initializeDefaultEmployees(bizB.id, true);
    this.initializeDefaultIntegrations(bizB.id);
  }

  // Initialize employees for a business
  public initializeDefaultEmployees(businessId: string, preConfigured: boolean = false) {
    const defaultTemplates = [
      {
        id: `emp_receptionist_${businessId}`,
        name: 'AI Receptionist',
        role: 'Customer Response',
        status: preConfigured ? 'active' : 'not_configured',
        purpose: 'Instantly responds to inbound WhatsApp, Instagram, and web chats 24/7.',
        tasksToday: preConfigured ? 8 : 0,
        completedToday: preConfigured ? 8 : 0,
        waitingApproval: 0,
        autonomyLevel: 'require_approval',
        channels: ['WhatsApp', 'Instagram', 'Website chat'],
      },
      {
        id: `emp_sales_${businessId}`,
        name: 'AI Sales Assistant',
        role: 'Sales & Conversion',
        status: preConfigured ? 'active' : 'not_configured',
        purpose: 'Identifies buying intent, qualifies high-value bookings, and drafts customized quotes.',
        tasksToday: preConfigured ? 3 : 0,
        completedToday: preConfigured ? 2 : 0,
        waitingApproval: preConfigured ? 1 : 0,
        autonomyLevel: 'require_approval',
        channels: ['WhatsApp', 'Email'],
      },
      {
        id: `emp_followup_${businessId}`,
        name: 'AI Follow-Up Agent',
        role: 'Customer Retention',
        status: preConfigured ? 'active' : 'not_configured',
        purpose: 'Re-engages leads who went cold and sends personalized recall offers to dormant regulars.',
        tasksToday: preConfigured ? 4 : 0,
        completedToday: preConfigured ? 3 : 0,
        waitingApproval: preConfigured ? 1 : 0,
        autonomyLevel: 'require_approval',
        channels: ['WhatsApp', 'SMS'],
      },
      {
        id: `emp_reviews_${businessId}`,
        name: 'AI Review Manager',
        role: 'Reputation & Reviews',
        status: preConfigured ? 'active' : 'not_configured',
        purpose: 'Monitors Google Business Profile reviews, flags negative ratings, and drafts empathetic responses.',
        tasksToday: preConfigured ? 2 : 0,
        completedToday: preConfigured ? 1 : 0,
        waitingApproval: preConfigured ? 1 : 0,
        autonomyLevel: 'require_approval',
        channels: ['Google Business Profile'],
      },
      {
        id: `emp_operations_${businessId}`,
        name: 'AI Operations Coordinator',
        role: 'Operations & Service',
        status: 'not_configured',
        purpose: 'Tracks turnaround bottlenecks, table/chair utilization, and peak hour alerts.',
        tasksToday: 0,
        completedToday: 0,
        waitingApproval: 0,
        autonomyLevel: 'require_approval',
        channels: ['Internal Dashboard'],
      },
      {
        id: `emp_marketing_${businessId}`,
        name: 'AI Marketing Strategist',
        role: 'Marketing & Digital Presence',
        status: 'not_configured',
        purpose: 'Schedules seasonal promotions, crafts announcements, and generates local SEO updates.',
        tasksToday: 0,
        completedToday: 0,
        waitingApproval: 0,
        autonomyLevel: 'require_approval',
        channels: ['Instagram', 'Google Business Profile'],
      },
      {
        id: `emp_analyst_${businessId}`,
        name: 'AI Business Analyst',
        role: 'Executive Intelligence',
        status: preConfigured ? 'active' : 'not_configured',
        purpose: 'Synthesizes cross-channel metrics, runs health diagnostic scans, and answers CFO-level queries.',
        tasksToday: preConfigured ? 1 : 0,
        completedToday: preConfigured ? 1 : 0,
        waitingApproval: 0,
        autonomyLevel: 'require_approval',
        channels: ['Executive Digest'],
      },
    ];

    for (const t of defaultTemplates) {
      this.aiEmployees.set(t.id, {
        ...t,
        businessId,
        avatarColor: 'bg-indigo-600',
        recentActivity: preConfigured ? ['Initialized baseline autonomous listeners'] : [],
      } as StoredAIEmployee);
    }
  }

  // Initialize integrations for a business
  public initializeDefaultIntegrations(businessId: string) {
    const defaultIntegrations: StoredIntegration[] = [
      {
        id: `int_whatsapp_${businessId}`,
        businessId,
        name: 'WhatsApp Business Cloud API',
        category: 'Messaging',
        description: 'Send order confirmations, automated greetings, and interactive appointment buttons.',
        status: 'not_connected',
        features: ['Automated replies', 'Order confirmations', 'Quick action approvals'],
      },
      {
        id: `int_google_${businessId}`,
        businessId,
        name: 'Google Business Profile',
        category: 'Reputation',
        description: 'Sync customer ratings, review notifications, and auto-publish approved responses.',
        status: 'not_connected',
        features: ['Review sync', 'Instant negative alerts', 'Auto-response posting'],
      },
      {
        id: `int_instagram_${businessId}`,
        businessId,
        name: 'Instagram Direct API',
        category: 'Social',
        description: 'Sync story replies, direct message inquiries, and price checks into the unified inbox.',
        status: 'not_connected',
        features: ['DM auto-replies', 'Story reply lead capture', 'Menu sending'],
      },
      {
        id: `int_pos_${businessId}`,
        businessId,
        name: 'POS & Billing System',
        category: 'Commerce',
        description: 'Sync customer orders, daily sales receipts, and repeat visitor intervals.',
        status: 'not_connected',
        features: ['Real-time revenue telemetry', 'Customer visit frequency', 'Average ticket size tracking'],
      },
      {
        id: `int_web_${businessId}`,
        businessId,
        name: 'Website Live Chat Widget',
        category: 'Web Widget',
        description: 'Embeddable single-script floating widget to capture website visitors 24/7.',
        status: 'not_connected',
        features: ['Lead capture form', 'Instant greeting', 'WhatsApp fallback'],
      },
      {
        id: `int_gdrive_${businessId}`,
        businessId,
        name: 'Google Drive Cloud Storage',
        category: 'Cloud Storage',
        description: 'Sync and backup business records, customer catalogs, conversation logs, and AI audit reports directly into Google Drive.',
        status: 'not_connected',
        features: ['Automated JSON backups', 'Customer CSV sync', 'AI Strategic report export', '1-Click file preview & restore'],
      },
    ];

    for (const int of defaultIntegrations) {
      this.integrations.set(int.id, int);
    }
  }

  // Helper: Find user by email
  public findUserByEmail(email: string): UserRecord | undefined {
    const normalized = (email || '').toLowerCase().trim();
    for (const u of this.users.values()) {
      if (u.email === normalized) return u;
    }
    return undefined;
  }

  // Helper: Find user by session token
  public getUserByToken(token: string): UserRecord | null {
    if (!token) return null;
    const session = this.sessions.get(token);
    if (!session) return null;
    return this.users.get(session.userId) || null;
  }

  // Helper: Check if user has access to business
  public userHasBusinessAccess(userId: string, businessId: string): boolean {
    for (const m of this.businessMembers.values()) {
      if (m.userId === userId && m.businessId === businessId) {
        return true;
      }
    }
    return false;
  }

  // Helper: Get all businesses for a user
  public getBusinessesForUser(userId: string): BusinessRecord[] {
    const userBusinesses: BusinessRecord[] = [];
    for (const m of this.businessMembers.values()) {
      if (m.userId === userId) {
        const b = this.businesses.get(m.businessId);
        if (b) userBusinesses.push(b);
      }
    }
    return userBusinesses;
  }

  // Helper: Get isolated records for a business
  public getCustomers(businessId: string): StoredCustomer[] {
    return Array.from(this.customers.values()).filter((c) => c.businessId === businessId);
  }

  public getConversations(businessId: string): StoredConversation[] {
    return Array.from(this.conversations.values()).filter((c) => c.businessId === businessId);
  }

  public getReviews(businessId: string): StoredReview[] {
    return Array.from(this.reviews.values()).filter((r) => r.businessId === businessId);
  }

  public getActionTasks(businessId: string): StoredActionTask[] {
    return Array.from(this.actionTasks.values()).filter((t) => t.businessId === businessId);
  }

  public getEmployees(businessId: string): StoredAIEmployee[] {
    return Array.from(this.aiEmployees.values()).filter((e) => e.businessId === businessId);
  }

  public getIntegrations(businessId: string): StoredIntegration[] {
    return Array.from(this.integrations.values()).filter((i) => i.businessId === businessId);
  }

  public getAuditLogs(businessId: string): StoredAuditLog[] {
    return Array.from(this.auditLogs.values()).filter((l) => l.businessId === businessId);
  }

  // Compute live real metrics from database for a business
  public computeBusinessHealthAndStats(businessId: string) {
    const b = this.businesses.get(businessId);
    const customers = this.getCustomers(businessId);
    const reviews = this.getReviews(businessId);
    const conversations = this.getConversations(businessId);
    const tasks = this.getActionTasks(businessId);

    // If completely empty business
    const hasData = customers.length > 0 || (b?.monthlyRevenue || 0) > 0 || reviews.length > 0;

    let overallScore = 0;
    let avgRating = 0;
    if (reviews.length > 0) {
      const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
      avgRating = Number((sum / reviews.length).toFixed(1));
    }

    if (!hasData) {
      const emptyHealth: BusinessHealth = {
        overallScore: 0,
        lastScanDate: undefined,
        categories: [
          {
            id: 'sales',
            name: 'Sales & Conversion',
            score: 0,
            problems: ['No sales or customer transaction records found.'],
            opportunity: 'Connect POS or add customers to calculate potential revenue',
            recommendedAction: 'Add customer records or import CSV to activate sales intelligence',
            priority: 'medium',
          },
          {
            id: 'cx',
            name: 'Customer Response',
            score: 0,
            problems: ['No conversation channels connected.'],
            opportunity: 'Connect WhatsApp or Instagram for instant response monitoring',
            recommendedAction: 'Activate AI Receptionist to handle inbound inquiries',
            priority: 'medium',
          },
          {
            id: 'reviews',
            name: 'Reviews & Reputation',
            score: 0,
            problems: ['No reviews recorded yet.'],
            opportunity: 'Connect Google Business Profile to track reviews',
            recommendedAction: 'Link Google Business Profile in Integrations',
            priority: 'low',
          },
          {
            id: 'retention',
            name: 'Customer Retention',
            score: 0,
            problems: ['No customer history to analyze retention.'],
            opportunity: 'Import customer history to identify churn risks',
            recommendedAction: 'Add at least 3 customer profiles with visit history',
            priority: 'low',
          },
          {
            id: 'operations',
            name: 'Operations & Service Delivery',
            score: 0,
            problems: ['Operational telemetry pending initial data.'],
            opportunity: 'Monitor response intervals and order fulfillment velocity',
            recommendedAction: 'Complete onboarding setup',
            priority: 'low',
          },
          {
            id: 'marketing',
            name: 'Marketing & Digital Presence',
            score: 0,
            problems: ['No marketing integrations active.'],
            opportunity: 'Sync Google Business Profile or Instagram',
            recommendedAction: 'Connect social or local search profiles',
            priority: 'low',
          },
        ],
      };

      const emptyOpportunities: OpportunityMetric[] = [
        {
          id: 'opp_cust',
          label: 'Total Customers',
          count: 0,
          subtitle: 'No customers yet',
          targetView: 'customers',
        },
        {
          id: 'opp_rev',
          label: 'Monthly Revenue',
          count: '₹0',
          subtitle: 'No sales recorded',
          targetView: 'analytics',
        },
        {
          id: 'opp_enq',
          label: 'Inbound Enquiries',
          count: 0,
          subtitle: 'Channels awaiting setup',
          targetView: 'conversations',
        },
        {
          id: 'opp_revs',
          label: 'Customer Reviews',
          count: 0,
          subtitle: 'Awaiting first review',
          targetView: 'reviews',
        },
        {
          id: 'opp_tasks',
          label: 'Pending Approvals',
          count: 0,
          subtitle: 'Clean queue',
          targetView: 'actions',
        },
      ];

      return {
        hasData: false,
        overallScore: 0,
        health: emptyHealth,
        opportunities: emptyOpportunities,
        insights: [],
        customersCount: 0,
        revenue: 0,
        reviewsCount: 0,
        avgRating: 0,
        missedEnquiries: 0,
      };
    }

    // Business has real data
    const totalRevenue = b?.monthlyRevenue || customers.reduce((acc, c) => acc + (c.totalSpendINR || c.totalSpend || 0), 0);
    const missedEnquiries = conversations.filter((c) => c.priority === 'urgent' && c.unread).length;
    const inactiveCustomers = customers.filter((c) => c.status === 'Inactive' || c.status === 'At Risk').length;

    // Calculate score based on real data points
    let score = 70;
    if (avgRating >= 4.5) score += 10;
    if (missedEnquiries > 0) score -= Math.min(missedEnquiries * 3, 15);
    if (inactiveCustomers > 0) score -= Math.min(inactiveCustomers * 2, 10);
    if (customers.length >= 50) score += 10;
    overallScore = Math.max(20, Math.min(95, score));

    const health: BusinessHealth = {
      overallScore,
      lastScanDate: 'Calculated from live business data',
      categories: [
        {
          id: 'sales',
          name: 'Sales & Conversion',
          score: Math.min(95, Math.max(40, overallScore - 4)),
          problems: missedEnquiries > 0 ? [`${missedEnquiries} enquiries require attention`] : ['No missed sales enquiries'],
          opportunity: `₹${(missedEnquiries * 1500 || 5000).toLocaleString('en-IN')} potential recovery`,
          recommendedAction: 'Deploy AI Follow-Up Agent to respond within 5 mins',
          priority: missedEnquiries > 0 ? 'high' : 'low',
        },
        {
          id: 'cx',
          name: 'Customer Response',
          score: Math.min(95, Math.max(40, overallScore - 6)),
          problems: conversations.some((c) => c.unread) ? ['Unread customer messages in inbox'] : ['All messages answered'],
          opportunity: 'Protect customer satisfaction and bookings',
          recommendedAction: 'Enable AI Receptionist for 24/7 instant channel response',
          priority: 'medium',
        },
        {
          id: 'reviews',
          name: 'Reviews & Reputation',
          score: reviews.length > 0 ? Math.round(avgRating * 18) : 50,
          problems: reviews.some((r) => r.rating <= 3 && !r.responded) ? ['Unanswered negative review detected'] : ['Reputation stable'],
          opportunity: 'Boost local search visibility',
          recommendedAction: 'Approve AI-crafted responses in Review Hub',
          priority: reviews.some((r) => r.rating <= 3 && !r.responded) ? 'urgent' : 'low',
        },
        {
          id: 'retention',
          name: 'Customer Retention',
          score: Math.min(90, Math.max(40, overallScore - 5)),
          problems: inactiveCustomers > 0 ? [`${inactiveCustomers} patrons haven't visited in 30+ days`] : ['Healthy retention cycle'],
          opportunity: `₹${(inactiveCustomers * 1200 || 3000).toLocaleString('en-IN')} reactivation potential`,
          recommendedAction: 'Send tailored re-engagement invite to at-risk patrons',
          priority: inactiveCustomers > 0 ? 'high' : 'medium',
        },
        {
          id: 'operations',
          name: 'Operations & Service Delivery',
          score: overallScore,
          problems: ['Peak hours experience slight response delay'],
          opportunity: 'Streamline order & appointment intake',
          recommendedAction: 'Enable auto-booking acknowledgement',
          priority: 'medium',
        },
        {
          id: 'marketing',
          name: 'Marketing & Digital Presence',
          score: Math.min(92, overallScore + 2),
          problems: ['Google Business photos and offerings require periodic updates'],
          opportunity: 'Attract high-intent local searchers',
          recommendedAction: 'Post weekly promotional update',
          priority: 'medium',
        },
      ],
    };

    const opportunities: OpportunityMetric[] = [
      {
        id: 'opp_cust',
        label: 'Total Customers',
        count: customers.length,
        subtitle: `${customers.filter((c) => c.status === 'Active' || c.status === 'High Value').length} active patrons`,
        targetView: 'customers',
      },
      {
        id: 'opp_rev',
        label: 'Monthly Revenue',
        count: `₹${totalRevenue.toLocaleString('en-IN')}`,
        subtitle: 'Based on logged records',
        targetView: 'analytics',
      },
      {
        id: 'opp_enq',
        label: 'Inbound Enquiries',
        count: conversations.length,
        subtitle: `${conversations.filter((c) => c.unread).length} unread`,
        targetView: 'conversations',
      },
      {
        id: 'opp_revs',
        label: 'Customer Reviews',
        count: reviews.length,
        subtitle: `${avgRating} ★ average rating`,
        targetView: 'reviews',
      },
      {
        id: 'opp_tasks',
        label: 'Pending Approvals',
        count: tasks.filter((t) => t.status === 'pending').length,
        subtitle: 'Requires human approval',
        targetView: 'actions',
      },
    ];

    const insights: AIInsight[] = [];
    if (missedEnquiries > 0) {
      insights.push({
        id: `ins_missed_${businessId}`,
        title: `${missedEnquiries} Inbound Enquiries Awaiting Response`,
        whyItMatters: 'Leads lose buying intent when response times exceed 15 minutes.',
        recommendedAction: 'Send personalized follow-up via AI Follow-Up Agent.',
        priority: 'urgent',
        potentialImpact: `₹${(missedEnquiries * 1500).toLocaleString('en-IN')} potential recovery`,
        category: 'Sales',
      });
    }
    if (inactiveCustomers > 0) {
      insights.push({
        id: `ins_inactive_${businessId}`,
        title: `${inactiveCustomers} High-Value Patrons Inactive for 30+ Days`,
        whyItMatters: 'Acquiring a new customer costs 5x more than re-engaging an existing one.',
        recommendedAction: 'Dispatch personalized WhatsApp incentive to your at-risk patrons.',
        priority: 'high',
        potentialImpact: `₹${(inactiveCustomers * 1200).toLocaleString('en-IN')} reactivated revenue`,
        category: 'Retention',
      });
    }

    return {
      hasData: true,
      overallScore,
      health,
      opportunities,
      insights,
      customersCount: customers.length,
      revenue: totalRevenue,
      reviewsCount: reviews.length,
      avgRating,
      missedEnquiries,
    };
  }

  // Delete business and cascade all child records
  public deleteBusiness(businessId: string): boolean {
    if (!this.businesses.has(businessId)) return false;

    // Delete business
    this.businesses.delete(businessId);

    // Delete members
    for (const [id, m] of this.businessMembers.entries()) {
      if (m.businessId === businessId) this.businessMembers.delete(id);
    }
    // Delete customers
    for (const [id, c] of this.customers.entries()) {
      if (c.businessId === businessId) this.customers.delete(id);
    }
    // Delete conversations
    for (const [id, c] of this.conversations.entries()) {
      if (c.businessId === businessId) this.conversations.delete(id);
    }
    // Delete reviews
    for (const [id, r] of this.reviews.entries()) {
      if (r.businessId === businessId) this.reviews.delete(id);
    }
    // Delete action tasks
    for (const [id, t] of this.actionTasks.entries()) {
      if (t.businessId === businessId) this.actionTasks.delete(id);
    }
    // Delete AI employees
    for (const [id, e] of this.aiEmployees.entries()) {
      if (e.businessId === businessId) this.aiEmployees.delete(id);
    }
    // Delete integrations
    for (const [id, i] of this.integrations.entries()) {
      if (i.businessId === businessId) this.integrations.delete(id);
    }
    // Delete audit logs
    for (const [id, l] of this.auditLogs.entries()) {
      if (l.businessId === businessId) this.auditLogs.delete(id);
    }

    return true;
  }

  // Delete user account and their owned businesses
  public deleteUserAccount(userId: string): boolean {
    const user = this.users.get(userId);
    if (!user) return false;

    // Find owned businesses
    const ownedBusinessIds: string[] = [];
    for (const m of this.businessMembers.values()) {
      if (m.userId === userId && m.role === 'Owner') {
        ownedBusinessIds.push(m.businessId);
      }
    }

    // Delete each owned business
    for (const bId of ownedBusinessIds) {
      this.deleteBusiness(bId);
    }

    // Remove any remaining memberships
    for (const [id, m] of this.businessMembers.entries()) {
      if (m.userId === userId) this.businessMembers.delete(id);
    }

    // Delete user sessions
    for (const [token, s] of this.sessions.entries()) {
      if (s.userId === userId) this.sessions.delete(token);
    }

    // Delete user
    this.users.delete(userId);
    return true;
  }
}

export const db = new MultiTenantStore();
