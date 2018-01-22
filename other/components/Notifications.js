// @flow
import React, { Component } from 'react'
import autobind from 'class-autobind'
import PropTypes from 'prop-types'

import Alert from '../components/Alert'
import Loader from '../components/Loader/index'

class Notifications extends Component {
  /**
   * @class Notifications
   * @classdesc Notifications
   * @memberOf Components
   * @param {Object} props
   * @param {Object} props.notificationsData - data
   * @param {Object} props.isFetching - isFetching data
   * @param {Object} props.error - error
   */

  constructor (props: Object) {
    super(props)
    autobind(this)
  }

  render () {
    let {
      notificationsData,
      isFetching,
      error
    } = this.props

    if (error) {
      return <Alert text={error.statusText} level='danger' icon='times' />
    }

    if (isFetching) {
      return (<Loader />)
    }

    return (
      <div className='notifications alert alert-danger'>
        <div className='row'>
          <div className='col-sm-12'>
            {notificationsData.map((item: Object, key: number) => (
              <NotificationsItem
                item={item}
                key={`notifications__item-component-${item.text}-${key}`}
                markAsRead={this.props.markAsRead}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }
}

class NotificationsItem extends Component {
  constructor (props: Object) {
    super(props)
    autobind(this)

    this.state = {
      active: true
    }
  }

  onBtnClick (eventId: number) {
    this.setState({
      active: !this.state.active
    }, () => {
      this.props.markAsRead(eventId)
    })
  }

  onLinkClick () {
    let {brand, deal} = this.props.item
    this.context.router.push(`/brands/${brand}/deals/${deal}`)
  }

  render () {
    let {item} = this.props

    let className = this.state.active ? '' : 'notifications__item--hidden'

    let text = item.text

    if (~text.indexOf('{DEAL_LINK_PLACEHOLDER}')) {
      let firstPart = text.slice(0, text.indexOf('{DEAL_LINK_PLACEHOLDER}'))
      firstPart = firstPart.slice(0, firstPart.lastIndexOf('.') + 1)
      let secondPart = text.slice(text.indexOf('{DEAL_LINK_PLACEHOLDER}') + '{DEAL_LINK_PLACEHOLDER}'.length)

      text = <span>{firstPart}
        <a href='javascript: void(0);' className='btn-link' id='btn-link-custom' onClick={this.onLinkClick}>
          <span> Look here {secondPart}</span>
        </a>
      </span>
    }

    return (
      <div className={`notifications__item ${className}`}>
        <i className='fa-fw fa fa-info' />
        <strong>Info! </strong>
        {text}

        <button className='close'
          onClick={() => this.onBtnClick(item.event_id)}>×
        </button>
      </div>
    )
  }
}

NotificationsItem.contextTypes = {
  router: PropTypes.object
}

Notifications.propTypes = {
  notificationsData: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.object,
  markAsRead: PropTypes.func.isRequired
}

export default Notifications
