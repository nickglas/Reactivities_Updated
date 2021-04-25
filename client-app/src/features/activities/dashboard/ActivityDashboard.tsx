import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { Grid } from 'semantic-ui-react'
import LoadingComponent from '../../../app/layout/LoadingComponent'
import { useStore } from '../../../app/stores/store'
import ActivityList from './ActivityList'



const ActivityDashboard = () => {

  const { activityStore } = useStore()
  const { activityRegistery } = activityStore

  useEffect(() => {
    if (activityRegistery.size <= 1) activityStore.loadActivites()
  }, [activityStore, activityRegistery])

  if (activityStore.loadingInitial) {
    return <LoadingComponent inverted={true} content={'Loading activities'} />
  }


  return (
    <Grid>
      <Grid.Column width='10'>
        <ActivityList />
      </Grid.Column>
      <Grid.Column width='6'>
        <h2>Activity filters</h2>
      </Grid.Column>
    </Grid>
  )
}

export default observer(ActivityDashboard)
