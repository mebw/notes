
import { fetchWrapper } from '../helper/fetchWrapper';

const baseImagesUrl = `${process.env.REACT_APP_apiUrl}/images`;
//read proccess.env.baseUrl


export const imageService = {
    uploadImage,
    getImage
}


function uploadImage({ imageData, userId }) {

    const params = { imageData, userId };
    return fetchWrapper.post(`${baseImagesUrl}/upload`, params);
}



function getImage({ userId }) {

    const params = { userId };
    return fetchWrapper.get(`${baseImagesUrl}/`, params);
}



