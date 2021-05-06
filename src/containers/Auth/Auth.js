import React, { useState } from 'react';
import './Auth.scss';
import { useSelector,useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { checkValidity } from '../../shared/Validity';
import PropTypes from 'prop-types';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import ScrollToTopOnMount from '../../shared/ScrollToTopOnMount';
import {auth} from './../../store/actions/authActions'
function  Auth(){
  const loading=useSelector(state => state.auth.loading )
  const error  =useSelector(state => state.auth.error)
  const isAuth =useSelector(state => state.auth.token !== null)
  const dispatch =useDispatch();
  const [controls,setControls] = useState({
          email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Mail Address'
        },
        value: '',
        validation: {
          required: true,
          isEmail: true
        },
        valid: false,
        touched: false
      },
      password: {
        elementType: 'input',
        elementConfig: {
          type: 'password',
          placeholder: 'Password'
        },
        value: '',
        validation: {
          required: true,
          minLength: 6
        },
        valid: false,
        touched: false
      
    },
  });
  const [isSignup,setIsSignUp]=useState(true)

  const inputChangedHandler = (e, controlName) => {
    const updatedControls = {
      ...controls,
      [controlName]: { // update only one input
        ...controls[controlName],
        value: e.target.value,
        valid: checkValidity(e.target.value, controls[controlName].validation),
        touched: true
      }
    };
    setControls(updatedControls);
  };

  const submitHandler = e => {
    e.preventDefault();
    dispatch(auth(controls.email.value, controls.password.value,isSignup));
  };

  const switchAuthModeHandler = () => {
    setIsSignUp(prevState => {
      return {
        isSignup: !prevState.isSignup
      };
    });
  };
    // convert object of objects into array of objects
    const formElementsArray = [];
    for (let key in controls) {
      formElementsArray.push({
        id: key,
        config: controls[key]
      });
    };

    let form = formElementsArray.map(formElement => (
      <Input
        key={formElement.id}
        elementType={formElement.config.elementType}
        elementConfig={formElement.config.elementConfig}
        value={formElement.config.value}
        invalid={!formElement.config.valid}
        shouldValidate={formElement.config.validation}
        touched={formElement.config.touched}
        changed={(e) => inputChangedHandler(e, formElement.id)}
      />
    ));

    // Display Spinner
    if (loading) {
      form = <Spinner />
    };

    // Display Firebase Error Message
    let errorMessage = null;
    if (error) {
      errorMessage = (
        <p>{error.message}</p>
      )
    };

    // redirect after signin/login
    let authRedirect = null;
    if (isAuth) {
      authRedirect = <Redirect to="/" />
    };

    let title = <h1 className="auth-title">You don't have an account yet? Create them below.</h1>
    if (!isSignup) title = <h1 className="auth-title">Do you already have an account? Log in below.</h1>;

    return (
      <>
        <ScrollToTopOnMount />
        <div className="auth-container">
          {title}
          <div className="switch">
            <Button
              clicked={switchAuthModeHandler()}
              btnType="dark">SWITCH TO {isSignup ? 'SINGIN' : 'SIGNUP'}</Button>
          </div>
          {authRedirect}
          {errorMessage}
          <form onSubmit={submitHandler}>
            {form}
            <Button>Submit</Button>
          </form>
        </div>
      </>
    );
  }


Auth.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  isAuth: PropTypes.bool.isRequired,
  onAuth: PropTypes.func.isRequired
};

export default Auth;