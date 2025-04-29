import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WithAuth = (WrappedComponent) => {
  const ComponentWithAuth = () => {
    const navigate = useNavigate();
    useEffect(() => {
      if (!localStorage.getItem('id')) navigate('/');
    }, [navigate]);
    return <WrappedComponent />;
  };
  return ComponentWithAuth;
};

export default WithAuth;