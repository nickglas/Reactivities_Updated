import { observer } from 'mobx-react-lite'
import React, { Fragment, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Grid } from 'semantic-ui-react'
import LoadingComponent from '../../app/layout/LoadingComponent'
import { useStore } from '../../app/stores/store'
import ProfileContent from './ProfileContent'
import ProfileHeader from './ProfileHeader'

const ProfilePage = () => {

  const {username} = useParams<{username: string}>()
  const {profileStore} = useStore()
  const {loadProfile, loadingProfile, profile} = profileStore

  useEffect(() => {
    loadProfile(username)
  },[loadProfile, username])

  if (loadingProfile) return <LoadingComponent content='Loading profile...'/>

  return (
    <Grid>
      <Grid.Column width={16}>
        {profile && 
        <Fragment>
          <ProfileHeader profile={profile}/>
          <ProfileContent profile={profile}/>
        </Fragment>
        }
      </Grid.Column>
    </Grid>
  )
}

export default observer(ProfilePage)
