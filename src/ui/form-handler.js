import { createProject, addTodoToCurrentProject, setCurrentProject } from '../data/project-manager.js';
import { renderSidebar } from './sidebar.js';
import { renderTodos, renderProjectTitle, taskBeingEdited } from './render-todos.js';
import { saveProjectsToStorage } from '../data/project-manager.js';

export function setupProjectForm() {
    const form = document.getElementById('project-form');
    form.addEventListener('submit', e => {
        e.preventDefault();
        const input = form.querySelector('input[name="project"]');
        const name = input.value.trim();
        if (!name) return;

        createProject(name);
        input.value = '';
        renderSidebar();
        renderTodos();
        renderProjectTitle();
    });
}

export function setupTodoForm() {
    const form = document.getElementById('todoForm');
    form.addEventListener('submit', e => {
        e.preventDefault();
        const formData = new FormData(form);
        const title = formData.get('title');
        const description = formData.get('description');
        const due_date = formData.get('due-date');
        const priority = formData.get('priority');

        addTodoToCurrentProject(title, description, due_date, priority);
        renderTodos();

        document.getElementById('todoModal').close();
    })
}

export function editTodoForm() {
    document.getElementById('editTodoForm').addEventListener('submit', e => {
        e.preventDefault();

        if (!taskBeingEdited) return;

        taskBeingEdited.title = document.getElementById('edit-title').value;
        taskBeingEdited.description = document.getElementById('edit-description').value;
        taskBeingEdited.due_date = document.getElementById('edit-due-date').value;
        taskBeingEdited.priority = document.getElementById('edit-priority').value;

        saveProjectsToStorage();
        renderTodos();
        document.getElementById('editTodoModal').close();
    });
}