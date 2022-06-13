import React from 'react'
import styles from './NoteCard.module.css'
import deleteNote from '../../../images/delete.png'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { showDialog } from '../../../features/delete'
const NoteCard = ({ note }) => {
    const dispatch = useDispatch();

    const firstLetterUppercase = (str) => {
        return str.charAt(0).toUpperCase();
    }


    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const deleteSelectedNote = () => {
        dispatch(showDialog({ noteName: note.title, noteId: note._id, deleteNote: false, showDeleteDialog: true }));
    }

    return (
        <div className={styles.container}>
            <div className={styles.cardTop}>
                <div className={styles.categoryLogo} style={{ backgroundColor: `${note.category.color}` }}>

                    {firstLetterUppercase(note.category.name)}
                </div>
                <div className={styles.noteInfo}>
                    <p className={styles.noteTitle}>{note.title}</p>
                    <p className={styles.noteCategory}>{note.category.name}</p>
                    <p className={styles.noteDate}>{formatDate(note.createdAt)}</p>
                </div>
                <div onClick={deleteSelectedNote} className={styles.noteDelete}>
                    <img src={deleteNote} alt="delete note" />
                </div>

            </div>
            <div className={styles.noteText}>
                <Link to={`/note/${note._id}`} className="link">
                    <p> {note.content.length < 150 ? note.content : note.content.substring(0, 150) + '...'}</p>
                </Link>
            </div>

        </div>
    )
}

export default NoteCard