import { Fragment } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, useLocation } from 'react-router';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import TestErrors from '../../features/errors/testError';
import { ToastContainer } from 'react-toastify';
import serverError from '../../features/errors/serverError';
import notFound from '../../features/errors/notFound';
import { Switch } from 'react-router-dom';
import LoginForm from '../../features/users/LoginForm';
import { useStore } from '../stores/store';
import { useEffect } from 'react';
import LoadingComponent from './LoadingComponent';
import ModalContainer from '../common/modals/ModalContainer';
import ProfilePage from '../../features/profiles/ProfilePage';

const App = () => {

  const location = useLocation()
  const {commonStore, userStore} = useStore()

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded())
    }else{
      commonStore.setAppLoaded()
    }
  }, [commonStore,userStore])

  if (!commonStore.appLoaded) return <LoadingComponent content='Loading app...'/>

  return (
    <Fragment>
      <ToastContainer position='bottom-right' hideProgressBar/>
      <ModalContainer/>

      <Route exact path='/' component={HomePage} />
      <Route path={'/(.+)'}
        render={() => (
          <Fragment>
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
              <Switch>
                <Route exact path='/activities' component={ActivityDashboard} />
                <Route path='/activities/:id' component={ActivityDetails} />
                <Route key={location.key} path={['/createActivity', '/manage/:id']} component={ActivityForm} />
                <Route path='/profiles/:username' component={ProfilePage}/>
                <Route path='/errors' component={TestErrors}/>
                <Route path='/server-error' component={serverError}/>
                <Route path='/login' component={LoginForm}/>
                <Route component={notFound}/>
              </Switch>
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
}

export default observer(App);
