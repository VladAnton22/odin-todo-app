export class Todo {
    constructor(title, description, due_date, priority, completed = false) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.description = description;
        this.due_date = due_date;
        this.priority = priority;
        this.completed = completed;
    }

    toggleCompleted() {
        this.completed = !this.completed;
    }
}