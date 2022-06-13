import React, { useState } from 'react'
import styles from './Category.module.css'
const Category = ({ textValue, containerColor, categoryId, notDefault, rmColor, removePersonalCategory, removePersonalCategoryFromDb }) => {
    const [removeCat, setRemoveCat] = useState(false);

    const removeCategory = async () => {

        // remove color value from local array state storage
        if (rmColor) rmColor(containerColor);
        //remove personal category that is in local array state storage
        if (removePersonalCategory) removePersonalCategory(textValue);
        //check if there are records in the database with this category,if there are records, don't remove the category, instead tell user to change the category of the records(or delete the records) and come back to remove the category. 
        if (removePersonalCategoryFromDb) {
            let res = await removePersonalCategoryFromDb(categoryId, textValue);
            if (res === 0) //if res is 0, it means there are no records with this category(in notes), so remove the category
                setRemoveCat(true)
            else //if res is not 0, it means there are records with this category(in notes), so don't remove the category, instead tell user to change the category of the records(or delete the records) and come back to remove the category.
                setRemoveCat(false);
        }
    }

    return (

        removeCat ? null :
            <div className={styles.container} style={{ backgroundColor: `${containerColor}`, color: 'white' }}>
                {textValue}
                {notDefault && <div className={styles.remove} onClick={removeCategory}>X</div>}
            </div>

    )
}

export default Category