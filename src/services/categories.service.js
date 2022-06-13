
import { fetchWrapper } from '../helper/fetchWrapper';

const baseCategoriesUrl = `${process.env.REACT_APP_apiUrl}/categories`;
//read proccess.env.baseUrl


export const categoryService = {
    getUserNoteCategories,
    getPersonalUserCategories,
    getCategoryNames,
    addCategory,
    deleteCategory
}


function getUserNoteCategories({ userId }) {
    const params = { userId };
    return fetchWrapper.get(`${baseCategoriesUrl}/`, params);
}

function getPersonalUserCategories({ userId }) {

    const params = { userId };
    return fetchWrapper.post(`${baseCategoriesUrl}/getPersonalUserCategories`, params);
}

function addCategory({ belongsTo, name, color }) {

    const params = { belongsTo, name, color };
    return fetchWrapper.post(`${baseCategoriesUrl}/`, params);
}

function deleteCategory({ categoryId }) {


    return fetchWrapper.delete(`${baseCategoriesUrl}/${categoryId}`);
}

function getCategoryNames({ userId }) {

    const params = { userId };
    return fetchWrapper.post(`${baseCategoriesUrl}/getCategoryNames`, params);
}






