
export enum UserRole {
  DIRECTOR = 'Director',
  SALES_RETAIL = 'Sales Retail',
  SALES_CORPORATE = 'Sales Corporate',
  SALES_MANAGER = 'Sales Manager',
  TRAINING_MANAGER = 'Training Manager',
  OPERATIONS_MANAGER = 'Operations Manager',
  TRAINER = 'Trainer',
  FINANCE = 'Finance',
  HR = 'HR'
}

export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  INTERESTED = 'Interested',
  FOLLOW_UP = 'Follow-up Scheduled',
  CONVERTED = 'Converted',
  NOT_INTERESTED = 'Not Interested'
}

export enum DealStage {
  QUALIFICATION = 'Qualification',
  PROPOSAL_SENT = 'Proposal Sent',
  PROPOSAL_ACCEPTED = 'Proposal Accepted',
  INVOICE_SENT = 'Invoice Sent',
  PAYMENT_CONFIRMED = 'Payment Confirmed',
  TRAINING_SCHEDULED = 'Training Scheduled',
  TRAINING_COMPLETED = 'Training Completed',
  CLOSED_WON = 'Closed Won',
  CLOSED_LOST = 'Closed Lost'
}

export enum TrainingStatus {
  PLANNED = 'Planned',
  CONFIRMED = 'Confirmed',
  ONGOING = 'Ongoing',
  COMPLETED = 'Completed',
  RESCHEDULED = 'Rescheduled'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  avatar?: string;
}

export interface AvailabilitySlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
}

export interface TrainerProfile {
  userId: string;
  skills: string[];
  availability: 'Available' | 'Busy' | 'On Leave';
  bio: string;
  courses: string[];
  availabilitySlots?: AvailabilitySlot[];
  activityLog?: { id: string; action: string; timestamp: string }[];
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: 'LinkedIn' | 'Email' | 'Referral' | 'Call';
  type: 'Retail' | 'Corporate';
  company?: string;
  status: LeadStatus;
  assignedTo: string; // User ID
  followUpDate?: string;
  history: string[];
  createdAt: string;
}

export interface Deal {
  id: string;
  title: string;
  clientId: string; // Lead or Account ID
  clientName: string;
  type: 'Retail' | 'Corporate';
  value: number;
  stage: DealStage;
  assignedTo: string;
  expectedClose: string;
  isPaid: boolean;
  invoiceId?: string;
  proposalId?: string;
}

export interface Proposal {
  id: string;
  dealId: string;
  clientName: string;
  courses: { name: string; price: number; duration: string }[];
  totalValue: number;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected';
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  dealId: string;
  amount: number;
  dueDate: string;
  status: 'Pending' | 'Paid';
  paymentDate?: string;
  paymentMethod?: string;
}

export interface TrainingClass {
  id: string;
  dealId: string;
  courseName: string;
  duration: string;
  hours: number;
  classroom: '1' | '2' | '3' | '4';
  trainerId: string;
  status: TrainingStatus;
  startDate: string;
  endDate: string;
}

export interface Learner {
  id: string;
  trainingId: string;
  name: string;
  email: string;
  completed: boolean;
  certificateId?: string;
  issuedAt?: string;
}

export interface SalesTarget {
  userId: string;
  year: number;
  target: number;
  achieved: number;
}
