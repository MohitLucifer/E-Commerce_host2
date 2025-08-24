import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
const Spinner = ({path = 'login'}) => {
  const [count, setCount] = useState(2);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevValue) => --prevValue);
    }, 1000);
    count === 0 &&
      navigate(`/${path}`, {
        state: location.pathname,
      });
    return () => clearInterval(interval);
  }, [count, navigate, location,path]);
  return (
    <>
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="modern-spinner-message">
          <span className="redirect-text">Redirecting you in <span className="redirect-count">{count}</span> second{count !== 1 ? 's' : ''}...</span>
        </div>
        <div className="modern-spinner">
          <div className="modern-spinner-circle"></div>
        </div>
      </div>
    </>
  );
};

export default Spinner;