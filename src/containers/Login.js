import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import { useAppContext } from '../libs/contextLib';
import { useFormFields } from '../libs/hooksLib';
import { onError } from '../libs/errorLib';
import './Login.css';

const Login = () => {
  const history = useHistory();
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange ] = useFormFields({
    email: '',
    password: ''
  })

  const validateForm = () => fields.email.length > 0
    && fields.password.length > 0;

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    try {
      await Auth.signIn(fields.email, fields.password);  
      userHasAuthenticated(true);

    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  };

  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="email" bsSize="large">
          <ControlLabel>Email</ControlLabel>
          <FormControl
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <ControlLabel>Password</ControlLabel>
          <FormControl 
            value={fields.password}
            onChange={handleFieldChange}
            type="password"
          />
        </FormGroup>
        <LoaderButton 
          block 
          bsSize="large" 
          disabled={!validateForm()} 
          type="submit"
          isLoading={isLoading}
        >
          Login
        </LoaderButton>
      </form>
    </div>
  );
};

export default Login;