import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// SHOW SIGNUP FORM

function showSignup() {

  document.getElementById("loginForm").style.display = "none";
  document.getElementById("signupForm").style.display = "block";
}

// SHOW LOGIN FORM

function showLogin() {

  document.getElementById("signupForm").style.display = "none";
  document.getElementById("loginForm").style.display = "block";
}

// SIGNUP

// SIGNUP WITH FIREBASE

document.getElementById("signupForm")
.addEventListener("submit", async function(e){

  e.preventDefault();

  const name =
  document.getElementById("signupName").value;

  const email =
  document.getElementById("signupEmail").value;

  const password =
  document.getElementById("signupPassword").value;

  try{

    // CREATE ACCOUNT
    const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // SAVE USER INFO TO FIRESTORE
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email
    });

    alert("Account Created Successfully!");

    showLogin();

  }catch(error){

    alert(error.message);
  }
});


// LOGIN

document.getElementById("loginForm")
.addEventListener("submit", async function(e){

  e.preventDefault();

  const email =
  document.getElementById("loginEmail").value;

  const password =
  document.getElementById("loginPassword").value;

  try{

    // LOGIN
    const userCredential =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // GET USER DATA
    const docRef =
    doc(db, "users", user.uid);

    const docSnap =
    await getDoc(docRef);

    if(docSnap.exists()){

      const userData =
      docSnap.data();

      document.getElementById("authPage")
      .style.display = "none";

      document.getElementById("plannerPage")
      .style.display = "block";

      document.getElementById("profileName")
      .innerText = userData.name;

      document.getElementById("profileEmail")
      .innerText = userData.email;

      document.getElementById("dashboardName")
      .innerText = userData.name;

      localStorage.setItem(
        "currentUser",
        JSON.stringify(userData)
      );
    }

  }catch(error){

    alert(error.message);
  }
});
// LOAD PROFILE FROM SIGNUP

window.onload = function(){

  const currentUser =
  JSON.parse(localStorage.getItem("currentUser"));

  if(currentUser){

    document.getElementById("authPage")
    .style.display = "none";

    document.getElementById("plannerPage")
    .style.display = "block";

    document.getElementById("profileName")
    .innerText = currentUser.name;

    document.getElementById("profileEmail")
    .innerText = currentUser.email;

    document.getElementById("dashboardName")
    .innerText = currentUser.name;
    initializeTasks();


    document.getElementById("name")
    .value = currentUser.name;

    document.getElementById("email")
    .value = currentUser.email;
    document.getElementById("dashboardStudentName")
.innerText = currentUser.name;

// TODAY DATE
const today = new Date();

document.getElementById("todayDate")
.innerText =
today.toLocaleDateString("en-US",{
  month:"short",
  day:"numeric",
  year:"numeric"
});
  }
}

// SECTION NAVIGATION

function showSection(sectionId){

  let sections =
  document.querySelectorAll(".content-section");

  sections.forEach(section => {
    section.classList.add("hidden");
  });

  document.getElementById(sectionId)
  .classList.remove("hidden");
}
// SHOW EDIT PROFILE FORM


// PROFILE
// PROFILE
// PROFILE
function editProfile(){

  let currentUser =
  JSON.parse(localStorage.getItem("currentUser"));

  let newName =
  prompt("Enter New Name:", currentUser.name);

  let newEmail =
  prompt("Enter New Email:", currentUser.email);

  if(newName && newEmail){

    // GET USERS
    let users =
    JSON.parse(localStorage.getItem("plannerUsers")) || [];

    // UPDATE USERS
    users = users.map(user => {

      if(user.email === currentUser.email){

        return{
          ...user,
          name:newName,
          email:newEmail
        };
      }

      return user;
    });

    // UPDATE CURRENT USER
    currentUser.name = newName;
    currentUser.email = newEmail;

    // SAVE
    localStorage.setItem(
      "plannerUsers",
      JSON.stringify(users)
    );

    localStorage.setItem(
      "currentUser",
      JSON.stringify(currentUser)
    );

    // UPDATE DISPLAY
    document.getElementById("profileName")
    .innerText = newName;

    document.getElementById("profileEmail")
    .innerText = newEmail;

    document.getElementById("dashboardName")
    .innerText = newName;

    alert("Profile Updated!");
  }
}

