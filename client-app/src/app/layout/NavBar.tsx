import { Button, Container, Menu } from 'semantic-ui-react'
import { useStore } from '../stores/store'



const NavBar = () => {

  const { activityStore } = useStore()
  const { openForm } = activityStore

  return (
    <div>
      <Menu inverted fixed='top'>
        <Container>
          <Menu.Item header>
            <img src="/assets/logo.png" alt="logo" style={{ marginRight: 10 }} />
            Reactivities
          </Menu.Item>
          <Menu.Item name='Activities' />
          <Menu.Item>
            <Button onClick={() => openForm()} positive content='Create activity' />
          </Menu.Item>
        </Container>
      </Menu>
    </div>
  )
}

export default NavBar
