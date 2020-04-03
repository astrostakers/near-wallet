import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Translate } from 'react-localize-redux'
import { withRouter } from 'react-router-dom'

import { getAccessKeys, getTransactions } from '../../actions/account'

import DashboardSection from './DashboardSection'
import DashboardActivity from './DashboardActivity'
import PageContainer from '../common/PageContainer'
import FormButton from '../common/FormButton'
import Balance from '../common/Balance'

import activityGreyImage from '../../images/icon-activity-grey.svg'
import AuthorizedGreyImage from '../../images/icon-authorized-grey.svg'
import AccessKeysIcon from '../../images/icon-keys-grey.svg'

import DashboardKeys from './DashboardKeys'

class DashboardDetail extends Component {
    state = {
        loader: false,
        notice: false
    }

    componentDidMount() {
        this.refreshAccessKeys()
        this.refreshTransactions()

        this.setState(() => ({
            loader: true
        }))
    }

    refreshTransactions() {
        this.props.getTransactions()
    }

    refreshAccessKeys = () => {
        this.setState(() => ({
            loader: true
        }))

        this.props.getAccessKeys().then(() => {
            this.setState(() => ({
                loader: false
            }))
        })
    }

    handleNotice = () => {
        this.setState(state => ({
            notice: !state.notice
        }))
    }

    render() {
        const { loader, notice } = this.state
        const { authorizedApps, fullAccessKeys, transactions, amount, accountId } = this.props
        return (
            <PageContainer
                title={(
                    amount
                        ? <Fragment>
                            <span className='balance'><Translate id='balance.balance' />: </span>
                            <Balance amount={amount} />
                        </Fragment>
                        : <Translate id='balance.balanceLoading' />
                )}
                additional={(
                    <Link to='/send-money'>
                        <FormButton color='green-white-arrow' >
                            <Translate id='button.send' />
                        </FormButton>
                    </Link>
                )}
            >
                <DashboardSection
                    notice={notice}
                    handleNotice={this.handleNotice}
                >
                    <DashboardActivity
                        loader={loader}
                        image={activityGreyImage}
                        title=<Translate id='dashboard.activity' />
                        to={`${process.env.EXPLORER_URL || 'https://explorer.nearprotocol.com'}/accounts/${accountId}`}
                        transactions={transactions}
                        maxItems={5}
                        accountId={accountId}
                    />
                    <DashboardKeys
                        image={AuthorizedGreyImage}
                        title=<Translate id='authorizedApps.pageTitle' />
                        to='/authorized-apps'
                        empty=<Translate id='authorizedApps.dashboardNoApps' />
                        accessKeys={authorizedApps}
                    />
                    <DashboardKeys
                        image={AccessKeysIcon}
                        title=<Translate id='fullAccessKeys.pageTitle' />
                        to='/full-access-keys'
                        empty=<Translate id='fullAccessKeys.dashboardNoKeys' />
                        accessKeys={fullAccessKeys}
                    />
                </DashboardSection>
            </PageContainer>
        )
    }
}

const mapDispatchToProps = {
    getAccessKeys,
    getTransactions
}

// make sure that an action is an object, for UI purpose
const postprocessSerdeStruct = (action) => typeof action == 'object' ? [action] : [{[action]: {}}]

const mapStateToProps = ({ account }) => {
    const transactions = account.transactions 
        ? account.transactions.flatMap(t => t.actions.map((a) => ({
            ...t,
            action: postprocessSerdeStruct(a)
        })))
        : []

    return {
        ...account,
        authorizedApps: account.authorizedApps,
        fullAccessKeys: account.fullAccessKeys,
        transactions
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(DashboardDetail))
