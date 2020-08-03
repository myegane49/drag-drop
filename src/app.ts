interface Draggable {
  dragStartHandler(event: DragEvent): void
  dragEndHandler(event: DragEvent): void
}

interface DragTarget {
  dragOverHandler(event: DragEvent): void
  dropHandler(event: DragEvent): void
  dragLeaveHandler(event: DragEvent): void
}

enum ProjectStatus {Active, Finished}
class Project {
  constructor(public id: string, public title: string, public description: string, public people: number, public status: ProjectStatus) {

  }
}

type Listener<T> = (items: T[]) => void

class State<T> {
  protected listeners: Listener<T>[] = []

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn)
  }
}

class ProjectState extends State<Project> {
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

    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice())
    }
  }
}

const projectState = ProjectState.getInstance()

interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable) {
  let isValid = true
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0
  }
  if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
    isValid = isValid && validatableInput.value.length >= validatableInput.minLength
  }
  if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
    isValid = isValid && validatableInput.value.length <= validatableInput.maxLength
  }
  if (validatableInput.min != null && typeof validatableInput.value === 'number') {
    isValid = isValid && validatableInput.value >= validatableInput.min
  }
  if (validatableInput.max != null && typeof validatableInput.value === 'number') {
    isValid = isValid && validatableInput.value <= validatableInput.max
  }
  return isValid
}

function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this)
      return boundFn
    }
  }
  return adjDescriptor
}

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement
  hostElement: T
  element: U

  constructor(templateId: string, hostElementId: string, insertAtStart: boolean, newElementId?: string) {
    this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement
    this.hostElement = document.getElementById(hostElementId)! as T
    const importedNode = document.importNode(this.templateElement.content, true)
    this.element = importedNode.firstElementChild as U
    if (newElementId) {
      this.element.id = newElementId
    }

    this.attach(insertAtStart)
  }

  private attach(insertAtBegining: boolean) {
    this.hostElement.insertAdjacentElement(insertAtBegining ? 'afterbegin': 'beforeend', this.element)
  }

  // abstract configure?(): void
  abstract configure(): void
  abstract renderContent(): void;
}

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
  private project: Project

  get persons() {
    if (this.project.people === 1) {
      return '1 perosn'
    } else {
      return `${this.project.people} persons`
    }
  }

  constructor(hostId: string, project: Project) {
    super('single-project', hostId, false, project.id)
    this.project = project

    this.configure()
    this.renderContent()
  }

  @autobind
  dragStartHandler(event: DragEvent) {
    console.log(event)
  }

  dragEndHandler(_: DragEvent) {
    console.log('drag end')
  }

  configure() {
    this.element.addEventListener('dragstart', this.dragStartHandler)
    this.element.addEventListener('dragend', this.dragEndHandler)
  }

  renderContent() {
    this.element.querySelector('h2')!.textContent = this.project.title
    this.element.querySelector('h3')!.textContent = this.persons + ' assigned'
    this.element.querySelector('p')!.textContent = this.project.description
  }
}

class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  // templateElement: HTMLTemplateElement
  // hostElement: HTMLDivElement
  // element: HTMLElement
  assignedProjects: Project[]

  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', false, `${type}-projects`)
    // this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement
    // this.hostElement = document.getElementById('app')! as HTMLDivElement
    this.assignedProjects = []
    
    // const importedNode = document.importNode(this.templateElement.content, true)
    // this.element = importedNode.firstElementChild as HTMLElement
    // this.element.id = `${this.type}-projects`

    // this.attach()
    this.configure()
    this.renderContent()
  }

  configure() {
    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter(prj => {
        if (this.type === 'active') {
          return prj.status === ProjectStatus.Active
        } else {
          return prj.status === ProjectStatus.Finished
        }
      })
      this.assignedProjects = relevantProjects
      this.renderProjects()
    })
  }

  renderContent() {
    const listId = `${this.type}-projects-list`
    this.element.querySelector('ul')!.id = listId
    this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS'
  }

  private renderProjects() {
    const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement
    listEl.innerHTML = ''
    for (const prjItem of this.assignedProjects) {
      // const listItem = document.createElement('li')
      // listItem.textContent = prjItem.title
      // listEl.appendChild(listItem)

      new ProjectItem(this.element.querySelector('ul')!.id, prjItem)
    }
  }

  // private attach() {
  //   this.hostElement.insertAdjacentElement('beforeend', this.element)
  // }
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  // templateElement: HTMLTemplateElement
  // hostElement: HTMLDivElement
  // element: HTMLFormElement
  titleInputElement: HTMLInputElement
  descriptionInputElement: HTMLInputElement
  peopleInputElement: HTMLInputElement

  constructor() {
    super('project-input', 'app', true, 'user-input')
    // this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement
    // this.hostElement = document.getElementById('app')! as HTMLDivElement
    
    // const importedNode = document.importNode(this.templateElement.content, true)
    // this.element = importedNode.firstElementChild as HTMLFormElement
    // this.element.id = 'user-input'
    this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement
    this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement
    this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement

    this.configure()
    // this.attach()
  }
  
  configure() {
    // this.element.addEventListener('submit', this.submitHandler)
    // this.element.addEventListener('submit', this.submitHandler.bind(this)) // this is the workaround for the this keyword problem
    this.element.addEventListener('submit', this.submitHandler)
  }

  renderContent() {}

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value
    const enteredDescription = this.descriptionInputElement.value
    const enteredPeople = this.peopleInputElement.value

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true
    }
    const descValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5
    }
    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1
    }

    // if (enteredTitle.trim().length === 0 || enteredDescription.trim().length === 0 || enteredPeople.trim().length === 0) {
    if (!validate(titleValidatable) || !validate(descValidatable) || !validate(peopleValidatable)) {
      alert('invalid input')
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople]
    }
  }

  private clearInputs() {
    this.titleInputElement.value = ''
    this.descriptionInputElement.value = ''
    this.peopleInputElement.value = ''
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault()
    // console.log(this.titleInputElement.value) // this won't point at the class when the method is triggered in the event listener. because this is bound to current target of the event in the method of an event listener
    const userInput = this.gatherUserInput()
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput
      projectState.addProject(title, desc, people)
      this.clearInputs()
    }
  }

  // private attach() {
  //   this.hostElement.insertAdjacentElement('afterbegin', this.element)
  // }
}

const prjInput = new ProjectInput()
const activePrjList = new ProjectList('active')
const finishedPrjList = new ProjectList('finished')