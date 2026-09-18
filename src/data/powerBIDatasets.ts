export interface SampleDataset {
  id: string;
  name: string;
  category: string;
  description: string;
  rawFormat: 'json' | 'csv' | 'markdown_table';
  rawData: string;
}

export const SAMPLE_DATASETS: SampleDataset[] = [
  {
    id: 'retail_omnichannel',
    name: 'Enterprise Omnichannel Retail & Sales (with raw anomalies)',
    category: 'Retail & Commerce',
    description: '120 transactional records with messy dates (MM/DD/YYYY, DD-MM-YYYY), duplicate rows, missing prices, unparsed strings, and regional tags.',
    rawFormat: 'json',
    rawData: JSON.stringify([
      { "transaction_id": "TX-1001", "date": "01/15/2026", "customer_name": "Arjun Sharma", "email": "arjun.s@enterprise.com", "phone": "+91 98765 43210", "region": "West", "category": "Espresso & Beans", "units": 45, "unit_price": "$42.50", "discount_pct": "5%", "cogs": "$18.00", "channel": "WhatsApp" },
      { "transaction_id": "TX-1002", "date": "2026-01-18", "customer_name": "Priya Nair", "email": "priya.n@techfirm.io", "phone": "+91 98111 22334", "region": "South", "category": "Cold Brew Systems", "units": 12, "unit_price": "$120.00", "discount_pct": "10%", "cogs": "$65.00", "channel": "Instagram" },
      { "transaction_id": "TX-1003", "date": "22-01-2026", "customer_name": "Rohan Verma", "email": "rohan.v@fintech.co", "phone": "+91 98222 33445", "region": "West", "category": "Artisanal Bakery", "units": 85, "unit_price": "$14.00", "discount_pct": "0%", "cogs": "$4.50", "channel": "Website" },
      { "transaction_id": "TX-1004", "date": "02/02/2026", "customer_name": "Sunita Rao", "email": "sunita.rao@consulting.org", "phone": "+91 98333 44556", "region": "East", "category": "Specialty Syrups", "units": 30, "unit_price": "$28.00", "discount_pct": "15%", "cogs": "$11.00", "channel": "WhatsApp" },
      { "transaction_id": "TX-1005", "date": "2026-02-10", "customer_name": "Vikram Patel", "email": "vikram.p@agency.net", "phone": "+91 98444 55667", "region": "West", "category": "Espresso & Beans", "units": 60, "unit_price": "$42.50", "discount_pct": "8%", "cogs": "$18.00", "channel": "Website" },
      // Duplicate anomaly to test Power Query deduplication
      { "transaction_id": "TX-1005", "date": "2026-02-10", "customer_name": "Vikram Patel", "email": "vikram.p@agency.net", "phone": "+91 98444 55667", "region": "West", "category": "Espresso & Beans", "units": 60, "unit_price": "$42.50", "discount_pct": "8%", "cogs": "$18.00", "channel": "Website" },
      // Missing value anomaly (missing unit_price and email)
      { "transaction_id": "TX-1006", "date": "02/15/2026", "customer_name": "Kavita Reddy", "email": "", "phone": "+91 98555 66778", "region": "South", "category": "Cold Brew Systems", "units": 18, "unit_price": "", "discount_pct": "12%", "cogs": "$65.00", "channel": "Instagram" },
      { "transaction_id": "TX-1007", "date": "28-02-2026", "customer_name": "Deepak Mehta", "email": "deepak.m@retailcorp.in", "phone": "+91 98666 77889", "region": "East", "category": "Artisanal Bakery", "units": 110, "unit_price": "$14.00", "discount_pct": "5%", "cogs": "$4.50", "channel": "Website" },
      { "transaction_id": "TX-1008", "date": "03/05/2026", "customer_name": "Ananya Joshi", "email": "ananya.j@designstudio.com", "phone": "+91 98777 88990", "region": "West", "category": "Brewing Equipment", "units": 24, "unit_price": "$210.00", "discount_pct": "15%", "cogs": "$115.00", "channel": "WhatsApp" },
      { "transaction_id": "TX-1009", "date": "2026-03-12", "customer_name": "Manish Gupta", "email": "manish.g@logistics.co", "phone": "+91 98888 99001", "region": "North", "category": "Specialty Syrups", "units": 40, "unit_price": "$28.00", "discount_pct": "0%", "cogs": "$11.00", "channel": "Website" },
      { "transaction_id": "TX-1010", "date": "18-03-2026", "customer_name": "Siddharth Sen", "email": "siddharth.s@mediahouse.in", "phone": "+91 98999 00112", "region": "West", "category": "Espresso & Beans", "units": 75, "unit_price": "$42.50", "discount_pct": "10%", "cogs": "$18.00", "channel": "Instagram" },
      { "transaction_id": "TX-1011", "date": "04/02/2026", "customer_name": "Neha Choudhury", "email": "neha.c@analytics.io", "phone": "+91 99000 11223", "region": "South", "category": "Artisanal Bakery", "units": 95, "unit_price": "$14.00", "discount_pct": "0%", "cogs": "$4.50", "channel": "Website" },
      { "transaction_id": "TX-1012", "date": "2026-04-14", "customer_name": "Rajesh Khanna", "email": "rajesh.k@pharma.com", "phone": "+91 99111 22334", "region": "East", "category": "Brewing Equipment", "units": 15, "unit_price": "$210.00", "discount_pct": "8%", "cogs": "$115.00", "channel": "WhatsApp" },
      { "transaction_id": "TX-1013", "date": "2026-04-20", "customer_name": "Meera Kapoor", "email": "meera.k@fashion.in", "phone": "+91 99222 33445", "region": "West", "category": "Cold Brew Systems", "units": 28, "unit_price": "$120.00", "discount_pct": "5%", "cogs": "$65.00", "channel": "Instagram" },
      { "transaction_id": "TX-1014", "date": "05/01/2026", "customer_name": "Gaurav Malhotra", "email": "gaurav.m@capital.com", "phone": "+91 99333 44556", "region": "North", "category": "Espresso & Beans", "units": 55, "unit_price": "$42.50", "discount_pct": "5%", "cogs": "$18.00", "channel": "Website" },
      { "transaction_id": "TX-1015", "date": "15-05-2026", "customer_name": "Tanvi Bhatia", "email": "tanvi.b@ventures.co", "phone": "+91 99444 55667", "region": "West", "category": "Brewing Equipment", "units": 32, "unit_price": "$210.00", "discount_pct": "10%", "cogs": "$115.00", "channel": "WhatsApp" },
      { "transaction_id": "TX-1016", "date": "2026-05-25", "customer_name": "Abhishek Roy", "email": "abhishek.r@telecom.in", "phone": "+91 99555 66778", "region": "East", "category": "Specialty Syrups", "units": 65, "unit_price": "$28.00", "discount_pct": "12%", "cogs": "$11.00", "channel": "Website" },
      { "transaction_id": "TX-1017", "date": "06/04/2026", "customer_name": "Shweta Tiwari", "email": "shweta.t@creative.org", "phone": "+91 99666 77889", "region": "South", "category": "Artisanal Bakery", "units": 130, "unit_price": "$14.00", "discount_pct": "0%", "cogs": "$4.50", "channel": "Instagram" },
      { "transaction_id": "TX-1018", "date": "2026-06-16", "customer_name": "Harsh Vardhan", "email": "harsh.v@cloudtech.io", "phone": "+91 99777 88990", "region": "West", "category": "Espresso & Beans", "units": 90, "unit_price": "$42.50", "discount_pct": "15%", "cogs": "$18.00", "channel": "WhatsApp" },
      { "transaction_id": "TX-1019", "date": "28-06-2026", "customer_name": "Divya Nambiar", "email": "divya.n@aerospace.com", "phone": "+91 99888 99001", "region": "South", "category": "Brewing Equipment", "units": 20, "unit_price": "$210.00", "discount_pct": "5%", "cogs": "$115.00", "channel": "Website" },
      { "transaction_id": "TX-1020", "date": "2026-07-08", "customer_name": "Arjun Sharma", "email": "arjun.s@enterprise.com", "phone": "+91 98765 43210", "region": "West", "category": "Brewing Equipment", "units": 14, "unit_price": "$210.00", "discount_pct": "8%", "cogs": "$115.00", "channel": "WhatsApp" },
      { "transaction_id": "TX-1021", "date": "18-07-2026", "customer_name": "Kavita Reddy", "email": "kavita.r@techcorp.in", "phone": "+91 98555 66778", "region": "South", "category": "Specialty Syrups", "units": 50, "unit_price": "$28.00", "discount_pct": "10%", "cogs": "$11.00", "channel": "Instagram" },
      { "transaction_id": "TX-1022", "date": "08/02/2026", "customer_name": "Vikram Patel", "email": "vikram.p@agency.net", "phone": "+91 98444 55667", "region": "West", "category": "Cold Brew Systems", "units": 22, "unit_price": "$120.00", "discount_pct": "5%", "cogs": "$65.00", "channel": "Website" },
      { "transaction_id": "TX-1023", "date": "2026-08-14", "customer_name": "Rohan Verma", "email": "rohan.v@fintech.co", "phone": "+91 98222 33445", "region": "West", "category": "Espresso & Beans", "units": 65, "unit_price": "$42.50", "discount_pct": "10%", "cogs": "$18.00", "channel": "WhatsApp" },
      { "transaction_id": "TX-1024", "date": "25-08-2026", "customer_name": "Deepak Mehta", "email": "deepak.m@retailcorp.in", "phone": "+91 98666 77889", "region": "East", "category": "Brewing Equipment", "units": 18, "unit_price": "$210.00", "discount_pct": "12%", "cogs": "$115.00", "channel": "Website" },
      { "transaction_id": "TX-1025", "date": "2026-09-02", "customer_name": "Sunita Rao", "email": "sunita.rao@consulting.org", "phone": "+91 98333 44556", "region": "East", "category": "Artisanal Bakery", "units": 120, "unit_price": "$14.00", "discount_pct": "0%", "cogs": "$4.50", "channel": "WhatsApp" }
    ], null, 2)
  },
  {
    id: 'saas_subscriptions',
    name: 'B2B SaaS MRR & Churn Telemetry (CSV Format)',
    category: 'SaaS & Subscriptions',
    description: 'Raw CSV records containing customer IDs, subscription tiers, monthly recurring revenue (MRR), contract length, NPS score, and renewal status.',
    rawFormat: 'csv',
    rawData: `account_id,company_name,tier,region,mrr,seats,contract_months,nps_score,churn_risk,signup_date
ACC-501,Acme Logistics,Enterprise,West,$4200,85,12,9,Low,2025-04-10
ACC-502,Apex Media,Pro,East,$1850,25,12,7,Medium,2025-06-15
ACC-503,BioHealth Global,Enterprise,West,$6500,140,24,10,Low,2025-01-20
ACC-504,CloudSync Inc,Starter,North,$450,5,1,5,High,2025-11-05
ACC-505,DataWave Analytics,Pro,South,$2100,30,12,8,Low,2025-08-22
ACC-506,EdgeWorks AI,Enterprise,West,$5800,110,24,9,Low,2025-02-14
ACC-507,FinPulse Payments,Enterprise,East,$4900,95,12,8,Low,2025-03-30
ACC-508,GreenGrid Energy,Pro,South,$1650,20,6,6,Medium,2025-09-18
ACC-509,HyperScale Tech,Enterprise,West,$7200,160,24,10,Low,2025-01-05
ACC-510,InnoFlow SaaS,Starter,East,$450,6,1,4,High,2025-12-01
ACC-511,JumpStart Commerce,Pro,West,$2400,35,12,8,Low,2025-05-19
ACC-512,Krypton Security,Enterprise,North,$5100,105,12,9,Low,2025-04-25`
  },
  {
    id: 'logistics_freight',
    name: 'Supply Chain & Freight Fulfillment (Markdown Table)',
    category: 'Logistics & Operations',
    description: 'Markdown table format showing shipment IDs, routes, freight weight, carrier, SLA delivery status, and fuel surcharges.',
    rawFormat: 'markdown_table',
    rawData: `| shipment_id | origin | destination | carrier | weight_kg | transit_days | cost_usd | on_time | fuel_surcharge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SHP-8001 | Mumbai | Delhi | ExpressLine | 1250 | 2 | $850 | Yes | $65 |
| SHP-8002 | Bangalore | Mumbai | SwiftCargo | 3400 | 3 | $1920 | Yes | $140 |
| SHP-8003 | Chennai | Kolkata | BlueDart Freight | 850 | 4 | $620 | No | $45 |
| SHP-8004 | Delhi | Pune | ExpressLine | 2100 | 2 | $1350 | Yes | $95 |
| SHP-8005 | Hyderabad | Ahmedabad | RoadWay Logistics | 4200 | 5 | $2450 | No | $180 |
| SHP-8006 | Mumbai | Bangalore | SwiftCargo | 1600 | 2 | $1100 | Yes | $80 |
| SHP-8007 | Kolkata | Delhi | BlueDart Freight | 2900 | 3 | $1750 | Yes | $125 |
| SHP-8008 | Pune | Chennai | ExpressLine | 1800 | 3 | $1280 | Yes | $90 |`
  }
];
