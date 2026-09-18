export type AppView =
  | 'landing'
  | 'login'
  | 'signup'
  | 'forgot_password'
  | 'onboarding'
  | 'dashboard'
  | 'customers'
  | 'conversations'
  | 'reviews'
  | 'analytics'
  | 'bi_engine'
  | 'employees'
  | 'actions'
  | 'scanner'
  | 'analyst'
  | 'integrations'
  | 'storage'
  | 'settings'
  | 'billing'
  | 'architecture';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
}

export interface BusinessMember {
  id: string;
  userId: string;
  businessId: string;
  role: 'Owner' | 'Admin' | 'Manager' | 'Staff';
}

export type CustomerStatus = 'New' | 'Active' | 'Inactive' | 'High Value' | 'At Risk';

export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';

export type TaskStatus = 'pending' | 'approved' | 'dismissed' | 'completed';

export type ReviewSentiment = 'Positive' | 'Neutral' | 'Negative' | 'Urgent';

export type ChannelType = 'WhatsApp' | 'Instagram' | 'Website' | 'Website chat' | 'Email';

export interface BusinessProfile {
  id: string;
  name: string;
  category: string;
  location: string;
  description: string;
  monthlyRevenue: number;
  customersCount: number;
  missedEnquiries: number;
  avgRating: number;
  reviewsCount: number;
  inactiveCustomers: number;
  currency: string;
  phone: string;
  email: string;
  website: string;
  onboarded: boolean;
  goals: string[];
  openingHours?: string;
  toneOfVoice?: string;
  upiId?: string;
}

export interface CategoryHealth {
  id: string;
  name: string;
  score: number;
  problems: string[];
  opportunity: string;
  recommendedAction: string;
  priority: TaskPriority;
}

export interface BusinessHealth {
  overallScore: number;
  categories: CategoryHealth[];
  lastScanDate?: string;
}

export interface AIEmployee {
  id: string;
  name: string;
  role: string;
  avatarColor?: string;
  status: 'Active' | 'Paused' | 'Training' | 'active' | 'paused';
  purpose: string;
  tasksToday: number;
  completedTasks?: number;
  completedToday?: number;
  waitingForApproval?: number;
  waitingApproval?: number;
  potentialOpportunitiesINR?: number;
  recentActivity: string[];
  metrics?: { label: string; value: string }[];
  performance?: string;
  autonomyLevel: 'Suggest Only' | 'Require Approval' | 'Auto Execute' | 'suggest_only' | 'require_approval' | 'auto_execute';
  channels?: string[];
  assignedChannels?: string[];
}

export interface OpportunityMetric {
  id: string;
  label: string;
  count: number | string;
  subtitle: string;
  accent?: 'red' | 'amber' | 'emerald' | 'blue' | 'purple';
  icon?: string;
  targetView: AppView;
}

export interface AIInsight {
  id: string;
  title: string;
  whyItMatters: string;
  recommendedAction: string;
  priority: TaskPriority;
  potentialImpact: string;
  category: string;
  actionId?: string;
}

export interface ActionTask {
  id: string;
  priority: TaskPriority;
  problem: string;
  recommendedAction: string;
  estimatedImpact: string;
  potentialValueINR?: number;
  status: TaskStatus;
  category: string;
  assignedEmployee: string;
  targetCustomerName?: string;
  payload?: {
    channel?: ChannelType | string;
    messageDraft?: string;
    reviewId?: string;
    customerId?: string;
  };
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  lastInteraction: string;
  daysSinceLastPurchase: number;
  totalPurchases: number;
  totalSpend?: number;
  totalSpendINR?: number;
  status: CustomerStatus;
  favoriteItems: string | string[];
  aiSummary?: string;
  recommendation?: string;
  aiRecommendation?: string;
  notes?: string;
  conversationsSummary?: string;
}

export type CustomerRecord = Customer;

