import { makeAutoObservable, runInAction } from "mobx";
import { history } from "../..";
import agent from "../agent";
import { User, UserFormValues } from "../models/user";
import { store } from "./store";

export default class UserStore{
  user: User | null = null

  constructor() {
    makeAutoObservable(this)
  }

  get isLoggedIn(){
    return !!this.user
  }

  login = async (creds: UserFormValues) => {
    try {
      const user = await agent.Account.login(creds)
      store.commonStore.setToken(user.token)
      runInAction(() => this.user = user)
      history.push('/activities')
      store.modalStore.closeModal()
    } catch (error) {
      throw error
    }
  }

  logout = () => {
    this.user = null
    store.commonStore.token = null
    window.localStorage.removeItem('jwt')
    history.push('/')
  }

  getUser = async() => {
    try {
      const user = await agent.Account.current()
      runInAction(() => this.user = user)
    } catch (error) {
      console.warn(error)
    }
  }

  register = async(creds: UserFormValues) =>{
    try {
      const user = await agent.Account.register(creds)
      store.commonStore.setToken(user.token)
      runInAction(() => this.user = user)
      history.push('/activities')
      store.modalStore.closeModal()
    } catch (error) {
      throw error
    }
  }

}