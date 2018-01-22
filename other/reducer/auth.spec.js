import { expect } from 'chai'
import reducer, { initialState } from './auth'
import * as types from '../constants/actionTypes'
import { Map } from 'immutable'

var chai = require('chai')
var chaiImmutable = require('chai-immutable')

chai.use(chaiImmutable)

describe('Reducers::Auth', () => {
  const getInitialState = (): any => {
    return initialState
  }

  it('should set initial state by default', () => {
    const action = {type: 'unknown'}
    const expected = getInitialState()

    expect(reducer(undefined, action)).to.deep.equal(expected)
  })

  it('should handle AUTH', () => {
    const action = {type: types.AUTH}
    const initialState = Map({
      auth: Map({
        isFetching: false,
        data: {},
        error: null
      })
    })
    const nextState = reducer(initialState, action)
    expect(nextState).to.have.deep.property('auth.isFetching', true)
    expect(nextState).to.have.deep.property('auth.error', null)
  })

  it('should handle AUTH_SUCCESS', () => {
    const data = {data: 0}
    const action = {type: types.AUTH_SUCCESS, data}
    const initialState = Map({
      auth: Map({
        isFetching: true,
        data: {},
        error: null
      })
    })
    const nextState = reducer(initialState, action)
    expect(nextState).to.have.deep.property('auth.isFetching', false)
    expect(nextState).to.have.deep.property('auth.data', data)
  })

  it('should handle AUTH_ERROR', () => {
    const data = 'Error text'
    const action = {type: types.AUTH_ERROR, data}
    const initialState = Map({
      auth: Map({
        isFetching: true,
        data: {},
        error: null
      })
    })

    const nextState = reducer(initialState, action)

    expect(nextState).to.have.deep.property('auth.error', data)
  })

  it('should handle LOGOUT', () => {
    const data = {}
    const action = {type: types.LOGOUT}
    const initialState = Map({
      auth: Map({
        isFetching: true,
        data: {data: 0},
        error: null
      })
    })
    const nextState = reducer(initialState, action)
    expect(nextState).to.have.deep.property('auth.data')
  })
})
