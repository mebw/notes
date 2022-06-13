import styles from './Header.module.css'
import logo from '../../images/logo.png'
import search from '../../images/search.png'
import avatar from '../../images/avatar.png'
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { containsLoginInfo, loginPopup, closeDialog } from '../../features/header'; //3 states of header: no login info, login info(not logged in), login info(logged in)
import { showSearch } from '../../features/search';
import { showSettings } from '../../features/settings'
import { accountService } from '../../services/account.service'
import { fetchImagePath } from '../../features/imgAsync'
import { noteService } from '../../services/notes.service'
const Header = () => {

    const [showMenu, setShowMenu] = useState(false)
    const [searchPopup, setSearchPopup] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [searchedNotes, setSearchedNotes] = useState([]);
    const [noteSearching, setNoteSearching] = useState(true);

    const headerState = useSelector(state => state.header);
    const userState = useSelector(state => state.user);
    const imagePathState = useSelector(state => state.imagePath);
    const imageUploadState = useSelector(state => state.imageUpload);
    const imgSyncState = useSelector(state => state.imgSync);
    const dispatch = useDispatch();
    const history = useNavigate();
    const ref = useRef();
    const refPopup = useRef();

    useOnClickOutside(refPopup, () => setSearchPopup(false));
    const handleSearchValueChange = (e) => {
        let value = e.target.value;
        setSearchValue(value);
        if (value.length >= 3) {
            setSearchPopup(true)
        } else
            setSearchPopup(false)

    }

    const imageGetter = () => {
        let imagePath = avatar;

        if (imgSyncState.newImageUploaded) {//check if image is uploaded using settingsUser dialog. 
            //therefore image path is taken from the imageUploadState
            if (imageUploadState.loading || imageUploadState.error.length > 0) return;

            if (imageUploadState.uploadedImage) {
                imagePath = imageUploadState.uploadedImage;
            }
        }
        else { // image path is taken from the imagePathState which is modified when user logs in
            if (imagePathState.loading || imagePathState.error.length > 0) return;

            if (imagePathState.profilePic) {
                imagePath = imagePathState.profilePic;
            }
        }
        return <img className={styles.userAvatar} src={imagePath} alt="" />;

    }

    const user = accountService.userValue

    useEffect(() => {
        if (!imagePathState.profilePic) {
            dispatch(fetchImagePath())
        }
        const getSearchedNotes = async () => {
            try {
                const res = await noteService.getUserNotesBySearch({ userId: user.id, searchWord: searchValue });

                setSearchedNotes(res.notes)
                setNoteSearching(false);
            } catch (error) {
                setNoteSearching(true);
            }
        }
        getSearchedNotes()

    }, [searchValue])

    //src: https://www.youtube.com/watch?v=Hl7o4tJQzPs
    useEffect(() => {
        const checkIfClickedOutside = (e) => {
            //ref.current = check if div is available (the div which is assigned ref)
            //!ref.current.contains(e.target) = check if the target of the event is not inside the div
            if (showMenu && ref.current && !ref.current.contains(e.target)) {
                setShowMenu(false);
            }
        };
        //add event listener to the document
        document.addEventListener("click", checkIfClickedOutside);

        //cleaning code: remove listener when component is unmounted
        return () => {
            document.removeEventListener("click", checkIfClickedOutside);
        };
    }, [showMenu]);

    const LoggedInDiv =
        <div className={styles.rightSide}>
            <div className={styles.searchContainer} ref={refPopup}>
                <form>
                    <input type="text" value={searchValue} onChange={handleSearchValueChange} className={styles.searchText} placeholder="search notes..." />
                </form>
                {searchPopup && searchedNotes.length > 0 &&
                    <div className={styles.searchPopup}>

                        {!noteSearching && searchedNotes.map(note => {
                            return <Link key={note._id} to={`/note/${note._id}`} className="link">
                                <div className={styles.searchedValue} onClick={() => { setSearchPopup(false); setSearchValue('') }}>
                                    <div className={styles.searchedCategoryLogo} style={{ backgroundColor: `${note.category.color}` }}>
                                        {note.category.name.charAt(0)}

                                    </div>
                                    <div className={styles.searchedNoteValue}>
                                        <div className={styles.searchedNoteTitle}>
                                            {note.title}
                                        </div>
                                        <div className={styles.searchedNoteContent}>
                                            {/* take first three words */}
                                            {note.content.split(' ').slice(0, 3).join(' ') + ' ...'}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        })}
                    </div>}
            </div>
            <div onClick={() => dispatch(showSearch({ showSearch: true }))}>
                <img src={search} style={{ height: "10px", cursor: "pointer" }} alt="" />
            </div>
            <h3 className={styles.userName}>{user?.email?.substring(0, user?.email?.indexOf('@'))}</h3>
            <div ref={ref}>
                <div className={styles.avatarHolder} onClick={() => setShowMenu(!showMenu)}>
                    {imageGetter()}
                    {showMenu && (
                        <div className={styles.userMenu} >
                            <ul>
                                <li className={styles.userMenuItem} onClick={() => dispatch(showSettings({ showSettings: true }))}>Settings</li>
                                <li onClick={() => { accountService.logout(); history('/') }} className={styles.userMenuItem}>Logout</li>
                            </ul>
                        </div>)
                    }
                </div>
            </div>
        </div>

    const notLoggedInDiv =
        <div className={styles.rightSide}>

            <h3 className={styles.logIn} onClick={() => { dispatch(closeDialog(false)); dispatch(loginPopup(true)) }}>Login</h3>
            <h3 className={styles.signUp} onClick={() => { dispatch(closeDialog(false)); dispatch(loginPopup(false)) }}>Sign Up</h3>

        </div>


    function useOnClickOutside(ref, handler) { //src: https://usehooks.com/useOnClickOutside/
        //other version implemented as a library(short and quick): https://github.com/Andarist/use-onclickoutside
        useEffect(
            () => {
                const listener = (event) => {
                    // Do nothing if clicking ref's element or descendent elements
                    if (!ref.current || ref.current.contains(event.target)) {
                        return;
                    }
                    handler(event);
                };
                document.addEventListener("mousedown", listener);
                document.addEventListener("touchstart", listener);
                return () => {
                    document.removeEventListener("mousedown", listener);
                    document.removeEventListener("touchstart", listener);
                };
            },
            // Add ref and handler to effect dependencies
            // It's worth noting that because passed in handler is a new ...
            // ... function on every render that will cause this effect ...
            // ... callback/cleanup to run every render. It's not a big deal ...
            // ... but to optimize you can wrap handler in useCallback before ...
            // ... passing it into this hook.
            [ref, handler]
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.logo} onClick={() => { history('/'); dispatch(containsLoginInfo(true)) }}>
                <img src={logo} alt="" />
            </div>
            {
                headerState.value.hasLoginInfo ? (userState.value.user?.jwtToken ? LoggedInDiv : notLoggedInDiv) : null
            }

        </div>
    )
}

export default Header;