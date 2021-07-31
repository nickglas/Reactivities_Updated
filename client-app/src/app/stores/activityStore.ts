import { makeAutoObservable, runInAction } from "mobx"
import agent from "../agent"
import { Activity, ActivityFormValues } from "../models/activity"
import {format} from 'date-fns'
import { store } from "./store"
import { Profile } from "../models/profile"

export default class ActivityStore {
  activityRegistery = new Map<string, Activity>()
  selectedActivity: Activity | undefined = undefined;
  editMode = false
  loading = false
  loadingInitial = false

  constructor() {
    makeAutoObservable(this)
  }

  get activitiesByDate() {
    return Array.from(this.activityRegistery.values()).sort((a, b) =>
      a.date!.getTime() - b.date!.getTime())
  }

  get groupedActivites() {
    return Object.entries(
      this.activitiesByDate.reduce((activities, activity) => {
        const date = format(activity.date!, 'dd MMM yyyy')
        activities[date] = activities[date] ? [...activities[date], activity] : [activity]
        return activities
      }, {} as { [key: string]: Activity[] })
    )
  }

  updateActivityUser = (profile: Partial<Profile>) => {
    runInAction(() => {
      this.activityRegistery.forEach((activity: Activity, key: string) => {
        if (activity.host!.username === profile.username) {
          activity.host = {...activity.host!, ...profile}
        }
      })
    })     
  }

  updateAttendeeUser = (profile: Partial<Profile>) => {
    runInAction(() => {
      this.activityRegistery.forEach((activity: Activity, key: string) => {
        if (activity.attendees.find(x=>x.username === profile.username) !== undefined) {
          const indexer = activity.attendees.findIndex(x=>x.username === profile.username)
          const updated = {...activity.attendees.find(x=>x.username === profile.username)!, ...profile}
          activity.attendees[indexer] = updated
        }
      })
    })
  }

  loadActivites = async () => {
    this.loadingInitial = true
    try {
      const activities = await agent.Activities.list()
      activities.forEach(activity => {
        this.setActivity(activity)
      })
      this.setLoadingInitial(false)
    } catch (error) {
      console.log(error)
      this.setLoadingInitial(false)
    }
  }

  loadActivity = async (id: string) => {
    let activity = this.getActivity(id)
    if (activity) {
      this.selectedActivity = activity
      return activity
    } else {
      this.loadingInitial = true
      try {
        activity = await agent.Activities.details(id)
        this.setActivity(activity)
        runInAction(() => {
          this.selectedActivity = activity
        })
        this.setLoadingInitial(false)
        return activity
      } catch (error) {
        console.log(error)
        this.setLoadingInitial(false)
      }
    }
  }

  private setActivity(activity: Activity) {
    const user = store.userStore.user

    if (user) {
      activity.isGoing = activity.attendees!.some(
        a => a.username === user.username
      )
      activity.isHost = activity.hostUsername === user.username
      activity.host = activity.attendees?.find(x=>x.username === activity.hostUsername)
    }

    activity.date = new Date(activity.date!)
    this.activityRegistery.set(activity.id, activity)
  }

  private getActivity = (id: string) => {
    return this.activityRegistery.get(id)
  }

  setLoadingInitial = (state: boolean) => { this.loadingInitial = state }

  createActivity = async (activity: ActivityFormValues) => {
    const user = store.userStore.user
    const attendee = new Profile(user!)
    try {
      await agent.Activities.create(activity)
      const newActivity = new Activity(activity)
      newActivity.hostUsername = user!.username
      newActivity.attendees = [attendee]
      this.setActivity(newActivity)
      runInAction(() => {
        this.selectedActivity = newActivity
      })
    } catch (error) {
      console.log(error)
    }
  }

  updateActivity = async (activity: ActivityFormValues) => {
    try {
      await agent.Activities.update(activity)
      runInAction(() => {
        if (activity.id) {
          let updatedActivity = {...this.getActivity(activity.id), ...activity}
          this.activityRegistery.set(activity.id, updatedActivity as Activity)
          this.selectedActivity = updatedActivity as Activity
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  deleteActivity = async (id: string) => {
    this.loading = true
    try {
      await agent.Activities.delete(id)
      runInAction(() => {
        this.activityRegistery.delete(id)
        this.loading = false
      })
    } catch (error) {
      console.log(error)
      runInAction(() => {
        this.loading = false
      })
    }
  }

  updateAttenance = async () => {
    const user = store.userStore.user
    this.loading = true

    try {
      await agent.Activities.attend(this.selectedActivity!.id)
      runInAction(() => {
        if (this.selectedActivity?.isGoing) {
          this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(a => a.username !== user?.username)
          this.selectedActivity.isGoing = false
        }else{
          const attendee = new Profile(user!)
          this.selectedActivity?.attendees?.push(attendee)
          this.selectedActivity!.isGoing = true
        }
        this.activityRegistery.set(this.selectedActivity!.id, this.selectedActivity!)
      })
    } catch (error) {
      console.warn(error)
    }
    finally{
      runInAction(() => this.loading = false)
    }
  }

  cancelActivity = async () =>{
    this.loading = true
    try {
      await agent.Activities.attend(this.selectedActivity!.id)
      runInAction(()=>{
        this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled
        this.activityRegistery.set(this.selectedActivity!.id, this.selectedActivity!)
      })
    } catch (error) {
      console.warn(error)
    }
    finally{
      runInAction(() => {
        this.loading = false
      })
    }
  }

  clearSelectedActivity = () => {
    this.selectedActivity = undefined
  }

}