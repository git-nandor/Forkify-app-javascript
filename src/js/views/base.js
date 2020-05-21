export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchRes: document.querySelector('.results'),
    searchResultList: document.querySelector('.results__list'),
    searchResultPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
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