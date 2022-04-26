const taskInput = document.querySelector(".task-input input"),
filters = document.querySelectorAll(".filters span"),
clearAll = document.querySelector(".clear-btn"),
taskBox = document.querySelector(".task-box");

let editId;
let isEdited = false;
//Getting the Localstorage for toDo list
let todo = JSON.parse(localStorage.getItem("todo-list")); //Have to parse first for use .push function

filters.forEach(btn => {
    btn.addEventListener("click", () => {
        // console.log(btn);
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showToDo(btn.id);
    });
});
//get date and time
const getCurrentTimeDate = () => {
    let currentTimeDate = new Date();

    var weekday = new Array(7);
    weekday[0] = "DOM";
    weekday[1] = "LUN";
    weekday[2] = "MAR";
    weekday[3] = "MIER";
    weekday[4] = "JUE";
    weekday[5] = "VIE";
    weekday[6] = "SAB";

    var month = new Array();
    month[0] = "ENE";
    month[1] = "FEB";
    month[2] = "MAR";
    month[3] = "ABR";
    month[4] = "MAY";
    month[5] = "JUN";
    month[6] = "JUL";
    month[7] = "AGO";
    month[8] = "SEPT";
    month[9] = "OCT";
    month[10] = "NOV";
    month[11] = "DIC";

    var hours   =  currentTimeDate.getHours();
    var minutes =  currentTimeDate.getMinutes();
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var AMPM = hours >= 12 ? 'PM' : 'AM';
    if(hours === 12){
        hours=12;
    }else{
        hours = hours%12;
    }
    var seconds =currentTimeDate.getSeconds();
    seconds = seconds < 10 ? '0'+seconds : seconds;

    var currentTime = `${hours}:${minutes}:${seconds}${AMPM} `;
    var currentDay = weekday[currentTimeDate.getDay()];

    var currentDate  = currentTimeDate.getDate();
    var currentMonth = month[currentTimeDate.getMonth()];
    var CurrentYear = currentTimeDate.getFullYear();

    var fullDate = `${currentDate} ${currentMonth} ${CurrentYear}`;


    document.getElementById("time").innerHTML = currentTime;
    document.getElementById("day").innerHTML = currentDay;
    document.getElementById("date").innerHTML = fullDate;

    setTimeout(getCurrentTimeDate, 500);
}
getCurrentTimeDate();
//Getting the weather using OpenWeatherAPI by the latitude and longitude
function getCurrentWeather(lat,long) {
    var key = '9555549e86871500922f93a6f91e0dc6';
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+long+'&lang=en&exclude=minutely,hourly,daily,alerts&units=metric&appid='+key)
    .then(function(resp) { return resp.json() }) // Convert data to json
    .then(function(data) {
    //   console.log(data.current.temp, data.current.weather[0].description);
      document.getElementById("Weather").innerHTML = `${Math.round(data.current.temp)}°C`;
      let icon = data.current.weather[0].icon;
      if (icon != null){
        switch(icon) {
            case "01d":
                document.getElementById("weatherIcon").className = "uil uil-sun"
                break;
            case "01n":
                document.getElementById("weatherIcon").className = "uil uil-moon"
                break;
            case "02d":
                document.getElementById("weatherIcon").className = "uil uil-cloud-sun"
                break;
            case "02n":
                document.getElementById("weatherIcon").className = "uil uil-cloud-moon"
                break;
            case "03d" || "03n":
                document.getElementById("weatherIcon").className = "uil uil-cloud"
                break;
            case "04d" || "04n":
                document.getElementById("weatherIcon").className = "uil uil-clouds"
                break;
            case "04d" || "04n":
                document.getElementById("weatherIcon").className = "uil uil-clouds"
                break;
            case "09d" || "09n":
                document.getElementById("weatherIcon").className = "uil uil-cloud-rain"
                break;
            case "10d":
                document.getElementById("weatherIcon").className = "uil uil-cloud-sun-rain"
                break;
            case "10n":
                document.getElementById("weatherIcon").className = "uil uil-cloud-moon-rain"
                break;
            case "11d" || "11n":
                document.getElementById("weatherIcon").className = "uil uil-thunderstorm"
                break;
            case "13d" || "13n":
                document.getElementById("weatherIcon").className = "uil uil-snowflake"
                break;
            case "50d" || "50n":
                document.getElementById("weatherIcon").className = "uil uil-cloud-wind"
                break;
            }
      }
    })
  }

