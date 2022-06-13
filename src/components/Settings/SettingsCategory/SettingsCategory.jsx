import React, { useState, useEffect } from 'react'
import Category from './Category/Category'
import styles from './SettingsCategory.module.css'
import { PopoverPicker } from '../../../components/PopoverPicker/PopoverPicker';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSystemCategory } from '../../../features/settings/categories/fetchSystemCategory';
import { fetchPersonalCategory } from '../../../features/settings/categories/fetchPersonalCategory';
import { fetchUserCategoryNames } from '../../../features/settings/categories/fetchUserCategoryNames';
import { categoryService } from '../../../services/categories.service';
import { accountService } from '../../../services/account.service';
import { noteService } from '../../../services/notes.service';
import { useAlert } from "react-alert";


const SettingsCategory = () => {
    const alert = useAlert();
    const [color, setColor] = useState("#808080");
    const [colorList, setColorList] = useState([]);
    const [personalCategories, setPersonalCategories] = useState([]);
    const [personalCategory, setPersonalCategory] = useState('')
    const systemCategoryState = useSelector(state => state.systemCategory);
    const personalCategoryState = useSelector(state => state.personalCategory);
    const userCategoryNamesState = useSelector(state => state.userCategoryNames);

    const dispatch = useDispatch();
    useEffect(() => {

        dispatch(fetchSystemCategory());
        dispatch(fetchPersonalCategory());

    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchUserCategoryNames());
    }, [dispatch])



    const addPersonalCategory = (e) => {


        e.preventDefault();

        //whatever I do, setCategoryNames is not working. even if I give it hard coded values. I need to figure out why.
        if (personalCategory === '') return;
        setColorList([...colorList, color]);
        //if the same category name is already in the database, don't add it.
        if (userCategoryNamesState.categoryNames.find(item => item.name.toLowerCase() === personalCategory.toLowerCase())) return;
        //if the same color is sleceted in the current color list, don't add it.
        if (colorList.find(item => item === color)) return;
        //if the same color name  of a category is already in the database, don't add it.
        if (userCategoryNamesState.categoryNames.find(item => item.color === color)) return;

        console.log(color)

        const newPersonalCategory = {
            id: personalCategories.length + 1,
            name: personalCategory,
            color: color
        }

        setPersonalCategories([...personalCategories, newPersonalCategory]);
        console.log(personalCategories); //it is not immediately updated.
        //explanation: https://stackoverflow.com/questions/54069253/the-usestate-set-method-is-not-reflecting-a-change-immediately
        setPersonalCategory('');
    }

    const removeColor = (color) => {
        setColorList(colorList.filter(item => item !== color));
    }

    //removes personal category from local state
    const removePersonalCategory = (categoryName) => {
        setPersonalCategories(personalCategories.filter(item => item.name !== categoryName));
    }

    //removes personal category from database
    const removePersonalCategoryFromDb = async (categoryId, categoryName) => {
        //todo: ask user if he wants to delete the category. :done
        //todo: if yes
        //todo: check if category exists in the notes table.
        //todo: if it does, don't remove it. Tell user to delete the notes first.
        //todo: if there are no notes with this category, remove it.

        const userId = accountService.userValue.id;
        const result = await noteService.getUserNotes({ userId });
        const notes = result.notes;
        const notesWithCategory = notes.filter(item => item.category._id === categoryId);
        if (notesWithCategory.length > 0) {
            // alert('you have notes with this category. Change their category or delete the notes first.');

            //I am using Div, because alert transforms letters to uppercase by default.
            //found this link to solve it. https://stackoverflow.com/questions/43383930/react-alert-showing-uppercase
            alert.error(<div style={{ textTransform: 'initial', fontSize: "12px" }}>You have notes with this category. Change their category or delete the notes first!</div>);
            return notesWithCategory.length;
        }
        else {
            let confirm = window.confirm(`Are you sure you want to remove '${categoryName}' category?`);
            if (confirm) {
                try {
                    await categoryService.deleteCategory({ categoryId });
                } catch (error) {
                    console.log(error.message)
                }
                return 0;
            };
        }
    }

    const savePersonalCategory = (e) => {
        e.preventDefault();
        let errorVal = '';
        const userId = accountService.userValue.id;
        console.log(personalCategories);
        personalCategories.forEach(async (item) => {
            try {
                await categoryService.addCategory({ belongsTo: userId, name: item.name, color: item.color });
            } catch (error) {
                errorVal = error.message;
                console.log(error.message)
            }

        })
        if (errorVal === '') {
            alert.success(<div style={{ textTransform: 'initial', fontSize: "12px" }}>Categories successfully saved!</div>);
        }
    }
    return (


        <div className={styles.container}>
            {systemCategoryState.loading && <span>Loading...</span>}
            {!systemCategoryState.loading && systemCategoryState.error ? <div>Error: {systemCategoryState.error}</div> : null}
            {!systemCategoryState.loading && systemCategoryState.systemCategories?.length ? (
                <div>
                    <h2 className={styles.title}>Default Categories</h2>
                    <div className={styles.categoryContainer}>
                        {
                            systemCategoryState.systemCategories.map(category => {
                                return <Category key={category._id} textValue={category.name} containerColor={category.color} categoryId={category._id} />

                            })
                        }
                    </div>
                </div>
            ) : null}

            <hr />
            <div className={styles.customCategoryContainer}>
                {personalCategoryState.loading && <span>Loading...</span>}
                {!personalCategoryState.loading && personalCategoryState.error ? <div>Error: {systemCategoryState.error}</div> : null}

                {!personalCategoryState.loading && personalCategoryState.personalCategories?.length ? (


                    <div className={styles.addingCategory}>
                        <div className={styles.customCategories}>
                            <h2 className={styles.title}>personal Categories</h2>
                            <div className={styles.categoryList}>
                                {
                                    personalCategoryState.personalCategories.map(category => {
                                        return <Category key={category._id} notDefault={true} textValue={category.name} containerColor={category.color} categoryId={category._id} removePersonalCategoryFromDb={removePersonalCategoryFromDb} />
                                    })
                                }
                            </div>
                        </div>

                    </div>

                ) : <span style={{ textAlign: "center" }}>No personal categories yet.</span>}
                <hr />
                <div className={styles.categoryList}>

                    {
                        personalCategories && personalCategories.map(category => {
                            return <Category key={category.id} notDefault={true} textValue={category.name} containerColor={category.color} rmColor={removeColor} removePersonalCategory={removePersonalCategory} />
                        })
                    }
                </div>
                <div className={styles.insertCategory}>
                    <input type="text" style={{ width: "50%" }} placeholder="name of Category" value={personalCategory} onChange={(e) => setPersonalCategory(e.target.value)} />

                    <div style={{ display: 'flex', justifyContent: "space-between" }}>
                        <h2 className={styles.title}>Select color of new category:</h2>

                        <div>
                            <PopoverPicker color={color} onChange={setColor} />
                        </div>
                    </div>


                    <button onClick={addPersonalCategory} style={{ width: "50%" }} >Add New</button>
                </div>
                <hr />
                <div>
                    <button onClick={savePersonalCategory}>Save Changes</button>
                </div>
            </div>




        </div>

    )
}

export default SettingsCategory