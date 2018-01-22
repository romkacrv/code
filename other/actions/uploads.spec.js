import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import sinon from 'sinon'
import { expect } from 'chai'
import * as actions from './uploads'
import * as types from '../constants/actionTypes'
import * as Server from '../../helpers/Server'
import * as errorParsers from '../../helpers/ErrorParser'
import { Map } from 'immutable'

var sinonStubPromise = require('sinon-stub-promise')
sinonStubPromise(sinon)

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Uploads actions', () => {
  let ServerStubGet
  let ServerStubPut
  let ServerStubDel
  let ServerStubPost

  before(() => {
    ServerStubGet = sinon.stub(Server, 'get')
      .returnsPromise()
    ServerStubPut = sinon.stub(Server, 'put')
      .returnsPromise()
    ServerStubPost = sinon.stub(Server, 'post')
      .returnsPromise()
    ServerStubDel = sinon.stub(Server, 'del')
      .returnsPromise()
  })

  after(() => {
    ServerStubGet.restore()
    ServerStubPut.restore()
    ServerStubDel.restore()
    ServerStubPost.restore()
  })

  it('creates DISABLE_UPLOAD_SUCCESS when disable upload has been done', () => {
    const response = {upload_id: 1}

    ServerStubDel.resolves(response)

    const expectedActions = [
      {type: types.DISABLE_UPLOAD, tableName: 'tableName'},
      {
        type: types.DISABLE_UPLOAD_SUCCESS,
        data: response,
        meta: {
          after: {}
        }
      }
    ]

    const store = mockStore()

    store.dispatch(actions.disableUpload([1], {}, 0, 'tableName'))
    return expect(store.getActions()).to.include.deep.members(expectedActions)
  })

  it('creates TABLE_UPLOADS_SELECT when disable upload has been done', () => {
    const response = {upload_id: 1}

    ServerStubDel.resolves(response)

    const expectedActions = [
      {type: types.TABLE_UPLOADS_SELECT, data: [], tableName: 'tableName'}
    ]

    const store = mockStore()

    store.dispatch(actions.disableUpload([1], {}, 0, 'tableName'))
    return expect(store.getActions()).to.include.deep.members(expectedActions)
  })

  it('creates GET_UPLOAD_NOTIFICATIONS when disable upload has been done', () => {
    const response = {upload_id: 1}

    ServerStubDel.resolves(response)

    const expectedActions = [
      {type: types.GET_UPLOAD_NOTIFICATIONS, data: []}
    ]

    const store = mockStore({
      events: Map({
        uploadNotifications: Map({
          data: []
        })
      })
    })

    store.dispatch(actions.disableUpload([1], {}, 0, 'tableName'))
    return expect(store.getActions()).to.include.deep.members(expectedActions)
  })

  it('creates DISABLE_UPLOAD_ERROR when disable upload has been fail', () => {
    const response = {
      request: {
        response: JSON.stringify({
          message: 'error'
        })
      }
    }

    ServerStubDel.rejects(response)

    const expectedActions = [
      {type: types.DISABLE_UPLOAD, tableName: 'tableName'},
      {
        type: types.DISABLE_UPLOAD_ERROR,
        params: {ids: [1], afterSuccess: {}},
        tableName: 'tableName',
        error: JSON.parse(response.request.response).message
      }
    ]

    const store = mockStore({})

    store.dispatch(actions.disableUpload([1], {}, 0, 'tableName'))
    return expect(store.getActions()).to.deep.equal(expectedActions)
  })
})
