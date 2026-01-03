
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './layouts/Layout';

import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateTrip from './pages/CreateTrip.jsx';
// import ItineraryBuilder from "./pages/ItineraryBuilder.jsx";
import ItineraryView from "./pages/ItineraryView.jsx";
import TripBudget from "./pages/TripBudget.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Dashboard from './pages/Dashboard.jsx'; // Ensure .jsx extension
import PublicTrip from './pages/PublicTrip';
import MyTrips from './pages/MyTrips.jsx';
import TripBuilder from './pages/TripBuilder.jsx';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/share/:shareId" element={<PublicTrip />} />

          {/* Protected Routes wrapped in Layout */}
          <Route element={<Layout />}>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-trip"
              element={
                <ProtectedRoute>
                  <CreateTrip />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-trips"
              element={
                <ProtectedRoute>
                  <MyTrips />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trip/:id"
              element={
                <ProtectedRoute>
                  <TripBuilder />
                </ProtectedRoute>
              }
            />
            <Route path="/trip/:tripId/budget" element={<TripBudget />} />
            <Route path="/trip/:tripId/view" element={<ItineraryView />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
