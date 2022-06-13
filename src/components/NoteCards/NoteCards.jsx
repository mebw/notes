import React from 'react'
import NoteCard from './NoteCard/NoteCard'
import styles from './NoteCards.module.css'

import { useDispatch, useSelector } from 'react-redux';
import { noteMode } from '../../features/notes';
import { NoteMode } from '../../helper/NoteMode'

import newNoteWhiteIcon from '../../images/newNoteWhite.png'

import { Link } from 'react-router-dom'

const NoteCards = ({ notes }) => {

    const noteState = useSelector(state => state.notes);
    const dispatch = useDispatch();

    const newNoteDiplay = () => {
        let returnValue;
        //if noteState in new note mode, hide the new note button.
        if (noteState.value.noteMode === NoteMode.New)
            returnValue =
                <Link to="/note" className="link">
                    <div className={styles.sidebarItems} style={{ display: "none" }}>
                        <img src={newNoteWhiteIcon} alt="newNoteWhiteIcon" style={{ width: "18px" }} onClick={() => {
                            dispatch(noteMode({ noteMode: NoteMode.New }))
                        }} />
                    </div>
                </Link>

        //if noteState in other mode, like view mode or edit mode, show the new note button.
        else
            returnValue =
                <Link to="/note/0" className="link">
                    <div className={styles.sidebarItems}>
                        <img src={newNoteWhiteIcon} alt="newNoteWhiteIcon" style={{ width: "18px" }} onClick={() => dispatch(noteMode({ noteMode: NoteMode.New }))} />
                    </div>
                </Link>

        return returnValue;
    }


    return (
        <div>

            {/* this div with style styles.mobileIcons is only visible in mobile phones */}
            <div className={styles.mobileIcons} >
                {newNoteDiplay()}
            </div>

            <div className={styles.container}>
                {notes.map(note => <NoteCard key={note._id} note={note} />)}
            </div>
        </div>
    )
}

export default NoteCards