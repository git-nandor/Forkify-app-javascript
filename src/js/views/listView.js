import { elements, getExtraItem, getBackgroundColor, sanitize } from './base';


export const clearList = () => {
    hideListBtns();
    elements.shoppingList.innerHTML = '';
};

export const checkList = (stateListIds) => {
    let allInTheList = [];
    let currentListRecipeIds = [];

    // Get all recipe ids from the rendered list
    const currentListTitledElements = document.querySelectorAll(".shopping__titled_section");
    currentListTitledElements.forEach(element => { 
        currentListRecipeIds.push(element.dataset.itemid);
    });

    // If all state list id is in the rendered currentListRecipeIds then return true
    stateListIds.forEach(stateId => {
        currentListRecipeIds.includes(stateId) ? allInTheList.push(true) : allInTheList.push(false);
    });

    // Return true/false based on elements
    return allInTheList.every(Boolean);
};

export const clearInputs = id => {
    const extraItem = getExtraItem(id);
    
    extraItem.querySelector('.extra_count').value = 1;
    extraItem.querySelector('.extra_ingredient').value = "";
};

export const deleteItem = id => {
    const item = document.querySelector(`[data-itemid="${id}"]`);
    if (item) item.parentElement.removeChild(item);
};

export const getExtraItemData = recipeId => {
    const extraItem = getExtraItem(recipeId);
    const extraItemCount = sanitize(extraItem.querySelector('.extra_count').value);
    const extraItemIngredient = sanitize(extraItem.querySelector('.extra_ingredient').value);
    
    const extraItemData = {
        count: parseFloat(extraItemCount), 
        ingredient: extraItemIngredient
    };
    return extraItemData;
};

export const showListBtns = () => {
    elements.shoppingBtn.style.visibility = "visible";
    elements.shoppingClear.style.visibility = "visible";
};

export const hideListBtns = () => {
    elements.shoppingBtn.style.visibility = "hidden";
    elements.shoppingClear.style.visibility = "hidden";
};

export const renderItem = item => {
    const itemMarkup = `
        <li class="shopping__item" data-itemid="${item.id}">
            <div class="shopping__count">
                <input type="number" value="${item.count.toFixed(2)}" min="0" step="${item.count.toFixed(2)}" class="shopping__count-value">
                <p>${item.unit}</p>
            </div>
            <p class="shopping__description">${item.ingredient}</p>
            <button class="shopping__delete btn-tiny">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>
    `;
    document.querySelector(`[data-recipeid="${item.recipeId}"]`).insertAdjacentHTML('beforeend', itemMarkup);
};

export const createTitledSection = recipe => {
    const sectionMarkup = `
        <ul class="shopping__titled_section" data-recipeid="${recipe.id}" data-itemid="${recipe.id}">
            <li class="shopping__item shopping-list-title-container" data-itemid="${recipe.id}" >
                <a class="shopping-list-title-link" href="#${recipe.id}">    
                    <p class="shopping__description shopping-list-title">${recipe.title}</p>
                </a>
                <svg class="recipe__info-icon list-title-icon">
                    <use href="img/icons.svg#icon-man"></use>
                </svg>
                <p class="shopping-list-title-servings">${recipe.servings ? recipe.servings : '*'}</p>
                <button class="shopping__delete btn-tiny">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-cross"></use>
                    </svg>
                </button>
            </li>
            <li class="shopping__item extra_item">
                
                <p class="shopping__description extra_title">Add extra ingredient:</p>
                <div class="shopping__extra_count">
                    <input type="number" value="1" min="0" step="1" class="extra_count">
                </div>
                <div class="shopping__extra_ingredient">
                    <input type="text" value="" placeholder="ingredient" class="extra_ingredient">
                </div>
                
                <button class="shopping__add_extra_btn btn-tiny">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-plus"></use>
                    </svg>
                </button>
            </li>
        </ul>
    `;
    //elements.shoppingList.insertAdjacentHTML('beforeend', sectionMarkup);
    elements.shoppingList.insertAdjacentHTML('afterbegin', sectionMarkup);
};

export const renderShoppingChecklistSection = (recipeId, recipeTitle) => {
    const checklistMarkup = `
        <figure class="recipe__fig">
        <img src="img/checklist01.jpg" alt="shopping checklist" class="recipe__img">
            <h1 class="recipe__title">
                <span>Lets shopping!</span>
            </h1>
        </figure>
    `;
    elements.recipe.insertAdjacentHTML('afterbegin', checklistMarkup);
    elements.recipe.style.backgroundColor = getBackgroundColor('checklist');
};

export const renderShoppingTitledChecklist = (recipeId, recipeTitle) => {
    const checklistMarkup = `
        <ul class="checklist_titled_section" data-recipeid="${recipeId}">
            <li class="shopping__item shopping-list-title-container">    
                <p class="shopping__description shopping-list-title">${recipeTitle}</p>
            </li>
        </ul>
    `;
    elements.recipe.insertAdjacentHTML('beforeend', checklistMarkup);
}

export const renderChecklistItem = item => {
    const checklistItemMarkup = `
        <li class="shopping__item" data-itemid="${item.id}">
            <div class="shopping__checklist">
                <input type="checkbox" name="${item.id}" class="shopping__count-value">
                <p>${item.count.toFixed(2)}</p>
                <p>${item.unit}</p>
            </div>
            <p class="shopping__description">${item.ingredient}</p>
        </li>
    `;
    document.querySelector(`[data-recipeid="${item.recipeId}"]`).insertAdjacentHTML('beforeend', checklistItemMarkup);
};

export const renderBackToRecipesBtn = recipeId => {
    const btnMarkup = `
        <div class="checklist-end">
            <button class="btn-small recipe__btn checklist-btn-back" data-recipeId="${recipeId}">
                <span>Back to recipes</span>
            </button>
        </div>
    `;
    elements.recipe.insertAdjacentHTML('beforeend', btnMarkup);
};