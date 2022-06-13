import React from 'react'
import styles from './EmailSent.module.css'

import { useParams, useSearchParams } from "react-router-dom"
const EmailSent = ({ setLoginInfo }) => {
    const [searchParams] = useSearchParams();

    setLoginInfo(false);
    const { userEmail } = useParams();

    const verification = searchParams.get('verify');

    return (
        <div className={styles.container}>
            <div className={styles.heading}>{verification === 'true' ? 'Verify' : 'Reset'} Your Account</div>
            <div className={styles.message}>An email with your account {verification === 'true' ? 'confirmation' : 'reset'} link has been sent to your email: <span style={{ fontWeight: 'bold', color: 'red' }}>{userEmail}.</span>
            </div>
            <div className={styles.checkemail}>check your email and click the link provided there.</div>
        </div>
    )
}

export default EmailSent