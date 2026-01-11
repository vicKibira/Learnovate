
import { useState, useEffect } from 'react';
import { 
  User, Lead, Deal, Proposal, Invoice, TrainingClass, Learner, 
  UserRole, LeadStatus, DealStage, TrainingStatus, TrainerProfile 
} from './types';
import { MOCK_USERS } from './constants';

const STORAGE_KEY = 'learnovate_crm_data';

export const useStore = () => {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [data, setData] = useState({
    users: MOCK_USERS as User[],
    trainerProfiles: [] as TrainerProfile[],
    leads: [] as Lead[],
    deals: [] as Deal[],
    proposals: [] as Proposal[],
    invoices: [] as Invoice[],
    trainingClasses: [] as TrainingClass[],
    learners: [] as Learner[],
    targets: [] as { userId: string, target: number, achieved: number }[]
  });

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.trainerProfiles) parsed.trainerProfiles = [];
      setData(parsed);
    } else {
      const initialProfiles: TrainerProfile[] = MOCK_USERS
        .filter(u => u.role === UserRole.TRAINER)
        .map(u => ({
          userId: u.id,
          skills: ['Python', 'Cloud Architecture'],
          availability: 'Available' as const,
          bio: 'Expert trainer with 10+ years of experience.',
          courses: ['Python Advanced', 'AWS Essentials'],
          availabilitySlots: [],
          activityLog: [{ id: '1', action: 'Profile initialized', timestamp: new Date().toISOString() }]
        }));
      setData(prev => ({ ...prev, trainerProfiles: initialProfiles }));
    }

    const savedTheme = localStorage.getItem('learnovate_theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.className = savedTheme;
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.className = newTheme;
    localStorage.setItem('learnovate_theme', newTheme);
  };

  const addLead = (lead: Omit<Lead, 'id' | 'createdAt' | 'history'>) => {
    const newLead: Lead = {
      ...lead,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      history: [`Lead created at ${new Date().toLocaleString()}`]
    };
    setData(prev => ({ ...prev, leads: [...prev.leads, newLead] }));
    return newLead;
  };

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    setData(prev => ({
      ...prev,
      leads: prev.leads.map(l => l.id === id ? { 
        ...l, 
        status, 
        history: [...l.history, `Status updated to ${status} at ${new Date().toLocaleString()}`] 
      } : l)
    }));
  };

  const createDealFromLead = (leadId: string, value: number) => {
    const lead = data.leads.find(l => l.id === leadId);
    if (!lead) return;

    const newDeal: Deal = {
      id: Math.random().toString(36).substr(2, 9),
      title: `${lead.name} - ${lead.company || 'Retail Training'}`,
      clientId: lead.id,
      clientName: lead.name,
      type: lead.type,
      value: value,
      stage: DealStage.QUALIFICATION,
      assignedTo: lead.assignedTo,
      expectedClose: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isPaid: false
    };

    updateLeadStatus(leadId, LeadStatus.CONVERTED);
    setData(prev => ({ ...prev, deals: [...prev.deals, newDeal] }));
  };

  const updateDealStage = (dealId: string, stage: DealStage) => {
    setData(prev => ({
      ...prev,
      deals: prev.deals.map(d => d.id === dealId ? { ...d, stage } : d)
    }));
  };

  const createProposal = (dealId: string, courses: Proposal['courses']) => {
    const deal = data.deals.find(d => d.id === dealId);
    if (!deal) return;

    const total = courses.reduce((sum, c) => sum + c.price, 0);
    const newProposal: Proposal = {
      id: `PROP-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      dealId,
      clientName: deal.clientName,
      courses,
      totalValue: total,
      status: 'Sent',
      createdAt: new Date().toISOString()
    };

    setData(prev => ({ ...prev, proposals: [...prev.proposals, newProposal] }));
    updateDealStage(dealId, DealStage.PROPOSAL_SENT);
  };

  const acceptProposal = (proposalId: string) => {
    const prop = data.proposals.find(p => p.id === proposalId);
    if (!prop) return;

    setData(prev => ({
      ...prev,
      proposals: prev.proposals.map(p => p.id === proposalId ? { ...p, status: 'Accepted' } : p)
    }));

    const newInvoice: Invoice = {
      id: Math.random().toString(36).substr(2, 9),
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      dealId: prop.dealId,
      amount: prop.totalValue,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Pending'
    };

    setData(prev => ({ ...prev, invoices: [...prev.invoices, newInvoice] }));
    updateDealStage(prop.dealId, DealStage.PROPOSAL_ACCEPTED);
    updateDealStage(prop.dealId, DealStage.INVOICE_SENT);
  };

  const confirmPayment = (invoiceId: string) => {
    const inv = data.invoices.find(i => i.id === invoiceId);
    if (!inv) return;

    setData(prev => ({
      ...prev,
      invoices: prev.invoices.map(i => i.id === invoiceId ? { ...i, status: 'Paid', paymentDate: new Date().toISOString() } : i),
      deals: prev.deals.map(d => d.id === inv.dealId ? { ...d, isPaid: true, stage: DealStage.PAYMENT_CONFIRMED } : d)
    }));
  };

  const scheduleTraining = (dealId: string, training: Omit<TrainingClass, 'id'>) => {
    const deal = data.deals.find(d => d.id === dealId);
    if (!deal || !deal.isPaid) {
      alert("Payment MUST be confirmed before scheduling training!");
      return;
    }

    const isTrainerBusy = data.trainingClasses.some(t => 
      t.trainerId === training.trainerId && 
      ((training.startDate >= t.startDate && training.startDate <= t.endDate) || 
       (training.endDate >= t.startDate && training.endDate <= t.endDate))
    );

    if (isTrainerBusy) {
      alert("Conflict detected: Trainer is already booked for these dates!");
      return;
    }

    const newTraining: TrainingClass = {
      ...training,
      id: Math.random().toString(36).substr(2, 9)
    };

    setData(prev => ({ ...prev, trainingClasses: [...prev.trainingClasses, newTraining] }));
    updateDealStage(dealId, DealStage.TRAINING_SCHEDULED);
  };

  const updateTrainerProfile = (profile: TrainerProfile) => {
    setData(prev => {
      const exists = prev.trainerProfiles.some(p => p.userId === profile.userId);
      const newLogEntry = { id: Math.random().toString(36).substr(2, 9), action: `Profile updated by ${currentUser.name}`, timestamp: new Date().toISOString() };
      const updatedProfile = { 
        ...profile, 
        activityLog: [...(profile.activityLog || []), newLogEntry] 
      };

      return {
        ...prev,
        trainerProfiles: exists 
          ? prev.trainerProfiles.map(p => p.userId === profile.userId ? updatedProfile : p)
          : [...prev.trainerProfiles, updatedProfile]
      };
    });
  };

  const updateUserAvatar = (userId: string, avatar: string) => {
    setData(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === userId ? { ...u, avatar } : u)
    }));
  };

  const addTrainerUser = (userData: { name: string, email: string }, profileData: Omit<TrainerProfile, 'userId'>) => {
    const userId = Math.random().toString(36).substr(2, 9);
    const newUser: User = {
      id: userId,
      name: userData.name,
      email: userData.email,
      role: UserRole.TRAINER,
      active: true
    };

    const newProfile: TrainerProfile = {
      ...profileData,
      userId,
      activityLog: [{ id: '1', action: 'Account created', timestamp: new Date().toISOString() }]
    };

    setData(prev => ({
      ...prev,
      users: [...prev.users, newUser],
      trainerProfiles: [...prev.trainerProfiles, newProfile]
    }));
    return userId;
  };

  const addSalesUser = (userData: { name: string, email: string, role: UserRole.SALES_RETAIL | UserRole.SALES_CORPORATE }) => {
    const userId = Math.random().toString(36).substr(2, 9);
    const newUser: User = {
      id: userId,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      active: true
    };

    setData(prev => ({
      ...prev,
      users: [...prev.users, newUser]
    }));
    return userId;
  };

  const issueCertificate = (learnerId: string) => {
    const certId = `CERT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    setData(prev => ({
      ...prev,
      learners: prev.learners.map(l => l.id === learnerId ? { 
        ...l, 
        completed: true, 
        certificateId: certId, 
        issuedAt: new Date().toISOString() 
      } : l)
    }));
  };

  const switchRole = (role: UserRole) => {
    const user = MOCK_USERS.find(u => u.role === role) || MOCK_USERS[0];
    setCurrentUser(user as User);
  };

  return {
    currentUser,
    data,
    theme,
    toggleTheme,
    addLead,
    updateLeadStatus,
    createDealFromLead,
    updateDealStage,
    createProposal,
    acceptProposal,
    confirmPayment,
    scheduleTraining,
    issueCertificate,
    switchRole,
    updateTrainerProfile,
    updateUserAvatar,
    addTrainerUser,
    addSalesUser,
    setData
  };
};
