// app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  Timestamp,
  serverTimestamp,
  getCountFromServer,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { firebaseConfig } from "./config.js";

// simple gate (keep if you want)
if (localStorage.getItem("isAuthenticated") !== "true") {
  location.href = "index.html";
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const SECRET = "roman"; 

// ---- DOM
const form = document.getElementById("tea-form");
const teaCounter = document.getElementById("counter");
const greeting = document.querySelector(".greeting");
//setGreeting(greeting);

// Map drink -> volume (mL)
const VOLUME = {
  bottle: 500,
  can: 340,
  carton: 1500,
  "juice-box": 200,
  "fountain-small": 350,
  "fountain-medium": 500,
  "fountain-large": 800,
};

// Month range helper
function monthRange(d = new Date()) {
  const start = new Date(d.getFullYear(), d.getMonth(), 1);
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
  return { start: Timestamp.fromDate(start), end: Timestamp.fromDate(end) };
}

// Update “this will be ice tea number” (current month count + 1)
async function updateCounter() {
  try {
    const { start, end } = monthRange();
    const col = collection(db, "iceTea");
    const q = query(col, where("ts", ">=", start), where("ts", "<", end));
    const agg = await getCountFromServer(q);
    const count = agg.data().count || 0;
    teaCounter.textContent = String(count + 1);
  } catch (error) {
    console.error("counter error:", error);
  }
}

// Handle submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const drink = form.querySelector('input[name="drink"]:checked')?.value || "";
  const review = form.querySelector('textarea[name="review"]').value.trim();

  if (!drink) {
    alert("please pick a drink");
    return;
  }
  if (!review) {
    alert("please leave a review");
    return;
  }

  const volume = VOLUME[drink];
  if (!volume) {
    alert("unknown drink type");
    return;
  }

  try {
    await addDoc(collection(db, "iceTea"), {
      drink,
      volume,
      review,
      ts: serverTimestamp(),
      secret: SECRET,
    });

    form.reset();
    updateCounter(); // reflect the next number after saving
  } catch (error) {
    console.error("add error:", error);
    alert("could not save your entry (check console)");
  }
});

// Initial load
updateCounter();
