import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import sinon from 'sinon'
import { expect } from 'chai'
import * as actions from './auth'
import * as types from '../constants/actionTypes'
import * as Server from '../../helpers/Server'
import * as Cache from '../../helpers/ClientSideCache'
import { Map } from 'immutable'

var sinonStubPromise = require('sinon-stub-promise')
sinonStubPromise(sinon)

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

global.localStorage = {
  setItem: function () {
  },
  getItem: function () {
  },
  removeItem: function () {
  }
}

describe('Auth actions', () => {
  let ServerStubGet
  let ServerStubPut
  let ServerStubDel
  let ServerStubPost
  let CacheStubSet
  let CacheStubGet
  let LocalStorageStubSet
  let LocalStorageStubGet
  before(() => {
    ServerStubGet = sinon.stub(Server, 'get')
      .returnsPromise()
    ServerStubPut = sinon.stub(Server, 'put')
      .returnsPromise()
    ServerStubPost = sinon.stub(Server, 'post')
      .returnsPromise()
    ServerStubDel = sinon.stub(Server, 'del')
      .returnsPromise()

    CacheStubSet = sinon.stub(Cache, 'set')
    CacheStubGet = sinon.stub(Cache, 'get')
    LocalStorageStubSet = sinon.stub(localStorage, 'setItem')
    LocalStorageStubGet = sinon.stub(localStorage, 'getItem')
  })

  after(() => {
    ServerStubGet.restore()
    ServerStubPut.restore()
    ServerStubDel.restore()
    ServerStubPost.restore()
    CacheStubSet.restore()
    CacheStubGet.restore()
    LocalStorageStubSet.restore()
    LocalStorageStubGet.restore()
  })

  it('creates AUTH_SUCCESS when user auth', () => {
    const response = {token: 'token_value', user: 'user', is_save: true}

    ServerStubPost.resolves(response)

    const expectedActions = [
      {type: types.AUTH},
      {type: types.AUTH_SUCCESS, data: response}
    ]

    const store = mockStore({token: []})

    return store.dispatch(actions.secondLogin('email@email.ru', 'password'))
      .then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions)
      })
  })

  it('creates AUTH_ERROR when user auth', () => {
    const response = {error: 'token_value'}

    ServerStubPost.rejects(response)

    const expectedActions = [
      {type: types.AUTH},
      {type: types.AUTH_ERROR, error: response}
    ]

    const store = mockStore({})

    return store.dispatch(actions.secondLogin('email@email.ru', 'password'))
      .then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions)
      })
  })

  it('creates SHOW_SECRET_KEY_SUCCESS when user auth', () => {
    const response = {
      otp: 'secretKey',
      token: 'token_value',
      user: 'user'
    }

    ServerStubPost.resolves(response)

    const expectedActions = [
      {type: types.AUTH},
      {
        type: types.SHOW_SECRET_KEY_SUCCESS,
        secretKey: response.otp,
        loginData: {
          token: response.token,
          user: response.user
        },
        meta: {
          modal: true
        }
      }
    ]

    const store = mockStore({token: []})

    return store.dispatch(actions.secondLogin('email@email.ru', 'password'))
      .then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions)
      })
  })

  it('creates LOGOUT when user auth', () => {
    const expectedActions = [
      {type: types.LOGOUT}
    ]

    const store = mockStore({})
    store.dispatch(actions.logout())

    return expect(store.getActions()).to.deep.equal(expectedActions)
  })

  it('creates AUTH_SUCCESS when user auth check success', () => {
    const response = {token: 'token_value', user: JSON.stringify({name: 'user'})}

    CacheStubGet.returns(response.token)
    LocalStorageStubGet.returns(response.user)

    const expectedActions = [
      {
        type: types.AUTH_SUCCESS,
        data: {
          token: response.token,
          user: JSON.parse(response.user),
          isLogged: true
        }
      }
    ]

    const store = mockStore({
      auth: Map({
        auth: Map({
          data: {
            isLogged: false
          }
        })
      })
    })

    store.dispatch(actions.checkAuth())

    return expect(store.getActions()).to.deep.equal(expectedActions)
  })

  // it('creates AUTH_SUCCESS when user auth check fails', () => {
  //     const response = {user:JSON.stringify({name:'user'})};
  //
  //     CacheStubGet.returns(null);
  //     LocalStorageStubGet.returns(response.user);
  //
  //     const expectedActions = [
  //         {type: types.AUTH_SUCCESS, data: {
  //             token: null,
  //             user: JSON.parse(response.user),
  //             isLogged: false
  //         }}
  //     ];
  //
  //     const store = mockStore({auth: Map({
  //         auth: Map({
  //             data: {
  //                 isLogged: false
  //             }
  //         })
  //     })});
  //     store.dispatch(actions.checkAuth());
  //     return expect(store.getActions()).to.deep.equal(expectedActions);
  // });

  it('creates AUTH_SUCCESS when user got secret key and auth', () => {
    const expectedActions = [
      {type: types.AUTH_SUCCESS, data: {}}
    ]

    const store = mockStore({
      auth: Map({
        auth: Map({
          loginData: {}
        })
      })
    })

    store.dispatch(actions.login())
    return expect(store.getActions()).to.deep.equal(expectedActions)
  })

  it('creates AUTH_PASS_RESET_SUCCESS when user reset pass', () => {
    const response = 'ok'
    const data = {token_optp: 'token_optp', 'code': 'code'}

    ServerStubDel.resolves(response)

    const expectedActions = [
      {type: types.AUTH_PASS_RESET.PENDING},
      {type: types.AUTH_PASS_RESET.SUCCESS, data: response}
    ]

    const store = mockStore()

    store.dispatch(actions.resetPassword(data))
    return expect(store.getActions()).to.deep.equal(expectedActions)
  })
})
