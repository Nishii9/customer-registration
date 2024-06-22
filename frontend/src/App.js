import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Tabs, Tab, Toolbar, Typography, Container } from '@mui/material';
import CustomerRegistration from './components/CustomerRegistration';
import AdminRegistration from './components/AdminRegistration';
import AdminLogin from './components/AdminLogin';
import './App.css'; // Import the CSS file

const App = () => {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} className="white-text">
            Registration System
          </Typography>
          <Tabs value={false} textColor="inherit" indicatorColor="secondary">
            <Tab label="Home" component={Link} to="/" className="white-text" />
            <Tab label="Register as Customer" component={Link} to="/register-customer" className="white-text" />
            <Tab label="Register as Admin" component={Link} to="/register-admin" className="white-text" />
            <Tab label="Admin Login" component={Link} to="/admin-login" className="white-text" />
          </Tabs>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ marginTop: '2rem' }}>
        <Routes>
          <Route path="/register-customer" element={<CustomerRegistration />} />
          <Route path="/register-admin" element={<AdminRegistration />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Container>
    </Router>
  );
};

const Home = () => (
  <div>
    <Typography variant="h4" gutterBottom>
      Welcome to Registration System
    </Typography>
    <Typography>
      This is a simple registration system where you can register as a customer or an admin.
    </Typography>
  </div>
);

export default App;
