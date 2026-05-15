import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { useAuthStore } from './store/useAuthStore';

// --- PUBLIC PAGES ---
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import PublicDirectory from './pages/PublicDirectory';


// --- OWNER / COMPANY ADMIN PAGES (/dashboard/*) ---
import Dashboard from './pages/Dashboard';
import Finance from './pages/Finance';
import Workforce from './pages/Workforce';
import BusinessSettings from './pages/BusinessSettings';
import InvoiceEditor from './pages/InvoiceEditor';
import DirectoryLeads from './pages/DirectoryLeads';
import MarketplaceManager from './pages/MarketplaceManager';
import Invoices from './pages/Invoices';

// --- STAFF / ENGINEER PAGES (/staff/*) ---
import StaffDashboard from './pages/staff/StaffDashboard';
import StaffProjects from './pages/staff/StaffProjects';
import StaffMessages from './pages/staff/StaffMessages';
import StaffAI from './pages/staff/StaffAI';
import StaffDocuments from './pages/staff/StaffDocuments';
import StaffSettings from './pages/staff/StaffSettings';

// --- SUPER ADMIN PAGES (/admin/*) ---
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminVerifications from './pages/admin/AdminVerifications';
import AdminUsers from './pages/admin/AdminUsers';
import AdminStats from './pages/admin/AdminStats';
import AdminSettings from './pages/admin/AdminSettings';


// --- SHARED DETAIL PAGES ---
import ProjectDetail from './pages/ProjectDetail';
import TenderBoard from './pages/TenderBoard';
import BOQEngine from './pages/BOQEngine';
import Messages from './pages/Messages';
import Documents from './pages/Documents';
import AIAssistant from './pages/AIAssistant';
import PublicMarketplace from './pages/PublicMarketPlace';

function App() {
  const { isAuthenticated, user } = useAuthStore();

  // Helper to determine where to send a logged-in user
  const getHomePath = () => {
    if (user?.role === 'admin') return "/admin";
    if (user?.role === 'staff') return "/staff/dashboard";
    return "/dashboard";
  };

  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          {/* ==========================================
              1. GUEST ROUTES
              ========================================== */}
          <Route path="/" element={isAuthenticated ? <Navigate to={getHomePath()} /> : <Landing />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to={getHomePath()} /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to={getHomePath()} /> : <Register />} />

          <Route path="/directory" element={<PublicDirectory />} />
          <Route path="/marketplace" element={<PublicMarketplace />} />


          {/* ==========================================
              2. OWNER / COMPANY ADMIN ROUTES (/dashboard)
              ========================================== */}
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['owner']}><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/finance" element={<ProtectedRoute allowedRoles={['owner']}><Finance /></ProtectedRoute>} />
          <Route path="/dashboard/workforce" element={<ProtectedRoute allowedRoles={['owner']}><Workforce /></ProtectedRoute>} />
          <Route path="/dashboard/invoices/new" element={<ProtectedRoute allowedRoles={['owner']}><InvoiceEditor /></ProtectedRoute>} />
          <Route path="/dashboard/settings/business" element={<ProtectedRoute allowedRoles={['owner']}><BusinessSettings /></ProtectedRoute>} />
          <Route path="/dashboard/directory" element={<ProtectedRoute allowedRoles={['owner']}><DirectoryLeads /></ProtectedRoute>} />
<Route path="/dashboard/marketplace" element={<ProtectedRoute allowedRoles={['owner']}><MarketplaceManager /></ProtectedRoute>} />
<Route path="/dashboard/invoices" element={<ProtectedRoute allowedRoles={['owner']}><Invoices /></ProtectedRoute>} />

          {/* Owner access to shared tools */}
          <Route path="/dashboard/projects" element={<ProtectedRoute allowedRoles={['owner']}><ProjectDetail /></ProtectedRoute>} />
          <Route path="/dashboard/messages" element={<ProtectedRoute allowedRoles={['owner']}><Messages /></ProtectedRoute>} />
          <Route path="/dashboard/boq" element={<ProtectedRoute allowedRoles={['owner']}><BOQEngine /></ProtectedRoute>} />
          <Route path="/dashboard/ai" element={<ProtectedRoute allowedRoles={['owner']}><AIAssistant /></ProtectedRoute>} />
          <Route path="/dashboard/documents" element={<ProtectedRoute allowedRoles={['owner']}><Documents /></ProtectedRoute>} />
          <Route path="/dashboard/tenders" element={<ProtectedRoute allowedRoles={['owner']}><TenderBoard /></ProtectedRoute>} />


          {/* ==========================================
              3. STAFF / ENGINEER ROUTES (/staff)
              ========================================== */}
          <Route path="/staff/dashboard" element={<ProtectedRoute allowedRoles={['staff']}><StaffDashboard /></ProtectedRoute>} />
          <Route path="/staff/projects" element={<ProtectedRoute allowedRoles={['staff']}><StaffProjects /></ProtectedRoute>} />
          <Route path="/staff/messages" element={<ProtectedRoute allowedRoles={['staff']}><StaffMessages /></ProtectedRoute>} />
          <Route path="/staff/ai" element={<ProtectedRoute allowedRoles={['staff']}><StaffAI /></ProtectedRoute>} />
          <Route path="/staff/documents" element={<ProtectedRoute allowedRoles={['staff']}><StaffDocuments /></ProtectedRoute>} />
          <Route path="/staff/settings" element={<ProtectedRoute allowedRoles={['staff']}><StaffSettings /></ProtectedRoute>} />


          {/* ==========================================
              4. SUPER ADMIN ROUTES (/admin)
              ========================================== */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/verifications" element={<ProtectedRoute allowedRoles={['admin']}><AdminVerifications /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/stats" element={<ProtectedRoute allowedRoles={['admin']}><AdminStats /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminSettings /></ProtectedRoute>} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;