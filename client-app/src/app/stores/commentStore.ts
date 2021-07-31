import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import { ChatComment } from "../models/comment";
import { store } from "./store";

export default class commentStore{

  comments: ChatComment[] = []
  hubConnection: HubConnection | null = null
  loading: boolean = false

  constructor(){
    makeAutoObservable(this)
  }

  createHubConnection = (activityId: string) => {
    if (store.activityStore.selectedActivity) {
      this.hubConnection = new HubConnectionBuilder()
        .withUrl('https://localhost:5001/chat?activityId=' + activityId,{
          accessTokenFactory: () => store.userStore.user?.token!
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build()

        this.hubConnection.start().catch(error => console.warn('Error creating chat connection: ' + error))
        this.hubConnection.on('LoadComments', (comments: ChatComment[]) => {
          runInAction(() => {
            comments.forEach(comment => {
              comment.createdAt = new Date(comment.createdAt + 'Z')
            })
            this.comments = comments
          })
        })

        this.hubConnection.on('ReceiveComment', (comment: ChatComment) => {
          runInAction(() =>{
            comment.createdAt = new Date(comment.createdAt)
            this.comments.unshift(comment)
          })
        })
    }
  }

  stopHubConnection = () =>{
    this.hubConnection?.stop().catch(error => console.warn("Error stopping the connection: " + error))
  }

  clearComments = () => {
    this.comments = []
    this.stopHubConnection()
  }

  addComment = async (comment: any) => {
    comment.activityId = store.activityStore.selectedActivity?.id
    try {
      await this.hubConnection?.invoke('SendComment', comment)
    } catch (error) {
      console.warn("error submitting comment" , error)
    }
  }
}