import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onFilterIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      //check if the current value of the filter is the same 5 milliseconds ago (0.5 seconds)
      if (enteredFilter === inputRef.current.value) {
        const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
        fetch('https://react-hooks-be04b.firebaseio.com/ingredients.json' + query)
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
            props.onFilterIngredients(loadedIngrdients);
          })
      }
      //cleanup function, run before the enxt execution
      return () => {
        clearTimeout(timer);
      };
    }, 500);

  }, [enteredFilter, onFilterIngredients, inputRef]);
  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input type="text" ref={inputRef} value={enteredFilter} onChange={event => setEnteredFilter(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
