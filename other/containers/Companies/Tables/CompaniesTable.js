// @flow
import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { connect } from 'react-redux'

import Jarviswidget from '../../../components/Jarviswidget'
import Table from '../../../components/FixedDataTable/clientSideTable'
import confirmModal from '../../../components/ConfirmModal/index'
import autobind from 'class-autobind'
import CompaniesCreateModal from '../Modals/CompaniesCreateModal'
import CompaniesEditModal from '../Modals/CompaniesEditModal'

import * as CommonHelper from '../../../helpers/Common'
import * as Country from '../../../helpers/Country'

import * as actions from '../../../redux/actions/companies'
import * as tableActions from '../../../redux/actions/table'

class CompaniesTable extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    aliases: PropTypes.object,
    error: PropTypes.object,
    isFetching: PropTypes.bool,
    selected: PropTypes.array,
    fetch: PropTypes.func,
    modalOpen: PropTypes.bool,
    table: PropTypes.object,
    changeTableFetch: PropTypes.func,
    selectCompanies: PropTypes.func,
    deleteCompany: PropTypes.func,
    editCompanyModalSetOpen: PropTypes.func,
    setCompanyInitialValues: PropTypes.func
  }

  constructor (props: Object) {
    super(props)
    autobind(this)
  }

  onBtnClick (button, data, skip, sort) {
    switch (button) {
      case 'deleteCompany':
        confirmModal('Are you sure you want to delete company info?')
          .then(
            () => {
              this.props.deleteCompany([data.company_id],
                {type: 'getCompanies', params: {skip, sort}})
            }
          )
        break
      case 'editCompany':
        this.props.editCompanyModalSetOpen(true)
        this.props.setCompanyInitialValues(data.company_id)
        break
      default:
    }
  }

  deleteSelectedCompanies (ids: Array<number>, skip, sort) {
    confirmModal('Are you sure you want to delete selected company info ?')
      .then(
        () => {
          this.props.deleteCompany(ids,
            {type: 'getCompanies', params: {skip, sort}})
        }
      )
  }

  render (): any {
    const {
      data, aliases, table, selected,
      selectCompanies,
      changeTableFetch,
      modalOpen
    } = this.props

    const isFetching = this.props.isFetching || aliases.isFetching
    const error = this.props.error || aliases.error

    const clientTableData = CommonHelper.getClientTableData(data.items, table)
    const countries = Country.getAllCountries()

    const enabledColumns = table ? table.columns : ['company_id', 'saved_by', 'name', 'owner',
      'country', 'address', 'city',
      'state', 'zip', 'actions']

    let sort = _.get(table, 'server.sort', 'company_id DESC')
    let filter = _.get(table, 'server.where', {})

    let companyFilters = {
      saved_by: {
        values: _.get(aliases, 'data.manager', {}),
        filterType: 'SELECT',
        multi: true
      },
      country: {
        values: Country.getCountryFilterValues(),
        filterType: 'SELECT',
        multi: true
      }
    }

    const filterData = CommonHelper.getFilters(companyFilters, filter)

    const tableProps = {
      data: clientTableData,
      autoServerCall: true,
      fetch: this.props.fetch,
      checkboxColumns: true
    }

    return (
      <div className='companies'>
        <CompaniesCreateModal
          countries={countries} />
        <div className='companies-table'>
          <div className='row'>
            <div className='col-xs-12'>
              <Jarviswidget title='Company Info' icon='table'
                bodyClassName='no-padding table-widget'
                style={{overflowX: 'hidden'}}>
                {modalOpen ? <CompaniesEditModal
                  countries={countries} /> : null}
                <Table
                  {...tableProps}
                  height={40}
                  initialSort={sort}
                  initialFilter={filter}
                  filterData={filterData}
                  select={selectCompanies}
                  selected={selected}
                  onBtnClick={this.onBtnClick}
                  changeTableFetch={changeTableFetch}
                  error={error}
                  isFetching={isFetching}
                  footerAction={this.deleteSelectedCompanies}
                  footerActionBtn={{
                    btnName: 'Delete selected company info',
                    btnColor: 'danger',
                    privileges: {company: ['delete']}
                  }}
                  className='companies-table__table'
                  enabledColumns={enabledColumns}
                  idAlias='company_id'
                  allColumns={[
                    {
                      columnName: 'company_id',
                      displayName: 'ID',
                      qFilter: 'number'
                    },
                    {
                      columnName: 'saved_by',
                      displayName: 'Owner',
                      qFilter: 'SELECT',
                      customRenderCell: (cell) => {
                        return CommonHelper.getAliasNameById(aliases.data, 'manager', cell)
                      }
                    },
                    {columnName: 'name', displayName: 'Company name'},
                    {columnName: 'owner', displayName: 'Company owner name'},
                    {
                      columnName: 'country',
                      displayName: 'Company country',
                      qFilter: 'STRINGSELECT',
                      customRenderCell: (cell) => {
                        return Country.getCountryNameByCode(cell)
                      },
                      prepareFilterColumnValue: (item) => {
                        return Country.getCountryNameByCode(item.country)
                      }
                    },
                    {columnName: 'address', displayName: 'Company address'},
                    {
                      columnName: 'city',
                      displayName: 'City'
                    },
                    {
                      columnName: 'state',
                      displayName: 'State'
                    },
                    {
                      columnName: 'zip',
                      displayName: 'Zip'
                    },
                    {
                      columnName: 'actions',
                      displayName: 'Actions',
                      isSortable: false,
                      buttons: [
                        {
                          buttonName: 'Edit',
                          buttonColor: 'primary',
                          action: 'editCompany',
                          privileges: {company: ['update']}
                        },
                        {
                          buttonName: 'Delete',
                          buttonColor: 'danger',
                          action: 'deleteCompany',
                          privileges: {company: ['delete']}
                        }
                      ]
                    }
                  ]}
                />
              </Jarviswidget>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

CompaniesTable.contextTypes = {
  router: React.PropTypes.object
}

function mapStateToProps (state: Object): Object {
  return {
    data: state.companies.get('companies').get('data'),
    aliases: state.common.get('aliases').toJS(),
    selected: state.companies.get('companies').get('selected'),
    error: state.companies.get('companies').get('error'),
    isFetching: state.companies.getIn(['companies', 'isFetching']),
    modalOpen: state.companies.get('editCompany').get('modalOpen'),
    table: state.table.get('companies')
  }
}

function mapDispatchToProps (dispatch: Function): Object {
  return {
    fetch: (query: Object) => {
      dispatch(actions.getCompanies(query))
    },
    selectCompanies: (ids: Array<number>) => {
      dispatch(actions.selectCompanies(ids))
    },
    deleteCompany: (id: number, afterSuccess: Object) => {
      dispatch(actions.deleteCompany(id, afterSuccess))
    },
    editCompanyModalSetOpen: (modalOpen: boolean) => {
      dispatch(actions.editCompanyModalSetOpen(modalOpen))
    },
    setCompanyInitialValues: (companyId: number) => {
      dispatch(actions.setCompanyInitialValues(companyId))
    },
    changeTableFetch: (query: Object, params: Object, columns: Array<string>) => {
      dispatch(tableActions.changeTableFetch('companies', query, columns, params))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompaniesTable)
