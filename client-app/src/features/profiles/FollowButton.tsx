import { observer } from 'mobx-react-lite'
import React, { SyntheticEvent } from 'react'
import { Reveal, Button } from 'semantic-ui-react'
import { Profile } from '../../app/models/profile'
import { useStore } from '../../app/stores/store'

interface Props{
  profile: Profile
}

const FollowButton = ({profile}: Props) => {

  const {profileStore: {updateFollowing, loading}, userStore} = useStore()

  if (userStore.user?.username === profile.username) {
    return null
  }

  function handleFollow(event: SyntheticEvent, username: string){
    event.preventDefault()
    profile.following ? updateFollowing(username,false) : updateFollowing(username,true)
  }

  return (
    <Reveal animated='move'>
      <Reveal.Content visible style={{width: '100%'}}>
        <Button 
          fluid 
          color='teal' 
          content= {profile.following ? 'Following' : 'Not following'} 
        />
        
      </Reveal.Content>
      <Reveal.Content hidden style={{width: '100%'}}>
        <Button fluid
          basic 
          color=  {profile.following ? 'red' : 'green'}
          content= {profile.following ? 'Unfollow' : 'Follow'} 
          loading={loading}
          onClick={(e) => handleFollow(e, profile.username)}
        />
      </Reveal.Content>
  </Reveal>
  )
}

export default observer(FollowButton)
