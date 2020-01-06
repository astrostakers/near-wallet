import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { validateEmail } from '../../utils/account';
import SetRecoveryMethod from './SetRecoveryMethod';
import SetRecoveryMethodSuccess from  './SetRecoveryMethodSuccess';
import AccountSkipThisStep from '../common/AccountSkipThisStep';
import Disclaimer from '../common/Disclaimer';
import {
    requestCode,
    setupAccountRecovery,
    redirectToApp,
    clear,
    clearCode
} from '../../actions/account';

const Container = styled.div`
    form {
        max-width: 500px;

        h4 {
            margin-bottom: 0 !important;
    
            @media (max-width: 767px) {
                font-size: 14px !important;
            }
        }

        .email-input-wrapper {
            width: 100%;
        }

        .react-phone-number-input {
            position: relative;
        }

        .react-phone-number-input__country {
            position: absolute;
            top: 24px;
            right: 12px;
            z-index: 1;
        }

        .react-phone-number-input__country-select-arrow {
            display: none;
        }
    }

    input {
        border-radius: 3px;
    }

    h2 {
        color: #4a4f54 !important;
        margin: -20px 0 20px 0;

        @media (max-width: 767px) {
            margin: -10px 0 10px 0;
            font-size: 14px !important;
        }
    }

    .link {
        display: inline-block;
        margin-top: 10px;
    }

    .button {
        display: block;
    }

    .grid {
        margin: 0;

        @media (max-width: 767px) {
            .disclaimer {
                margin: 50px 0 0 0;
            }
        }
    }
`;

class SetRecoveryMethodContainer extends Component {

    state = {
        loader: false,
        phoneNumber: '',
        email: '',
        validEmail: false,
        isLegit: false,
        recoverWithEmail: true
    }

    componentWillUnmount = () => {
        this.props.clear();
        this.props.clearCode();
    }

    handlePhoneChange = (e, { name, value }) => {
        this.setState(() => ({
            [name]: value,
            isLegit: this.isLegitField(name, value)
        }))
    }

    handleToggleRecoverMethod = () => {
        this.setState(prevState => ({
            recoverWithEmail: !prevState.recoverWithEmail
        }));
    }

    isLegitField = (name, value) => {
        let validators = {
            phoneNumber: isValidPhoneNumber,
            securityCode: value => !!value.trim().match(/^\d{6}$/)
        }
        return validators[name](value);
    }

    handleSubmitRecoverMethod = () => {

        this.setState({ loader: true }, () => {
            if (!this.props.sentMessage) {
                // Send magic link to email/phone
                // Set this.props.sentMessage to true
            }
        });
    }

    handleEmailChange = (e) => {
        let value = e.target.value;
        this.setState({
            email: value,
            validEmail: validateEmail(value)
        });
    }

    handleEnterNewRecoverValue = () => {
        /* TODO: Set this.props.sentMessage to false */
        this.setState({
            email: '',
            phoneNumber: '',
        });
    }

    skipRecoverySetup = () => {
        let nextUrl = `/setup-seed-phrase/${this.props.accountId}`;
        this.props.history.push(nextUrl);
    }

    render() {
        const combinedState = {
            ...this.props,
            ...this.state,
            isLegit: this.state.isLegit && !this.props.formLoader
        }

        const { sentMessage, redirectToApp } = this.props;

        return (
            <Container className='ui container'>
                {!sentMessage &&
                    <>
                        <SetRecoveryMethod
                            {...combinedState}
                            toggleRecoverMethod={this.handleToggleRecoverMethod}
                            handlePhoneChange={this.handlePhoneChange}
                            handleEmailChange={this.handleEmailChange}
                            submitRecovery={this.handleSubmitRecoverMethod}
                        />
                        <AccountSkipThisStep skipRecoverySetup={this.skipRecoverySetup} />

                    </>
                }
                {sentMessage &&
                    <SetRecoveryMethodSuccess
                        {...combinedState}
                        handleConfirmMessageReceived={redirectToApp}
                        handleEnterNewRecoverValue={this.handleEnterNewRecoverValue}
                    />
                }
                <Disclaimer/>
            </Container>
        )
    }
}

const mapDispatchToProps = {
    requestCode,
    setupAccountRecovery,
    redirectToApp,
    clear,
    clearCode
}

const mapStateToProps = ({ account }, { match }) => ({
    ...account,
    accountId: match.params.accountId
})

export const SetRecoveryMethodContainerWithRouter = connect(mapStateToProps, mapDispatchToProps)(SetRecoveryMethodContainer);