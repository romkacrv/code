import * as actionTypes from '../constants/groups'
import * as actions from '../actions/groups'

const groups = (store: Object): Object => (next: Function): Object => (action: Object): Object => { // eslint-disable-line

  switch (action.type) {
    case actionTypes.CREATE_GROUP.SUCCESS:
      store.dispatch(actions.fetchGroups())

      action.meta = action.meta || {}
      action.meta.transition = '/roles/groups'
      break

    case actionTypes.DELETE_GROUP.SUCCESS:
      store.dispatch(actions.fetchGroups())

      action.meta = action.meta || {}
      action.meta.transition = '/roles/groups'
      break
  }

  let result = next(action)

  return result
}

export default groups
