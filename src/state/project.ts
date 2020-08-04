import { Project, ProjectStatus } from '../models/project.js'

// namespace App {
  type Listener<T> = (items: T[]) => void
    
  class State<T> {
    protected listeners: Listener<T>[] = []
  
    addListener(listenerFn: Listener<T>) {
      this.listeners.push(listenerFn)
    }
  }
  
  export class ProjectState extends State<Project> {
    // private listeners: Listener[] = []
    private projects: Project[] = []
    private static instance: ProjectState
  
    private constructor() {
      super()
    }
  
    static getInstance() {
      if (this.instance) {
        return this.instance
      }
      this.instance = new ProjectState()
      return this.instance
    }
  
    // addListener(listenerFn: Listener) {
    //   this.listeners.push(listenerFn)
    // }
  
    addProject(title: string, desc: string, numOfPeople: number) {
      const newProject = new Project(Math.random().toString(), title, desc, numOfPeople, ProjectStatus.Active)
      // {
      //   id: Math.random().toString(),
      //   title,
      //   description: desc,
      //   people: numOfPeople
      // }
      this.projects.push(newProject)
  
      // for (const listenerFn of this.listeners) {
      //   listenerFn(this.projects.slice())
      // }
      this.updateListeners()
    }
  
    moveProject(projectId: string, newStatus: ProjectStatus) {
      const project = this.projects.find(prj => prj.id === projectId)
      if (project && project.status !== newStatus) {
        project.status = newStatus
      }
      this.updateListeners()
    }
  
    private updateListeners() {
      for (const listenerFn of this.listeners) {
        listenerFn(this.projects.slice())
      }
    }
  }
  
  export const projectState = ProjectState.getInstance()
    
// }
