import { getProjects, setCurrentProject, getCurrentProject, deleteProject } from '../data/project-manager.js';
import { renderTodos, renderProjectTitle } from './render-todos.js';

export function renderSidebar() {
    const sidebar = document.querySelector('#project-list');
    sidebar.innerHTML = '';
    const current = getCurrentProject();

    getProjects().forEach(project => {
        const proj = document.createElement('div');
        proj.textContent = project.name;

        proj.classList.add(
            'cursor-pointer', 'p-2', 'rounded', 'flex', 'justify-between', 'items-center',
            'hover:bg-gray-200'
        );

        if (current && project.id === current.id) {
            proj.classList.add('bg-indigo-100');
        }

        proj.setAttribute('tabindex', '0');
        proj.setAttribute('role', 'button');

        // Project selection
        proj.addEventListener('click', () => {
            setCurrentProject(project.id);
            renderTodos();
            renderProjectTitle();
            renderSidebar();
        });

        // Delete Button

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>';
        deleteBtn.classList.add('text-s', 'text-gray-600', 'hover:text-red-500');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent triggering project switch
            if (confirm(`Delete project "${project.name}"?`)) {
                deleteProject(project.id);
                renderSidebar();
                renderTodos();
                renderProjectTitle();
            }
        });
        proj.appendChild(deleteBtn);

        sidebar.appendChild(proj);
    });
}