/* Initialise Reverse Geocode API Client */
var reverseGeocoder=new BDCReverseGeocode();

/* Get the current user's location information, based on the coordinates provided by their browser */
/* Fetching coordinates requires the user to be accessing your page over HTTPS and to allow the location prompt. */
function getLocation() {      
    reverseGeocoder.getClientLocation(function(result) {
    //   console.log(result.locality);
      let cargando = "Cargando ubicacion";
      if(result.locality != null)
      {
        document.getElementById("City").innerHTML = result.locality;
        // console.log(result.latitude, result.longitude);
        let lat = result.latitude;
        let long = result.longitude;
        // console.log(result);
        getCurrentWeather(lat,long);
      }
    });
  }
getLocation();

function showToDo(filters){
    let li = "";
    if(todo) {
        todo.forEach((todo, id) => {
            //If todo status is completed, then the value of isCompleted is checked
            let isCompleted = todo.status == "Completado" ? "checked" : "";
            // console.log(id, todo);
            if(todo.status == filters || filters == "Todo") {
                    li += `<li class="task">
                    <label for="${id}">
                        <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                        <p class="${isCompleted}">${todo.name}</p>
                    </label>
                    <div class="settings">
                        <i onclick="showMenu(this)" class="uil uil-setting"></i>
                        <ul class="task-menu">
                            <li onclick="editTask(${id}, '${todo.name}')"><i class="uil uil-edit"></i>Editar
                            <li onclick="deleteTask(${id})"><i class="uil uil-trash-alt"></i>Eliminar</li>
                        </ul>
                    </div>
                </li>`;
            }
        });
    }
    //Check if li for pending task is empty and insert a span saying that there is no more task
    taskBox.innerHTML = li || `<span> No hay tareas <i class="uil uil-thumbs-up"></i> </span>`;
    //Adding overflow for scrollbar
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
}
showToDo("Todo");

//Getting the div menu for the selected task
function showMenu(selectedTask) {
    // console.log(selectedTask);
    let taskMenu = selectedTask.parentElement.lastElementChild;
    taskMenu.classList.add("show");
    document.addEventListener("click", e => {
        //Identify the I tag where we've the edit and delete options for the task
        if(e.target.tagName != "I" || e.target != selectedTask) {
            taskMenu.classList.remove("show");
        }
    });
}

function updateStatus(selectedTask) {
    console.log(selectedTask);
    //Get the task name on the p tag
    let taskName = selectedTask.parentElement.lastElementChild;
    if(selectedTask.checked) {
        taskName.classList.add("checked");
        //Update the task status to complete
        todo[selectedTask.id].status = "Completado";
    } else {
        taskName.classList.remove("checked");
        //Update the task status to pending
        todo[selectedTask.id].status = "Pendiente";
    }
    localStorage.setItem("todo-list",JSON.stringify(todo));
}

function editTask(taskId,taskName){
    // console.log(taskId,taskName);
    editId = taskId;
    isEdited = true;
    taskInput.value = taskName;

}

function deleteTask(deleteId){
    // console.log(deleteId);
    //remove the selected task from the todo array
    todo.splice(deleteId,1);
    localStorage.setItem("todo-list",JSON.stringify(todo));
    showToDo("Todo");
}

//Remove all existing tasks
clearAll.addEventListener("click", () => {
    todo.splice(0,todo.length);
    localStorage.setItem("todo-list",JSON.stringify(todo));
    showToDo("Todo");
});

// Getting user input for task on the ppl bar
taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim(); //trim for delete blank spaces
    if(e.key == "Enter" && userTask){
        if (!isEdited) { //check that the task is a new one and not the one that is being edited
            // console.log(userTask);
            //condición ? expr1 : expr2 
            todo = !todo ? [] : todo; //if todo isn't exist, pass an empty array to todo
        
            let taskInfo = {name: userTask, status: "Pendiente"};
            todo.push(taskInfo); //adding new task to todo
        }else {
            isEdited = false;
            // console.log(todo[editId]);
            todo[editId].name = userTask;
        }
        // console.log(todo);
        taskInput.value = "";
        localStorage.setItem("todo-list",JSON.stringify(todo));
        showToDo("Todo");
    }
});

//40:03