export interface MessageItem {
  id: string;
  sender: 'customer' | 'business' | 'ai_draft';
  senderName?: string;
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

export interface ConversationThread {
  id: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  channel: ChannelType;
  lastMessage: string;
  timestamp: string;
  lastTimestamp?: string;
  priority?: TaskPriority;
  unreadCount?: number;
  unread?: boolean;
  suggestedResponse?: string;
  aiSuggestedResponse?: string;
  suggestedAction?: string;
  messages: MessageItem[];
}

export type Conversation = ConversationThread;

export interface ReviewItem {
  id: string;
  customerName: string;
  rating: number;
  text?: string;
  content?: string;
  date: string;
  platform: 'Google Business Profile' | 'Zomato' | 'Swiggy' | 'Direct' | string;
  sentiment: ReviewSentiment;
  aiAnalysis?: string;
  suggestedResponse?: string;
  status?: 'pending' | 'approved' | 'dismissed';
  responded?: boolean;
}

export interface TopService {
  name: string;
  category: string;
  revenue: number;
  orders: number;
  margin: string;
  trend: 'up' | 'down' | 'neutral';
}

export type TopProduct = {
  name: string;
  category: string;
  revenueINR: number;
  ordersCount: number;
  marginPercent: number;
};

export interface AnalyticsPeriod {
  totalRevenue: number;
  customerCount: number;
  totalEnquiries: number;
  conversionRate: number;
  averageResponseTimeMinutes: number;
  repeatCustomerRate: number;
  revenueTrend: Array<{
    period: string;
    revenue: number;
    enquiries: number;
    orders: number;
  }>;
}

export interface AnalyticsData {
  timeframe: '7d' | '30d' | '90d' | '1y';
  revenueTotal: number;
  revenueGrowthPct: number;
  customersTotal: number;
  customersGrowthPct: number;
  enquiriesTotal: number;
  conversionRatePct: number;
  avgResponseTimeMin: number;
  repeatCustomerRatePct: number;
  chartData: { label: string; revenue: number; enquiries: number; orders: number }[];
  topServices: TopService[];
  aiObservations: string[];
}

export interface IntegrationItem {
  id: string;
  name: string;
  category: string;
  description: string;
  status: 'connected' | 'not_connected' | 'coming_soon' | 'demo';
  badge?: string;
  lastSync?: string;
  features: string[];
  config?: {
    phoneNumber?: string;
    accountSid?: string;
    apiKey?: string;
    webhookUrl?: string;
    websiteDomain?: string;
    connectedAt?: string;
    // WhatsApp specific verified account info
    wabaId?: string;
    profileName?: string;
    qualityRating?: string;
    verifiedNameStatus?: string;
    tier?: string;
    catalogSync?: string;
    // Instagram specific verified account info
    instagramHandle?: string;
    instagramAccountId?: string;
    displayName?: string;
    followersCount?: number;
    mediaCount?: number;
    accountType?: string;
    bio?: string;
    dmSync?: string;
    verifiedAt?: string;
  };
}

export interface VerificationCodeResponse {
  success: boolean;
  channel: string;
  identifier: string;
  code?: string;
  message: string;
  expiresAt: number;
  deliveryMethod?: string;
}

export interface VerificationConfirmResponse {
  success: boolean;
  channel: string;
  accountInfo: any;
  integration: IntegrationItem;
  message: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  priceINR: number;
  billingPeriod: string;
  description: string;
  features: string[];
  limitations?: string[];
  recommended?: boolean;
}

export interface AuditLog {
  id: string;
  actionTitle: string;
  type: string;
  timestamp: string;
  status: string;
  user: string;
  actor?: string;
  actorName?: string;
  mode: 'DEMO_MODE' | 'LIVE_API';
}

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  size?: string | number;
  modifiedTime: string;
  createdTime?: string;
  webViewLink?: string;
  webContentLink?: string;
  description?: string;
}

export interface GoogleDriveStatus {
  isConnected: boolean;
  userEmail: string | null;
  userName: string | null;
  userPhoto: string | null;
  lastBackupTime?: string | null;
  filesCount: number;
}

// ---------------------------------------------------------------------------
// POWER BI CORE DATA ANALYTICS & BI ENGINE INTERFACES
// ---------------------------------------------------------------------------

