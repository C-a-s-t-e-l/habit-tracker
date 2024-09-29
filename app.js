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
    const habitDiv = document.createElement('div');
    habitDiv.classList.add('habit');
    habitDiv.setAttribute('data-id', habit.id);

    const habitInfo = document.createElement('div');
    habitInfo.classList.add('habit-info');
    habitInfo.innerHTML = `<strong>${habit.name}</strong>`;

    const countersDiv = document.createElement('div');
    countersDiv.classList.add('counters');

    // Create counters
    const secondCounter = document.createElement('div');
    secondCounter.classList.add('counter');
    secondCounter.innerHTML = `Seconds: ${habit.seconds}`;

    const hourCounter = document.createElement('div');
    hourCounter.classList.add('counter');
    hourCounter.innerHTML = `Hours: ${habit.hours}`;

    const dayCounter = document.createElement('div');
    dayCounter.classList.add('counter');
    dayCounter.innerHTML = `Days: ${habit.days}`;

    countersDiv.appendChild(secondCounter);
    countersDiv.appendChild(hourCounter);
    countersDiv.appendChild(dayCounter);

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = 'Delete';

    // Append all to habitDiv
    habitDiv.appendChild(habitInfo);
    habitDiv.appendChild(countersDiv);
    habitDiv.appendChild(deleteBtn);

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
        hours: 0,
        days: 0,
        lastUpdated: Date.now() // Initialize lastUpdated
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

// Function to calculate elapsed time and update counters
function calculateElapsedTime() {
    const now = Date.now();

    habits.forEach((habit, index) => {
        const elapsedMilliseconds = now - habit.lastUpdated;
        const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);

        habit.seconds += elapsedSeconds;

        // Convert seconds to hours
        if (habit.seconds >= 3600) {
            habit.hours += Math.floor(habit.seconds / 3600);
            habit.seconds = habit.seconds % 3600;
        }

        // Convert hours to days
        if (habit.hours >= 24) {
            habit.days += Math.floor(habit.hours / 24);
            habit.hours = habit.hours % 24;
        }

        // Update lastUpdated timestamp
        habit.lastUpdated = now;

        // Update the habit in the array
        habits[index] = habit;
    });

    saveHabits();
    renderHabits();
}

// Function to update counters while the app is open
function updateCounters() {
    const now = Date.now();

    habits.forEach((habit, index) => {
        // Calculate the time difference since the last update
        const elapsedMilliseconds = now - habit.lastUpdated;
        const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);

        if (elapsedSeconds >= 1) {
            habit.seconds += elapsedSeconds;

            // Convert seconds to hours
            if (habit.seconds >= 3600) {
                habit.hours += Math.floor(habit.seconds / 3600);
                habit.seconds = habit.seconds % 3600;
            }

            // Convert hours to days
            if (habit.hours >= 24) {
                habit.days += Math.floor(habit.hours / 24);
                habit.hours = habit.hours % 24;
            }

            // Update lastUpdated timestamp
            habit.lastUpdated = now;

            // Update the habit in the array
            habits[index] = habit;
        }
    });

    saveHabits();
    renderHabits();
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

// Initial calculations and render
calculateElapsedTime();
renderHabits();

// Update counters every second
setInterval(updateCounters, 1000);
