import { BehaviorSubject } from 'rxjs';
import { fetchWrapper } from '../helper/fetchWrapper';
const baseAccountUrl = `${process.env.REACT_APP_apiUrl}/accounts`;

const userSubject = new BehaviorSubject(null);//good example of BehaviourSubject:https://www.youtube.com/watch?v=rdK92pf3abs. Look first of 'Subject': https://www.youtube.com/watch?v=-mwNLRbfKmU

export const accountService = {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    refreshToken,
    verifyEmail,
    user: userSubject.asObservable(),
    get userValue() {
        return userSubject.value;
    }

}



function register({ email, password }) {
    const params = { email: email.toLowerCase(), password };
    return fetchWrapper.post(`${baseAccountUrl}/register`, params);
}

function changePassword({ userId, currentPassword, newPassword }) {
    const params = { userId, currentPassword, newPassword };
    return fetchWrapper.post(`${baseAccountUrl}/change-password`, params);
}


function verifyEmail(token) {
    return fetchWrapper.post(`${baseAccountUrl}/verify-email`, { token });
}

function forgotPassword({ email }) {
    return fetchWrapper.post(`${baseAccountUrl}/forgot-password`, { email });
}

function resetPassword({ token, newPassword }) {
    return fetchWrapper.post(`${baseAccountUrl}/reset-password`, { token, newPassword });
}


//async await syntax of login function

async function login(email, password) {
    const user = await fetchWrapper.post(`${baseAccountUrl}/authenticate`, { email: email.toLowerCase(), password });

    if (user?.id) { //if we get a user successfully(if we don't get user from db, there is no id propery), publish user to subscribers and start timer to refresh token
        userSubject.next(user);
        //todo: add user to redux store. it seems not possible to do this in this way. there is a solution, in the following link.
        // https://stackoverflow.com/questions/64883984/how-to-access-the-redux-store-outside-of-a-component-in-react
        //but a user is commenting that there is a 'circular dependency' problem. He says 'But if you use store as context in your app via redux provider, it brings you to circular dependency. How deal with it?'
        startRefreshTokenTimer();
    }
    return user;
}

function logout() {

    // revoke token, stop refresh timer, publish null to user subscribers and redirect to login page
    fetchWrapper.post(`${baseAccountUrl}/revoke-token`, {});
    stopRefreshTokenTimer();
    userSubject.next(null);
    // history.push('/account/login');
}

let refreshTokenTimeout;

function startRefreshTokenTimer() {
    // parse json object from base64 encoded jwt token
    const jwtToken = JSON.parse(atob(userSubject?.value?.jwtToken?.split('.')[1]));

    // set a timeout to refresh the token a minute before it expires. it expires in 15 minutes
    const expires = new Date(jwtToken.exp * 1000); //https://stackoverflow.com/questions/39926104/what-format-is-the-exp-expiration-time-claim-in-a-jwt

    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    refreshTokenTimeout = setTimeout(refreshToken, timeout);
}

function stopRefreshTokenTimer() {
    clearTimeout(refreshTokenTimeout);
}

// async function refreshToken() {

//         const user = await fetchWrapper.post(`${baseAccountUrl}/refresh-token`, {});
//         // publish user to subscribers and start timer to refresh token
//         userSubject.next(user); //good example of BehaviourSubject:https://www.youtube.com/watch?v=rdK92pf3abs. Look first of 'Subject': https://www.youtube.com/watch?v=-mwNLRbfKmU
//         startRefreshTokenTimer();
//         return user;


// }

function refreshToken() {
    return fetchWrapper.post(`${baseAccountUrl}/refresh-token`, {})
        .then(user => {
            // publish user to subscribers and start timer to refresh token
            userSubject.next(user); //good example of BehaviourSubject:https://www.youtube.com/watch?v=rdK92pf3abs. Look first of 'Subject': https://www.youtube.com/watch?v=-mwNLRbfKmU
            startRefreshTokenTimer();
            return user;
        })
        .catch(err => {
            console.log("err: ", err);
        });
}