// CALENDAR

function saveDate(){

  let date =
  document.getElementById("calendarDate").value;

  document.getElementById("savedDate")
  .innerHTML =
  `<p>Saved Study Date: ${date}</p>`;
}

// TASKS

// =========================
// TASK STORAGE
// =========================
// GET CURRENT USER EMAIL
function getCurrentUserEmail(){

  let currentUser =
  JSON.parse(localStorage.getItem("currentUser"));

  return currentUser ? currentUser.email : null;
}

// TASK STORAGE KEY
function getTaskStorageKey(){

  return "calendarTasks_" +
  getCurrentUserEmail();
}

// INITIALIZE TASKS
function initializeTasks(){

  calendarTasks =
  JSON.parse(
    localStorage.getItem(getTaskStorageKey())
  ) || [];

  loadTasks();
}
let currentDate = new Date();

let calendarTasks = [];
// SAVE TASKS
function saveTasks(){

  localStorage.setItem(
    "calendarTasks",
    JSON.stringify(calendarTasks)
  );
}

// LOAD TASKS
function loadTasks(){

  const taskList =
  document.getElementById("taskList");

  taskList.innerHTML = "";

  calendarTasks.forEach(task => {

    let li =
    document.createElement("li");

    li.setAttribute("data-task", task.name);
    li.setAttribute("data-deadline", task.deadline);

    if(task.completed){
      li.classList.add("completed");
    }

    li.innerHTML = `

      <div class="task-info">

        <strong>${task.name}</strong>
        <br>

        <small>
  Deadline: ${task.deadline} | ${task.time}
</small>
      </div>

      <div>

        <button onclick="completeTask(this)">
          Complete
        </button>

        <button onclick="deleteTask(this)">
          Delete
        </button>

      </div>
    `;

    taskList.appendChild(li);

  });

  updateTaskCount();
  renderCalendar();
}

// =========================
// ADD TASK
// =========================

function addTask(){

  let taskInput =
  document.getElementById("taskInput");

  let taskDeadline =
  document.getElementById("taskDeadline");

  let taskTime =
  document.getElementById("taskTime");

  let taskText =
  taskInput.value;

  let deadline =
  taskDeadline.value;

  let time =
  taskTime.value;

  if(taskText === "" || deadline === "" || time === ""){

    alert("Please enter task, date, and time");

    return;
  }

  // SAVE TASK
  calendarTasks.push({
    name:taskText,
    deadline:deadline,
    time:time,
    completed:false
  });

  saveTasks();

  loadTasks();

  taskInput.value = "";
  taskDeadline.value = "";
  taskTime.value = "";
}

// =========================
// COMPLETE TASK
// =========================

function completeTask(button){

  let li =
  button.parentElement.parentElement;

  let taskName =
  li.getAttribute("data-task");

  let deadline =
  li.getAttribute("data-deadline");

  calendarTasks.forEach(task => {

    if(
      task.name === taskName &&
      task.deadline === deadline
    ){

      task.completed = !task.completed;
    }
  });

  saveTasks();

  loadTasks();
}

// =========================
// DELETE TASK
// =========================

function deleteTask(button){

  let li =
  button.parentElement.parentElement;

  let taskName =
  li.getAttribute("data-task");

  let deadline =
  li.getAttribute("data-deadline");

  calendarTasks =
  calendarTasks.filter(task => {

    return !(
      task.name === taskName &&
      task.deadline === deadline
    );

  });

  saveTasks();

  loadTasks();
}

// =========================
// UPDATE TASK COUNT
// =========================

