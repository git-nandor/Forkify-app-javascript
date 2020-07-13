export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchRes: document.querySelector('.results'),
    searchResultList: document.querySelector('.results__list'),
    searchResultPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping'),
    shoppingBtn: document.getElementById('go-to-checklist'),
    shoppingClear: document.getElementById('shopping-list-clear'),
    shoppingList: document.querySelector('.shopping__list'),
    likeList: document.querySelector('.likes__list'), 
    likesMenu: document.querySelector('.likes__field')
}

// Collection of the used elements class names
export const elementStrings = {
    loader: 'loader'
}

export const renderLoader = parent => {
    const elementLoader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', elementLoader);
}

export const clearLoader = () => {
    const loaderElement = document.querySelector(`.${elementStrings.loader}`);
    if (loaderElement) loaderElement.parentElement.removeChild(loaderElement);
}

export const getExtraItem = id => {
    return document.querySelector(`[data-recipeid="${id}"] .extra_item`);
}

export const getBackgroundColor = forElement => {
    const checklistBg = 'ffffff';
    const recipeBg = 'F9F5F3';

    return    forElement === 'checklist' ? `#${checklistBg}` :  `#${recipeBg}`;
}

export const sanitize = inputString => {
    const map = {
        '&': ' ',
        '<': ' ',
        '>': ' ',
        '"': ' ',
        "'": ' ',
        '`': ' ',
        "/": ' ',
        '\\': ' ',
        '(': ' ',
        ')': ' ',
        ']': ' ',
        '[': ' ',
        '}': ' ',
        '{': ' ',
        '=': ' '
    };
    const reg = /[&<>"'`=(){}[\]/\\]/ig;

    //The match() method retrieves the result of matching a string against a regular expression.
    return inputString.replace(reg, (match)=>(map[match])); 
}