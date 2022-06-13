import React, { useState } from 'react'
import { Formik, Field, Form, ErrorMessage, useFormik } from 'formik'
import styles from './SignUp.module.css'
import * as Yup from 'yup'
import { accountService } from '../../services/account.service'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { closeDialog } from '../../features/header';
import { userSignedIn } from '../../features/img/imgSync'
import { fetchImagePath } from '../../features/imgAsync'
const SignUp = ({ setClose, showLoginPopUp }) => {
    let dat;
    const headerState = useSelector(state => state.header);
    const dispatch = useDispatch();
    headerState.value.showLoginPopup ? dat = 2 : dat = 1; //if 2 it is login if 1 it is sign up
    const [value, setValue] = useState(dat)
    const [userInDb, setUserInDb] = useState(false)
    const [dataSubmitted, setDataSubmitted] = useState(false)
    const [loginErrorMessage, setLoginErrorMessage] = useState('')
    const history = useNavigate();
    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        onSubmit: (values) => {
            setDataSubmitted(true)
            accountService.register(values)
                .then((data) => {
                    setDataSubmitted(false)
                    if (!data.success)
                        setUserInDb(true)
                    else {
                        dispatch(closeDialog(true))
                        history(`/emailSent/${values.email}?verify=true`)
                    }
                })
                .catch(error => {
                    console.log(error)
                });
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email format').required('required'),
            password: Yup.string().required('password is required.')
        })
    });

    const initialValues = {
        email: '',
        password: ''
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Email is invalid')
            .required('Email is required'),
        password: Yup.string().required('Password is required')
    });

    const userSignedInInfo = () => {
        dispatch(userSignedIn());
    }
    function onSubmit2({ email, password }, { setSubmitting }) {
        //reset error message
        setLoginErrorMessage('');
        accountService.login(email, password)
            .then((user) => {

                if (user?.msg) {
                    setLoginErrorMessage(user.msg)
                }
                else {
                    dispatch(closeDialog(true));
                    dispatch(fetchImagePath());
                    userSignedInInfo();
                    history('/notes');
                }

                setSubmitting(false);


            })
            .catch(error => {
                console.log(error);
                setSubmitting(false);
            });
    }

    const loginFormik = <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit2}>
        {({ errors, touched, isSubmitting }) => (
            <Form>
                <div className={styles.signUpForm}>

                    <h3>Login</h3>
                    <Field name="email" className={styles.inputvalue} id="email" type="text" placeholder="Email" />
                    <ErrorMessage name="email" component="div" style={{ color: 'red' }} />
                    <Field name="password" className={styles.inputvalue} id="password" type="password" placeholder="Password"
                    />
                    <ErrorMessage name="password" component="div" style={{ color: 'red' }} />

                    <button type="submit" disabled={isSubmitting} className={styles.btnSubmit}>Login</button>
                    <div className={styles.loginError}>{loginErrorMessage}</div>
                    <hr />
                    <span className={styles.signInLink} style={{ textAlign: "center" }} onClick={() => { setValue(3) }}>Forgot password</span>
                    <div className={styles.account}>don't have an account?
                        <span className={styles.signInLink} onClick={() => { setValue(1) }}> Create One</span>
                    </div>


                </div>
            </Form>
        )}
    </Formik>

    const fpInitialValues = {
        email: ''
    };

    const fpValidationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Email is invalid')
            .required('Email is required')
    });
    function onSubmit({ email }, { setSubmitting }) {
        setLoginErrorMessage('');
        accountService.forgotPassword({ email })
            .then((response) => {
                if (!response.success) {
                    setLoginErrorMessage(response.msg)
                }
                else {
                    dispatch(closeDialog(true));
                    history(`/emailSent/${email}?verify=false`);
                }
                setSubmitting(false);

            })
            .catch(error => {
                console.log(error);
                setSubmitting(false);
                // alertService.error(error);
            });
    }

    const forgotPasswordFormik = <Formik initialValues={fpInitialValues} validationSchema={fpValidationSchema} onSubmit={onSubmit}>
        {({ errors, touched, isSubmitting }) => (
            <Form>
                <div className={styles.signUpForm}>
                    <div className={styles.account}>Enter your email address and we will send you a link to reset your password.</div>

                    <Field name="email" className={styles.inputvalue} id="email" type="text" placeholder="Email" />
                    <ErrorMessage name="email" component="div" style={{ color: 'red' }} />
                    <button type="submit" className={styles.btnSubmit} disabled={isSubmitting} >Send</button>

                </div>
            </Form>
        )}
    </Formik>
    const GetContent = (value) => {
        let returnValue;
        if (value === 1)
            returnValue = <>
                <h2 className={styles.headerText}> Create an account</h2>
                <div className={styles.signUpBox}>
                    <form className={styles.signUpForm} onSubmit={formik.handleSubmit}>
                        <div className={styles.signUpInfo}>Sign up with your email and a password</div>
                        <input className={styles.inputvalue} name="email" id="email" type="text" placeholder="Email" onChange={formik.handleChange} value={formik.values.email} />
                        {formik.errors.email ? <p style={{ color: 'red', margin: '0px', textAlign: 'left' }}>{formik.errors.email}</p> : null}
                        <input className={styles.inputvalue} name="password" id="password" type="password" placeholder="Password"
                            onChange={formik.handleChange} value={formik.values.password} />
                        {formik.errors.password ? <p style={{ color: 'red', margin: '0px', textAlign: 'left' }}>{formik.errors.password}</p> : null}
                        <button className={styles.btnSubmit} type="submit" disabled={dataSubmitted}>Sign up</button>
                        {dataSubmitted ? <div style={{ margin: 'auto' }}><div className={styles.loader}></div></div> : null}

                        {userInDb ? <p style={{ color: 'red', margin: '0px', textAlign: 'left' }}>email already exists. please choose another email.</p> : null}
                        <hr />
                    </form>
                </div>
                <div className={styles.account}>Already have an account?
                    <span className={styles.signInLink} onClick={() => { setValue(2) }}> Sign In</span>
                </div>
            </>;

        else if (value === 2)
            returnValue = <>
                {loginFormik}
            </>
        else if (value === 3)
            returnValue = <>

                {forgotPasswordFormik}
            </>
        else
            returnValue = null;

        return returnValue;
    }





    return (
        <div className={styles.container} >

            <div className={styles.contentWrapper}>
                <h2 className={styles.closeButton} onClick={() => { dispatch(closeDialog(true)) }}>x</h2>

                {GetContent(value)}
            </div>
        </div >

    )
}

export default SignUp