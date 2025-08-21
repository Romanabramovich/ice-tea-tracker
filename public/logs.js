// logs.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

// (optional) simple gate
if (localStorage.getItem("isAuthenticated") !== "true") {
  location.href = "landing.html";
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM target (fallback to the first .logs-table if id is missing)
const listEl =
  document.getElementById("logs-list") || document.querySelector(".logs-table");

// drink → icon (adjust paths to match your project)
const ICON = {
  bottle: "icons/bottle.png",
  can: "icons/can.png",
  carton: "icons/carton.png",
  "juice-box": "icons/juice-box.png",
  "fountain-small": "icons/fountain-drink.png",
  "fountain-medium": "icons/fountain-drink.png",
  "fountain-large": "icons/fountain-drink.png",
};

// (optional) fallback volumes if some docs don’t have 'volume'
const DEFAULT_VOL = {
  bottle: 500,
  can: 330,
  carton: 250,
  "juice-box": 200,
  "fountain-small": 500,
  "fountain-medium": 750,
  "fountain-large": 1000,
};

function fmtDate(ts) {
  const d = ts?.toDate?.() ?? new Date();
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function makeCard({ drink, volume, review, ts }) {
  const wrapper = document.createElement("div");
  wrapper.className = "log-entry";

  const dateEl = document.createElement("div");
  dateEl.className = "log-date";
  dateEl.textContent = fmtDate(ts);

  const content = document.createElement("div");
  content.className = "log-content";

  const info = document.createElement("div");
  info.className = "drink-info";

  const img = document.createElement("img");
  img.className = "drink-icon";
  img.alt = drink || "drink";
  img.src = ICON[drink] || "icons/bottle.png";

  const vol = document.createElement("span");
  vol.className = "drink-volume";
  const ml = Number.isFinite(volume) ? volume : DEFAULT_VOL[drink] || 0;
  vol.textContent = ml ? `${ml}mL` : "";

  const msg = document.createElement("div");
  msg.className = "log-message";
  msg.textContent = review || "";

  info.appendChild(img);
  info.appendChild(vol);
  content.appendChild(info);
  content.appendChild(msg);

  wrapper.appendChild(dateEl);
  wrapper.appendChild(content);
  return wrapper;
}

async function loadLogs() {
  try {
    // newest first, at most 5
    const q = query(collection(db, "iceTea"), orderBy("ts", "desc"), limit(5));
    const snap = await getDocs(q);

    // clear and render exactly what we have (0–5 items)
    listEl.replaceChildren();
    snap.forEach((docSnap) => {
      const card = makeCard(docSnap.data());
      listEl.appendChild(card);
    });
  } catch (err) {
    console.error("Failed to load logs:", err);
    // Optional: leave container empty; no empty-state per your preference
  }
}

loadLogs();
