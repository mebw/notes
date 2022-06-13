
import React, { useEffect, useState } from 'react';

import styles from './DeleteDialog.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { yes, no } from '../../features/delete';
import { noteService } from '../../services/notes.service';
import { getNote } from '../../features/notesApi'
import { setUpdated } from '../../features/notesData';
import { accountService } from '../../services/account.service';
import { noteMode } from '../../features/notes';
import { NoteMode } from '../../helper/NoteMode';
const DeleteDialog = () => {

    const dispatch = useDispatch();
    const deleteState = useSelector(state => state.delete);
    const user = accountService.userValue;
    const deleteNote = async () => {
        try {
            await noteService.deleteNote({ noteId: deleteState.value.noteId });
            dispatch(setUpdated(true));


            dispatch(noteMode({ noteMode: NoteMode.View }));
            getNote({ userId: user.id }, dispatch, true);

            dispatch(yes());


        } catch (error) {
            console.log(error);
        }

    }


    const dialog = <div className={styles.container}>
        <div className={styles.contentWrapper}>

            <div className={styles.title}>
                <p>Are you sure you want to delete note <span style={{ color: 'red' }}>'{deleteState.value.noteName}' </span>?</p>
            </div>

            <div className={styles.confirmButtonDiv}>
                <button onClick={deleteNote} className={styles.confirmButton}>yes</button>
                <button onClick={() => dispatch(no())} className={styles.confirmButton}>no</button>
            </div>
        </div>
    </div>

    return (
        deleteState.value.showDeleteDialog ? dialog : null
    )
}

export default DeleteDialog