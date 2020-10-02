import React, { useState, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

function Ingredients() {

  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    fetch('https://react-hooks-be04b.firebaseio.com/ingredients.json')
      .then(response => response.json())
      .then(responseData => {
        const loadedIngrdients = [];
        for (const key in responseData) {
          loadedIngrdients.push({
            id: key,
            title: responseData[key].ingredient.title,
            amount: responseData[key].ingredient.amount
          })
        }
        setIngredients(loadedIngrdients);
      })
  }, []); //[] render when component first render

  const addIngredientHandler = ingredient => {
    fetch('https://react-hooks-be04b.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify({ ingredient }),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      return response.json;
    }).then(responseData => {
      setIngredients(prevIngredients => [
        ...prevIngredients,
        { id: responseData.name, ...ingredient }
      ]);
    })
  }
  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList ingredients={ingredients} onRemoveItem={() => { }} />
      </section>
    </div>
  );
}

export default Ingredients;
