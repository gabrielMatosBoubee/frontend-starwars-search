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
  const [name, setName] = useState('');
  const [typeNumberValue, setTypeNumberValue] = useState('population');
  const [compareFilter, setCompareFilter] = useState('maior que');
  const [number, setNumber] = useState(0);
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
  };
  useEffect(() => {
    callApi();
  }, []);
  useEffect(() => {
    if (name.length === 0) {
      setPlanetsFilter(planets);
    }
  }, [name.length, planets]);
  const filterName = ({ target: { value } }) => {
    setName(value);
    if (value.length > 0) {
      const planetsFilterByName = planets
        .filter((element) => element.name.includes(value));
      setPlanetsFilter(planetsFilterByName);
    }
  };
  const onClickTypeNumber = ({ target: { value } }) => {
    setTypeNumberValue(value);
  };
  const onClickCompareFilter = ({ target: { value } }) => {
    setCompareFilter(value);
  };
  const onChangeNumber = ({ target: { value } }) => {
    setNumber(value);
  };
  const onClickTypeNumberSort = ({ target: { value } }) => {
    setTypeNumberValueSort(value);
  };
  const onClickTypeSort = ({ target: { value } }) => {
    setTypeSort(value);
    if (value === 'ASC') {
      setCheckedASC(true);
      setCheckedDESC(false);
    } else {
      setCheckedDESC(true);
      setCheckedASC(false);
    }
  };
  const buttonFilterNumber = () => {
    const valuesOfFiltersArray = filters;
    const valuesOfFilter = {
      typeNumberValue,
      compareFilter,
      number,
    };
    valuesOfFiltersArray.push(valuesOfFilter);
    setFilters(valuesOfFiltersArray);

    const AllTypesFilter = allTypesNumberValue.filter((ele) => ele !== typeNumberValue);
    setAllTypesNumberValue(AllTypesFilter);
    setTypeNumberValue(AllTypesFilter[0]);
    setTest(test + 1);
  };
  const deleteButtonFilter = (type) => {
    setPlanetsFilter(planets);
    const filtro = filters.filter((ele) => ele.typeNumberValue !== type);
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
    if (typeSort === 'ASC') {
      const menosUm = -1;
      return filtro.sort((a, b) => {
        if (b[typeNumberValueSort] === 'unknown') {
          return menosUm;
        }
        return (+a[typeNumberValueSort] - +b[typeNumberValueSort]);
      });
    }
    if (typeSort === 'DESC') {
      console.log('ok');
      return filtro.sort((a, b) => +b[typeNumberValueSort] - +a[typeNumberValueSort]);
    }
    return filtro;
  };
  const sortFilterButton = () => {
    setTest(test + 1);
  };
  useEffect(() => {
    if (filters.length > 0) {
      filters.forEach((ele) => {
        if (ele.compareFilter === 'maior que') {
          const filter = planetsFilter
            .filter((element) => +element[ele.typeNumberValue] > +ele.number);
          return setPlanetsFilter(sortFilter(filter));
        }
        if (ele.compareFilter === 'menor que') {
          const filter = planetsFilter
            .filter((element) => +element[ele.typeNumberValue] < +ele.number);
          return setPlanetsFilter(sortFilter(filter));
        }
        if (ele.compareFilter === 'igual a') {
          const filter = planetsFilter
            .filter((element) => element[ele.typeNumberValue] === +ele.number);
          return setPlanetsFilter(sortFilter(filter));
        }
      });
    }
    const dez = 10;
    SetLoading(true);
    setPlanetsFilter(sortFilter(planetsFilter));
    setTimeout(() => {
      SetLoading(false);
    }, dez);
  }, [test]);
  return (
    <div>
      <form>
        <input type="text" onChange={ filterName } data-testid="name-filter" />
        <select data-testid="column-filter" onClick={ onClickTypeNumber }>
          {allTypesNumberValue
            .map((types) => <option key={ types } value={ types }>{types}</option>)}
        </select>
        <select data-testid="comparison-filter" onClick={ onClickCompareFilter }>
          <option value="maior que">maior que</option>
          <option value="menor que">menor que</option>
          <option value="igual a">igual a</option>
        </select>
        <input
          type="number"
          data-testid="value-filter"
          onChange={ onChangeNumber }
          value={ number }
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
        <div key={ filtersUsed.typeNumberValue } data-testid="filter">
          <p>{filtersUsed.typeNumberValue}</p>
          <button
            type="button"
            onClick={ () => deleteButtonFilter(filtersUsed.typeNumberValue) }
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
      <table>
        <tr>
          {newArray.map((e) => <th key={ e }>{e}</th>)}
        </tr>
        {loading ? <p>loading</p> : planetsFilter.map((ele) => (
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
    </div>
  );
}
export default Home;