function updateTaskCount(){

  let totalTasks =
  calendarTasks.length;

  document.getElementById("taskCount")
  .innerText = totalTasks;
}

// =========================
// CALENDAR
// =========================

function renderCalendar(){

  const monthYear =
  document.getElementById("monthYear");

  const calendarGrid =
  document.getElementById("calendarGrid");

  calendarGrid.innerHTML = "";

  const year =
  currentDate.getFullYear();

  const month =
  currentDate.getMonth();

  const firstDay =
  new Date(year, month, 1).getDay();

  const lastDate =
  new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "January","February","March",
    "April","May","June",
    "July","August","September",
    "October","November","December"
  ];

  monthYear.innerText =
  `${monthNames[month]} ${year}`;

  // EMPTY BOXES
  for(let i = 0; i < firstDay; i++){

    let empty =
    document.createElement("div");

    empty.classList.add("empty");

    calendarGrid.appendChild(empty);
  }

  // DAYS
  for(let day = 1; day <= lastDate; day++){

    let dayBox =
    document.createElement("div");

    dayBox.classList.add("calendar-day-box");

    let fullDate =
    `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

    dayBox.innerHTML =
    `
      <h4>${day}</h4>

      <div class="calendar-task-container"
      id="${fullDate}">
      </div>
    `;

    calendarGrid.appendChild(dayBox);

    // SHOW TASKS
    // SHOW TASKS
calendarTasks.forEach(task => {

  if(task.deadline === fullDate){

    let taskElement =
    document.createElement("div");

    taskElement.classList.add("calendar-task");

    // CONVERT TIME TO AM/PM
    let formattedTime =
    new Date("1970-01-01T" + task.time)
    .toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    // IF COMPLETED
    if(task.completed){

      taskElement.classList.add("done-task");

      taskElement.innerText =
      "✔ " + task.name + " (" + formattedTime + ")";

    }else{

      taskElement.innerText =
      task.name + " (" + formattedTime + ")";
    }

    dayBox.querySelector(".calendar-task-container")
    .appendChild(taskElement);
  }

});
  }
}

// =========================
// CHANGE MONTH
// =========================

function changeMonth(step){

  currentDate.setMonth(
    currentDate.getMonth() + step
  );

  renderCalendar();
}

// =========================
// LOAD WHEN WEBSITE OPENS
// =========================

loadTasks();
// TIMER

let time = 1500;
let timer;
let running = false;

function updateTimer(){

  let minutes =
  Math.floor(time / 60);

  let seconds =
  time % 60;

  seconds =
  seconds < 10 ? "0" + seconds : seconds;

  document.getElementById("timer")
  .innerText =
  `${minutes}:${seconds}`;
}
function setCustomTimer(){

  let minutes =
  document.getElementById("timerMinutes").value;

  if(minutes <= 0 || minutes === ""){

    alert("Enter valid minutes");

    return;
  }

  time = minutes * 60;

  updateTimer();
}
function startTimer(){

  if(running) return;

  running = true;

  timer = setInterval(() => {

    if(time > 0){

      time--;

      updateTimer();

    } else {

      clearInterval(timer);

      alert("Study Session Finished!");

      running = false;
    }

  },1000);
}

function pauseTimer(){

  clearInterval(timer);

  running = false;
}

function resetTimer(){

  clearInterval(timer);

  running = false;

  time = 1500;

  updateTimer();
}

updateTimer();

// LOGOUT
async function logoutUser(){

  await signOut(auth);

  localStorage.removeItem("currentUser");

  location.reload();
}

window.showSignup = showSignup;
window.showLogin = showLogin;
window.logoutUser = logoutUser;
window.showSection = showSection;
window.addTask = addTask;
window.completeTask = completeTask;
window.deleteTask = deleteTask;
window.changeMonth = changeMonth;
window.startTimer = startTimer;
window.pauseTimer = pauseTimer;
window.resetTimer = resetTimer;
window.setCustomTimer = setCustomTimer;
window.editProfile = editProfile;