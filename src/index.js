import './input.css'
import { renderSidebar } from './ui/sidebar.js';
import { renderTodos, renderProjectTitle } from './ui/render-todos.js';
import { editTodoForm, setupProjectForm, setupTodoForm } from './ui/form-handler.js';
import {createDefaultProject, loadProjectsFromStorage, getProjects} from './data/project-manager.js';

document.addEventListener('DOMContentLoaded', () => {
  loadProjectsFromStorage();

  if (getProjects().length === 0) createDefaultProject();

  setupProjectForm();
  setupTodoForm();
  editTodoForm();
  renderSidebar();
  renderProjectTitle();
  renderTodos();
});

document.getElementById('openModal').addEventListener('click', () => {
  document.getElementById('todoModal').showModal();
});