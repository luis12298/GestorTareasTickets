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
      tasks.forEach(task => addTaskToList(task.title, task.description));
   };

   // Guardar tareas en localStorage
   const saveTasks = () => {
      const tasks = Array.from(taskList.children).map(item => ({
         title: item.querySelector(".task-title").textContent,
         description: item.querySelector(".task-description-text").textContent
      }));
      localStorage.setItem("tasks", JSON.stringify(tasks));
   };

   // Crear y añadir un ticket a la lista
   const addTaskToList = (title, description) => {
      const taskItem = document.createElement("li");
      taskItem.classList.add("task-item");

      const taskTitle = document.createElement("h3");
      taskTitle.classList.add("task-title");
      taskTitle.textContent = title;

      const taskDescription = document.createElement("p");
      taskDescription.classList.add("task-description-text");
      taskDescription.textContent = description;

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

      taskItem.appendChild(taskTitle);
      taskItem.appendChild(taskDescription);
      taskItem.appendChild(deleteBtn);

      taskList.appendChild(taskItem);
      adjustTaskListHeight(); // Ajustar el tamaño de la lista
   };

   // Manejar el formulario para añadir tareas
   const handleAddTask = (e) => {
      e.preventDefault();

      const title = taskTitleInput.value.trim();
      const description = taskDescriptionInput.value.trim();

      if (title) {
         addTaskToList(title, description);
         saveTasks();

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
// Evento para filtrar tareas
