// @flow
import React from 'react'
import Modal from 'react-modal'
import autobind from 'class-autobind'
import CompaniesEditForm from '../Forms/CompaniesEditForm'
import Loader from '../../../components/Loader/index'
import Error from '../../../components/Error/index'

import { connect } from 'react-redux'

import * as actions from '../../../redux/actions/companies'

type CompaniesEditModalType = {
  error: Object,
  countries: Array<Object>,
  statusForm: string,
  modalOpen: boolean,
  initialValues: Object,
  company: Object,
  editCompany: Function,
  editCompanyResetError: Function,
  editCompanyModalSetOpen: Function,
  setCompanyInitialValues: Function
};

class CompaniesEditModal extends React.Component {
  props: CompaniesEditModalType

  constructor (props: CompaniesEditModalType) {
    super(props)
    autobind(this)
  }

  componentWillReceiveProps (nextProps: Object) {
    if (nextProps.statusForm === 'COMPLETE') {
      this.closeModal()
    }
  }

  closeModal () {
    this.props.editCompanyModalSetOpen(false)
  }

  submitForm () {
    this.refs.companiesEditForm.submit()
  }

  closeError (e: Event) {
    e.preventDefault()
    this.props.editCompanyResetError()
  }

  onFormSubmit (data: Object) {
    this.props.editCompany(data)
  }

  render (): React$Element<*> {
    const {
      statusForm, error,
      initialValues, modalOpen, countries
    } = this.props

    return (
      <div>
        <Modal
          className='Modal__Bootstrap modal-dialog'
          contentLabel='edit-company-modal'
          id='edit-company'
          closeTimeoutMS={150}
          isOpen={modalOpen}
          onRequestClose={this.closeModal}>
          {statusForm === 'FETCH' && <Loader />}
          <div className='modal-content'>
            <div className='modal-header'>
              <button type='button' className='close'
                onClick={this.closeModal}>
                <span aria-hidden='true'>&times;</span>
                <span className='sr-only'>Close</span>
              </button>
              <h4 className='modal-title'>Edit company info page</h4>
            </div>
            <div className='modal-body' style={{padding: '0'}}>
              <CompaniesEditForm
                ref='companiesEditForm'
                initialValues={initialValues}
                countries={countries}
                onSubmit={this.onFormSubmit}
              />
            </div>
            <div className='modal-footer'>
              <button type='button' className='btn btn-default'
                onClick={this.closeModal}>Close
              </button>
              <button type='button' className='btn btn-primary'
                onClick={this.submitForm}>Submit
              </button>
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
  initialValues: state.companies.get('editCompany').get('data'),
  statusForm: state.companies.get('editCompany').get('status'),
  error: state.companies.get('editCompany').get('error'),
  modalOpen: state.companies.get('editCompany').get('modalOpen')
})

const mapDispatchToProps = (dispatch: Function): Object => ({
  editCompany: (data: Object) => {
    dispatch(actions.editCompany(data))
  },
  editCompanyResetError: () => {
    dispatch(actions.editCompanyResetError())
  },
  editCompanyModalSetOpen: (modalOpen: boolean) => {
    dispatch(actions.editCompanyModalSetOpen(modalOpen))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(CompaniesEditModal)
