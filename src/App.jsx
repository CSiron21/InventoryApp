import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import supabase from './supabaseClient'
import LoginPage from './components/LoginPage.jsx'
import SignupPage from './components/SignupPage.jsx'
import Dashboard from './components/Dashboard.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import InventoryPage from './pages/InventoryPage.jsx'
import SalesOrdersPage from './pages/SalesOrdersPage.jsx'
import PurchaseOrdersPage from './pages/PurchaseOrdersPage.jsx'
import SuppliersPage from './pages/SuppliersPage.jsx'

function App() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        if (session?.user) {
          loadProfile(session.user.id)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (!data) {
      const { error: insertError } = await supabase.from('profiles').insert([
        { id: userId, username: null }
      ])
      if (insertError) console.error('Insert error:', insertError)
    } else {
      setProfile(data)
    }
  }

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    return session ? children : <Navigate to="/login" replace />
  }

  // Auth Route Component (redirect to dashboard if already logged in)
  const AuthRoute = ({ children }) => {
    return !session ? children : <Navigate to="/dashboard" replace />
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Auth Routes */}
          <Route 
            path="/login" 
            element={
              <AuthRoute>
                <LoginPage />
              </AuthRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <AuthRoute>
                <SignupPage />
              </AuthRoute>
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard user={session?.user} profile={profile} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/inventory" 
            element={
              <ProtectedRoute>
                <Dashboard user={session?.user} profile={profile} activeTab="inventory" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/sales-orders" 
            element={
              <ProtectedRoute>
                <Dashboard user={session?.user} profile={profile} activeTab="sales-orders" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/purchase-orders" 
            element={
              <ProtectedRoute>
                <Dashboard user={session?.user} profile={profile} activeTab="purchase-orders" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/suppliers" 
            element={
              <ProtectedRoute>
                <Dashboard user={session?.user} profile={profile} activeTab="suppliers" />
              </ProtectedRoute>
            } 
          />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
