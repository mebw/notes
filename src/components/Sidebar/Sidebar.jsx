import React from 'react'
import styles from './Sidebar.module.css'
import notes from '../../images/notes.png'
import newNote from '../../images/newNote.png'
import { useDispatch, useSelector } from 'react-redux'
import { noteMode } from '../../features/notes';
import { NoteMode } from '../../helper/NoteMode'
import { Link } from "react-router-dom";
import { getNote } from '../../features/notesApi'
import { accountService } from '../../services/account.service'
const Sidebar = () => {
    const dispatch = useDispatch()
    const noteState = useSelector(state => state.notes);

    const newNoteDiplay = () => {
        let returnValue;
        //if noteState is 'new' note mode, hide the new note button.
        if (noteState.value.noteMode === NoteMode.New) {
            returnValue =
                <Link to="/note" className="link">
                    <div className={styles.sidebarItems} style={{ display: "none" }}>
                        <div onClick={() => dispatch(noteMode({ noteMode: NoteMode.New }))}>
                            <img src={newNote} alt="new" />
                            <span>New</span>
                        </div>
                    </div>
                </Link>

        }
        //if noteState in other mode, like view mode or edit mode, show the new note button.
        else {
            returnValue =
                <Link to="/note/0" className="link">
                    <div className={styles.sidebarItems}>
                        <div onClick={() => dispatch(noteMode({ noteMode: NoteMode.New }))}>
                            <img src={newNote} alt="new" />
                            <span >New</span>
                        </div>
                    </div>
                </Link>
        }
        return returnValue;
    }
    return (
        <div className={styles.container} >
            <Link to="/notes" className="link">
                <div className={styles.sidebarItems} onClick={() => {
                    dispatch(noteMode({ noteMode: NoteMode.View }));
                    getNote({ userId: accountService.userValue.id }, dispatch, true);

                }}>
                    {/* Reason of calling dispatch here is so that 'new' for creating note will be visible on the sidebar.  */}
                    <img src={notes} alt="notes" />
                    <span>My notes</span>
                </div>
            </Link>
            {newNoteDiplay()}
        </div>
    )
}

export default Sidebar