import axios from 'axios';
import { accountService } from '../services/account.service';

const apiUrl = process.env.REACT_APP_apiUrl;
export const fetchWrapper = {
    get,
    post,
    put,
    delete: _delete
}

//src: https://flaviocopes.com/axios-credentials/
//answers why we use credentials

const axiosInstance = axios.create({
    withCredentials: true,
})

async function get(url, data) {
    try {

        let config = {
            headers: { ...authHeader(url) },
            params: data,
        }
        // const response = await axiosInstance.get(url, { params: data }, { headers: { 'Content-Type': 'application/json', ...authHeader(url) } });
        const response = await axiosInstance.get(url, config);
        return handleResponse(response);

    } catch (error) {
        console.log(error);
    }

}

async function _delete(url) {
    try {

        let config = {
            headers: { ...authHeader(url) }
        }
        // const response = await axiosInstance.get(url, { params: data }, { headers: { 'Content-Type': 'application/json', ...authHeader(url) } });
        const response = await axiosInstance.delete(url, config);
        return handleResponse(response);

    } catch (error) {
        console.log(error);
    }

}


//axios post request    
async function post(url, data) {
    const response = await axiosInstance.post(url, data, { headers: { 'Content-Type': 'application/json', ...authHeader(url) } });
    return handleResponse(response);
}

async function put(url, data) {
    const response = await axiosInstance.put(url, data, { headers: { 'Content-Type': 'application/json', ...authHeader(url) } });
    return handleResponse(response);
}
function authHeader(url) {
    // return auth header with jwt if user is logged in and request is to the api url

    //to be done later
    const user = accountService.userValue;
    const isLoggedIn = user && user.jwtToken;
    const isApiUrl = url.startsWith(apiUrl);


    if (isLoggedIn && isApiUrl) {

        return { Authorization: `Bearer ${user.jwtToken}` };
    } else {
        return {};
    }
}



function handleResponse(response) {

    return response.data;
}