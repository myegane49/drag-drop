// /// <reference path="./base.ts" />
// /// <reference path="../decorators/autobind.ts" />
// /// <reference path="../models/drag-drop.ts" />
// /// <reference path="../models/project.ts" />

// import { Draggable } from '../models/drag-drop.js'
// import { Project } from '../models/project.js'
// import { Component } from './base.js'
// import { autobind } from '../decorators/autobind.js'
import { Draggable } from '../models/drag-drop'
import { Project } from '../models/project'
import { Component } from './base'
import { autobind } from '../decorators/autobind'

// namespace App {
  export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
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
      event.dataTransfer!.setData('text/plain', this.project.id)
      event.dataTransfer!.effectAllowed = 'move'
    }
  
    @autobind
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
// }