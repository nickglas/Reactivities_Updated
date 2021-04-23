import { Fragment, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

const App = () => {

  const { activityStore } = useStore()

  useEffect(() => {
    activityStore.loadActivites()
  }, [activityStore])

  if (activityStore.loadingInitial) {
    return <LoadingComponent inverted={true} content={'Loading activities'} />
  }

  return (
    <Fragment>
      <NavBar />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard />
      </Container>
    </Fragment>
  );
}

export default observer(App);