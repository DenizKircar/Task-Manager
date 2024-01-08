document.addEventListener("contextmenu", (event) => {event.preventDefault();});

        // new Sortable(items, {
        // animation: 150,
        // ghostClass: 'sortable-ghost'
        // });

        let taskList = [];

        if(localStorage.getItem("taskList") !== null) {
            taskList = JSON.parse(localStorage.getItem("taskList"));
        }
        let editID;
        let isEditTask = false;
        const taskInput = document.querySelector("#txtTaskName");

        displayTasks("all");
        
        function displayTasks(filter) {
            let ul = document.getElementById("items"); 
            ul.innerHTML = "";

            if(taskList.length == 0) {
                ul.innerHTML = "<p class='p-3 m-0'>Your list is clear.</p>"
            }
            else {
            for(let task of taskList) {

                let completed = task.status == "completed" ? "checked": "";

                if(filter == task.status || filter == "all") {

                let li = `
                    <li class="task list-group-item" oncontextmenu="deleteTask(${task.id})">
                        <div class="form-check">
                            <input type="checkbox" onclick="updateStatus(this)" id="${task.id}" class="form-check-input" ${completed}>
                            <label for="${task.id}" class="form-check-label ${completed}">${task.taskName}</label>
                        </div>
                        <div class="dropdown">
                            <button class="btn btn-link dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="fa-solid fa-ellipsis"></i>
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li><a onclick='editTask(${task.id}, "${task.taskName}")' class="dropdown-item" href="#"><i class="fa-solid fa-pen"></i> Edit</a></li>
                                <li><a onclick="deleteTask(${task.id})" class="dropdown-item" href="#"><i class="fa-solid fa-trash-can"></i> Delete</a></li>
                            </ul>
                        </div>
                    </li>
                `;
                
                ul.insertAdjacentHTML("beforeend", li);}
            }}
        }
        

        const btnAdd = document.querySelector("#btnAddNewTask");
        const btnClear = document.querySelector("#btnClear");
        const filters = document.querySelectorAll(".filters span");

        

        btnAdd.addEventListener("click", newTask);
        btnAdd.addEventListener("keypress", function() {
             if (event.key == "Enter") {btnAdd.addEventListener.click();}
        })

        btnClear.addEventListener("click", clearTask);

        for(let span of filters) {
            span.addEventListener("click", function() {
                document.querySelector("span.active").classList.remove("active");
                span.classList.add("active");
                displayTasks(span.id);
            })
        }



        function newTask(event) {

            if(taskInput.value == "") {alert("Task cannot be empty.")}
            else {
                if(!isEditTask) {if(taskInput.value == "Nah, I'd win.") {taskList.push({"id": taskList.length + 1, "taskName": "Nuh uh 💀", "status": "pending"});}
                    else {taskList.push({"id": taskList.length + 1, "taskName": taskInput.value, "status": "pending"});}}
                else {
                    for(let task of taskList) {
                        if(task.id == editID) {task.taskName = taskInput.value;}
                        isEditTask = false;
                }}
                
                taskInput.value = "";
                displayTasks(document.querySelector("span.active").id);
                localStorage.setItem("taskList", JSON.stringify(taskList));
                }
            
            event.preventDefault();
        }

        function editTask(id, taskName) {
            editID = id;
            isEditTask = true;
            taskInput.value = taskName;
            taskInput.focus();
            taskInput.classList.add("active");
        }

        function deleteTask(id) {

            let deletedID;

            for(let index in taskList) {
                if(id == taskList[index].id) {deletedID = index;}
            }
            
            taskList.splice(deletedID, 1);
            displayTasks(document.querySelector("span.active").id);
            localStorage.setItem("taskList", JSON.stringify(taskList));

        }

        function clearTask(event) {
            taskList.splice(0, taskList.length);
            localStorage.setItem("taskList", JSON.stringify(taskList));
            
            displayTasks("all");
            event.preventDefault();
            
        }

        function updateStatus(selectedTask) {

            let label = selectedTask.nextElementSibling;
            let status;

            if(selectedTask.checked) {label.classList.add("checked"); status = "completed";}
            else {label.classList.remove("checked"); status = "pending";}

            for(let task of taskList) {
                if(task.id == selectedTask.id) {
                    task.status = status;
                }
            }

            displayTasks(document.querySelector("span.active").id);

            localStorage.setItem("taskList", JSON.stringify(taskList));
        }