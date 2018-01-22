// @flow
import React from 'react'
import Modal from 'react-modal'
import autobind from 'class-autobind'
import CompaniesCreateReduxForm from '../Forms/CompaniesCreateForm'
import Loader from '../../../components/Loader/index'
import Error from '../../../components/Error/index'
import PermissionWrapper from '../../../containers/PermissionWrapper'

import { connect } from 'react-redux'

import * as actions from '../../../redux/actions/companies'

type CompaniesCreateModalType = {
  error: Object,
  countries: Array<Object>,
  statusForm: string,
  modalOpen: boolean,
  createCompany: Function,
  createCompanyResetError: Function,
  createCompanyModalSetOpen: Function
};

class CompaniesCreateModal extends React.Component {
  props: CompaniesCreateModalType

  constructor (props: CompaniesCreateModalType) {
    super(props)
    autobind(this)
  }

  componentWillReceiveProps (nextProps: Object) {
    if (nextProps.statusForm === 'COMPLETE') {
      this.closeModal()
    }
  }

  openModal () {
    this.props.createCompanyModalSetOpen(true)
  }

  closeModal () {
    this.props.createCompanyModalSetOpen(false)
  }

  submitForm () {
    this.refs.createCompany.submit()
  }

  closeError (e: Event) {
    e.preventDefault()
    this.props.createCompanyResetError()
  }

  onFormSubmit (data: Object) {
    this.props.createCompany(data)
  }

  render (): React$Element<*> {
    const {statusForm, error, modalOpen, countries} = this.props

    return (
      <div>
        <div className='companies-create'>
          <div className='row'>
            <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
              <h1 className='page-title txt-color-blueDark'>
                <i className='fa-fw fa fa-info' />&nbsp;
                Company Info
              </h1>
            </div>

            <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6 text-align-right'>
              <PermissionWrapper forceRender privileges={{company: ['create']}}>
                <button className='btn btn-primary' key='create-company' onClick={this.openModal}>
                  Add new info page
                </button>
              </PermissionWrapper>
            </div>
          </div>
        </div>
        <Modal 
          className='Modal__Bootstrap modal-dialog'
          contentLabel='create-company-modal'
          id='create-company'
          closeTimeoutMS={150}
          isOpen={modalOpen}
          onRequestClose={this.closeModal}
        >
          {statusForm === 'FETCH' &&
          <Loader />}
          <div className='modal-content'>
            <div className='modal-header'>
              <button type='button' className='close' onClick={this.closeModal}>
                <span aria-hidden='true'>&times;</span>
                <span className='sr-only'>Close</span>
              </button>
              <h4 className='modal-title'>New company info page</h4>
            </div>

            <div className='modal-body' style={{padding: '0'}}>
              <CompaniesCreateReduxForm ref='createCompany'
                countries={countries}
                onSubmit={this.onFormSubmit} />
            </div>

            <div className='modal-footer'>
              <button type='button' className='btn btn-default'
                onClick={this.closeModal}>Close
              </button>

              <PermissionWrapper privileges={{company: ['create']}}>
                <button type='button' className='btn btn-primary' onClick={this.submitForm}>
                  Submit
                </button>
              </PermissionWrapper>
            </div>
          </div>
          {statusForm === 'FAIL' &&
          <Error text={error} onClose={this.closeError} />}
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state: Object): Object => ({
  statusForm: state.companies.get('createCompany').get('status'),
  error: state.companies.get('createCompany').get('error'),
  modalOpen: state.companies.get('createCompany').get('modalOpen')
})

const mapDispatchToProps = (dispatch: Function): Object => ({
  createCompany: (data: Object) => {
    dispatch(actions.createCompany(data))
  },
  createCompanyResetError: () => {
    dispatch(actions.createCompanyResetError())
  },
  createCompanyModalSetOpen: (modalOpen: boolean) => {
    dispatch(actions.createCompanyModalSetOpen(modalOpen))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(CompaniesCreateModal)
