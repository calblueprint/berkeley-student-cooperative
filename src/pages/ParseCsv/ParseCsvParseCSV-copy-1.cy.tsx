import React from 'react'
import ParseCSV from './ParseCsv'

describe('<ParseCSV />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<ParseCSV />)
  })
})