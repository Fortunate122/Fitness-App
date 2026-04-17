const checkbox = document.getElementById("checkbox");
const workoutGrid = document.getElementById("workout-grid");
const muscleFilter = document.getElementById("muscle-filter");
const goalFilter = document.getElementById("goal-filter");

const planSelectorPanel = document.getElementById("plan-selector-panel");
const selectedWorkoutLabel = document.getElementById("selected-workout-label");
const confirmPlanBtn = document.getElementById("confirm-plan-btn");
const cancelPlanBtn = document.getElementById("cancel-plan-btn");
const dayCheckboxes = document.querySelectorAll(
  '.day-checkboxes input[type="checkbox"]'
);

const workouts = [
  {
    id: 1,
    title: "Warm Up",
    category: "full-body",
    goal: "mobility",
    videoUrl: "https://www.youtube.com/watch?v=_6-k5-w1bZw",
  },
  {
    id: 2,
    title: "Chest Press",
    category: "chest",
    goal: "strength",
    videoUrl: "https://youtu.be/4Y2ZdHCOXok?si=ULaEwE2fdGeuB1eG",
  },
  {
    id: 3,
    title: "Bicep Curl",
    category: "arms",
    goal: "hypertrophy",
    videoUrl: "https://youtu.be/XE_pHwbst04?si=l8ECB5EEZ5pI2R6B",
  },
  {
    id: 4,
    title: "Back Row",
    category: "back",
    goal: "strength",
    videoUrl: "https://youtu.be/7B5Exks1KJE?si=ZoFPcFuJFfr8-K2c",
  },
  {
    id: 5,
    title: "Tricep Extension",
    category: "arms",
    goal: "hypertrophy",
    videoUrl: "https://youtu.be/30owVlZZEf8?si=tA37WRBuDYpkRfAb",
  },
  {
    id: 6,
    title: "Hamstring Curl",
    category: "legs",
    goal: "hypertrophy",
    videoUrl: "https://youtu.be/q1cKTmaeQWo?si=WqSdOX5toOOtuoFM",
  },
  {
    id: 7,
    title: "Quad Extension",
    category: "legs",
    goal: "hypertrophy",
    videoUrl: "https://youtu.be/ljO4jkwv8wQ?si=NDIBGsDKil3orqJV",
  },
  {
    id: 8,
    title: "Squat",
    category: "legs",
    goal: "strength",
    videoUrl: "https://youtu.be/my0tLDaWyDU?si=K-r9vFlVzIpHgXWK",
  },
  {
    id: 9,
    title: "Romanian Deadlift",
    category: "legs",
    goal: "strength",
    videoUrl: "https://youtu.be/5bJEigM5iVg?si=_lHDOfjCRZl-xex_",
  },
  {
    id: 10,
    title: "Cardio",
    category: "cardio",
    goal: "endurance",
    videoUrl: "https://www.youtube.com/watch?v=heP2u6TYfeE",
  },
  {
    id: 11,
    title: "Recovery",
    category: "recovery",
    goal: "recovery",
    videoUrl: "https://www.youtube.com/watch?v=utAqR9-dmh0",
  },
];

const dayNames = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

let selectedWorkoutForPlan = null;

let weeklyPlan =
  JSON.parse(localStorage.getItem("weeklyPlan")) || {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  };

// Theme toggle
checkbox.addEventListener("change", () => {
  document.body.classList.toggle("dark");

  const theme = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", JSON.stringify({ theme }));
});

const savedTheme = JSON.parse(localStorage.getItem("theme"));
if (savedTheme && savedTheme.theme === "dark") {
  document.body.classList.add("dark");
  checkbox.checked = true;
}

