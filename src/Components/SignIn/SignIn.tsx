import React, { useRef, useState } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FormHelperText from '@material-ui/core/FormHelperText';
import LinearProgress from '@material-ui/core/LinearProgress';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import PersonAddIcon from '@material-ui/icons/PersonAddOutlined';
import {
  Field, Form, Formik, FormikHelpers,
} from 'formik';
import { CheckboxWithLabel } from 'formik-material-ui';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';

import { register, signIn } from 'Redux/actions';
import { RootState } from 'Redux/reducers';
import { errorSelector } from 'Selectors/errors';
import { loadingSelector } from 'Selectors/loading';
import ActionNames from 'Constants/actionNames';
import AvatarSelector from 'Components/AvatarSelector';
import UserEmailField from 'Components/UserEmailField';
import UserNameField from 'Components/UserNameField';
import UserPasswordField from 'Components/UserPasswordField';
import {
  email as emailValidation,
  name as nameValidation,
  password as passwordValidation,
} from 'Common/validation';

enum State {
  SIGN_IN = 'SIGN_IN',
  REGISTER = 'REGISTER',
}

const validationSchemaSignIn = Yup.object().shape({
  email: emailValidation,
  password: passwordValidation,
});

const validationSchemaRegister = Yup.object().shape({
  email: emailValidation,
  password: passwordValidation,
  name: nameValidation,
});

type FromValues = {
  name: string;
  email: string;
  password: string;
  remember: boolean;
}

const SignIn = () => {
  const dispatch = useDispatch();

  const loginError = useSelector((rootState: RootState) => errorSelector(rootState, ActionNames.LOGIN));
  const registerError = useSelector((rootState: RootState) => errorSelector(rootState, ActionNames.REGISTER));
  const loginLoading = useSelector((rootState: RootState) => loadingSelector(rootState, ActionNames.LOGIN));
  const registerLoading = useSelector((rootState: RootState) => loadingSelector(rootState, ActionNames.REGISTER));

  const isLogging = loginLoading || registerLoading;

  const [variant, setVariant] = useState<State>(State.SIGN_IN);

  const avatarFileInput = useRef<HTMLInputElement>(null);

  const onSignIn = (values: FromValues) => {
    const { email, password, remember } = values;
    dispatch(signIn({ email, password, remember }));
  };

  const onRegister = (values: FromValues) => {
    const files = avatarFileInput?.current?.files;
    const avatar = files ? files[0] : undefined;

    const {
      email, password, name, remember,
    } = values;
    dispatch(register({
      email, password, name, avatar, remember,
    }));
  };

  const onSubmit = (values: FromValues, { setSubmitting }: FormikHelpers<FromValues>) => {
    if (variant === State.SIGN_IN) {
      onSignIn(values);
    } else if (variant === State.REGISTER) {
      onRegister(values);
    }
    setSubmitting(false);
  };

  let validationSchema;
  let title = '';
  if (variant === State.SIGN_IN) {
    validationSchema = validationSchemaSignIn;
    title = 'Sign in';
  } else if (variant === State.REGISTER) {
    validationSchema = validationSchemaRegister;
    title = 'Register';
  }

  const initialValues: FromValues = {
    name: '',
    email: '',
    password: '',
    remember: false,
  };

  return (
    <Box pt={8} px={2} width="100%" alignItems="center" display="flex" flexDirection="column">
      <Paper elevation={2}>
        <Box maxWidth="30rem">
          <AppBar position="static">
            <Tabs
              value={variant}
              onChange={(event, value) => setVariant(value)}
              variant="fullWidth"
              disabled={isLogging}
            >
              <Tab disabled={isLogging} value={State.SIGN_IN} label="Sign in" />
              <Tab disabled={isLogging} value={State.REGISTER} label="Register" />
            </Tabs>
          </AppBar>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            p={3}
          >
            <Box p={1}>
              {variant === State.SIGN_IN && <LockOutlinedIcon color="primary" fontSize="large" />}
              {variant === State.REGISTER && <PersonAddIcon color="primary" fontSize="large" />}
            </Box>
            <Typography component="h1" variant="h5">
              {title}
            </Typography>
            <Box mt={1}>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({ submitForm }) => (
                  <Form>
                    {loginError && variant === State.SIGN_IN && (
                    <FormHelperText error>{loginError}</FormHelperText>
                    )}
                    {registerError && variant === State.REGISTER && (
                    <FormHelperText error>{registerError}</FormHelperText>
                    )}
                    {variant === State.REGISTER && (
                    <>
                      <AvatarSelector disabled={isLogging} avatarFileInput={avatarFileInput} />
                      <Field disabled={isLogging} component={UserNameField} name="name" />
                    </>
                    )}
                    <Field disabled={isLogging} component={UserEmailField} name="email" />
                    <Field disabled={isLogging} component={UserPasswordField} name="password" />
                    <Field
                      disabled={isLogging}
                      component={CheckboxWithLabel}
                      name="remember"
                      Label={{ label: 'Remember me' }}
                      color="primary"
                      type="checkbox"
                    />
                    {isLogging && <LinearProgress />}
                    <Box mt={3}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={isLogging}
                        onClick={submitForm}
                      >
                        {title}
                      </Button>
                    </Box>
                  </Form>
                )}
              </Formik>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default SignIn;
