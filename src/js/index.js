// Global 01 plan and build states structure
// Global 02 create search module  and setup API connection
// Global 03 create view/base for collecting html elements
// Global 04 create models/Search and controlSearch to get data
// Global 05 create views/searchView to collect search term and render new data
// Global 06 render results and create pagination
// Global 07 create models/Recipe and parse, unify recipe data
// Global 08 create views/resipeViews set event listeners to render recipe data

import Recipe from './models/Recipe';
import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';


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
            alert(`Error searching recipe! ${error}`);
            clearLoader();
        }
        
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault(); // Info: Do not reload page after click
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

        // Highlight selected search item
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
            recipeView.renderRecipe(state.recipe);

        } catch (error) {
            alert(`Error processing recipe! ${error}`);
        }
        
    }
}


// More event triggering same callback -> window.addEventListener('load', controlRecipe); & window.addEventListener('hashchange', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//const r = new Recipe(47746);
//r.getRecipe();