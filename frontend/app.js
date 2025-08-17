// Tea Tracker App JavaScript

class TeaTracker {
  constructor() {
    this.currentCount = 0;
    this.monthlyCount = 0;
    this.yearlyCount = 0;
    this.teaVolume = 0;

    this.init();
  }

  init() {
    this.loadData();
    this.setupEventListeners();
    this.updateDisplay();
    this.updateGreeting();
  }

  loadData() {
    // Load data from localStorage if available
    const savedData = localStorage.getItem("teaTrackerData");
    if (savedData) {
      const data = JSON.parse(savedData);
      this.currentCount = data.currentCount || 0;
      this.monthlyCount = data.monthlyCount || 0;
      this.yearlyCount = data.yearlyCount || 0;
    }
  }

  saveData() {
    const data = {
      currentCount: this.currentCount,
      monthlyCount: this.monthlyCount,
      yearlyCount: this.yearlyCount,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem("teaTrackerData", JSON.stringify(data));
  }

  setupEventListeners() {
    // Increment button
    document.getElementById("incrementBtn").addEventListener("click", () => {
      this.increment();
    });

    // Decrement button
    document.getElementById("decrementBtn").addEventListener("click", () => {
      this.decrement();
    });

    // Reset button
    document.getElementById("resetBtn").addEventListener("click", () => {
      this.reset();
    });

    // Navigation items
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        this.handleNavigation(e);
      });
    });

    // Add touch feedback for mobile
    this.addTouchFeedback();
  }

  increment() {
    this.currentCount++;
    this.monthlyCount++;
    this.yearlyCount++;
    this.saveData();
    this.updateDisplay();
    this.addButtonFeedback("incrementBtn");
  }

  decrement() {
    if (this.currentCount > 0) {
      this.currentCount--;
      this.monthlyCount--;
      this.yearlyCount--;
      this.saveData();
      this.updateDisplay();
      this.addButtonFeedback("decrementBtn");
    }
  }

  reset() {
    if (confirm("Are you sure you want to reset today's count?")) {
      this.currentCount = 0;
      this.saveData();
      this.updateDisplay();
      this.addButtonFeedback("resetBtn");
    }
  }

  updateDisplay() {
    // Update the main counts
    document.getElementById("monthlyCount").textContent = this.monthlyCount;
    document.getElementById("yearlyCount").textContent = this.yearlyCount;

    // Calculate and update volume displays
    const monthlyVolume = this.monthlyCount * this.teaVolume;
    const yearlyVolume = this.yearlyCount * this.teaVolume;

    // Update the volume text in the stats
    const monthlyStat = document.querySelector(
      ".stat-item:first-child .highlight"
    );
    const yearlyStat = document.querySelector(
      ".stat-item:last-child .highlight"
    );

    if (monthlyStat) {
      monthlyStat.textContent = monthlyVolume.toLocaleString();
    }
    if (yearlyStat) {
      yearlyStat.textContent = yearlyVolume.toLocaleString();
    }
  }

  updateGreeting() {
    const hour = new Date().getHours();
    let greeting = "good morning, jayme";

    if (hour >= 12 && hour < 17) {
      greeting = "good afternoon, jayme";
    } else if (hour >= 17) {
      greeting = "good evening, jayme";
    }

    document.querySelector("greeting-section .greeting").textContent = greeting;
  }

  handleNavigation(e) {
    // Remove active class from all nav items
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.remove("active");
    });

    // Add active class to clicked item
    e.currentTarget.classList.add("active");

    // Handle navigation (for future implementation)
    const navLabel = e.currentTarget.querySelector(".nav-label").textContent;
    console.log(`Navigating to: ${navLabel}`);

    // For now, just show an alert for other sections
    if (navLabel !== "home") {
      alert(`${navLabel} section coming soon!`);
      // Reset to home
      document.querySelectorAll(".nav-item").forEach((item) => {
        item.classList.remove("active");
      });
      document.querySelector(".nav-item:first-child").classList.add("active");
    }
  }

  addTouchFeedback() {
    // Add haptic feedback for iOS devices
    if ("vibrate" in navigator) {
      document.querySelectorAll(".action-btn").forEach((btn) => {
        btn.addEventListener("touchstart", () => {
          navigator.vibrate(50);
        });
      });
    }
  }

  addButtonFeedback(buttonId) {
    const button = document.getElementById(buttonId);
    button.style.transform = "scale(0.95)";

    setTimeout(() => {
      button.style.transform = "";
    }, 150);
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new TeaTracker();
});

// Service Worker registration for PWA functionality
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}
