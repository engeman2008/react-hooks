import React, { useState, useReducer, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

function Ingredients() {

  const ingredientReducer = (currentIngredients, action) => {
    switch (action.type) {
      case 'SET':
        return action.ingredients;
      case 'ADD':
        return [...currentIngredients, action.ingredient];
      case 'DELETE':
        return currentIngredients.filter(ing => ing.id !== action.id);
      default:
        throw new Error('should not get there');
    }
  }

  const [ingredients, dispatch] = useReducer(ingredientReducer, [])
  // const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const addIngredientHandler = ingredient => {
    setIsLoading(true);
    fetch('https://react-hooks-be04b.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify({ ingredient }),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      setIsLoading(false);
      return response.json;
    }).then(responseData => {

      dispatch({ type: 'ADD', ingredient: { id: responseData.name, ...ingredient } })

      // setIngredients(prevIngredients => [
      //   ...prevIngredients,
      //   { id: responseData.name, ...ingredient }
      // ]);
    })
  }

  const filterIngsHandler = useCallback(filterIngredients => {
    // setIngredients(filterIngredients);
    dispatch({ type: 'SET', ingredients: filterIngredients })
  }, []);

  const removeIngredientHandler = ingredientId => {
    setIsLoading(true);
    fetch(`https://react-hooks-be04b.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE'
    }).then(response => {
      setIsLoading(false);
      // setIngredients(prevIngredients =>
      //   prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
      // );
      dispatch({ type: 'DELETE', id: ingredientId })

    }).catch(error => {
      setIsLoading(false);
      setError(error.message)
    })
  };

  const clearError = () => {
    setError(null);
  }
  return (
    <div className="App">
      { error && <ErrorModal onClose={clearError} >{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} isLoading={isLoading} />

      <section>
        <Search onFilterIngredients={filterIngsHandler} />
        <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
