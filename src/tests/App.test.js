import React from 'react';
import { render, screen } from '@testing-library/react';
// import App from '../App';
import Home from '../pages/Home'
import mock from '../../cypress/mocks/testData'
import userEvent from '@testing-library/user-event';


describe('testes da aplicação', () => {

  beforeEach(() => global.fetch = jest.fn().mockResolvedValue({
    json: jest.fn().mockResolvedValue(mock)
  }))

  // afterEach(() => jest.clearAllMocks())

  test('I am your test', () => {
    render(<Home />);
    const linkElement = screen.getByText(/name/i);
    expect(linkElement).toBeInTheDocument();
  });
  test('Se está filtrando', async () => {
    render(<Home />);
    await screen.findByText(/Tatooine/i)
    const selectColumn = screen.getByTestId('column-filter')
    userEvent.selectOptions(selectColumn, 'surface_water')
    const selectComparasion = screen.getByTestId(/comparison-filter/i)
    userEvent.selectOptions(selectComparasion, 'menor que')
    const inputNumber = screen.getByTestId(/value-filter/i)
    userEvent.type(inputNumber, '40')
    const getBtnFilter = screen.getByTestId(/button-filter/i)
    userEvent.click(getBtnFilter)
    const allTr = screen.getAllByRole('row')
    expect(allTr).toHaveLength(7)
  })
  test('Se está filtrando ao digitar', async () => {
    render(<Home />);
    const inputName = screen.getByTestId(/name-filter/i)
    const tato = await screen.findByText(/Tatooine/i)
    userEvent.type(inputName, 'Ta')
    const tr = screen.getAllByRole('row')
    expect(tr).toHaveLength(2);
    expect(tato).toBeInTheDocument();
  })
})
