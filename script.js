// ===============================
// Habit Tracker
// ===============================

const habitInput = document.getElementById("habitInput");
const addHabitBtn = document.getElementById("addHabitBtn");
const habitList = document.querySelector(".habit-list");

const totalHabits = document.getElementById("totalHabits");
const completedHabits = document.getElementById("completedHabits");
const bestStreak = document.getElementById("bestStreak");

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const themeBtn = document.getElementById("themeBtn");

let habits = JSON.parse(localStorage.getItem("habits")) || [];

// ===============================
// Save
// ===============================

function saveHabits() {
    localStorage.setItem("habits", JSON.stringify(habits));
}

// ===============================
// Add Habit
// ===============================

addHabitBtn.addEventListener("click", addHabit);

habitInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addHabit();
});

function addHabit() {

    const name = habitInput.value.trim();

    if (name === "") {
        alert("Enter a habit.");
        return;
    }

    habits.push({
        id: Date.now(),
        name,
        completed: false,
        streak: 0
    });

    habitInput.value = "";

    saveHabits();
    renderHabits();
}

// ===============================
// Render
// ===============================

function renderHabits() {

    habitList.innerHTML = "";

    habits.forEach((habit) => {

        const card = document.createElement("div");
        card.className = "habit-card";

        card.innerHTML = `
            <div class="habit-info">
                <input
                    type="checkbox"
                    ${habit.completed ? "checked" : ""}
                >

                <div>
                    <h3>${habit.name}</h3>
                    <p>🔥 ${habit.streak} Day Streak</p>
                </div>
            </div>

            <button class="delete-btn">
                🗑
            </button>
        `;

        // Checkbox
        const checkbox = card.querySelector("input");

        checkbox.addEventListener("change", () => {

            habit.completed = checkbox.checked;

            if (habit.completed) {
                habit.streak++;
            } else {
                if (habit.streak > 0)
                    habit.streak--;
            }

            saveHabits();
            renderHabits();

        });

        // Delete

        const deleteBtn = card.querySelector(".delete-btn");

        deleteBtn.addEventListener("click", () => {

            habits = habits.filter(h => h.id !== habit.id);

            saveHabits();
            renderHabits();

        });

        habitList.appendChild(card);

    });

    updateDashboard();
}

// ===============================
// Dashboard
// ===============================

function updateDashboard() {

    totalHabits.textContent = habits.length;

    const completed = habits.filter(h => h.completed).length;

    completedHabits.textContent = completed;

    let max = 0;

    habits.forEach(h => {
        if (h.streak > max)
            max = h.streak;
    });

    bestStreak.textContent = max + " 🔥";

    let percent = 0;

    if (habits.length > 0) {
        percent = Math.round(
            (completed / habits.length) * 100
        );
    }

    progressFill.style.width = percent + "%";
    progressText.textContent = percent + "%";

}

// ===============================
// Theme
// ===============================

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        document.body.style.background = "#111827";
        document.body.style.color = "#ffffff";

        document.querySelectorAll(".card,.habit-card,.progress-section,.add-habit input,#themeBtn")
            .forEach(el => {

                el.style.background = "#1f2937";
                el.style.color = "#fff";

            });

        localStorage.setItem("theme", "dark");

    } else {

        location.reload();

        localStorage.setItem("theme", "light");

    }

});

// Load Saved Theme

if (localStorage.getItem("theme") === "dark") {
    themeBtn.click();
}

// ===============================
// Initial Render
// ===============================

renderHabits();