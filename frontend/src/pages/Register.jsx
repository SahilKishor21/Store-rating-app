import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SignupForm from '../components/auth/SignupForm';
import useAuthStore from '../stores/authStore';

const Register = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/stores');
    }
  }, [isAuthenticated, navigate]);

  return <SignupForm />;
};

export default Register;