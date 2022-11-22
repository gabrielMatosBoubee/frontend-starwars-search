import React, { useEffect, useState } from 'react';
import starWarsApi from '../services';

function Home() {
  const [planets, setPlanets] = useState([]);
  const [planetsFilter, setPlanetsFilter] = useState([]);
  const [name, setName] = useState('');

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

  return (
    <div>
      <form>
        <input type="text" onChange={ filterName } data-testid="name-filter" />
      </form>
      <table>
        <tr>
          <th>Name</th>
          <th>Rotation Period</th>
          <th>Orbital Period</th>
          <th>Diameter</th>
          <th>Climate</th>
          <th>Gravity</th>
          <th>Terrain</th>
          <th>Surface Water</th>
          <th>Population</th>
          <th>Films</th>
          <th>Created</th>
          <th>Edited</th>
          <th>URL</th>
        </tr>
        {planetsFilter.map((ele) => (
          <tr key={ ele.name }>
            <td>{ele.name}</td>
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
