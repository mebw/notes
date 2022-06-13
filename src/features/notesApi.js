
import { noteService } from "../services/notes.service";
import { getStart, getSuccess, getFailure, setUpdated } from "./notesData";
export const getNote = async ({ userId }, dispatch, updated) => {
    if (updated) {
        dispatch(getStart());
        try {
            const res = await noteService.getUserNotes({ userId })
            dispatch(getSuccess(res.notes));
        } catch (err) {
            dispatch(getFailure());
        }
        dispatch(setUpdated(false));//we are setting 'updated' to false, because we have finised fetching data and notes in the data store are up to date.
    }

};


export const getNotesManyCriteria = async (userId, dispatch, updated, title, category, dateFrom, dateTo) => {
    if (updated) {
        dispatch(getStart());
        try {
            const res = await noteService.getNotesManyCriteria(userId, title, category, dateFrom, dateTo)
            dispatch(getSuccess(res.notes));
        } catch (err) {
            dispatch(getFailure());
        }
        dispatch(setUpdated(false));//we are setting 'updated' to false, because we have finised fetching data and notes in the data store are up to date.
    }

};