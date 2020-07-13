// Global 01 plan and build states structure
// Global 02 create search module  and setup API connection
// Global 03 create view/base for collecting html elements
// Global 04 create models/Search and controlSearch to get data
// Global 05 create views/searchView to collect search term and render new data
// Global 06 render results and create pagination
// Global 07 create models/Recipe and parse, unify recipe data
// Global 08 create views/recipeViews set event listeners to render recipe data
// Global 09 create serving calculation and shopping list in models/Recipe
// Global 10 create models/List for add update and delete list items in shopping list
// Global 11 create views/listView for markups and handle UI
// Global 12 create models/Like for add update and delete likes
// Global 13 create views/likeView for markups and handle UI 
// Global 14 create local storage for likes to persist data

import { elements, renderLoader, clearLoader } from './views/base';
import Recipe from './models/Recipe';
import Search from './models/Search';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';



/** Global state of the app
 * - Search object state.search (query, result)
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

/** 
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    // 1. Get query from view
    const query = searchView.getInput();

    if (query) {
        // 2. New search object and add to state
        state.search = new Search(query);

        // 3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        searchView.clearPageBtns();
        renderLoader(elements.searchRes);

        try {
            // 4. Search for recipes
            await state.search.getResults();

            // 5. Render results on UI
            clearLoader();
            searchView.renderPaginatedResults(state.search.result, 1);
        } catch (error) {
            const errorMessage = `Sorry, unable to search recipe.`;
            
            clearLoader();
            recipeView.clearRecipe();
            recipeView.renderRecipeError(errorMessage);
    
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault(); // ! Do not reload page after click
    controlSearch();
})

elements.searchResultPages.addEventListener('click', e => {
    const button = e.target.closest('.btn-inline');
    if (button) {
        const goToPage = parseInt(button.dataset.goto, 10);
        
        searchView.clearResults();
        searchView.clearPageBtns();   
        searchView.renderPaginatedResults(state.search.result, goToPage);
    }
   
})

/** 
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
    
    // Get ID from window url
    const id = window.location.hash.replace('#', '');
    
    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search item if search exist
        if (state.search) {
            searchView.clearHighlight();
            searchView.highlightSelected(id);
        };

        // Create new Recipe object
        state.recipe = new Recipe(id);
        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.unifyIngredients();

            // Calculate servings and time
            state.recipe.calcCookingTyme();
            state.recipe.calcServings();

            // Render recipe
            clearLoader();
            const like = state.likes ? state.likes.isLiked(id) : false;
            recipeView.renderRecipe(state.recipe, like);

        } catch (error) {
            const errorMessage = `Sorry, unable to render recipe.`;

            recipeView.clearRecipe();
            recipeView.renderRecipeError(errorMessage);
        }
    }
    
    // Start List controll at hash change and onload for restoring the list
    controlList();
}

// Control Recipe Event handler
// ! Different events triggering same callback with loop -> window.addEventListener('load', controlRecipe); & window.addEventListener('hashchange', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));



/** 
 * LIST CONTROLLER
 */

