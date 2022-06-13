import React from 'react'
import styles from './HomeLogo.module.css'
import bigGlobe from '../../images/globeBig.png'
import smallGlobe from '../../images/globeSmall.png'
const HomeLogo = () => {
    return (
        <div className={styles.container}>
            <img className={styles.bigGlobe} src={bigGlobe} alt="" />
            <img className={styles.smallGlobe} src={smallGlobe} alt="" />
            <p className={styles.noteAdd}>Save and access your notes from anywhere</p>
        </div>
    )
}

export default HomeLogo