
import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Layout,
  Menu,
  ChevronRight,
  Search,
  Bell,
  Settings,
  LogOut,
  Plus,
  Filter,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Briefcase as BriefcaseIcon,
  Users as UsersIcon,
  X,
  Target,
  CreditCard,
  Calendar,
  ShieldCheck,
  UserRoundSearch,
  Command,
  Clock,
  Check,
  User,
  Palette,
  Monitor,
  Shield,
  Activity,
  Globe,
  Database,
  ChevronDown,
  Sun,
  Moon,
  Sparkles,
  Command as CommandIcon,
  Zap,
  ChevronLeft,
  Mail,
  Lock,
  Key,
  ShieldAlert,
  BookOpen,
  LineChart,
  PieChart,
  Wallet,
  History,
  ArrowUpRight,
  Fingerprint,
  Save,
  // Add Loader2 to lucide-react imports
  Loader2
} from 'lucide-react';
import { useStore } from './store';
import { NAVIGATION_ITEMS } from './constants';
import { UserRole, LeadStatus, DealStage, TrainingStatus } from './types';
// Cast motion to any to bypass environment-specific type definition issues
import { motion as motionAny, AnimatePresence } from 'framer-motion';
const motion = motionAny as any;

// Page Components
import Dashboard from './pages/Dashboard';
import DirectorDashboard from './pages/DirectorDashboard';
import SalesRetailDashboard from './pages/SalesRetailDashboard';
import SalesCorporateDashboard from './pages/SalesCorporateDashboard';
import LeadsPage from './pages/LeadsPage';
import DealsPage from './pages/DealsPage';
import TrainingPage from './pages/TrainingPage';
import InvoicesPage from './pages/InvoicesPage';
import CertificationPage from './pages/CertificationPage';
import ProposalsPage from './pages/ProposalsPage';
import TrainerManagementPage from './pages/TrainerManagementPage';
import SalesManagerPage from './pages/SalesManagerPage';
import OperationsManagerPage from './pages/OperationsManagerPage';
import UsersPage from './pages/UsersPage';
import CurriculumHub from './pages/CurriculumHub';
import PerformanceInsights from './pages/PerformanceInsights';
import RevenueIQ from './pages/RevenueIQ';
import PayoutManagement from './pages/PayoutManagement';
import ComplianceVault from './pages/ComplianceVault';
import TalentEngine from './pages/TalentEngine';
import CulturePulse from './pages/CulturePulse';
import GrowthStrategy from './pages/GrowthStrategy';
import ComplianceShield from './pages/ComplianceShield';
import WellnessHub from './pages/WellnessHub';
import FeedbackHub from './pages/FeedbackHub';
import StudentNexus from './pages/StudentNexus';
import WorkforceAnalytics from './pages/WorkforceAnalytics';
import LifecycleManager from './pages/LifecycleManager';
import TrainingManagerDashboard from './pages/TrainingManagerDashboard';
import OperationsDashboard from './pages/OperationsDashboard';
import LandingPage from './pages/LandingPage';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
  icon: React.ReactNode;
}

