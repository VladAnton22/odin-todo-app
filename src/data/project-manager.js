import { Project } from '../models/project.js';
import { Todo } from '../models/todo.js';

const projects = []
let currentProject = null;

export function createProject(name) {
    const project = new Project(name);
    projects.push(project);
    currentProject = project; // Always switch
    saveProjectsToStorage();
    return project;
}

export function getCurrentProject() {
    return currentProject;
}

export function setCurrentProject(id) {
    currentProject = projects.find(p => p.id === id);
}

export function addTodoToCurrentProject(title, description, due_date, priority) {
    const todo = new Todo(title, description, due_date, priority);
    currentProject.addTodo(todo);
    saveProjectsToStorage();
}

export function getProjects() {
    return [...projects];
}

export function createDefaultProject() {
    const project = new Project("Daily Tasks");
    projects.push(project);
    if (!currentProject) currentProject = project;
    return project;
}

export function deleteProject(id) {
    const index = projects.findIndex(p => p.id === id);
    if (index !== -1) {
        projects.splice(index, 1);

        // If current project is deleted, reset
        if (currentProject?.id === id) {
            currentProject = projects[0] || null;
        }
        saveProjectsToStorage();
    }
}

// STORAGE

const STORAGE_KEY = 'todo-projects';

export function saveProjectsToStorage() {
    const raw = JSON.stringify({
        projects,
        currentProjectId: currentProject?.id || null
    });
    localStorage.setItem(STORAGE_KEY, raw);
}

export function loadProjectsFromStorage() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed.projects)) return;

        projects.length = 0;
        parsed.projects.forEach(p => {
            const project = new Project(p.name);
            project.id = p.id;
            p.todos.forEach(t => {
                const todo = new Todo(t.title, t.description, t.due_date, t.priority, t.completed);
                todo.id = t.id;
                project.addTodo(todo);
            });
            projects.push(project);
        });

        if (parsed.currentProjectId) {
            currentProject = projects.find(p => p.id === parsed.currentProjectId) || projects[0] || null;
        } else {
            currentProject = projects[0] || null;
        }
    } catch (err) {
        console.error('Failed to load from storage:', err);
    }
}