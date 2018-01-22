import { createSelector } from 'reselect'

export const getGroupById = (state, groupId) => {
  let group = state.groups.getIn(['groups', 'byId', groupId])
  return group ? group.toJS() : undefined
}

export const getCreateRole = (state) => {
  let create = state.groups.getIn(['groups', 'create'])
  return create ? create.toJS() : undefined
}

export const getUsers = (state) => {
  let users = state.users.getIn(['tableManagers'])
  return users ? users.toJS() : undefined
}

export const getGroupEditPageData = createSelector(
  [getGroupById, getUsers],
  (group, users) => {
    let isFetching = (!group || group.isFetching || !users || users.isFetching)
    let error = (group || users)
      ? group ? group.error : users ? users.error : '' : ''

    return {
      isFetching,
      error,
      group,
      users
    }
  }
)

export const getGroupCreatePageData = createSelector(
  [getCreateRole, getUsers],
  (create, users) => {
    let isFetching = (!create || create.isFetching || !users || users.isFetching)
    let error = (create || users)
      ? create ? create.error : users ? users.error : '' : ''

    return {
      isFetching,
      error,
      users
    }
  }
)
