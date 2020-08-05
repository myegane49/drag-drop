// /// <reference path="./components/project-list.ts" />
// /// <reference path="./components/project-input.ts" />

// import { ProjectInput } from './components/project-input.js'
// import { ProjectList } from './components/project-list.js'
import { ProjectInput } from './components/project-input'
import { ProjectList } from './components/project-list'

// namespace App {
  new ProjectInput()
  new ProjectList('active')
  new ProjectList('finished')
// }