export type RawDataFormat = 'csv' | 'json' | 'markdown_table';

export interface PowerQueryTransformationStep {
  id: string;
  name: string;
  description: string;
  appliedAt: string;
  status: 'applied' | 'skipped' | 'optimized';
  impactSummary: string;
}

export interface DataAnomalyReport {
  missingValuesCount: number;
  missingValuesHandled: string[];
  duplicateRowsCount: number;
  duplicateRowsRemoved: number;
  datesNormalizedCount: number;
  stringsParsedCount: number;
  columnsNormalized: string[];
  anomalyDetails: string[];
}

export interface NormalizedRelationship {
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  cardinality: '1:N' | 'N:1' | '1:1' | 'N:N';
  crossFilteringDirection: 'Single' | 'Both';
}

export interface DAXMetric {
  id: string;
  name: string;
  daxFormula: string;
  category: 'Time Intelligence' | 'Cumulative' | 'Variance' | 'Segmentation' | 'Mathematical';
  currentValue: number | string;
  priorValue?: number | string;
  changePct?: number;
  trendDirection?: 'up' | 'down' | 'neutral';
  formattedResult: string;
}

export interface CustomerSegmentTier {
  tier: 'High Value (Tier 1)' | 'Medium Value (Tier 2)' | 'Low Value (Tier 3)';
  minSpend: number;
  maxSpend: number;
  count: number;
  percentOfTotal: number;
  totalRevenue: number;
  avgOrderValue: number;
  recommendation: string;
}

export interface NaturalLanguageQAResult {
  query: string;
  interpretedIntent: string;
  numericalAnswer: string;
  summaryNarrative: string;
  relevantMetrics: { label: string; value: string | number }[];
  matchedDimensions: string[];
  dataSubset: Record<string, any>[];
  suggestedVisualType: 'KPI Card' | 'Bar' | 'Line' | 'Pie' | 'Scatter' | 'Matrix';
}

export interface AIAnomalyInsight {
  id: string;
  metric: string;
  type: 'spike' | 'drop' | 'correlation' | 'trend_break' | 'seasonality';
  severity: 'high' | 'medium' | 'low';
  title: string;
  observation: string;
  storyBehindData: string;
  statisticalConfidence: number; // e.g. 0.94
  recommendedAction: string;
}

export interface VisualCoordinates {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type PowerBIVisualType = 'KPI Card' | 'Bar' | 'Line' | 'Pie' | 'Scatter' | 'Matrix';

export interface VisualLayoutSchema {
  id: string;
  type: PowerBIVisualType;
  title: string;
  description?: string;
  coordinates: VisualCoordinates;
  palette: string[];
  xAxisKey?: string;
  yAxisKey?: string;
  data: any[];
  crossFilterTarget?: string;
  crossFilterKey?: string;
  activeFilterValue?: string | null;
}

export interface CrossFilteringRule {
  sourceVisual: string;
  filterField: string;
  targetVisuals: string[];
  filterAction: 'highlight' | 'filter';
}

export interface DashboardLayoutSchema {
  $schema: string;
  dashboardId: string;
  title: string;
  version: string;
  generatedAt: string;
  theme: {
    name: string;
    primary: string;
    accent: string;
    background: string;
    surface: string;
    palette: string[];
  };
  canvas: {
    width: number;
    height: number;
    columns: number;
    rowHeight: number;
  };
  visuals: VisualLayoutSchema[];
  crossFilteringRules: CrossFilteringRule[];
  rlsApplied: {
    role: string;
    filteredRowCount: number;
    totalOriginalRows: number;
    maskedFields: string[];
  };
}

export type RowLevelSecurityRole =
  | 'Executive / Global Admin'
  | 'Regional Manager - West'
  | 'Regional Manager - East'
  | 'Store Manager / Analyst';

export interface RLSContext {
  role: RowLevelSecurityRole;
  regionAllowed?: string;
  maskPII: boolean;
  maskFinancialMargins: boolean;
  canExportRawData: boolean;
}

