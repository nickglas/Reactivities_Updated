import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { Grid } from 'semantic-ui-react'
import LoadingComponent from '../../../app/layout/LoadingComponent'
import { useStore } from '../../../app/stores/store'
import ActivityFilters from './ActivityFilters'
import ActivityList from './ActivityList'



const ActivityDashboard = () => {

  const { activityStore } = useStore()
  const { loadActivites, activityRegistery } = activityStore

  useEffect(() => {
    if (activityRegistery.size === 0) loadActivites()
  }, [loadActivites, activityStore, activityRegistery])

  if (activityStore.loadingInitial) {
    return <LoadingComponent inverted={true} content={'Loading activities'} />
  }


  return (
    <Grid>
      <Grid.Column width='10'>
        <ActivityList />
      </Grid.Column>
      <Grid.Column width='6'>
        <ActivityFilters />
      </Grid.Column>
    </Grid>
  )
}

export default observer(ActivityDashboard)
