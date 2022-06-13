import React, { useEffect, useState } from 'react';
import DatePicker from 'react-date-picker';//https://github.com/wojtekmaj/react-date-picker
import Select from 'react-select';
import styles from './Search.module.css'
import { useDispatch } from 'react-redux';
import { showSearch } from '../../features/search';
import { accountService } from '../../services/account.service';
import { categoryService } from '../../services/categories.service';
import { getNotesManyCriteria } from '../../features/notesApi'
import { setUpdated } from '../../features/notesData'
import { useNavigate } from 'react-router-dom';
const Search = ({ setShowSearch }) => {
    const [dateFrom, setDateFrom] = useState(new Date());
    const [dateTo, setDateTo] = useState(new Date());
    const [selectedNoteCat, setSelectedNoteCat] = useState(null); //this is for the 3rd party, react-select, dropdown menu component.
    const [ddlData, setDdlData] = useState([]);
    const [title, setTitle] = useState('');
    const history = useNavigate();
    const dispatch = useDispatch();


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
        getCategories();
    }, []);

    const searchNotes = (e) => {
        e.preventDefault();
        const userId = accountService.userValue.id;
        dispatch(setUpdated({ updated: true }));

        getNotesManyCriteria(userId, dispatch, true, title, selectedNoteCat?.value, dateFrom, dateTo);
        history('/notes');
        dispatch(showSearch({ showSearch: false }))
    }
    return (
        <div className={styles.container}>
            <div className={styles.contentWrapper}>
                <div className={styles.close} onClick={() => dispatch(showSearch({ showSearch: false }))}>X</div>
                <form className={styles.formContainer}>
                    <div className={styles.title}>
                        <input className={styles.titleText} value={title} onChange={(e) => setTitle(e.target.value)} type="text" name="" id="" placeholder="Title" />
                    </div>
                    <div className={styles.category}>

                        <Select
                            placeholder="Select category"
                            onChange={setSelectedNoteCat}
                            options={ddlData}

                        />
                    </div>
                    <div className={styles.dateRange}>
                        <label>Date From</label>
                        <div>
                            <DatePicker onChange={setDateFrom} value={dateFrom} style={{ width: '300px' }} />
                        </div>
                        <label>Date To</label>
                        <div>
                            <DatePicker onChange={setDateTo} value={dateTo} />
                        </div>
                    </div>
                    <div className={styles.searchButtonDiv}>
                        <button className={styles.searchButton} type="submit" onClick={searchNotes}>Search</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Search