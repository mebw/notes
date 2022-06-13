import React, { useState } from 'react'
import styles from './Settings.module.css'
import settingsBlu from '../../images/Categoryblu.png';
import settingsBla from '../../images/Categorybla.png';
import userBlu from '../../images/userblu.png';
import userBla from '../../images/userbla.png';
import SettingsCategory from './SettingsCategory/SettingsCategory';
import SettingsUser from './SettingsUser/SettingsUser';

import { useDispatch } from 'react-redux';
import { showSettings } from '../../features/settings';
const Settings = () => {
    const [toggleState, setToggleState] = useState(1);
    const dispatch = useDispatch();

    const toggleTab = (index) => {
        setToggleState(index);
    };





    return (
        <div className={styles.container} >
            <div className={styles.contentWrapper}>
                <span className={styles.closeModal} onClick={() => dispatch(showSettings({ showSettings: false }))}>X</span>

                <div className={styles.blocTabs}>
                    {/* tab 1 */}
                    <button
                        className={toggleState === 1 ? `${styles.tabs} ${styles.activeTabs}` : `${styles.tabs}`}
                        onClick={() => toggleTab(1)}
                    >
                        <div><img src={toggleState === 1 ? userBlu : userBla} alt="" /></div>
                        <div className={styles.tabText}>User</div>
                    </button>
                    {/* tab 2 */}
                    <button
                        className={toggleState === 2 ? `${styles.tabs} ${styles.activeTabs}` : `${styles.tabs}`}
                        onClick={() => toggleTab(2)}
                    >
                        <div><img src={toggleState === 1 ? settingsBla : settingsBlu} alt="" /></div>
                        <div className={styles.tabText}>Category</div>
                    </button>

                </div>
                {/* content of the tabs */}
                <div className={styles.contentTabs}>
                    {/* content of tab1 */}
                    <div
                        className={toggleState === 1 ? `${styles.content} ${styles.activeContent}` : `${styles.content}`}
                    >
                        <SettingsUser />

                    </div>
                    {/* content of tab 2 */}
                    <div
                        className={toggleState === 2 ? `${styles.content} ${styles.activeContent}` : `${styles.content}`}
                    >
                        <SettingsCategory />
                    </div>
                </div>

                {/* </div> */}
                {/* tabConainer ends above */}
            </div>
        </div>

    )
}

export default Settings