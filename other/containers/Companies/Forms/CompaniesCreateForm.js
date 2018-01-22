// @flow
import { reduxForm } from 'redux-form'
import validForm from '../../../helpers/validate'
import CompaniesForm from './CompaniesForm'

const validConfig = [
  {name: 'name', validators: [{name: 'isRequired'}, {name: 'minLength'}]},
  {name: 'owner', validators: [{name: 'isRequired'}, {name: 'minLength'}]},
  {name: 'country', validators: [{name: 'isRequired'}]},
  {name: 'address', validators: [{name: 'isRequired'}, {name: 'minLength'}]},
  {name: 'city', validators: [{name: 'isRequired'}, {name: 'minLength'}]},
  {name: 'state', validators: [{name: 'isRequired'}, {name: 'minLength'}]},
  {name: 'zip', validators: [{name: 'isRequired'}, {name: 'minLength'}]}
]

export default reduxForm({
  form: 'CompaniesCreateForm',
  enableReinitialize: true,
  validate: (values: Object): Object => {
    return validForm(validConfig, values)
  }
})(CompaniesForm)
