document.addEventListener("DOMContentLoaded", () => {
   const taskForm = document.getElementById("taskForm");
   const taskTitleInput = document.getElementById("taskTitle");
   const taskDescriptionInput = document.getElementById("taskDescription");
   const addTaskBtn = document.getElementById("addTaskBtn");
   const taskList = document.getElementById("taskList");
   const searchInput = document.getElementById("searchInput");

   // Cargar tareas desde localStorage
   const loadTasks = () => {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      tasks.forEach(task => addTaskToList(task.title, task.description, task.completed || false));
      sortTasks(); // Reorganiza tareas al cargarlas
   };

   // Guardar tareas en localStorage
   const saveTasks = () => {
      const tasks = Array.from(taskList.children).map(item => ({
         title: item.querySelector(".task-title").textContent,
         description: item.querySelector(".task-description-text").textContent,
         completed: item.classList.contains("completed")
      }));
      localStorage.setItem("tasks", JSON.stringify(tasks));
   };

   // Crear y añadir un ticket a la lista
   const addTaskToList = (title, description, completed = false) => {
      const taskItem = document.createElement("li");
      taskItem.classList.add("task-item");

      const taskTitle = document.createElement("h3");
      taskTitle.classList.add("task-title");
      taskTitle.textContent = title;

      const taskDescription = document.createElement("p");
      taskDescription.classList.add("task-description-text");
      taskDescription.textContent = description;

      // Botón de eliminar
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.textContent = "X";
      deleteBtn.addEventListener("click", () => {
         if (confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
            taskItem.remove();
            saveTasks();
            adjustTaskListHeight();
         }
      });

      // Botón de completar
      const completeBtn = document.createElement("button");
      completeBtn.classList.add("complete-btn");
      completeBtn.textContent = "✔";

      // Configurar el estado inicial del botón y la tarea
      if (completed) {
         taskItem.classList.add("completed");
         taskTitle.style.textDecoration = "line-through";
         taskDescription.style.textDecoration = "line-through";
         completeBtn.style.backgroundColor = "#6c757d"; // Gris si ya está completado
      } else {
         completeBtn.style.backgroundColor = "#007bff"; // Azul si no está completado
      }

      completeBtn.addEventListener("click", () => {
         taskItem.classList.toggle("completed");

         if (taskItem.classList.contains("completed")) {
            taskTitle.style.textDecoration = "line-through";
            taskDescription.style.textDecoration = "line-through";
            completeBtn.style.backgroundColor = "#6c757d"; // Color gris cuando está completado
         } else {
            taskTitle.style.textDecoration = "none";
            taskDescription.style.textDecoration = "none";
            completeBtn.style.backgroundColor = "#007bff"; // Vuelve al azul cuando no está completado
         }

         saveTasks();
         sortTasks(); // Reorganiza tareas después de marcar
      });

      taskItem.appendChild(taskTitle);
      taskItem.appendChild(taskDescription);
      taskItem.appendChild(deleteBtn);
      taskItem.appendChild(completeBtn);
      taskList.appendChild(taskItem);

      adjustTaskListHeight();
   };

   // Reorganizar las tareas: completadas al final
   const sortTasks = () => {
      const tasks = Array.from(taskList.children);
      tasks.sort((a, b) => {
         const aCompleted = a.classList.contains("completed");
         const bCompleted = b.classList.contains("completed");
         return aCompleted - bCompleted; // Completadas van al final
      });
      tasks.forEach(task => taskList.appendChild(task)); // Reinsertar en el orden correcto
   };

   // Manejar el formulario para añadir tareas
   const handleAddTask = (e) => {
      e.preventDefault();
      const title = taskTitleInput.value.trim();
      const description = taskDescriptionInput.value.trim();
      if (title) {
         addTaskToList(title, description);
         saveTasks();
         sortTasks(); // Reorganiza tareas después de añadir
         // Limpiar campos
         taskTitleInput.value = "";
         taskDescriptionInput.value = "";
      }
   };

   // Ajustar altura de la lista de tareas
   const adjustTaskListHeight = () => {
      if (taskList.children.length === 0) {
         taskList.style.minHeight = "0px";
      } else {
         taskList.style.minHeight = "50px";
      }
   };

   // Evento para añadir tarea
   addTaskBtn.addEventListener("click", handleAddTask);

   // Cargar tareas al inicio
   loadTasks();

   // Filtro de búsqueda
   searchInput.addEventListener("input", () => {
      const filter = searchInput.value.toLowerCase();
      const tasks = taskList.querySelectorAll(".task-item");
      tasks.forEach((task) => {
         const title = task.querySelector(".task-title").textContent.toLowerCase();
         const description = task.querySelector(".task-description-text").textContent.toLowerCase();
         if (title.includes(filter) || description.includes(filter)) {
            task.style.display = "";
         } else {
            task.style.display = "none";
         }
      });
   });
});
