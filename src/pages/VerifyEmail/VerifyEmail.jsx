import React, { useState, useEffect } from 'react'
import styles from './VerifyEmail.module.css'
import { accountService } from '../../services/account.service';
import { useSearchParams } from "react-router-dom"
import verified from '../../images/VerifiedUser.png'

const VerifyEmail = () => {
    // setLoginInfo(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const [verifying, setIsVerifying] = useState(true);

    const isVerifyingEmail =

        <div className={styles.container}>
            <div className={styles.verifying}>Verifying...</div>
        </div>


    const emailVerified =

        <div className={styles.container}>
            <img src={verified} alt="email verified" />
            <div className={styles.heading}>Email Verified!</div>
            <div className={styles.message}>You have successfully verified your account.</div>
            <div className={styles.messageLogin}>Go to the login page to login.</div>

        </div>

    const verify = () => {
        const token = searchParams.get('token');

        // remove token from url to prevent http referer leakage
        setSearchParams({});

        accountService.verifyEmail(token).then((response) => {

            setIsVerifying(false);
        }).catch(() => {
            setIsVerifying(false);
        });


    }

    useEffect(() => {
        verify();

    }, []
    );

    return (
        <div className={styles.container}>{verifying ? isVerifyingEmail : emailVerified}</div>
    )
}

export default VerifyEmail