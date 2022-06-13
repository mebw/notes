import React from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import NoteView from '../../components/NoteView/NoteView'
import styles from './NoteViewAndSidebar.module.css'
import { useParams } from "react-router-dom"
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
const NoteViewAndSidebar = ({ showSettings, setShowSettings }) => {

    const { noteId } = useParams();
    const history = useNavigate();
    const userState = useSelector(state => state.user);
    if (!userState.value.user) {
        history('/')
    }

    return (
        <div className={styles.container}>
            <div className={styles.sideBar}>
                <Sidebar />
            </div>
            <NoteView noteId={noteId} showSettings={showSettings} setShowSettings={setShowSettings} />

        </div>
    )
}

export default NoteViewAndSidebar