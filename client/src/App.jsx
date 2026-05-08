import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { getToken } from './lib/api'
import AppLayout         from './components/layout/AppLayout'
import Login             from './pages/Login'
import Dashboard         from './pages/Dashboard'
import Leads             from './pages/Leads'
import LeadDetail        from './pages/LeadDetail'
import LeadNew           from './pages/LeadNew'
import LeadEdit          from './pages/LeadEdit'
import Pipeline          from './pages/Pipeline'
import Reports           from './pages/Reports'
import ActivityInsights  from './pages/ActivityInsights'
import LeadImport        from './pages/LeadImport'
import Settings          from './pages/Settings'

function Guard({ children }) {
  return getToken() ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Guard><AppLayout /></Guard>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard"      element={<Dashboard />} />
          <Route path="leads"          element={<Leads />} />
          <Route path="leads/new"      element={<LeadNew />} />
          <Route path="leads/:id"      element={<LeadDetail />} />
          <Route path="leads/:id/edit" element={<LeadEdit />} />
          <Route path="pipeline"       element={<Pipeline />} />
          <Route path="reports"        element={<Reports />} />
          <Route path="analytics"      element={<ActivityInsights />} />
          <Route path="import"         element={<LeadImport />} />
          <Route path="settings"       element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
