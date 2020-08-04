/// <reference path="./base.ts" />
/// <reference path="../utils/validation.ts" />
/// <reference path="../decorators/autobind.ts" />
/// <reference path="../state/project.ts" />

namespace App {
  export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
}