const controlList = (RecipeBtnOrder) => {
   
    // Create new list if there is none yet
    if (!state.list && !localStorage.recipeList && state.recipe && RecipeBtnOrder) {

        state.list = new List(state.recipe.id);
        
        // Create UI Titled section for the list
        listView.createTitledSection(state.recipe);

        // Add each ingredient to the list and to the UI
        state.recipe.ingredients.forEach(element => {

            // Save and return the list item
            const listItem = state.list.addItem(
                state.recipe.title,
                state.recipe.id, 
                element.count, 
                element.unit, 
                element.unifiedIngredient
            );
            // Persist list data    
            state.list.persistListData();

            // Add list item to the UI
            listView.renderItem(listItem);
        });

        // Show the buttons for the shopping checklist
        listView.showListBtns();
    
    // If not button order then restore the list data
    } else if (!RecipeBtnOrder) {
        let isRendered = false;

        // Check the list and check if it's already rendered
        if (state.list && listView.checkList(state.list.recipeIds)) {
            isRendered = listView.checkList(state.list.recipeIds);
        };
        
        // New empty list and restoration from storage
        state.list = new List();

        // Restore local storage if it healthy and if there is not rendered yet
        if (state.list.checkStorageHealthy()) {
            
            state.list.readListStorage();
            
            // Recreate recipes based on the list items
            if(!isRendered) {
                
                let recreatedRecipe;
                let recreateRecipeHelper = [];

                state.list.items.forEach(item => {
                    // Create titled sections for each recipe and render list itmes
                    if (!recreateRecipeHelper.includes(item.recipeId)) {
                        recreateRecipeHelper.push(item.recipeId);
                        
                        recreatedRecipe = {
                            id: item.recipeId,
                            title: item.title
                        };

                        // Render titled section for recipe
                        listView.createTitledSection(recreatedRecipe);

                        // Render list item
                        listView.renderItem(item);

                        // Show the buttons for the shopping checklist
                        listView.showListBtns();

                    // There is titled section already so just render item   
                    } else {
                        // Render list item
                        listView.renderItem(item);
                    };
                });
            }
            
        
        // If local storage is not healthy delete and delete from state also
        } else {
            state.list.clearList();
            delete state.list;
        };
        

    // If actual recipe is in the list and there is no saved list then update
    } else if (RecipeBtnOrder && state.list && state.list.recipeIds.includes(state.recipe.id)) {
       
        // Delete recipe Titled section list item from UI
        listView.deleteItem(state.recipe.id);
        
        // Update list delete current recipe
        state.list.deleteItem (state.recipe.id);
        
        // Update list add new recipe
        state.list.addRecipeId(state.recipe.id);

        // Create UI Titled section for the list
        listView.createTitledSection(state.recipe);

        // Add each ingredient to the list and to the UI
        state.recipe.ingredients.forEach(element => {
            const listItem = state.list.addItem(
                state.recipe.title,
                state.recipe.id, 
                element.count, 
                element.unit, 
                element.unifiedIngredient
            );
            listView.renderItem(listItem);
        });

        // Persist list data    
        state.list.persistListData();

    // If actual recipe is not in the list then add to it 
    } else if (RecipeBtnOrder && state.list && !state.list.recipeIds.includes(state.recipe.id)){
        
        // Update list id-s
        state.list.addRecipeId(state.recipe.id);

        // Create UI Titled section for the list
        listView.createTitledSection(state.recipe);

        // Add each ingredients to the list and UI
        state.recipe.ingredients.forEach(element => {
            const listItem = state.list.addItem(
                state.recipe.title,
                state.recipe.id, 
                element.count, 
                element.unit, 
                element.unifiedIngredient
            );
            listView.renderItem(listItem);
        });

        // Persist list data    
        state.list.persistListData();
    }
};

