// profile.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

// simple gate
if (localStorage.getItem("isAuthenticated") !== "true") {
  location.href = "index.html";
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Month abbreviations
const MONTHS = [
  "jan", "feb", "mar", "apr",
  "may", "jun", "jul", "aug",
  "sep", "oct", "nov", "dec"
];

// State management
let selectedYear = new Date().getFullYear();
let allData = []; // Cache all data

// DOM elements
const yearDisplay = document.getElementById("current-year");
const prevYearBtn = document.getElementById("prev-year");
const nextYearBtn = document.getElementById("next-year");
const yearlyCountEl = document.getElementById("yearly-count");

async function fetchAllData() {
  try {
    const q = query(collection(db, "iceTea"));
    const snap = await getDocs(q);
    
    allData = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.ts) {
        allData.push({
          date: data.ts.toDate(),
          ...data
        });
      }
    });
  } catch (err) {
    console.error("Failed to fetch data:", err);
  }
}

function updateCalendar() {
  // Count entries per month for selected year
  const monthlyCounts = new Array(12).fill(0);
  let yearlyTotal = 0;

  allData.forEach((entry) => {
    if (entry.date.getFullYear() === selectedYear) {
      const month = entry.date.getMonth(); // 0-11
      monthlyCounts[month]++;
      yearlyTotal++;
    }
  });

  // Build the 3x4 table (3 rows, 4 columns = 12 months)
  const calendarBody = document.getElementById("calendar-body");
  calendarBody.replaceChildren();

  for (let row = 0; row < 3; row++) {
    const tr = document.createElement("tr");
    
    for (let col = 0; col < 4; col++) {
      const monthIndex = row * 4 + col; // 0-11
      const td = document.createElement("td");
      td.className = "month-cell";
      
      const monthLabel = document.createElement("div");
      monthLabel.className = "month-label";
      monthLabel.textContent = MONTHS[monthIndex];
      
      const monthCount = document.createElement("div");
      monthCount.className = "month-count";
      monthCount.textContent = monthlyCounts[monthIndex];
      
      td.appendChild(monthLabel);
      td.appendChild(monthCount);
      tr.appendChild(td);
    }
    
    calendarBody.appendChild(tr);
  }

  // Update year display
  yearDisplay.textContent = selectedYear;
  
  // Update yearly total
  yearlyCountEl.textContent = yearlyTotal;
  
  // Update button states
  const currentYear = new Date().getFullYear();
  nextYearBtn.disabled = selectedYear >= currentYear;
}

// Event listeners
prevYearBtn.addEventListener("click", () => {
  selectedYear--;
  updateCalendar();
});

nextYearBtn.addEventListener("click", () => {
  const currentYear = new Date().getFullYear();
  if (selectedYear < currentYear) {
    selectedYear++;
    updateCalendar();
  }
});

// Initialize
async function init() {
  await fetchAllData();
  updateCalendar();
}

init();