function formatLabel(value) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function createWorkoutCard(workout) {
  return `
    <article class="workout-card">
      <div class="workout-card-content">
        <span class="workout-tag">${formatLabel(workout.category)}</span>
        <h3>${workout.title}</h3>
        <p class="workout-goal">Goal: ${formatLabel(workout.goal)}</p>
        <div class="workout-card-actions">
          <a href="${workout.videoUrl}" target="_blank" rel="noopener noreferrer">
            Watch Video
          </a>
          <button type="button" class="plan-btn" data-workout-id="${workout.id}">
            Add to Plan
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderWorkouts(workoutList) {
  if (!workoutGrid) return;

  if (workoutList.length === 0) {
    workoutGrid.innerHTML = `<p class="empty-state">No workouts match your filters.</p>`;
    return;
  }

  workoutGrid.innerHTML = workoutList
    .map((workout) => createWorkoutCard(workout))
    .join("");
}

function filterWorkouts() {
  const selectedMuscle = muscleFilter.value;
  const selectedGoal = goalFilter.value;

  const filtered = workouts.filter((workout) => {
    const matchesMuscle =
      selectedMuscle === "all" || workout.category === selectedMuscle;
    const matchesGoal =
      selectedGoal === "all" || workout.goal === selectedGoal;

    return matchesMuscle && matchesGoal;
  });

  renderWorkouts(filtered);
}

function saveWeeklyPlan() {
  localStorage.setItem("weeklyPlan", JSON.stringify(weeklyPlan));
}

function renderWeeklyPlan() {
  dayNames.forEach((day) => {
    const listElement = document.getElementById(`${day}-list`);
    if (!listElement) return;

    const workoutsForDay = weeklyPlan[day];

    if (!workoutsForDay || workoutsForDay.length === 0) {
      listElement.innerHTML = `<li class="plan-empty">No workouts added yet.</li>`;
      return;
    }

    listElement.innerHTML = workoutsForDay
      .map(
        (workout) => `
          <li class="plan-item">
            <span>${workout.title}</span>
            <button
              type="button"
              class="remove-plan-btn"
              data-day="${day}"
              data-workout-id="${workout.id}"
            >
              Remove
            </button>
          </li>
        `
      )
      .join("");
  });
}

function openPlanSelector(workoutId) {
  const selectedWorkout = workouts.find((workout) => workout.id === workoutId);
  if (!selectedWorkout) return;

  selectedWorkoutForPlan = selectedWorkout;
  selectedWorkoutLabel.textContent = `Selected workout: ${selectedWorkout.title}`;

  dayCheckboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  planSelectorPanel.classList.remove("hidden");
}

function closePlanSelector() {
  selectedWorkoutForPlan = null;
  selectedWorkoutLabel.textContent = "Selected workout:";
  dayCheckboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
  planSelectorPanel.classList.add("hidden");
}

function addSelectedDaysToPlan() {
  if (!selectedWorkoutForPlan) return;

  const selectedDays = Array.from(dayCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  if (selectedDays.length === 0) {
    alert("Please select at least one day.");
    return;
  }

  selectedDays.forEach((day) => {
    weeklyPlan[day].push(selectedWorkoutForPlan);
  });

  saveWeeklyPlan();
  renderWeeklyPlan();
  closePlanSelector();
}

function removeWorkoutFromPlan(day, workoutId) {
  weeklyPlan[day] = weeklyPlan[day].filter(
    (workout) => workout.id !== workoutId
  );

  saveWeeklyPlan();
  renderWeeklyPlan();
}

if (muscleFilter && goalFilter) {
  muscleFilter.addEventListener("change", filterWorkouts);
  goalFilter.addEventListener("change", filterWorkouts);
}

if (confirmPlanBtn) {
  confirmPlanBtn.addEventListener("click", addSelectedDaysToPlan);
}

if (cancelPlanBtn) {
  cancelPlanBtn.addEventListener("click", closePlanSelector);
}

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("plan-btn")) {
    const workoutId = Number(event.target.dataset.workoutId);
    openPlanSelector(workoutId);
  }

  if (event.target.classList.contains("remove-plan-btn")) {
    const { day, workoutId } = event.target.dataset;
    removeWorkoutFromPlan(day, Number(workoutId));
  }
});

renderWorkouts(workouts);
renderWeeklyPlan();