// Handle list events. Add extra, delete and update list item
elements.shopping.addEventListener('click', event  => {
    
    // Handle the delete item
    if (event.target.matches('.shopping__delete, .shopping__delete *')) {
        let itemId = event.target.closest('.shopping__item').dataset.itemid;
        
        // Delete from state
        state.list.deleteItem(itemId);

        // Persist list data    
        state.list.persistListData();

        // Hide the buttons for the shopping checklist if there is no more item in the list
        if (state.list.items.length === 0) listView.hideListBtns();

        // Delete from UI
        listView.deleteItem(itemId);

        // If no more recipe id in the list then delete it from state
        if (state.list.recipeIds.length === 0) {
            state.list.clearList();
            delete state.list;
        }

    // Handle the count update    
    } else if (event.target.matches('.shopping__count-value')) {
        let itemId = event.target.closest('.shopping__item').dataset.itemid;
        const value = parseFloat(event.target.value, 10);
        state.list.updateCount(itemId, value);

        // Persist list data    
        state.list.persistListData();

    // Handle add extra item    
    } else if (event.target.matches('.shopping__add_extra_btn, .shopping__add_extra_btn *')) {
        const extraItemRecipeId = event.target.closest('.shopping__titled_section').dataset.recipeid;
        
        // Get extra item data
        const extraItemData = listView.getExtraItemData(extraItemRecipeId);
        
        // Add extra item to the list if got new ingredient
        if (extraItemData.ingredient) {

            // Get the recipe title based on the recipe id
            let recipeTitle;
            state.list.items.forEach( element => {
                if (element.recipeId === extraItemRecipeId) {
                    recipeTitle = element.title;
                };
            });

            // Add extra item to the list and save it
            const listItem = state.list.addItem(
                recipeTitle,
                extraItemRecipeId, 
                extraItemData.count, 
                '', 
                extraItemData.ingredient
            );
            // Persist list data    
            state.list.persistListData();

            // Add extra item to the UI
            listView.renderItem(listItem);

            // Show buttons for the shopping checklist
            listView.showListBtns();

            // Clear UI input fields
            listView.clearInputs(extraItemRecipeId);
        };
    // Create shopping checklist    
    } else if (event.target.matches('.list__btn, .list__btn *')) {

        // Clear UI
        recipeView.clearRecipe();
        listView.clearList();
        searchView.clearResults();

        // Clear search
        state.search = undefined;

        // Render checklist sections 
        listView.renderShoppingChecklistSection();

        // Render checklist titled sections
        const sectionIds = [];
        state.list.items.forEach(item => {
            if (!sectionIds.includes(item.recipeId)) {
                sectionIds.push(item.recipeId);
                listView.renderShoppingTitledChecklist(item.recipeId, item.title);
            }
        });
        
        // Add each ingredients to the UI
        state.list.items.forEach(item => {
            listView.renderChecklistItem(item);
        });

        // Render back to recipes btn with the first recipes id
        listView.renderBackToRecipesBtn(sectionIds[0]);
    
    // Clear shopping checklist    
    } else if (event.target.matches('#shopping-list-clear')) {
        state.list.clearList();
        listView.clearList();
    }
});

// Handle all clicks on the checklist
elements.recipe.addEventListener('click', event => {

    // Jump back to recipes (end of shopping)  
    if (event.target.matches('.checklist-btn-back, .checklist-btn-back *')) {
        controlRecipe();
    };
});

/** 
 * LIKE CONTROLLER
 */
const controlLike = () => {
    const currentID = state.recipe.id;

    // If there are no likes at all, add likes to the state
    if (!state.likes) state.likes = new Likes();

    // NOT yet liked the current recipe
    if (!state.likes.isLiked(currentID)) {

        // Add current recipe like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        // Toggle the like button
        likesView.toggleLikeButton(true);

        // Add like to the UI list
        likesView.renderLike(newLike);

        // Toggle the like menu
        likesView.toggleLikeMenu(state.likes.getNumLikes());

    // LIKED allready the current recipe    
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentID);

        // Toggle like button
        likesView.toggleLikeButton(false);

        // Remove like from the UI list
        likesView.deleteLike(currentID);

        // Toggle the like menu
        likesView.toggleLikeMenu(state.likes.getNumLikes());
    }
};

// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();
    
    // Restore likes
    state.likes.readStorage();

    // Toggle the like menu
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing likes
    state.likes.likes.forEach((like) => likesView.renderLike(like));
});


 // Handling all recipe button clicks 
elements.recipe.addEventListener('click', event => {

    // Decrease servings
    if (event.target.matches('.btn-decrease, .btn-decrease *')) {
        
        // Prevent negative servings
        if (state.recipe.servings > 1) { 
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    // Increase servings    
    } else if (event.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    
    // Add ingredients to shopping list   
    } else if (event.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList(true);

        // Show the buttons for the shopping checklist
        listView.showListBtns();

    // Add/Remove recipe to the like list    
    } else if (event.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    }
});

