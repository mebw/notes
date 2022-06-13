import React, { useState, useEffect } from 'react'
import NoteCards from '../../components/NoteCards/NoteCards'
import Sidebar from '../../components/Sidebar/Sidebar'
import { accountService } from '../../services/account.service'
import Home from '../Home/Home'
import styles from './NotesAndSidebar.module.css'
import { noteService } from '../../services/notes.service'
import { useSelector } from 'react-redux';
const NotesAndSidebar = () => {

    const notesDataState = useSelector(state => state.notesData);
    const [notes, setNotes] = useState([]);

    const user = accountService.userValue;

    //this is for first time load when user logged in. Because there is a problem
    //with redux. You cant access the updated state immediately after dispatch(which is the case in the second useEffect)
    //here is an explanation: https://getridbug.com/reactjs/redux-not-updating-right-after-dispatch-in-functional-components/
    //I don't understand how to implement in the explanation.

    //as a solution I am using 2 useEffect. One for the first load time when user logs in(it directly fetchs data from server)
    //second using redux store. 
    //If you dont understand why two useEffect are used, remove the first one and 
    //data of notes will not be loaded automatically after user signs in. 
    //this is because eventhough I am updating the state of notes data  to updated=true, 
    //redux is not reading the change immediately after dispatch(code is written to do
    //that in the second useEffect). It is a known problem, and I guess it
    //can be solved using redux thunk as desicribed in the above link, but I have no idea how to do that.

    //this first useEffect runs only once when user logs in.
    useEffect(() => {
        if (!notesDataState.updated) {
            const getAllNotesOfUser = async () => {
                try {
                    const res = await noteService.getUserNotes({ userId: user.id })
                    setNotes(res.notes);
                } catch (err) {
                    console.log(err.message);
                }
            };
            getAllNotesOfUser();
        }
    }, [])

    useEffect(() => {
        //update notes local state whenever notes is updated from other components.(like when 'my notes' is clicked on the side bar or when user searches using search dialog for notes)
        setNotes(notesDataState.notes);

    }, [notesDataState.notes]);



    if (!user?.id) return <Home />
    return (
        <div className={styles.container}>
            <div className={styles.sideBar}>
                <Sidebar />
            </div>
            <NoteCards notes={notes} />
        </div>
    )
}

export default NotesAndSidebar