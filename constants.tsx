
import React from 'react';
import { 
  Users, 
  Target, 
  Briefcase, 
  FileText, 
  CreditCard, 
  GraduationCap, 
  Calendar, 
  ShieldCheck, 
  BarChart3,
  UserCheck,
  UserRoundSearch,
  Trophy,
  Zap,
  Activity,
  BookOpen,
  LineChart,
  PieChart,
  Wallet,
  History,
  UserPlus,
  Heart,
  Rocket,
  ShieldAlert,
  Gift
} from 'lucide-react';
import { UserRole } from './types';

export const NAVIGATION_ITEMS = [
  { name: 'Dashboard', icon: <BarChart3 className="w-5 h-5" />, roles: Object.values(UserRole) },
  { name: 'Sales Manager', icon: <Trophy className="w-5 h-5" />, roles: [UserRole.DIRECTOR, UserRole.SALES_MANAGER] },
  { name: 'Operations Hub', icon: <Activity className="w-5 h-5" />, roles: [UserRole.DIRECTOR, UserRole.OPERATIONS_MANAGER, UserRole.TRAINING_MANAGER] },
  { name: 'Leads', icon: <Target className="w-5 h-5" />, roles: [UserRole.DIRECTOR, UserRole.SALES_RETAIL, UserRole.SALES_CORPORATE, UserRole.SALES_MANAGER] },
  { name: 'Deals', icon: <Briefcase className="w-5 h-5" />, roles: [UserRole.DIRECTOR, UserRole.SALES_RETAIL, UserRole.SALES_CORPORATE, UserRole.SALES_MANAGER] },
  { name: 'Proposals', icon: <FileText className="w-5 h-5" />, roles: [UserRole.DIRECTOR, UserRole.SALES_RETAIL, UserRole.SALES_CORPORATE, UserRole.SALES_MANAGER] },
  { name: 'Invoices', icon: <CreditCard className="w-5 h-5" />, roles: [UserRole.DIRECTOR, UserRole.SALES_RETAIL, UserRole.SALES_CORPORATE, UserRole.FINANCE, UserRole.SALES_MANAGER] },
  { name: 'Revenue IQ', icon: <PieChart className="w-5 h-5" />, roles: [UserRole.FINANCE, UserRole.DIRECTOR] },
  { name: 'Payouts', icon: <Wallet className="w-5 h-5" />, roles: [UserRole.FINANCE, UserRole.DIRECTOR] },
  { name: 'Compliance Vault', icon: <History className="w-5 h-5" />, roles: [UserRole.FINANCE, UserRole.DIRECTOR] },
  { name: 'Training', icon: <Calendar className="w-5 h-5" />, roles: [UserRole.DIRECTOR, UserRole.TRAINING_MANAGER, UserRole.OPERATIONS_MANAGER, UserRole.TRAINER] },
  { name: 'Curriculum Hub', icon: <BookOpen className="w-5 h-5" />, roles: [UserRole.TRAINER, UserRole.TRAINING_MANAGER] },
  { name: 'Performance Insights', icon: <LineChart className="w-5 h-5" />, roles: [UserRole.TRAINER, UserRole.DIRECTOR] },
  { name: 'Trainers', icon: <UserRoundSearch className="w-5 h-5" />, roles: [UserRole.DIRECTOR, UserRole.TRAINING_MANAGER, UserRole.OPERATIONS_MANAGER] },
  { name: 'Certification', icon: <ShieldCheck className="w-5 h-5" />, roles: [UserRole.DIRECTOR, UserRole.HR] },
  { name: 'Talent Engine', icon: <UserPlus className="w-5 h-5" />, roles: [UserRole.HR, UserRole.DIRECTOR] },
  { name: 'Culture Pulse', icon: <Heart className="w-5 h-5" />, roles: [UserRole.HR, UserRole.DIRECTOR] },
  { name: 'Growth Strategy', icon: <Rocket className="w-5 h-5" />, roles: [UserRole.HR, UserRole.DIRECTOR] },
  { name: 'Compliance Shield', icon: <ShieldAlert className="w-5 h-5" />, roles: [UserRole.HR, UserRole.DIRECTOR] },
  { name: 'Wellness Hub', icon: <Gift className="w-5 h-5" />, roles: [UserRole.HR, UserRole.DIRECTOR] },
  { name: 'Users', icon: <UserCheck className="w-5 h-5" />, roles: [UserRole.DIRECTOR] },
];

export const TRAINING_HOURS_OPTIONS = [8, 24, 40, 48, 72];

export const MOCK_USERS = [
  { id: '1', name: 'John Admin', email: 'admin@learnovate.com', role: UserRole.DIRECTOR, active: true },
  { id: '2', name: 'Sarah Retail', email: 'sarah@learnovate.com', role: UserRole.SALES_RETAIL, active: true },
  { id: '3', name: 'Mike Corporate', email: 'mike@learnovate.com', role: UserRole.SALES_CORPORATE, active: true },
  { id: '4', name: 'Emily Training', email: 'emily@learnovate.com', role: UserRole.TRAINING_MANAGER, active: true },
  { id: '5', name: 'David Finance', email: 'david@learnovate.com', role: UserRole.FINANCE, active: true },
  { id: '6', name: 'Linda HR', email: 'linda@learnovate.com', role: UserRole.HR, active: true },
  { id: '7', name: 'Alex Trainer', email: 'alex@learnovate.com', role: UserRole.TRAINER, active: true },
  { id: '8', name: 'James Expert', email: 'james@learnovate.com', role: UserRole.TRAINER, active: true },
  { id: '9', name: 'Victor Sales Boss', email: 'victor@learnovate.com', role: UserRole.SALES_MANAGER, active: true },
  { id: '10', name: 'Sophia Ops Master', email: 'sophia@learnovate.com', role: UserRole.OPERATIONS_MANAGER, active: true },
];