const App: React.FC = () => {
  const store = useStore();
  const { theme, toggleTheme, currentUser, switchRole, data, setData } = store;

  // App state logic: 'landing' or 'app'
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Search Logic State
  const [searchQuery, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Notification Logic State
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set());

  // Settings Logic State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsSubView, setSettingsSubView] = useState<'main' | 'account' | 'security'>('main');
  const settingsRef = useRef<HTMLDivElement>(null);

  // Form states for dynamic settings
  const [accountForm, setAccountForm] = useState({ name: currentUser.name, email: currentUser.email });
  const [securityPrefs, setSecurityPrefs] = useState({ twoFactor: false, loginAlerts: true });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Sync form when user changes or modal opens
  useEffect(() => {
    if (isSettingsOpen) {
      setAccountForm({ name: currentUser.name, email: currentUser.email });
    } else {
      setTimeout(() => setSettingsSubView('main'), 300);
    }
  }, [isSettingsOpen, currentUser]);

  const handleUpdateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);

    // Simulate API call
    setTimeout(() => {
      setData((prev: any) => ({
        ...prev,
        users: prev.users.map((u: any) => u.id === currentUser.id ? { ...u, ...accountForm } : u)
      }));

      // Update the currentUser object in place (simple for mock store)
      Object.assign(currentUser, accountForm);

      setIsSavingProfile(false);
      setSettingsSubView('main');
    }, 800);
  };

  // Notification logic
  const notifications = useMemo<Notification[]>(() => {
    const { leads, invoices, trainingClasses } = store.data;
    const items: Notification[] = [];
    leads.slice(-2).forEach(l => {
      items.push({
        id: `lead-${l.id}`,
        title: 'New Lead Acquired',
        message: `${l.name} from ${l.company || 'Retail'} just entered the funnel.`,
        type: 'info',
        timestamp: l.createdAt,
        isRead: readNotifications.has(`lead-${l.id}`),
        icon: <Target className="w-4 h-4 text-indigo-500" />
      });
    });
    invoices.filter(i => i.status === 'Paid').slice(-2).forEach(i => {
      items.push({
        id: `pay-${i.id}`,
        title: 'Payment Confirmed',
        message: `Invoice ${i.invoiceNumber} of $${i.amount.toLocaleString()} has been cleared.`,
        type: 'success',
        timestamp: i.paymentDate || new Date().toISOString(),
        isRead: readNotifications.has(`pay-${i.id}`),
        icon: <CheckCircle className="w-4 h-4 text-emerald-500" />
      });
    });
    trainingClasses.filter(t => t.status === TrainingStatus.PLANNED).slice(-2).forEach(t => {
      items.push({
        id: `train-${t.id}`,
        title: 'Training Scheduled',
        message: `${t.courseName} is set to begin on ${new Date(t.startDate).toLocaleDateString()}.`,
        type: 'warning',
        timestamp: new Date().toISOString(),
        isRead: readNotifications.has(`train-${t.id}`),
        icon: <Calendar className="w-4 h-4 text-amber-500" />
      });
    });
    return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [store.data, readNotifications]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    setReadNotifications(new Set([...readNotifications, ...allIds]));
  };

  const filteredNavItems = useMemo(() => {
    return NAVIGATION_ITEMS.filter(item => item.roles.includes(store.currentUser.role));
  }, [store.currentUser.role]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const { leads, deals, invoices, users } = store.data;
    const results: any[] = [];

    leads.forEach(l => {
      if (l.name.toLowerCase().includes(query) || (l.company && l.company.toLowerCase().includes(query))) {
        results.push({ type: 'Lead', id: l.id, label: l.name, sub: l.company || 'Retail', icon: <Target className="w-4 h-4 text-emerald-500" />, tab: 'Leads' });
      }
    });

    deals.forEach(d => {
      if (d.title.toLowerCase().includes(query) || d.clientName.toLowerCase().includes(query)) {
        results.push({ type: 'Deal', id: d.id, label: d.title, sub: `${d.clientName} • $${d.value.toLocaleString()}`, icon: <BriefcaseIcon className="w-4 h-4 text-indigo-500" />, tab: 'Deals' });
      }
    });

    invoices.forEach(i => {
      if (i.invoiceNumber.toLowerCase().includes(query)) {
        results.push({ type: 'Invoice', id: i.id, label: i.invoiceNumber, sub: `$${i.amount.toLocaleString()}`, icon: <CreditCard className="w-4 h-4 text-amber-500" />, tab: 'Invoices' });
      }
    });

    users.forEach(u => {
      if (u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)) {
        const isTrainer = u.role === UserRole.TRAINER;
        results.push({
          type: 'Node',
          id: u.id,
          label: u.name,
          sub: u.role,
          icon: isTrainer ? <UserRoundSearch className="w-4 h-4 text-rose-500" /> : <ShieldCheck className="w-4 h-4 text-slate-500" />,
          tab: isTrainer ? 'Trainers' : 'Users'
        });
      }
    });

    return results.slice(0, 6);
  }, [searchQuery, store.data]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
        if (!searchQuery) setIsSearchExpanded(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setIsSearchExpanded(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleResultClick = (tab: string) => {
    setActiveTab(tab);
    setSearchTerm('');
    setIsSearchFocused(false);
    setIsSearchExpanded(false);
  };

  const toggleSearch = () => {
    if (!isSearchExpanded) {
      setIsSearchExpanded(true);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else if (!searchQuery) {
      setIsSearchExpanded(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        if (store.currentUser.role === UserRole.DIRECTOR) return <DirectorDashboard store={store} />;
        if (store.currentUser.role === UserRole.SALES_RETAIL) return <SalesRetailDashboard store={store} />;
        if (store.currentUser.role === UserRole.SALES_CORPORATE) return <SalesCorporateDashboard store={store} />;
        if (store.currentUser.role === UserRole.TRAINING_MANAGER) return <TrainingManagerDashboard store={store} />;
        if (store.currentUser.role === UserRole.OPERATIONS_MANAGER) return <OperationsDashboard store={store} />;
        return <Dashboard store={store} />;
      case 'Sales Manager': return <SalesManagerPage store={store} />;
      case 'Operations Hub': return <OperationsManagerPage store={store} />;
      case 'Leads': return <LeadsPage store={store} />;
      case 'Deals': return <DealsPage store={store} />;
      case 'Proposals': return <ProposalsPage store={store} />;
      case 'Invoices': return <InvoicesPage store={store} />;
      case 'Revenue IQ': return <RevenueIQ store={store} />;
      case 'Payouts': return <PayoutManagement store={store} />;
      case 'Compliance Vault': return <ComplianceVault store={store} />;
      case 'Training': return <TrainingPage store={store} />;
      case 'Curriculum Hub': return <CurriculumHub store={store} />;
      case 'Performance Insights': return <PerformanceInsights store={store} />;
      case 'Feedback Hub': return <FeedbackHub store={store} />;
      case 'Student Nexus': return <StudentNexus store={store} />;
      case 'Trainers': return <TrainerManagementPage store={store} />;
      case 'Certification': return <CertificationPage store={store} />;
      case 'Talent Engine': return <TalentEngine store={store} />;
      case 'Culture Pulse': return <CulturePulse store={store} />;
      case 'Growth Strategy': return <GrowthStrategy store={store} />;
      case 'Compliance Shield': return <ComplianceShield store={store} />;
      case 'Wellness Hub': return <WellnessHub store={store} />;
      case 'Workforce Analytics': return <WorkforceAnalytics store={store} />;
      case 'Lifecycle Manager': return <LifecycleManager store={store} />;
      case 'Users': return <UsersPage store={store} />;
      default: return <div className="p-8 text-center text-slate-500">Feature under construction: {activeTab}</div>;
    }
  };

  if (view === 'landing') {
    return <LandingPage onEnter={() => setView('app')} theme={theme} toggleTheme={toggleTheme} />;
  }

  return (
    <div className={`flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans transition-colors duration-700`}>
      {/* Sidebar - Enhanced Glassmorphism */}
      <aside className={`glass-sidebar transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col z-30 relative overflow-hidden ${isSidebarOpen ? 'w-72' : 'w-24'}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/5 to-transparent pointer-events-none" />

        <div className="p-8 flex items-center gap-4 overflow-hidden relative">
          <motion.div onClick={() => setView('landing')} whileHover={{ scale: 1.1, rotate: 5 }} className="relative flex-shrink-0 cursor-pointer group">
            <motion.div animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
            <div className="relative w-12 h-12 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(79,70,229,0.3)] border border-white/30 group-hover:border-white/60 transition-all">
              <Zap className="w-6 h-6 text-white fill-white/20" />
            </div>
          </motion.div>
          {isSidebarOpen && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="flex flex-col">
              <span className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white leading-none">Learnovate</span>
            </motion.div>
          )}
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto custom-scrollbar relative z-10">
          {filteredNavItems.map((item) => (
            <motion.button
              key={item.name}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 relative group overflow-hidden ${activeTab === item.name
                ? 'bg-indigo-600 text-white shadow-[0_15px_30px_-10px_rgba(79,70,229,0.4)]'
                : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
            >
              <div className={`${activeTab === item.name ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'} transition-colors duration-300`}>
                {item.icon}
              </div>
              {isSidebarOpen && <span className="font-bold text-sm tracking-tight">{item.name}</span>}
              {activeTab === item.name && (
                <motion.div layoutId="sidebar-pill" className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />
              )}
            </motion.button>
          ))}
        </nav>

        {/* User Card in Sidebar - Refined Glass */}
        <div className="p-4 mt-auto relative z-10">
          <div className="bg-white/30 dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-4 border border-white/30 dark:border-white/5 group transition-all hover:bg-white/40 dark:hover:bg-white/10">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-sm font-black text-white shadow-xl group-hover:scale-105 transition-transform duration-500">
                {currentUser.name.charAt(0)}
              </div>
              {isSidebarOpen && (
                <div className="overflow-hidden">
                  <p className="text-sm font-black truncate text-slate-800 dark:text-white leading-tight">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest truncate mt-0.5">{currentUser.role}</p>
                </div>
              )}
            </div>
            {isSidebarOpen && (
              <div className="relative group/select">
                <select
                  value={currentUser.role}
                  onChange={(e) => switchRole(e.target.value as UserRole)}
                  className="w-full bg-slate-900/5 dark:bg-white/5 border border-transparent rounded-2xl text-[10px] py-2.5 px-3 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all cursor-pointer text-slate-600 dark:text-slate-400 font-black hover:bg-white/60 dark:hover:bg-white/10 appearance-none uppercase tracking-widest"
                >
                  {Object.values(UserRole).map(role => <option key={role} value={role} className="dark:bg-slate-900 dark:text-white uppercase">{role}</option>)}
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area - Refined Header Glassmorphism */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-24 glass dark:bg-slate-950/40 border-b border-black/5 dark:border-white/5 flex items-center justify-between px-10 sticky top-0 z-20 transition-all duration-500">
          <div className="flex items-center gap-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="relative w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-500 transition-all text-slate-600 dark:text-slate-400 hover:text-indigo-600"
            >
              <motion.div animate={{ rotate: isSidebarOpen ? 180 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                <ChevronRight className="w-6 h-6" />
              </motion.div>
            </motion.button>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col"
              >
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">{activeTab}</h1>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-5">
            {/* Search Bar - Modern Detached Glass */}
            <div className="flex items-center gap-3 relative" ref={searchRef}>
              <motion.div layout animate={{ width: isSearchExpanded ? 400 : 48 }} className="relative flex items-center h-12">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleSearch}
                  className={`z-10 p-3 rounded-2xl transition-all shadow-sm flex items-center justify-center ${isSearchExpanded
                    ? 'text-white bg-indigo-600'
                    : 'text-slate-50 bg-white dark:bg-slate-900 dark:text-slate-400 border border-slate-100 dark:border-slate-800'
                    }`}
                >
                  {searchQuery ? <ArrowUpRight className="w-6 h-6" /> : <Search className="w-6 h-6" />}
                </motion.button>
                <AnimatePresence>
                  {isSearchExpanded && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="absolute inset-0 flex items-center pl-6">
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search workspace (Ctrl + /)"
                        value={searchQuery}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        className="w-full h-12 pl-10 pr-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold shadow-xl outline-none focus:ring-4 focus:ring-indigo-500/10 dark:text-white"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* DYNAMIC SEARCH RESULTS DROP DOWN */}
              <AnimatePresence>
                {isSearchExpanded && searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full mt-4 right-0 w-[480px] glass neo-shadow rounded-[2.5rem] overflow-hidden z-[100] border border-black/5 dark:border-white/5"
                  >
                    <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Results</span>
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/20 px-3 py-1 rounded-lg">{searchResults.length} Match Found</span>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                      {searchResults.length > 0 ? (
                        <div className="p-3 space-y-1">
                          {searchResults.map((res: any, i: number) => (
                            <motion.button
                              key={`${res.type}-${res.id}`}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              onClick={() => handleResultClick(res.tab)}
                              className="w-full flex items-center gap-4 p-4 rounded-[1.8rem] hover:bg-white dark:hover:bg-slate-800 transition-all group text-left"
                            >
                              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                {res.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-black text-slate-900 dark:text-white truncate">{res.label}</p>
                                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[8px] font-black uppercase tracking-tighter text-slate-400 group-hover:bg-indigo-500 group-hover:text-white">{res.type}</span>
                                </div>
                                <p className="text-xs font-bold text-slate-400 truncate mt-0.5">{res.sub}</p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-indigo-500 transition-colors" />
                            </motion.button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-20 text-center flex flex-col items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                            <Search className="w-8 h-8 text-slate-200" />
                          </div>
                          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No nodes found in registry</p>
                        </div>
                      )}
                    </div>
                    {searchResults.length > 0 && (
                      <div className="p-4 bg-indigo-600 text-white text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest">Press 'Enter' for Advanced Indexing</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-8 w-px bg-black/5 dark:bg-white/5 mx-1" />

            {/* Notifications with Glass Popover */}
            <div className="relative" ref={notificationRef}>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`relative p-3 rounded-2xl transition-all shadow-sm ${isNotificationsOpen
                  ? 'bg-indigo-600 text-white shadow-[0_10px_20px_-5px_rgba(79,70,229,0.3)]'
                  : 'text-slate-500 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 dark:text-slate-400 hover:shadow-md'
                  }`}
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2.5 right-2.5 w-5 h-5 bg-indigo-500 border-2 border-white dark:border-slate-950 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </motion.button>
              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="absolute top-full mt-5 right-0 w-[420px] glass neo-shadow rounded-[2.5rem] overflow-hidden z-[110]"
                  >
                    <div className="p-8 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Signal Feed</h3>
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">System Intelligence</p>
                      </div>
                      <button onClick={markAllAsRead} className="px-4 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-all text-indigo-600 dark:text-indigo-400 font-black text-[10px] uppercase tracking-widest">Mark All Read</button>
                    </div>
                    <div className="max-h-[480px] overflow-y-auto custom-scrollbar bg-white/20 dark:bg-slate-950/20">
                      {notifications.length > 0 ? (
                        <div className="divide-y divide-black/5 dark:divide-white/5">
                          {notifications.map((notif) => (
                            <motion.div key={notif.id} className={`p-6 flex gap-5 transition-all relative ${!notif.isRead ? 'bg-indigo-500/5 dark:bg-indigo-500/10' : ''}`}>
                              <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-sm border border-white dark:border-white/5 ${notif.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600' : notif.type === 'warning' ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-600' : 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600'}`}>
                                {notif.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-3 mb-1.5">
                                  <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">{notif.title}</h4>
                                  <span className="text-[9px] font-black text-slate-400 whitespace-nowrap uppercase">{new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">{notif.message}</p>
                              </div>
                              {!notif.isRead && <div className="absolute top-1/2 -translate-y-1/2 right-4 w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_12px_rgba(79,70,229,0.5)]" />}
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-20 text-center">
                          <p className="text-lg font-black text-slate-300">No active signals</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle - Ultra Modern Anim */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 12 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-amber-400 shadow-sm hover:shadow-md transition-all group"
            >
              <AnimatePresence mode="wait">
                {theme === 'light' ? (
                  <motion.div key="sun" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}><Sun className="w-6 h-6" /></motion.div>
                ) : (
                  <motion.div key="moon" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}><Moon className="w-6 h-6" /></motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Settings with Improved Toggles */}
            <div className="relative" ref={settingsRef}>
              <motion.button whileHover={{ y: -2, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={() => setIsSettingsOpen(!isSettingsOpen)} className={`p-3 rounded-2xl transition-all shadow-sm ${isSettingsOpen ? 'bg-indigo-600 text-white' : 'text-slate-500 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-md'}`}>
                <Settings className="w-6 h-6" />
              </motion.button>
              <AnimatePresence>
                {isSettingsOpen && (
                  <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="absolute top-full mt-5 right-0 w-[420px] glass neo-shadow rounded-[3rem] overflow-hidden z-[120]">
                    {settingsSubView === 'main' && (
                      <motion.div key="main" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-10">
                        <div className="flex items-center gap-5 mb-10">
                          <div className="w-16 h-16 bg-slate-900 rounded-[2rem] flex items-center justify-center shadow-xl"><User className="w-8 h-8 text-white" /></div>
                          <div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight truncate max-w-[200px]">{currentUser.name}</h3>
                            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">{currentUser.role}</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <button onClick={() => setSettingsSubView('account')} className="w-full flex items-center justify-between p-5 bg-black/5 dark:bg-white/5 rounded-2xl hover:bg-indigo-500 hover:text-white transition-all group">
                            <div className="flex items-center gap-4"><User className="w-5 h-5 opacity-40 group-hover:opacity-100" /> <span className="text-sm font-bold">My Profile</span></div>
                            <ChevronRight className="w-4 h-4 opacity-40 group-hover:opacity-100" />
                          </button>
                          <button onClick={() => setSettingsSubView('security')} className="w-full flex items-center justify-between p-5 bg-black/5 dark:bg-white/5 rounded-2xl hover:bg-indigo-500 hover:text-white transition-all group">
                            <div className="flex items-center gap-4"><Shield className="w-5 h-5 opacity-40 group-hover:opacity-100" /> <span className="text-sm font-bold">Safety Settings</span></div>
                            <ChevronRight className="w-4 h-4 opacity-40 group-hover:opacity-100" />
                          </button>
                        </div>
                        <div className="mt-10 pt-8 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                          <button onClick={() => setView('landing')} className="flex items-center gap-2 text-rose-500 hover:text-rose-600 text-xs font-black uppercase tracking-widest transition-all"><LogOut className="w-4 h-4" /> Log Out</button>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Build 3.0.5</span>
                        </div>
                      </motion.div>
                    )}

                    {settingsSubView === 'account' && (
                      <motion.div key="account" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-10">
                        <button onClick={() => setSettingsSubView('main')} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 hover:text-indigo-500 transition-colors">
                          <ChevronLeft className="w-4 h-4" /> Go Back
                        </button>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8">My Profile</h3>
                        <form onSubmit={handleUpdateAccount} className="space-y-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Name</label>
                            <input
                              type="text"
                              value={accountForm.name}
                              onChange={e => setAccountForm({ ...accountForm, name: e.target.value })}
                              className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-8 focus:ring-indigo-500/5 font-bold dark:text-white"
                              placeholder="Enter your name"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <input
                              type="email"
                              value={accountForm.email}
                              onChange={e => setAccountForm({ ...accountForm, email: e.target.value })}
                              className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-8 focus:ring-indigo-500/5 font-bold dark:text-white"
                              placeholder="your@email.com"
                              required
                            />
                          </div>
                          <div className="pt-4">
                            <button
                              type="submit"
                              disabled={isSavingProfile}
                              className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl uppercase tracking-widest text-[11px] shadow-2xl flex items-center justify-center gap-3 transition-all hover:bg-indigo-700 disabled:opacity-50"
                            >
                              {isSavingProfile ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                              {isSavingProfile ? 'Saving...' : 'Save Changes'}
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    )}

                    {settingsSubView === 'security' && (
                      <motion.div key="security" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-10">
                        <button onClick={() => setSettingsSubView('main')} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 hover:text-indigo-500 transition-colors">
                          <ChevronLeft className="w-4 h-4" /> Go Back
                        </button>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-8">Safety Settings</h3>
                        <div className="space-y-6">
                          <div className="flex items-center justify-between p-6 bg-black/5 dark:bg-white/5 rounded-[2rem]">
                            <div>
                              <p className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1.5">Extra Login Step</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Keeps account safer</p>
                            </div>
                            <label className="switch-toggle">
                              <input type="checkbox" checked={securityPrefs.twoFactor} onChange={() => setSecurityPrefs({ ...securityPrefs, twoFactor: !securityPrefs.twoFactor })} />
                              <span className="slider"></span>
                            </label>
                          </div>
                          <div className="flex items-center justify-between p-6 bg-black/5 dark:bg-white/5 rounded-[2rem]">
                            <div>
                              <p className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1.5">Alerts on Phone</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Notify on new logins</p>
                            </div>
                            <label className="switch-toggle">
                              <input type="checkbox" checked={securityPrefs.loginAlerts} onChange={() => setSecurityPrefs({ ...securityPrefs, loginAlerts: !securityPrefs.loginAlerts })} />
                              <span className="slider"></span>
                            </label>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-10 scroll-smooth custom-scrollbar relative">
          <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-indigo-50/5 to-transparent pointer-events-none" />
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
};

export default App;
