const starWarsApi = async () => {
  const url = 'https://swapi.dev/api/planets';
  const response = await fetch(url);
  const result = await response.json();
  result.results.forEach((element) => delete element.residents);
  return result.results;
};

export default starWarsApi;
