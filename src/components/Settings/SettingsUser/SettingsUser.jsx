import React, { useState, useEffect } from 'react'
import styles from './SettingsUser.module.css';
import fileUpload from '../../../images/fileUpload.png'
import avatar from '../../../images/avatar.png'
import { imageService } from '../../../services/images.service';
import { accountService } from '../../../services/account.service';
import { useDispatch, useSelector } from 'react-redux';
import { updateImagePath } from '../../../features/user';
import { imageUploaded } from '../../../features/img/imgSync';
import { fetchImagePath } from '../../../features/imgAsync';
import { uploadImages } from '../../../features/imgUploadAsync';
import { showSettings } from '../../../features/settings';
const SettingsUser = () => {
    const [file, setFile] = useState(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordChanged, setPasswordChanged] = useState(false);
    const [error, setError] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const [fileInputState, setFileInputState] = useState('');

    const dispatch = useDispatch()
    const uploadImageState = useSelector(state => state.imageUpload);
    const imagePathState = useSelector(state => state.imagePath);
    const handleChange = (e) => {
        //todo: save image to db
        const file = e.target.files[0];
        setFile(file);
        setFileInputState(e.target.value);
        if (!file) return;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            uploadImage(reader.result);
        };
        reader.onerror = () => {
            console.error('AHHHHHHHH!!');
            setErrMsg('something went wrong!');
        };
    }

    // const uploadImage = async (base64EncodedImage) => {
    //     const user = accountService.userValue
    //     try {
    //         const response = await imageService.uploadImage({ imageData: base64EncodedImage, userId: user.id });
    //         setUploading(false);
    //         setErrMsg('');
    //         dispatch(updateImagePath(response.imagePath));
    //         setSuccessMsg('Image uploaded successfully');
    //     } catch (error) {
    //         setUploading(false);
    //         console.error(error);
    //         setErrMsg('Something went wrong!');
    //     }



    const uploadImage = (base64EncodedImage) => {
        dispatch(uploadImages({ imageData: base64EncodedImage }));
        dispatch(imageUploaded());

    }


    const changePassword = (e) => {
        e.preventDefault();

        if (currentPassword.trim().length === 0 || newPassword.trim().length === 0) {
            setError('Passwords do not match');
            return;
        };
        setIsChangingPassword(true);


        // remove token from url to prevent http referer leakage


        accountService.changePassword({ userId: accountService.userValue.id, currentPassword, newPassword }).then((response) => {
            if (response.success) {
                setIsChangingPassword(false);
                // setPasswordChanged(true);
                setError('');
                dispatch(showSettings({ showSettings: false }))
            }
            else {
                setError(response.msg);
                setIsChangingPassword(false);
            }
        }).catch((error) => {
            setError(error.message);
            setIsChangingPassword(false);
            // setPasswordChanged(false);
        });
    }

    //////////////////////////////////////////////////////

    //const user = accountService.userValue


    // useEffect(() => {
    //     const getImage = async () => {

    //         imageService.getImage({ userId: user.id }).then((response) => {
    //             // console.log(response);
    //             setImageFromdb(response.imagePath);
    //             dispatch(updateImagePath(response.imagePath));
    //         }).catch((err) => {
    //             console.error(err);
    //             setErrMsg('Something went wrong!');
    //         });
    //     }
    //     getImage()
    // }, [dispatch, user.id])
    useEffect(() => {
        dispatch(fetchImagePath())
    }, []);


    return (
        <div className={styles.container}>
            <div className={styles.photoArea}>
                <h4>Change photo</h4>
                <div className={styles.photoHolder}>


                    {
                        file
                            ?
                            (uploadImageState.loading || uploadImageState.error.length > 0 ? <img className={styles.photo} style={{ opacity: "0.2" }} src={URL.createObjectURL(file)} alt="" /> : <img className={styles.photo} src={URL.createObjectURL(file)} alt="" />)
                            :
                            (imagePathState.loading || imagePathState.error.length > 0 ? <img className={styles.photo} src={avatar} alt="" /> : <img className={styles.photo} src={imagePathState.profilePic} alt="" />)
                    }
                    <span className={styles.upload}>
                        <label className={styles.uploadLabel} htmlFor="fileInput">
                            {/* htmlFor holds the id of the input of the type 'file'. */}
                            <img src={fileUpload} alt="" />
                        </label>
                        <input type="file" id="fileInput" accept="image/png, image/gif, image/jpeg" style={{ display: "none" }} onChange={handleChange} value={fileInputState} />

                    </span>
                </div>
            </div>
            <hr />
            <div className={styles.passwordArea}>

                <h4>Change password</h4>
                <form>
                    <div className={styles.passwordHolder}>

                        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current password" />
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="new password" />
                        {error && <span style={{ color: 'red', textAlign: 'center' }}>{error}</span>}
                    </div>
                </form>
                <div className={styles.btnSaveChanges}>
                    <button type="submit" onClick={changePassword} disabled={isChangingPassword}>Save change</button>
                </div>
            </div>
        </div>
    )
}

export default SettingsUser