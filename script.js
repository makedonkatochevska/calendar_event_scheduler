//html elements
const dateInput = document.getElementById("eventDate");
const descriptionInput = document.getElementById("eventDescription");
const form = document.getElementById("form");
const btnGroup = document.querySelector(".btn-group");
const ulList = document.getElementById("eventsList");
const showAllBtn = document.querySelector("#showAll");

// Function to generate a unique event ID
function generateEventId() {
  return "_" + Math.random().toString(36).substring(2, 9); //_k9xj221m
}

//Event class
class Event {
  constructor(_eventDate, _eventDesc, _eventID) {
    this.eventDate = _eventDate;
    this.eventDescription = _eventDesc;
    this.eventID = _eventID;
  }
}

//Event library class
class EventList {
  constructor() {
    this.eventList = [];
  }

  addEventToList(_newEvent) {
    this.eventList.push(_newEvent);
  }

  removeEventFromList(_eventID) {
    this.eventList = this.eventList.filter(
      (event) => event.eventID !== _eventID
    );
  }

  syncLocalStorage() {
    localStorage.setItem("eventList", JSON.stringify(this.eventList));
  }
}

//Event library instance
const events = new EventList();

//Function to add new event to list
function addNewEventToList() {
  //Prevent entering empty values
  if (!descriptionInput.value.trim() || !dateInput.value) {
    alert("Please enter valid information");
    return;
  }
  //Prevent entering event in the past
  const selectedDate = new Date(dateInput.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    alert("You cannot add an event in the past.");
    return;
  }

  //Creating an Event
  const newEvent = new Event(
    dateInput.value,
    descriptionInput.value.trim(),
    generateEventId()
  );
  events.addEventToList(newEvent);

  //Save the changes of event list to Local Storage
  events.syncLocalStorage();

  form.reset();
}
// Function to remove an event
function removeEventFromListAndDisplay(eventID) {
  events.removeEventFromList(eventID);

  //Save the changes of event list to Local Storage
  events.syncLocalStorage();

  displayEvents(events.eventList);
}

//Display events function
function displayEvents(events) {
  ulList.innerHTML = "";

  if (events.length === 0) {
    ulList.innerHTML = "<li class='list-group-item'>No events found</li>";
    return;
  }

  events.forEach((event) => {
    const li = document.createElement("li");
    li.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );
    li.textContent = `${event.eventDate}: ${event.eventDescription}`;

    //Remove btn
    const removeBtn = document.createElement("button");
    removeBtn.classList.add("btn", "btn-danger", "btn-sm");
    removeBtn.textContent = "Remove";

    // Add event listener to remove event
    removeBtn.addEventListener("click", () => {
      removeEventFromListAndDisplay(event.eventID);
    });

    li.appendChild(removeBtn);
    ulList.append(li);
  });
}

//Generate filter buttons
function generateFilterButtons() {
  // const months = [
  //   "Jan",
  //   "Feb",
  //   "Mar",
  //   "Apr",
  //   "May",
  //   "Jun",
  //   "Jul",
  //   "Aug",
  //   "Sep",
  //   "Oct",
  //   "Nov",
  //   "Dec",
  // ];

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    const dateString = date.toISOString().split("T")[0];

    const btn = document.createElement("button");
    btn.classList.add("btn", "btn-secondary");
    btn.textContent = date.toLocaleDateString("default", {
      month: "short",
      day: "numeric",
    });

    btn.addEventListener("click", () => filterEventsByDate(dateString));
    btnGroup.appendChild(btn);
  }
}

//Filter event by date
function filterEventsByDate(selectedDate) {
  const filteredEvents = events.eventList.filter(
    (event) => event.eventDate === selectedDate
  );
  displayEvents(filteredEvents);
}

//Show all events
showAllBtn.addEventListener("click", () => displayEvents(events.eventList));

//Add btn - add new event
form.addEventListener("submit", (e) => {
  e.preventDefault();
  addNewEventToList();

  //display events
  displayEvents(events.eventList);
});

//--------ON LOAD EVENTS-----------
document.addEventListener("DOMContentLoaded", () => {}); //Redundant event

const storedEvents = JSON.parse(localStorage.getItem("eventList")) || [];
events.eventList = storedEvents;
displayEvents(events.eventList);
generateFilterButtons();
