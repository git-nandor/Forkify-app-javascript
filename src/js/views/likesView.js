import { elements } from './base'; 
import { limitRecipeTitle } from './searchView'; 

export const renderLike = likedRecipe => {
    const sectionMarkup = `
    <li data-likedRecipeid="${likedRecipe.id}">
        <a class="likes__link" href="#${likedRecipe.id}">
            <figure class="likes__fig">
                <img src="${likedRecipe.img}" alt="${likedRecipe.title}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${limitRecipeTitle(likedRecipe.title)}</h4>
                <p class="likes__author">${likedRecipe.author}</p>
            </div>
        </a>
    </li>
    `;

    elements.likeList.insertAdjacentHTML('beforeend', sectionMarkup);
}

export const deleteLike = id => {
    const likeListItem = document.querySelector(`[data-likedRecipeid="${id}"]`);
    
    if (likeListItem) likeListItem.parentElement.removeChild(likeListItem);
}

export const toggleLikeButton = like => {
    const iconString = like ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
}

export const toggleLikeMenu = numLikes => {
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
}
