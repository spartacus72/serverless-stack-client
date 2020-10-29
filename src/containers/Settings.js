import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { API } from 'aws-amplify';
import { onError } from '../libs/errorLib';
import config from '../config';
import { StripeProvider, Elements } from 'react-stripe-elements';
import BillingForm from '../components/BillingForm';
import './Settings.css';

const Settings = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [stripe, setStripe] = useState(null);

  const billUser = (details) => API.post("notes", "/billing", {
    body: details
  });

  useEffect(() => {
    setStripe(window.stripe(config.STRIP_KEY));
  }, []);

  const handleFormSubmit = async (storage, { token, error}) => {
    if (error) {
      onError(error);
      return;
    }

    setIsLoading(true);

    try {
      await billUser({
        storage,
        source: token.id
      });

      alert("your card has been charged successfully!");
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  };

  return (
    <div className="Settings">
      <StripeProvider stripe={stripe}>
        <Elements>
          <BillingForm 
            isLoading={isLoading} 
            onSubmit={handleFormSubmit}
          />
        </Elements>
      </StripeProvider>
    </div>
  );
};

export default Settings;