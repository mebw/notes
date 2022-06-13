import React, { useEffect, useState } from 'react';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Search from './components/Search/Search';
import Settings from './components/Settings/Settings';
import NotesAndSidebar from './pages/NotesAndSidebar/NotesAndSidebar';
import NoteViewAndSidebar from './pages/NoteViewAndSidebar/NoteViewAndSidebar';

import Home from './pages/Home/Home';
import Header from './components/Header/Header';
import SignUp from './components/SignUp/SignUp';
import EmailSent from './pages/EmailSent/EmailSent';

import ResetPassword from './components/ResePassword/ResetPassword';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail';
import { accountService } from './services/account.service';

import { useSelector, useDispatch } from 'react-redux';
import { loginAction } from './features/user';
import DeleteDialog from './components/deleteDialog/DeleteDialog';
function App() {

    //state to show about login info in the header, whether user is logged in or not, and then
    //change interface based on that
    const [loginInfo, setLoginInfo] = useState(false)

    const headerState = useSelector(state => state.header);
    const userState = useSelector(state => state.user);
    const settingsState = useSelector(state => state.settings);
    const searchState = useSelector(state => state.search);

    const dispatch = useDispatch();


    //state to show if close button for the login, signup, reset password is clicked
    const [close, setClose] = useState(true)

    //state to show if login, signup pop up is shown
    const [showLoginPopUp, setshowLoginPopUp] = useState(false)

    const [showSettings, setShowSettings] = useState(false)
    const [showSearch, setShowSearch] = useState(false)



    useEffect(() => {
        accountService.user.subscribe(user => { dispatch(loginAction({ user })) });
    }, [dispatch]);

    return (
        <Router>
            {settingsState.value.showSettings && <Settings />}
            {searchState.value.showSearch && <Search setShowSearch={setShowSearch} />}

            <Header />
            <DeleteDialog />
            {!headerState.value.closeDialog && <SignUp setClose={setClose} showLoginPopUp={showLoginPopUp} setShowLoginPopUp={setshowLoginPopUp} />}

            <Routes>
                <Route path="/" element={userState.value.user?.id ? <NotesAndSidebar showSettings={showSettings} setShowSettings={setShowSettings} /> : <Home />} />
                <Route path="/account/reset-password" element={<ResetPassword />} />
                <Route path="/emailSent/:userEmail" element={<EmailSent setLoginInfo={setLoginInfo} />} />
                <Route path="/account/verify-email" element={<VerifyEmail />} />
                <Route path="/notes" element={<NotesAndSidebar showSettings={showSettings} setShowSettings={setShowSettings} />} />
                <Route path="/note/:noteId" element={<NoteViewAndSidebar showSettings={showSettings} setShowSettings={setShowSettings} />} />

            </Routes>
        </Router>

    );
}

export default App;
