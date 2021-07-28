import { observer } from 'mobx-react-lite'
import React from 'react'
import { TabPane, Tab } from 'semantic-ui-react'
import { Profile } from '../../app/models/profile'
import ProfilePhotos from './ProfilePhotos'

interface Props{
  profile: Profile
}

const ProfileContent = ({profile} : Props) => {
  
  const panes = [
    {menuItem : 'About', render: () => <TabPane>About content</TabPane>},
    {menuItem : 'Photos', render: () => <ProfilePhotos profile={profile}/>},
    {menuItem : 'Events', render: () => <TabPane>Events content</TabPane>},
    {menuItem : 'Followers', render: () => <TabPane>Followers content</TabPane>},
    {menuItem : 'Following', render: () => <TabPane>Following content</TabPane>},
  ]


  return (
    <Tab 
      menu={{fluid: true, vertical: true}}
      menuPosition='right'
      panes={panes}
    />
  )
}

export default observer(ProfileContent)
