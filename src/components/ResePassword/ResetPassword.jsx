import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { accountService } from '../../services/account.service';
import styles from './ResetPassword.module.css'
const ResetPassword = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [error, setError] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordResetted, setPasswordResetted] = useState(false);
    const reset = () => {
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        };

        if (newPassword.trim().length === 0 || confirmPassword.trim().length === 0) {
            setError('Passwords do not match');
            return;
        };
        setIsResettingPassword(true);
        const token = searchParams.get('token');

        // remove token from url to prevent http referer leakage
        setSearchParams({});

        accountService.resetPassword({ token, newPassword }).then((response) => {
            setIsResettingPassword(false);
            setPasswordResetted(true);
        }).catch((error) => {
            setError(error.message);
            setIsResettingPassword(false);
            setPasswordResetted(false);
        });
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        reset();
    }
    const resetPasswordControls = <div className={styles.container}>
        <p className={styles.headingText}>Create your new password</p>
        <form className={styles.passwordHolder}>
            <div className={styles.createPassword}>
                {/* https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label */}

                <input type="password" className={styles.inputvalue} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} name="createPass" id="createPass" placeholder="Create password" />

                <input type="password" className={styles.inputvalue} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} name="confirmPass" id="confirmPass" placeholder="Confirm password" />
            </div>
            <div style={{ color: 'red' }}>{error && "Error: " + error}</div>
            <button type="submit" disabled={isResettingPassword} className={styles.resetPassword} onClick={handleSubmit}>Reset password</button>
        </form>
    </div>

    const resetPasswordSuccess = <div className={styles.container}>
        <p className={styles.headingText}>Password reset successful</p>
        <p className={styles.message}>You can now login with your new password.</p>
    </div>
    return (
        passwordResetted ? resetPasswordSuccess : resetPasswordControls
    )
}

export default ResetPassword