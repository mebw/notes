
import { fetchWrapper } from '../helper/fetchWrapper';

const baseNotesUrl = `${process.env.REACT_APP_apiUrl}/notes`;
//read proccess.env.baseUrl


export const noteService = {

    addNote,
    getUserNotes,
    getNote,
    getUserNotesBySearch,
    getNotesManyCriteria,
    updateNote,
    deleteNote

}



function addNote({ title, category, content, belongsTo }) {

    const params = { title, category, content, belongsTo };
    return fetchWrapper.post(`${baseNotesUrl}/`, params);
}

function getUserNotes({ userId }) {


    const params = { userId };
    return fetchWrapper.get(`${baseNotesUrl}/`, params);
}

function getNotesManyCriteria(userId, title, category, dateFrom, dateTo) {
    const params = { userId, title, category, dateFrom, dateTo };
    return fetchWrapper.get(`${baseNotesUrl}/`, params);
}
function getUserNotesBySearch({ userId, searchWord }) {


    const params = { userId, searchWord };
    return fetchWrapper.get(`${baseNotesUrl}/`, params);
}
function getNote({ noteId }) {
    return fetchWrapper.get(`${baseNotesUrl}/${noteId}`);
}
function deleteNote({ noteId }) {
    return fetchWrapper.delete(`${baseNotesUrl}/${noteId}`);
}

function updateNote({ noteId, title, category, content, userId }) {

    const params = { noteId, title, category, content, userId };
    return fetchWrapper.put(`${baseNotesUrl}/`, params);
}






