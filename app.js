// Select DOM elements
const habitForm = document.getElementById('habit-form');
const habitNameInput = document.getElementById('habit-name');
const habitsContainer = document.getElementById('habits-container');

// Initialize habits array from localStorage or empty array
let habits = JSON.parse(localStorage.getItem('habits')) || [];

// Function to save habits to localStorage
function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits));
}

// Function to create habit HTML
function createHabitElement(habit) {
    // Create main habit card
    const habitDiv = document.createElement('div');
    habitDiv.classList.add('habit');
    habitDiv.setAttribute('data-id', habit.id);

    // Create habit header
    const habitHeader = document.createElement('div');
    habitHeader.classList.add('habit-header');

    const habitName = document.createElement('div');
    habitName.classList.add('habit-name');
    habitName.textContent = habit.name;

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.title = 'Delete Habit';

    // Append name and delete button to header
    habitHeader.appendChild(habitName);
    habitHeader.appendChild(deleteBtn);

    // Create counters container
    const countersDiv = document.createElement('div');
    countersDiv.classList.add('counters');

    // Create individual counters
    const secondCounter = document.createElement('div');
    secondCounter.classList.add('counter');
    secondCounter.innerHTML = `<span>${habit.seconds}</span> Seconds`;

    const minuteCounter = document.createElement('div');
    minuteCounter.classList.add('counter');
    minuteCounter.innerHTML = `<span>${habit.minutes}</span> Minutes`;

    const hourCounter = document.createElement('div');
    hourCounter.classList.add('counter');
    hourCounter.innerHTML = `<span>${habit.hours}</span> Hours`;

    const dayCounter = document.createElement('div');
    dayCounter.classList.add('counter');
    dayCounter.innerHTML = `<span>${habit.days}</span> Days`;

    // Append counters to counters container
    countersDiv.appendChild(secondCounter);
    countersDiv.appendChild(minuteCounter);
    countersDiv.appendChild(hourCounter);
    countersDiv.appendChild(dayCounter);

    // Append header and counters to main habit card
    habitDiv.appendChild(habitHeader);
    habitDiv.appendChild(countersDiv);

    // Event listener for delete
    deleteBtn.addEventListener('click', () => deleteHabit(habit.id));

    return habitDiv;
}

// Function to render all habits
function renderHabits() {
    habitsContainer.innerHTML = '';
    habits.forEach(habit => {
        const habitElement = createHabitElement(habit);
        habitsContainer.appendChild(habitElement);
    });
}

// Function to add a new habit
function addHabit(name) {
    const newHabit = {
        id: Date.now(),
        name: name,
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 0
    };
    habits.push(newHabit);
    saveHabits();
    renderHabits();
}

// Function to delete a habit
function deleteHabit(id) {
    habits = habits.filter(habit => habit.id !== id);
    saveHabits();
    renderHabits();
}

// Function to update counters (Optimized)
function updateCounters() {
    const now = Date.now();
    const oneSecond = 1000;

    habits.forEach((habit, index) => {
        // Increment seconds
        habit.seconds += 1;

        // Convert seconds to minutes
        if (habit.seconds >= 60) {
            habit.seconds = 0;
            habit.minutes += 1;
        }

        // Convert minutes to hours
        if (habit.minutes >= 60) {
            habit.minutes = 0;
            habit.hours += 1;
        }

        // Convert hours to days
        if (habit.hours >= 24) {
            habit.hours = 0;
            habit.days += 1;
        }

        // Update the habit in the array
        habits[index] = habit;

        // Update DOM elements directly to avoid re-rendering
        const habitDiv = document.querySelector(`.habit[data-id='${habit.id}']`);
        if (habitDiv) {
            const counters = habitDiv.querySelectorAll('.counter span');
            if (counters[0]) counters[0].textContent = habit.seconds;
            if (counters[1]) counters[1].textContent = habit.minutes;
            if (counters[2]) counters[2].textContent = habit.hours;
            if (counters[3]) counters[3].textContent = habit.days;
        }
    });
    saveHabits();
}

// Event listener for form submission
habitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const habitName = habitNameInput.value.trim();
    if (habitName !== '') {
        addHabit(habitName);
        habitNameInput.value = '';
    }
});

// Initial render
renderHabits();

// Update counters every second
setInterval(updateCounters, 1000);
