import React, { useState, useReducer, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

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

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null }
    case 'RESPONSE':
      return { ...curHttpState, loading: false }
    case 'ERROR':
      return { loading: false, error: action.message }
    case 'CLEAR':
      return { ...curHttpState, error: null }
    default:
      throw new Error('should not get there');
  }
}

function Ingredients() {

  const [ingredients, dispatch] = useReducer(ingredientReducer, [])
  const [httpState, dispatchHttp] = useReducer(httpReducer, { loading: false, error: null })
  // const [ingredients, setIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  const addIngredientHandler = useCallback(ingredient => {
    dispatchHttp({ type: 'SEND' });
    fetch('https://react-hooks-be04b.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify({ ingredient }),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      dispatchHttp({ type: 'RESPONSE' });
      return response.json;
    }).then(responseData => {

      dispatch({ type: 'ADD', ingredient: { id: responseData.name, ...ingredient } })

      // setIngredients(prevIngredients => [
      //   ...prevIngredients,
      //   { id: responseData.name, ...ingredient }
      // ]);
    })
  }, [])

  const filterIngsHandler = useCallback(filterIngredients => {
    // setIngredients(filterIngredients);
    dispatch({ type: 'SET', ingredients: filterIngredients })
  }, []);

  const removeIngredientHandler = useCallback(ingredientId => {
    dispatchHttp({ type: 'SEND' });
    fetch(`https://react-hooks-be04b.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE'
    }).then(response => {
      dispatchHttp({ type: 'RESPONSE' });
      // setIngredients(prevIngredients =>
      //   prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
      // );
      dispatch({ type: 'DELETE', id: ingredientId })

    }).catch(error => {
      dispatchHttp({ type: 'ERROR', message: error.message });
    })
  }, []);

  const clearError = useCallback(() => {
    dispatchHttp({ type: 'CLEAR' });
  }, []);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler} />
    );
  }, [ingredients, removeIngredientHandler])
  return (
    <div className="App">
      { httpState.error && <ErrorModal onClose={clearError} >{httpState.error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} isLoading={httpState.loading} />

      <section>
        <Search onFilterIngredients={filterIngsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
