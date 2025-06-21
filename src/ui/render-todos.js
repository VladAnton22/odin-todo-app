import { getCurrentProject } from '../data/project-manager.js';
import { saveProjectsToStorage } from '../data/project-manager.js';

export  let taskBeingEdited = null;

export function renderProjectTitle() {
    const title = document.getElementById("project-title");
    const project = getCurrentProject();
    title.innerHTML = project.name;
}

export function renderTodos() {
    const container = document.querySelector('#todo-list');
    container.innerHTML = '';
    const project = getCurrentProject();
    if (!project) return;

    project.todos.forEach(todo => {
        const li = document.createElement('li');
        li.classList.add("flex", "items-center", "justify-between", "bg-white", "p-4", "border-2", "border-gray-300", "rounded-lg")
        if (todo.completed) {
            li.classList.add("border-green-500");
        }
        const leftContent = document.createElement('div');
        leftContent.classList.add("flex", "tiems-center", "justify-center", "gap-x-3")
        const rightContent = document.createElement('div');
        rightContent.classList.add("flex", "items-center", "justify-center", "gap-x-3")

        // Checkbox input
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.classList.add('accent-green-500', 'w-6', 'h-6', 'my-auto');
        // Toggle when clicked
        checkbox.addEventListener('change', () => {
            todo.completed = checkbox.checked;
            saveProjectsToStorage();  // persist change
            renderTodos();            // re-render for UI update (optional)
        });

        const mainDetails = document.createElement('div');

        const title = document.createElement('h3');
        title.textContent = todo.title;
        title.classList.add("text-xl", "font-bold")
        const description = document.createElement('p');
        description.textContent = todo.description;
        description.classList.add("text-gray-600")
        const due_date = document.createElement('p');
        due_date.textContent = todo.due_date;
        const priority = document.createElement('p');
        priority.classList.add("px-2", "py-1", "text-s")
        priority.textContent = todo.priority;
        if (todo.priority === "low") {
            priority.classList.add("border-2", "border-green-300", "rounded-full", "text-center", "bg-green-100", "text-green-800");
        } else if (todo.priority === "medium") {
            priority.classList.add("border-2", "border-yellow-300", "rounded-full", "text-center", "bg-yellow-100", "text-yellow-800");
        } else if (todo.priority === "high") {
            priority.classList.add("border-2", "border-red-300", "rounded-full", "text-center", "bg-red-100", "text-red-800");
        }

        // Delete / Edit menu
        const menuWrapper = document.createElement('div');
        menuWrapper.classList.add('relative');

        const menuBtn = document.createElement('button');
        menuBtn.innerHTML = '&#8942;'; // three-dot vertical
        menuBtn.classList.add('text-gray-500', 'hover:text-gray-700', 'p-2');

        const dropdown = document.createElement('div');
        dropdown.classList.add('absolute', 'right-0', 'top-full', 'mt-2', 'w-28', 'bg-white', 'rounded', 'shadow-lg', 'border', 'z-10', 'hidden', 'flex', 'flex-col');

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('px-3', 'py-2', 'text-left', 'hover:bg-gray-100');
        editBtn.addEventListener('click', () => {
            taskBeingEdited = todo;

            document.getElementById('edit-title').value = todo.title;
            document.getElementById('edit-description').value = todo.description;
            document.getElementById('edit-due-date').value = todo.due_date;
            document.getElementById('edit-priority').value = todo.priority;

            dropdown.classList.add('hidden');
            document.getElementById('editTodoModal').showModal();
            console.log('Edit:', todo.title);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('px-3', 'py-2', 'text-left', 'hover:bg-red-100', 'text-red-500');
        deleteBtn.addEventListener('click', () => {
            project.todos = project.todos.filter(t => t.id !== todo.id);
            saveProjectsToStorage();
            renderTodos();
        });

        dropdown.appendChild(editBtn);
        dropdown.appendChild(deleteBtn);
        menuWrapper.appendChild(menuBtn);
        menuWrapper.appendChild(dropdown);

        menuBtn.addEventListener('click', () => {
            dropdown.classList.toggle('hidden');
        });

        // Hide dropdown on outside click
        document.addEventListener('click', e => {
            if (!menuWrapper.contains(e.target)) dropdown.classList.add('hidden');
        });

        mainDetails.append(title, description)
        leftContent.append(checkbox, mainDetails);
        rightContent.append(priority, due_date, menuWrapper);
        li.append(leftContent, rightContent)
        container.appendChild(li);

    });
}