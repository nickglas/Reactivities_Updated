import React, { useState } from 'react'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { Button, Header, Icon, Segment } from 'semantic-ui-react'
import agent from '../../app/api/agent'
import useQuery from '../../app/common/util/hooks'
import { useStore } from '../../app/stores/store'
import LoginForm from './LoginForm'

const ConfirmEmail = () => {

  const {modalStore} = useStore()
  const email = useQuery().get('email') as string
  const token = useQuery().get('token') as string

  const Status = {
    Verifying: 'Verifying',
    Failed: 'Failed',
    Succes: 'Success'
  }

  const [status, setStatus] = useState(Status.Verifying)

  function handleConfirmEmailResend(){
    agent.Account.resendEmailConfirm(email).then(() => {
      toast.success('Verification email resent - please check your email')
    }).catch((error) => console.log(error))
  }

  useEffect(() => {
    agent.Account.verifyEmail(token,email).then(() => {
      setStatus(Status.Succes)
    }).catch(() => {
      setStatus(Status.Failed)
    })
  },[Status.Failed, Status.Succes, token, email])

  function getBody(){
    switch (status) {
      case Status.Verifying:
        return <p>Verifying...</p>
      case Status.Failed:
        return(
        <div>
          <p>Verification failed. You can try resending the verify link to your email</p>
          <Button primary onClick={handleConfirmEmailResend} size='huge' content='Resend email' />
        </div>
        )
      case Status.Succes:
          return(
            <div>
              <p> Email has been verified. You can now log in! </p>
              <Button primary onClick={() => modalStore.openModal(<LoginForm/>)} content='Login' size='huge' />
            </div>
          )
    }
  }

  return (
    <Segment placeholder textAlign='center'>
      <Header icon>
        <Icon name='envelope'/>
        Email verification
      </Header>
      <Segment.Inline>
        {getBody()}
      </Segment.Inline>
    </Segment>
  )
}

export default ConfirmEmail
