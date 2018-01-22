// @flow
import * as ServerDispatcher from '../../helpers/ServerDispatcher'
import * as actionTypes from '../constants/groups'
import { Map } from 'immutable'

export const initialState = Map({
  groups: Map({
    table: Map({
      isFetching: true,
      data: [],
      error: null
    }),
    byId: Map(
      // {
      //     isFetching: Boolean,
      //     error: String,
      //     data: data
      // }
    ),
    create: Map({
      isFetching: false,
      error: null,
      data: undefined
    })
  })
})

export default function groups (state: Object = initialState, action: Object): Object {
  switch (action.type) {
    case actionTypes.FETCH_GROUPS.PENDING:
      return state.setIn(['groups', 'table', 'isFetching'], true)
        .setIn(['groups', 'table', 'error'], null)

    case actionTypes.FETCH_GROUPS.SUCCESS: {
      let st = state.setIn(['groups', 'table', 'isFetching'], false)
        .setIn(['groups', 'table', 'data'], action.data)

      let data = st.getIn(['groups', 'table', 'data'])
      let items = data.items || []

      items.forEach((group) => {
        st = st.setIn(['groups', 'byId', group.group_id], Map({
          isFetching: false,
          data: group
        }))
      })

      return st
    }

    case actionTypes.FETCH_GROUPS.ERROR:
      return state.setIn(['groups', 'table', 'isFetching'], false)
        .setIn(['groups', 'table', 'error'], action.error)

    case actionTypes.CREATE_GROUP.PENDING:
      return ServerDispatcher.f('groups.create', state, action)

    case actionTypes.CREATE_GROUP.ERROR:
      return ServerDispatcher.e('groups.create', state, action)

    case actionTypes.FETCH_GROUP.PENDING:
      return ServerDispatcher.f('groups.byId.' + action.group_id, state, action)

    case actionTypes.FETCH_GROUP.SUCCESS:
      return ServerDispatcher.s('groups.byId.' + action.group_id, state, action)

    case actionTypes.FETCH_GROUP.ERROR:
      return ServerDispatcher.e('groups.byId.' + action.group_id, state, action)

    case actionTypes.DELETE_GROUP.SUCCESS:
      return ServerDispatcher.e('groups.byId.' + action.group_id, state, action, (st) => {
        return st.setIn(['groups', 'table', 'isFetching'], false)
      })

    case actionTypes.DELETE_GROUP.ERROR:
      return ServerDispatcher.e('groups.byId.' + action.group_id, state, action, (st) => {
        let error = (action.error && action.error.statusText)
          ? action.error.statusText
          : action.error
            ? JSON.stringify(action.error)
            : JSON.stringify(action.data)

        st = st.setIn(['groups', 'table', 'isFetching'], false)
        st = st.setIn(['groups', 'table', 'error'], error)
        return st
      })

    case actionTypes.CREATE_GROUP_CLEAR:
      return state.setIn(['groups', 'create'], initialState.getIn(['groups', 'create']))

    default:
      return state
  }
}
