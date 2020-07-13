import uniqid from 'uniqid';

export default class List {
    constructor(recipeId) {
        this.items = [];
        this.recipeIds = [];

        if (recipeId) this.recipeIds = [recipeId];
    }
    
    addRecipeId (id) {
        this.recipeIds.push(id);
    }

    deleteRecipeId (id) {

        const recipeIndex = this.recipeIds.findIndex(currentId => currentId === id);
        
        if (recipeIndex !== -1) {
            this.recipeIds.splice(recipeIndex, 1);
        }
    }

    addItem (title, recipeId, count, unit, ingredient) {
        const item = {
            id: uniqid(),
            title,
            recipeId,
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem (id) {
        
        // If deletion ID is recipeId delete it 
        // Also delete each item with same recipeId start from the end to keep the right array indexes  
        if (this.recipeIds.includes(id)) {
            this.deleteRecipeId(id);

            // Collect the items indexes
            let indexList = [];
            this.items.forEach( (item, index) => {
                if (item.recipeId === id) indexList.push(index);
            });

            // Reverse the sorting and delete them
            indexList.reverse();
            indexList.forEach(itemIndex => {
                this.items.splice(itemIndex, 1);
            });
        // If deletion ID is itemId search and delete it 
        } else {
            this.items.forEach( (item, index) => {
                if (id === item.id) this.items.splice(index, 1);
            });
        };
    }

    updateCount (id, newCount) {
        this.items.find(element => element.id === id).count = newCount;
    }

    // Save list data into local storage
    persistListData() {
        if (this.items.length === 0 ) {
            localStorage.setItem('ingredientList', '');
        } else {
            localStorage.setItem('ingredientList', JSON.stringify(this.items));
        }
        
        // Convert array to string for storage
        let idsForStorage = this.recipeIds.join(',');
        localStorage.setItem('recipeList', idsForStorage);
    }

    // Read list data from local storage
    readListStorage() {
        
        let storageIngredients = localStorage.getItem('ingredientList');
        let storageRecipes = localStorage.getItem('recipeList');

        // Restoring list from the localStorage
        if (storageIngredients != false && 
            storageIngredients != null && 
            storageRecipes != false &&
            storageRecipes != null
            ) {
            this.items = JSON.parse(storageIngredients);
            this.recipeIds = storageRecipes.split(',');
        } else {
            this.items = [];
            this.recipeIds = [];
        }  
    }

    // Delete all list data
    clearList() {
        this.items = [];
        this.recipeIds = [];

        localStorage.removeItem('recipeList');
        localStorage.removeItem('ingredientList');
    }

    // Check storage items: exist and values 
    checkStorageHealthy() {
        let ingredientListHealthy = false; 
        let recipeListHealthy = false; 
        
        let storageIngredientList = localStorage.getItem('ingredientList');
        if (storageIngredientList != false && storageIngredientList != null) {
            ingredientListHealthy = true;
        }

        let storageRecipeList = localStorage.getItem('recipeList');
        if (storageRecipeList != false && storageRecipeList != null) {
            recipeListHealthy = true;
        }
        
        return (ingredientListHealthy && recipeListHealthy) ? true : false;
    }
}


