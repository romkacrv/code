// @flow
import React from 'react'
import autobind from 'class-autobind'
import Input from '../../../components/Input/index'
import Dropdown from '../../../components/InputDropdown/index'
import { Field } from 'redux-form'

type CompaniesFormType = {
  countries: Array<Object>
};

class CompaniesForm extends React.Component {
  constructor (props: CompaniesFormType) {
    super(props)
    autobind(this)
  }

  render (): React$Element<*> {
    let {countries} = this.props

    let disabled = this.props.disabled || false

    return (
      <form className='smart-form client-form'>
        <fieldset>
          <div className='row'>
            <div className='col col-xs-12'>
              <Field name='name'
                type='text'
                label='Company name'
                icon='edit'
                tooltip='Please enter name'
                component={Input}
                disabled={disabled}
              />
            </div>
          </div>

          <div className='row'>
            <div className='col col-xs-12'>
              <Field name='owner'
                type='text'
                label='Company owner name'
                icon='edit'
                tooltip='Please enter name'
                component={Input}
                disabled={disabled}
              />
            </div>
          </div>
          <div className='row'>
            <div className='col col-xs-12'>
              <Field name='country'
                label='Company country'
                placeholder='Please select country'
                textField='name'
                valueField='country_id'
                filter='contains'
                data={countries}
                component={Dropdown}
                disabled={disabled}
              />
            </div>
          </div>

          <div className='row'>
            <div className='col col-xs-12'>
              <Field name='address'
                type='text'
                label='Company address'
                tooltip='Please enter address'
                icon='edit'
                component={Input}
                disabled={disabled}
              />
            </div>
          </div>

          <div className='row'>
            <div className='col col-xs-12'>
              <Field name='city'
                type='text'
                label='City'
                icon='edit'
                tooltip='Please enter city'
                component={Input}
                disabled={disabled}
              />
            </div>
          </div>

          <div className='row'>
            <div className='col col-xs-12'>
              <Field name='state'
                type='text'
                label='State'
                icon='edit'
                tooltip='Please enter state'
                component={Input}
                disabled={disabled}
              />
            </div>
          </div>

          <div className='row'>
            <div className='col col-xs-12'>
              <Field name='zip'
                type='text'
                label='Zip'
                icon='edit'
                tooltip='Please enter zip'
                component={Input}
                disabled={disabled}
              />
            </div>
          </div>
        </fieldset>
      </form>
    )
  }
}

export default CompaniesForm
