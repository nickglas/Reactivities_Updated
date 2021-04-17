import React from 'react'
import { Grid } from 'semantic-ui-react'
import { Activity } from '../../../app/models/activity'
import ActivityDetails from '../details/ActivityDetails'
import ActivityForm from '../form/ActivityForm'
import ActivityList from './ActivityList'

interface Props {
  activities: Activity[]
  selectedActivity: Activity | undefined
  selectActivity: (id: string) => void
  cancelSelectActivity: () => void
  editMode: boolean
  openForm: (id: string) => void
  closeForm: () => void
  createOrdEdit: (activity: Activity) => void
  deleteActivity: (id: string) => void
}


const ActivityDashboard: React.FC<Props> = ({ activities, createOrdEdit, deleteActivity, selectActivity, selectedActivity, cancelSelectActivity, editMode, openForm, closeForm }) => {
  return (
    <Grid>
      <Grid.Column width='10'>
        <ActivityList
          activities={activities}
          selectActivity={selectActivity}
          deleteActivity={deleteActivity}
        />
      </Grid.Column>
      <Grid.Column width='6'>
        {selectedActivity && !editMode &&
          <ActivityDetails
            activity={selectedActivity}
            cancelSelectActivity={cancelSelectActivity}
            openForm={openForm}
          />
        }
        {editMode &&
          <ActivityForm closeForm={closeForm} activity={selectedActivity} createOrEdit={createOrdEdit} />}
      </Grid.Column>
    </Grid>
  )
}

export default ActivityDashboard
