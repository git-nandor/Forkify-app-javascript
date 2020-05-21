import { elements } from './base';

// Info: function 1 line without {} auto return the value
export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
}
export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResultPages.innerHTML = '';
}
export const clearPageBtns = () => {
    elements.searchResultPages.innerHTML = '';
} 

export const highlightSelected = id => {
    document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
}
export const clearHighlight = () => {
    if (document.querySelector('.results__link--active')){
        document.querySelector('.results__link--active').classList.remove('results__link--active');
    }
}
const limitRecipeTitle = (title, limit = 17) => {
    if (title.length > limit) {
        const limitedTitle = [];

        title.split(' ').reduce((accumulator, current, index) => {
            if (accumulator + current.length > limit && index === 0) {
                limitedTitle.push(current.slice(0, limit));
            } else if (accumulator + current.length <= limit) {
                limitedTitle.push(current);
            } 
            return accumulator + current.length;
        }, 0);
        return `${limitedTitle.join(' ')} ...`;
    }
    return title; 
}

const renderRecipe = recipe => {

    // Clicked link class: results__link--active TODO 
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
}

// type: 'next' or 'prev'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'next' ? page + 1 : page - 1}>
        <span>Page ${type === 'next' ? page + 1 : page - 1}</span>    
        <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${type === 'next' ? 'right' : 'left' }"></use>
        </svg>
    </button>
`;

const renderPaginationButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);

    let button;
    if (page === 1 && pages > 1) {
        // Just one button for next page
        button = createButton(page, 'next');
    } else if (page < pages) {
        // One button for next and one for Previous page
        button = `
        ${createButton(page, 'prev')}
        ${createButton(page, 'next')}
        `;
    } else if (page === pages && page > 1) {
        // Just one button for previous page
        button = createButton(page, 'prev');
    }

    elements.searchResultPages.insertAdjacentHTML('afterbegin', button);
}

export const renderPaginatedResults = (results, page = 1, resPerPage = 10) => {
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
  
    let onePageResults = results.slice(start, end);
    
    // Info: give one callback to forEach will call it with current as param
    onePageResults.forEach(renderRecipe);

    renderPaginationButtons(page, results.length, resPerPage);

}