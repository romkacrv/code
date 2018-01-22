// @flow
import _ from 'lodash'
import { parse } from 'redux-crud-action-types'
import * as ServerDispatcher from '../../helpers/ServerDispatcher'
import * as actionTypes from '../constants/groups'
import * as actionUrlHelper from '../../helpers/Action'

/**
 * Fetch groups
 *
 * @memberof Actions.Actions_Groups
 *
 * @param {Object} query - additional query params
 *
 * @returns {Function}
 */
export const fetchGroups = (query: ?Object = {}): Function => {
  return (dispatch: Function): Promise<*> => {
    query.limit = _.get(query, 'limit', 15)
    query = Object.assign({}, query, {populate: '[users,user_group]'})

    ServerDispatcher.request(
      dispatch,
      actionTypes.FETCH_GROUPS.PENDING,
      actionTypes.FETCH_GROUPS.SUCCESS,
      actionTypes.FETCH_GROUPS.ERROR
    ).get('api', actionUrlHelper.set(parse(actionTypes.FETCH_GROUPS)), query)
  }
}

/**
 * Fetch group
 *
 * @memberof Actions.Actions_Groups
 *
 * @param {Number} groupId - group id
 *
 * @returns {Function}
 */
export const fetchGroupById = (groupId: Number) => {
  return (dispatch: Function): Promise<*> => {
    ServerDispatcher.request(
      dispatch,
      {type: actionTypes.FETCH_GROUP.PENDING, group_id: groupId},
      {type: actionTypes.FETCH_GROUP.SUCCESS, group_id: groupId},
      {type: actionTypes.FETCH_GROUP.ERROR, group_id: groupId}
    ).get('api', actionUrlHelper.set(parse(actionTypes.FETCH_GROUP), {group_id: groupId}))
  }
}

/**
 * Update group
 *
 * @memberof Actions.Actions_Groups
 *
 * @param {Number} groupId - group id
 * @param {Object} data - data
 *
 * @returns {Function}
 */
export const updateGroupById = (groupId: Number, data: Object) => {
  return (dispatch: Function): Promise<*> => {
    ServerDispatcher.request(
      dispatch,
      {type: actionTypes.FETCH_GROUP.PENDING, group_id: groupId},
      {type: actionTypes.FETCH_GROUP.SUCCESS, group_id: groupId},
      {type: actionTypes.FETCH_GROUP.ERROR, group_id: groupId}
    ).put('api', actionUrlHelper.set(parse(actionTypes.FETCH_GROUP), {group_id: groupId}), data)
  }
}

/**
 * Create group
 *
 * @memberof Actions.Actions_Groups
 *
 * @param {Object} data - data
 *
 * @returns {Function}
 */
export const createNewGroup = (data: Object) => {
  return (dispatch: Function): Promise<*> => {
    ServerDispatcher.request(
      dispatch,
      actionTypes.CREATE_GROUP.PENDING,
      actionTypes.CREATE_GROUP.SUCCESS,
      actionTypes.CREATE_GROUP.ERROR
    ).post('api', parse(actionTypes.CREATE_GROUP), data)
  }
}

/**
 * Clear create form
 *
 * @memberof Actions.Actions_Groups
 *
 * @returns {{type}}
 */
export const clearCreateForm = () => {
  return {
    type: actionTypes.CREATE_GROUP_CLEAR
  }
}

/**
 * Delete group
 *
 * @memberof Actions.Actions_Groups
 *
 * @param {Number} groupId - group id
 *
 * @returns {Function}
 */
export const deleteGroupById = (groupId: Number) => {
  return (dispatch: Function): Promise<*> => {
    ServerDispatcher.request(
      dispatch,
      {type: actionTypes.DELETE_GROUP.PENDING, group_id: groupId},
      {type: actionTypes.DELETE_GROUP.SUCCESS, group_id: groupId},
      {type: actionTypes.DELETE_GROUP.ERROR, group_id: groupId}
    ).del('api', actionUrlHelper.set(parse(actionTypes.DELETE_GROUP), {group_id: groupId}))
  }
}
