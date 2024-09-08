"use strict";

// for create an object for a todo
class Todo {
  constructor(title) {
    this.title = title;
    this.isComplete = false;
  }
}

// for whole project
class TodoList {
  constructor(todosContainer) {
    // create our varibales project like global varibales and elements ,....
    this.todosContainer = todosContainer;
    this.todos = JSON.parse(localStorage.getItem("todos")) ?? [];
    this.todoInput = document.querySelector(".app-input");
    this.addBtn = document.querySelector(".add-todo-btn");
    this.clearBtn = document.querySelector(".clear-todos-btn");

    this.render();
  }

  render() {
    // GENERATE TODOS
    this.todosGenerator();

    // MANAGE TODO ACTIONS
    this.todosContainer.addEventListener("click", e => {
      if (e.target.classList.contains("todo__complete-btn")) {
        // click on complete todo button
        let todoId = e.target.closest(".todo").dataset.id;
        let todoIndex = [...this.todos].findIndex(todo => todo.id == todoId);
        this.todos[todoIndex].isComplete = !this.todos[todoIndex].isComplete;
        localStorage.setItem("todos", JSON.stringify(this.todos));
        this.todosGenerator();
      } else if (e.target.classList.contains("todo__delete-btn")) {
        // click on delete todo button
        Swal.fire({
          title: "Are you sure want to delete this todo ?",
          text: e.target.closest(".todo").querySelector(".todo__text").textContent,
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        }).then(result => {
          if (result.isConfirmed) {
            let todoId = e.target.closest(".todo").dataset.id;
            let todoIndex = [...this.todos].findIndex(todo => todo.id == todoId);
            this.todos.splice(todoIndex, 1);
            localStorage.setItem("todos", JSON.stringify(this.todos));
            this.todosGenerator();
          }
        });
      }
    });

    // ADD NEW TODO WITH ADD BUTTON
    this.addBtn.addEventListener("click", e => {
      this.addNewTodo();
    });

    // ADD NEW TODO WITH ENTER KEY
    this.todoInput.addEventListener("keyup", e => {
      if (e.key === "Enter") {
        this.addNewTodo();
      }
    });

    // CLEAR TODOS
    this.clearBtn.addEventListener("click", e => {
      // if we have some todos item show the modal and action
      if (this.todos.length) {
        Swal.fire({
          title: "Do you want to clear all todos ?",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        }).then(result => {
          if (result.isConfirmed) {
            this.clearTodos();
            Swal.fire("clear all todos", "success");
          }
        });
      }
    });
  }

  todosGenerator() {
    this.todosContainer.innerHTML = "";
    this.todos.forEach(todo => {
      this.todosContainer.insertAdjacentHTML(
        "beforeend",
        `
        <div class="todo ${todo.isComplete ? "completed" : ""}" data-id="${todo.id}">
            <p class="todo__text">
            ${todo.title}
            </p>
            <div class="todo__buttons">
            <button class="todo__complete-btn">${todo.isComplete ? "uncomplete" : "complete"}</button>
            <button class="todo__delete-btn">delete</button>
            </div>
        </div>`
      );
    });
  }

  addNewTodo() {
    let inputValue = this.todoInput.value.trim();

    if (inputValue) {
      // به این خاطر این کار رو کردم که چون اگر مثلا کاربر وقتی یه سری ایتم هارو حذف کنه دیگه مقدار ای دی با تعداد ایتم ها همخونی نداره و مثلا ممکنه ما دوتا ایتم داشته باشیم ولی اخرین ای دی شماره ۱۰ باشه برای همین باید اخرین ای دی رو پیدا کنم و بعدش یکی بهش اضافه کنم
      let lastTodo = this.todos[this.todos.length - 1];
      let newTodo = {
        id: lastTodo ? lastTodo.id + 1 : 1,
        title: inputValue,
        isComplete: false,
      };

      this.todos.push(newTodo);
      localStorage.setItem("todos", JSON.stringify(this.todos));
      this.clearForm();
      this.todosGenerator();
    }
  }

  clearTodos() {
    this.todos = [];
    localStorage.setItem("todos", JSON.stringify(this.todos));
    this.todosGenerator();
  }

  clearForm() {
    this.todoInput.value = "";
  }
}

new TodoList(document.querySelector(".todos"));
