import React, { useEffect, useState } from 'react'
import styles from './NoteView.module.css';
import settingsIcon from '../../images/settings.png'
import editIcon from '../../images/edit.png'
import deleteEnabled from '../../images/deleteEnabled.png'
import saveNoteIcon from '../../images/saveNote.png'
import notesWhiteIcon from '../../images/notesWhite.png'
import newNoteWhiteIcon from '../../images/newNoteWhite.png'
import { useDispatch, useSelector } from 'react-redux';

import TimeAgo from 'react-timeago'

import Select from 'react-select';
import { noteMode } from '../../features/notes';
import { showSettings } from '../../features/settings';
import { NoteMode } from '../../helper/NoteMode'
import { Link, useNavigate } from 'react-router-dom';

import { accountService } from '../../services/account.service';
import { noteService } from '../../services/notes.service';
import { categoryService } from '../../services/categories.service';

const NoteView = ({ noteId }) => {
    const noteState = useSelector(state => state.notes);
    const dispatch = useDispatch();
    const [selectedOption, setSelectedOption] = useState(null); //this is for the 3rd party, react-select, dropdown menu component.

    const [ddlData, setDdlData] = useState([]);
    const [notes, setNotes] = useState({});
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [color, setColor] = useState('');

    const [category, setCategory] = useState('');//this is for category name of category selected from the dropdown menu.
    const [categoryId, setCategoryId] = useState('');//this is for category id.

    const history = useNavigate();

    const clearFields = () => {
        if (noteState.value.noteMode === NoteMode.New) {
            setTitle('');
            setContent('');
        }
    }
    const getNotes = async (noteId) => {

        if (noteId.length > 1) { //if noteId is different from 0, then we are editing a note. 0 is for new note.
            const response = await noteService.getNote({ noteId });
            const data = response.note[0];

            setNotes(data);
            setTitle(data.title);
            setContent(data.content);
            setCategory(data.category.name);
            setCategoryId(data.category._id);
            setColor(data.category.color);
        }

    }


    async function getCategories() {
        const user = accountService.userValue;
        const userId = user.id;
        let dat = [];
        const res = await categoryService.getUserNoteCategories({ userId });
        const categories = res.categories;
        categories.map((category) => (
            dat.push({ value: category._id, label: category.name })
        ))
        setDdlData(dat);

    }
    useEffect(() => {
        getNotes(noteId);
        clearFields(); //this will remove the values from the fields(title and content) if new is clicked when the component is re-rendered. Don't add clearFields function to the dependency array, otherwise it will not allow you to enter the values in the fields(title and content).
    }, [noteId]);

    useEffect(() => {
        getCategories();
    }, []);

    const handleSave = () => {
        if (title.length === 0 || content.length === 0 || selectedOption === null) {
            return;
        }
        const user = accountService.userValue;
        const category = selectedOption.value;


        if (user?.id) {
            noteService.addNote({ title, category, content, belongsTo: user.id })
                .then((response) => {
                    history('/notes');
                })
                .catch(error => { console.log(error) });
        }
        clearFields();
        dispatch(noteMode({ noteMode: NoteMode.View }));
    }

    const handleUpdate = () => {

        if (title.length === 0 || content.length === 0) {//dont include if electedOption to check if it is null  here, because it is gonna be always null. 
            return;

        }
        const user = accountService.userValue;
        const category = selectedOption?.value ? selectedOption.value : categoryId; //if user doesnt select any category, then use the categoryId(if user doesn't select a value, selectedOption is always null). Because the categoryId is the category that the note being edited belongs to.


        if (user?.id) {

            noteService.updateNote({ noteId, title, category, content, userId: user.id })
                .then((response) => {

                    dispatch(noteMode({ noteMode: NoteMode.View }));
                    history('/notes');
                })
                .catch(error => { console.log(error) });
        }

    }

    const handleDelete = () => {

        dispatch(noteMode({ noteMode: NoteMode.View }));
    }
    const newNoteDiplay = () => {
        let returnValue;
        //if noteState in new note mode, hide the new note button.
        if (noteState.value.noteMode === NoteMode.New) {
            returnValue =
                <Link to="/note" className="link">
                    <div className={styles.sidebarItems} style={{ display: "none" }}>
                        <img src={newNoteWhiteIcon} alt="newNoteWhiteIcon" style={{ width: "18px" }} onClick={() => dispatch(noteMode({ noteMode: NoteMode.New }))} />
                    </div>
                </Link>

        }
        //if noteState in other mode, like view mode or edit mode, show the new note button.
        else {
            returnValue =
                <Link to="/note/0" className="link">
                    <div className={styles.sidebarItems}>
                        <img src={newNoteWhiteIcon} alt="newNoteWhiteIcon" style={{ width: "18px" }} onClick={() => dispatch(noteMode({ noteMode: NoteMode.New }))} />
                    </div>
                </Link>
        }
        return returnValue;
    }

    const changeInterface = (mode) => {
        let returnValue;
        if (mode === NoteMode.View) {
            returnValue = <>
                <div className={styles.headerIcons}>
                    {/* this div with style styles.mobileIcons is only visible in mobile phones */}
                    <div className={styles.mobileIcons}>
                        <Link to="/notes" className="link">
                            <div className={styles.sidebarItems} onClick={() => dispatch(noteMode({ noteMode: NoteMode.View }))}>
                                {/* Reason of calling dispatch here is so that 'new' for creating note will be visible on the sidebar.  */}
                                <img src={notesWhiteIcon} alt="notesWhiteIcon" style={{ width: "18px" }} />

                            </div>
                        </Link>
                        {newNoteDiplay()}

                    </div>
                    <img src={editIcon} alt="edit" onClick={() => dispatch(noteMode({ noteMode: NoteMode.Edit }))} />

                    <img src={settingsIcon} alt="settings" onClick={() => dispatch(showSettings({ showSettings: true }))} />
                </div>
                <div className={styles.noteContents}>
                    <div className={styles.noteTitle}>
                        <p>{notes.title}</p>
                    </div>
                    <div className={styles.noteCategory}>
                        <span className={styles.noteCategoryLogo} style={{ backgroundColor: `${color}` }}>{category.substring(0, 2)}</span>
                        <p>{category.substring(2)}</p>

                    </div>
                    <div className={styles.noteDate}>
                        <TimeAgo date={notes.createdAt} />
                    </div>
                    <div className={styles.noteViewContent}>

                        <p> {notes.content}</p>

                    </div>
                </div>
            </>

        }

        else if (mode === NoteMode.Edit) {


            const selectedCategroy = ddlData.find(function (cat, index) {

                let returnValue;

                if (cat.label === notes.category?.name) {
                    returnValue = category;
                    return true;
                }
                return returnValue;
            }
            );

            returnValue = <>
                <div className={styles.headerIcons}>

                    {/* this div with style styles.mobileIcons is only visible in mobile phones */}
                    <div className={styles.mobileIcons}>
                        <Link to="/notes" className="link">
                            <div className={styles.sidebarItems} onClick={() => dispatch(noteMode({ noteMode: NoteMode.View }))}>
                                {/* Reason of calling dispatch here is so that 'new' for creating note will be visible on the sidebar.  */}
                                <img src={notesWhiteIcon} alt="notesWhiteIcon" style={{ width: "18px" }} />

                            </div>
                        </Link>
                        {newNoteDiplay()}

                    </div>

                    <img src={saveNoteIcon} alt="updateNote" onClick={handleUpdate} />
                    <img src={settingsIcon} alt="settings" onClick={() => dispatch(showSettings({ showSettings: true }))} />
                </div>
                <div className={styles.noteContents}>
                    <div className={styles.noteTitle}>
                        <div>
                            <div className={styles.noteHeader}>Title</div>
                            <input type="text" className={styles.noteTitleText} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                    </div>
                    <div className={styles.noteCategory}>

                        <div>
                            <div className={styles.noteHeader}>Category</div>
                            <div style={{ width: "200px" }}>
                                <div style={{ width: "100%" }}>
                                    <Select
                                        placeholder="Select category"
                                        defaultValue={selectedCategroy}
                                        onChange={setSelectedOption}
                                        options={ddlData}

                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                    <div>
                        <div className={styles.noteContent}>
                            <div className={styles.noteHeader}>Content</div>


                            <textarea className={styles.writeText} placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />

                        </div>
                    </div>
                </div>
            </>
        }

        else if (mode === NoteMode.New) {


            returnValue = <>
                <div className={styles.headerIcons}>

                    {/* this div with style styles.mobileIcons is only visible in mobile phones */}
                    <div className={styles.mobileIcons}>
                        <Link to="/notes" className="link">
                            <div className={styles.sidebarItems} onClick={() => dispatch(noteMode({ noteMode: NoteMode.View }))}>
                                {/* Reason of calling dispatch here is so that 'new' for creating note will be visible on the sidebar.  */}
                                <img src={notesWhiteIcon} alt="notesWhiteIcon" style={{ width: "18px" }} />

                            </div>
                        </Link>
                        {newNoteDiplay()}

                    </div>

                    <img src={saveNoteIcon} alt="saveNote" onClick={handleSave} />
                    <img src={deleteEnabled} alt="deleteEnabled" onClick={handleDelete} style={{ width: "18px", display: "none" }} />
                    <img src={settingsIcon} alt="settings" onClick={() => dispatch(showSettings({ showSettings: true }))} />
                </div>

                <div className={styles.noteContents}>
                    <form >
                        <div className={styles.noteTitle}>

                            <div>
                                <div className={styles.noteHeader}>Title</div>
                                <input type="text" className={styles.noteTitleText} placeholder="Title" onChange={(e) => setTitle(e.target.value)} value={title} />
                            </div>
                        </div>
                        <div className={styles.noteCategory}>

                            <div>
                                <div className={styles.noteHeader}>Category</div>
                                <div style={{ width: "200px" }}>
                                    <div style={{ width: "100%" }}>
                                        <Select
                                            placeholder="Select category"
                                            defaultValue={selectedOption}
                                            onChange={setSelectedOption}
                                            options={ddlData}

                                        />
                                    </div>
                                </div>

                            </div>

                        </div>

                        <div className={styles.noteContent}>
                            <div className={styles.noteHeader}>Content</div>
                            <textarea className={styles.writeText} placeholder="Enter your note here" value={content} onChange={(e) => setContent(e.target.value)} />

                        </div>
                    </form>
                </div>

            </>
        }
        return returnValue;
    }

    return (
        <div className={styles.container}>

            {changeInterface(noteState.value.noteMode)}
        </div>
    )
}

export default NoteView