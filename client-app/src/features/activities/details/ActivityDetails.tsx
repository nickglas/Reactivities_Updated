import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { Button, Card, Image } from 'semantic-ui-react'
import LoadingComponent from '../../../app/layout/LoadingComponent'
import { useStore } from '../../../app/stores/store'



const ActivityDetails = () => {
  const { activityStore } = useStore()
  const { selectedActivity: activity, loadActivity, loadingInitial } = activityStore
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    if (id) loadActivity(id)
  }, [id, loadActivity])

  if (loadingInitial && !activity) return <LoadingComponent content='Loading selected activity' />

  return (
    <Card fluid>
      <Image src={`/assets/categoryImages/${activityStore.selectedActivity?.category}.jpg`} />
      <Card.Content>
        <Card.Header>{activityStore.selectedActivity?.title}</Card.Header>
        <Card.Meta>
          <span>{activityStore.selectedActivity?.date}</span>
        </Card.Meta>
        <Card.Description>
          {activityStore.selectedActivity?.description}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths='2'>
          <Button as={Link} to={`/manage/${activity?.id}`} basic color='blue' content='Edit' />
          <Button as={Link} to='/activities' basic color='grey' content='Cancel' />
        </Button.Group>
      </Card.Content>
    </Card>
  )
}

export default observer(ActivityDetails)
