const WORKER_URL = "https://sparkling-limit-1e35.appletrivedi123.workers.dev/";


// Escape HTML for safety
function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[m]);
}

// Load feedback from GitHub via Worker
async function loadFB() {
  const res = await fetch(WORKER_URL);
  return await res.json();
}

// Save feedback via Worker (POST)
async function saveFB(arr) {
  await fetch(WORKER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arr),
  });
}

// Render feedback on page
async function renderFeedback() {
  const list = document.getElementById("feedbackList");
  list.innerHTML = "Loading...";

  let items = (await loadFB()).reverse();

  if (!items.length) {
    list.innerHTML = "<p>No feedback yet.</p>";
    return;
  }

  list.innerHTML = "";

  items.forEach((fb) => {
    const div = document.createElement("div");
    div.className = "fb-item";
    div.innerHTML = `
      <strong>${escapeHTML(fb.name)}</strong> • 
      <span class="rating">${fb.rating}/5</span><br>
      <em>${escapeHTML(fb.subject)}</em>
      <p>${escapeHTML(fb.comments)}</p>
    `;
    list.appendChild(div);
  });
}

// Handle submit
document.getElementById("fbSave").onclick = async () => {
  const name = document.getElementById("name").value || "Anonymous";
  const subject = document.getElementById("subject").value;
  const rating = parseInt(document.getElementById("rating").value);
  const comments = document.getElementById("comments").value;

  if (rating < 1 || rating > 5) {
    alert("Rating must be 1–5");
    return;
  }

  let arr = await loadFB();
  arr.push({ name, subject, rating, comments, ts: Date.now() });

  await saveFB(arr);
  await renderFeedback();

  alert("Thank you! Feedback saved.");
};

// Admin-only clear feedback
document.getElementById("fbClear").onclick = async () => {
  const pin = prompt("Enter admin PIN");

  const ADMIN_PIN = "1234"; // change to your PIN

  if (pin !== ADMIN_PIN) {
    alert("Incorrect PIN");
    return;
  }

  if (!confirm("Clear ALL feedback?")) return;

  await saveFB([]);
  await renderFeedback();

  alert("All feedback cleared.");
};

// Initial load
renderFeedback();
