import axios from 'axios';

export default class Recipe {
    constructor (id){
        this.id = id;
    }

    async getRecipe() {
        try {
            const result = await axios(`https://forkify-api.herokuapp.com/api/get?&rId=${this.id}`);
            this.img = result.data.recipe.image_url;
            this.ingredients = result.data.recipe.ingredients;
            this.author = result.data.recipe.publisher_url;
            this.sourceUrl = result.data.recipe.source_url;
            this.title = result.data.recipe.title; 

        } catch (error) {
            console.log('Something went wrong with recipe response/result');
        }
    }

    calcCookingTyme() {
        // Based on that we need 15 min for each 3 ingredients
        const numIngredients = this.ingredients.length;
        const period = Math.ceil(numIngredients / 3);
        this.cookingTime = period * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    unifyIngredients() {
        // loop through and if find match then swap, first with the 's' ending!  
        const arrUnitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const arrUnitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const arrUnits = [...arrUnitsShort, 'kg', 'g'];

        const  newIngredients = this.ingredients.map(ingredient => {
            // 1. Uniform units
            let unifiedIngredient = ingredient.toLowerCase();
            arrUnitsLong.forEach((unit, i) => {
                unifiedIngredient = unifiedIngredient.replace(unit, arrUnitsShort[i]);
            });

            // 2. Remove pharentheses
            unifiedIngredient = unifiedIngredient.replace(/ *\([^)]*\) */g, ' ');

            // 3. Parse ingredients into count, unit ,ingredient
            const arrIngredients = unifiedIngredient.split(' ');

            // ! FindIndex loop through arrIngredients and check if actual arrIngredientsElement is in arrUnitsShort.
            // ! If the includes return true than findIndex return the actual arrIngredientsElement index.
            const unitIndex = arrIngredients.findIndex(arrIngredientsElement => arrUnits.includes(arrIngredientsElement));
            let objIngredient;

            if (unitIndex > -1) {
                // There is a unit
                // Ex. 4 cups, arrCount is [4] --> 4
                // Ex. 4 1/2 cups, arrCount is [4, 1/2] --> "4+1/2" --> 4.5
                
                const arrCount = arrIngredients.slice(0, unitIndex);

                let count;
                if (arrCount[0] === "") {
                    // There is a unit but no number
                    count = 1;
                } else if (arrCount.length === 1) {
                    // There is a unit and a number
                    count = eval(arrIngredients[0].replace('-', '+'));
                } else {
                    // There is a unit and more number ex: 4 1/2 cups
                    count = eval(arrIngredients.slice(0, unitIndex).join('+'));
                }

                objIngredient = {
                    count,
                    unit: arrIngredients[unitIndex],
                    unifiedIngredient: arrIngredients.slice(unitIndex + 1).join(' ')
                }

            } else if (parseInt(arrIngredients[0], 10)) {
                // There is no unit, but 1st element is number
                objIngredient = {
                    count: parseInt( arrIngredients, 10),
                    unit: '',
                    unifiedIngredient: arrIngredients.slice(1).join(' ')
                }

            } else if (unitIndex === -1) {
                // There is no unit, and no number in first position
                objIngredient = {
                    count: 1,
                    unit: '',
                    // ! short verison of unifiedIngredient: unifiedIngredient;
                    unifiedIngredient
                }
                 
            }
          
            return objIngredient;
        });
        this.ingredients = newIngredients;
    }

    updateServings (type) {
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // Ingredients
        this.ingredients.forEach( ing => {
            ing.count *= (newServings / this.servings);
        });
        this.servings = newServings;
    }
}