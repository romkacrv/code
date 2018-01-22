// @flow
import React, { Component } from 'react'

export default (RoutesNames: Array<string>) => (BaseComponent: Function) => {
  class RenderChildrenHOC extends Component {
    render () {
      const {children} = this.props

      return children && RoutesNames.indexOf(children.props.route.name) > -1
        ? <div>{children}</div>
        : <BaseComponent {...this.props} />
    }
  }

  RenderChildrenHOC.displayName = `Connector ${Component.displayName ||
  Component.name || 'Component'}`

  return RenderChildrenHOC
}
