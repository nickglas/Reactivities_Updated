import React, { Fragment } from 'react'
import { toast } from 'react-toastify'
import { Button, Header, Icon, Segment } from 'semantic-ui-react'
import agent from '../../app/api/agent'
import useQuery from '../../app/common/util/hooks'

const RegisterSuccess = () => {
  const email = useQuery().get('email') as string

  function handleConfirmEmailResend(){
    agent.Account.resendEmailConfirm(email).then(() => {
      toast.success('Verification email resent - please check your email')
    }).catch((error) => console.log(error))
  }

  return (
    <Segment placeholder textAlign='center'>
      <Header icon color='green'> 
        <Icon name='check'/>
        Succesfully registered!
      </Header>
      <p>Please check your email (including junk email) for the verification email</p>
      {email &&
        <Fragment>
          <p>Didn't receive the email? Click the button to resend the email</p>
          <Button primary onClick={handleConfirmEmailResend} content='Resend email' size='huge' />
        </Fragment>
      }
    </Segment>
  )
}

export default RegisterSuccess
