import React, { useEffect, useState } from 'react';
import starWarsApi from '../services';

function Home() {
  const array = ['population', 'orbital_period', 'diameter',
    'rotation_period', 'surface_water'];
  const newArray = ['Name', 'Rotation Period', 'Orbital Period', 'Diameter',
    'Climate', 'Gravity', 'Terrain', 'Surface Water', 'Population', 'Films',
    'Created', 'Edited', 'URL'];
  const [planets, setPlanets] = useState([]);
  const [planetsFilter, setPlanetsFilter] = useState([]);
  const [names, setName] = useState('');
  const [filter, setFilter] = useState({
    column: 'population',
    compareFilter: 'maior que',
    number: 0,
  });

  const [allTypesNumberValue, setAllTypesNumberValue] = useState(array);
  const [filters, setFilters] = useState([]);
  const [test, setTest] = useState(0);
  const [typeNumberValueSort, setTypeNumberValueSort] = useState('population');
  const [typeSort, setTypeSort] = useState('');
  const [checkedASC, setCheckedASC] = useState(false);
  const [checkedDESC, setCheckedDESC] = useState(false);
  const [loading, SetLoading] = useState(false);
  const callApi = async () => {
    setPlanets(await starWarsApi());
    setPlanetsFilter(await starWarsApi());
  };
  useEffect(() => {
    callApi();
    SetLoading(false);
  }, []);
  useEffect(() => {
    if (names.length === 0) {
      setPlanetsFilter(planets);
    }
  }, [names.length, planets]);
  const filterName = ({ target: { value } }) => {
    setName(value);
    if (value.length > 0) {
      const planetsFilterByName = planets
        .filter((element) => element.name.includes(value));
      setPlanetsFilter(planetsFilterByName);
    }
  };

  const onClickFilter = ({ target: { name, value } }) => (setFilter({ ...filter,
    [name]: value }));

  const onClickTypeNumberSort = ({ target: { value } }) => {
    setTypeNumberValueSort(value);
  };
  const onClickTypeSort = ({ target: { value } }) => {
    setTypeSort(value);
    if (value === 'ASC') {
      setCheckedASC(true);
      setCheckedDESC(false);
    } if (value === 'DESC') {
      setCheckedDESC(true);
      setCheckedASC(false);
    }
  };
  const buttonFilterNumber = () => {
    const valuesOfFiltersArray = filters;
    valuesOfFiltersArray.push(filter);
    setFilters(valuesOfFiltersArray);

    const AllTypesFilter = allTypesNumberValue.filter((ele) => ele !== filter.column);
    setAllTypesNumberValue(AllTypesFilter);
    setFilter({ ...filter, column: AllTypesFilter[0] });
    setTest(test + 1);
  };
  const deleteButtonFilter = (type) => {
    setPlanetsFilter(planets);
    const filtro = filters.filter((ele) => ele.column !== type);
    const deu = allTypesNumberValue;
    deu.push(type);
    setAllTypesNumberValue(deu);
    setFilters(filtro);
    setTest(test + 1);
  };
  const buttonDeleteAll = () => {
    setPlanetsFilter(planets);
    setAllTypesNumberValue(array);
    setFilters([]);
    setTest(test + 1);
  };
  const sortFilter = (filtro) => {
    const menosUm = -1;
    if (typeSort === 'DESC') {
      return filtro.sort((a, b) => {
        if (b[typeNumberValueSort] === 'unknown') return menosUm;
        return (+b[typeNumberValueSort] - +a[typeNumberValueSort]);
      });
    }
    if (typeSort === 'ASC') {
      return filtro.sort((a, b) => {
        if (b[typeNumberValueSort] === 'unknown') return menosUm;
        return (+a[typeNumberValueSort] - +b[typeNumberValueSort]);
      });
    }
    return filtro;
  };
  const sortFilterButton = () => {
    setTest(test + 1);
  };
  useEffect(() => {
    if (filters.length === 0 && test !== 0) {
      const dez = 10;
      SetLoading(true);
      setPlanetsFilter(sortFilter(planetsFilter));
      setTimeout(() => {
        SetLoading(false);
      }, dez);
    }
    if (filters.length > 0) {
      filters.forEach((ele) => {
        if (ele.compareFilter === 'maior que') {
          const filterPlanet = planetsFilter
            .filter((element) => +element[ele.column] > +ele.number);
          return setPlanetsFilter(sortFilter(filterPlanet));
        }
        if (ele.compareFilter === 'menor que') {
          const filterPlanet = planetsFilter
            .filter((element) => +element[ele.column] < +ele.number);
          return setPlanetsFilter(sortFilter(filterPlanet));
        }
        if (ele.compareFilter === 'igual a') {
          const filterPlanet = planetsFilter
            .filter((element) => +element[ele.column] === +ele.number);
          return setPlanetsFilter(sortFilter(filterPlanet));
        }
      });
    }
  }, [test]);
  return (
    <div>
      <form>
        <input type="text" onChange={ filterName } data-testid="name-filter" />
        <select data-testid="column-filter" name="column" onChange={ onClickFilter }>
          {allTypesNumberValue
            .map((types) => <option key={ types } value={ types }>{types}</option>)}
        </select>
        <select
          data-testid="comparison-filter"
          name="compareFilter"
          onChange={ onClickFilter }
        >
          <option value="maior que">maior que</option>
          <option value="menor que">menor que</option>
          <option value="igual a">igual a</option>
        </select>
        <input
          type="number"
          data-testid="value-filter"
          name="number"
          onChange={ onClickFilter }
          value={ filter.number }
        />
        <button
          type="button"
          data-testid="button-filter"
          onClick={ buttonFilterNumber }
        >
          Filter
        </button>
        <select data-testid="column-sort" onClick={ onClickTypeNumberSort }>
          {array
            .map((types) => <option key={ types } value={ types }>{types}</option>)}
        </select>
        <label htmlFor="Ascendente">
          Ascendente
          <input
            type="radio"
            id="Ascendente"
            value="ASC"
            data-testid="column-sort-input-asc"
            onChange={ onClickTypeSort }
            checked={ checkedASC }
          />
        </label>
        <label htmlFor="Descendente">
          Descendente
          <input
            type="radio"
            id="Descendente"
            data-testid="column-sort-input-desc"
            value="DESC"
            onChange={ onClickTypeSort }
            checked={ checkedDESC }
          />
        </label>
        <button
          data-testid="column-sort-button"
          type="button"
          onClick={ sortFilterButton }
        >
          Ordenar

        </button>
      </form>
      {filters.map((filtersUsed) => (
        <div key={ filtersUsed.column } data-testid="filter">
          <p>{filtersUsed.column}</p>
          <button
            type="button"
            onClick={ () => deleteButtonFilter(filtersUsed.column) }
          >
            Delete
          </button>
        </div>
      ))}
      <button
        type="button"
        data-testid="button-remove-filters"
        onClick={ buttonDeleteAll }
      >
        remove tudo
      </button>
      {loading ? <p>loading</p> : (
        <table>
          <tr>
            {newArray.map((e) => <th key={ e }>{e}</th>)}
          </tr>
          {planetsFilter.map((ele) => (
            <tr key={ ele.name }>
              <td data-testid="planet-name">{ele.name}</td>
              <td>{ele.rotation_period}</td>
              <td>{ele.orbital_period}</td>
              <td>{ele.diameter}</td>
              <td>{ele.climate}</td>
              <td>{ele.gravity}</td>
              <td>{ele.terrain}</td>
              <td>{ele.surface_water}</td>
              <td>{ele.population}</td>
              <td>{ele.films.map((element) => `${element} `)}</td>
              <td>{ele.created}</td>
              <td>{ele.edited}</td>
              <td>{ele.url}</td>
            </tr>
          ))}
        </table>
      )}
    </div>
  );
}
export default Home;
