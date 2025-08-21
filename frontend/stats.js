// stats.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- DOM targets
const monthCountEl = document.getElementById("month-drink-count");
const monthMlEl = document.getElementById("month-total-volume");
const yearCountEl = document.getElementById("year-drink-count");
const yearMlEl = document.getElementById("year-total-volume");
const favNameEl = document.getElementById("month-favorite-name");
const favImgEl = document.getElementById("month-favorite-img");

// Icon map for favorite (same names as your 'drink' values)
const ICON = {
  bottle: "icons/bottle.png",
  can: "icons/can.png",
  carton: "icons/carton.png",
  "juice-box": "icons/juice-box.png",
  "fountain-small": "icons/fountain-drink.png",
  "fountain-medium": "icons/fountain-drink.png",
  "fountain-large": "icons/fountain-drink.png",
};

// --- time windows (local time)
function monthBounds(d = new Date()) {
  const start = new Date(d.getFullYear(), d.getMonth(), 1);
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
  return { startTs: Timestamp.fromDate(start), endTs: Timestamp.fromDate(end) };
}
function yearBounds(d = new Date()) {
  const start = new Date(d.getFullYear(), 0, 1);
  const end = new Date(d.getFullYear() + 1, 0, 1);
  return { startTs: Timestamp.fromDate(start), endTs: Timestamp.fromDate(end) };
}

function sumAndMode(docs) {
  let totalMl = 0;
  const freq = Object.create(null);

  docs.forEach((ds) => {
    const data = ds.data();
    if (typeof data.volume === "number") totalMl += data.volume;
    const k = data.drink;
    if (typeof k === "string") freq[k] = (freq[k] || 0) + 1;
  });

  // mode
  let best = null,
    bestCount = -1;
  for (const k in freq) {
    if (freq[k] > bestCount) {
      best = k;
      bestCount = freq[k];
    }
  }
  return { count: docs.size, totalMl, favorite: best };
}

async function loadStats() {
  // Month
  const { startTs: mStart, endTs: mEnd } = monthBounds();
  const mQ = query(
    collection(db, "iceTea"),
    where("ts", ">=", mStart),
    where("ts", "<", mEnd)
  );
  const mSnap = await getDocs(mQ);
  const { count: mCount, totalMl: mMl, favorite: mFav } = sumAndMode(mSnap);

  monthCountEl.textContent = String(mCount);
  monthMlEl.textContent = String(mMl);

  if (mFav) {
    favNameEl.textContent = mFav;
    const src = ICON[mFav];
    if (src) {
      favImgEl.src = src;
      favImgEl.style.display = "";
    } else {
      favImgEl.style.display = "none";
    }
  } else {
    favNameEl.textContent = "-";
    favImgEl.style.display = "none";
  }

  // Year
  const { startTs: yStart, endTs: yEnd } = yearBounds();
  const yQ = query(
    collection(db, "iceTea"),
    where("ts", ">=", yStart),
    where("ts", "<", yEnd)
  );
  const ySnap = await getDocs(yQ);
  const { count: yCount, totalMl: yMl } = sumAndMode(ySnap);

  yearCountEl.textContent = String(yCount);
  yearMlEl.textContent = String(yMl);
}

loadStats().catch((err) => console.error("stats error:", err));
