const FB_KEY = "kalputsav_feedback_v1";

// load
function loadFeedback() {
  try {
    return JSON.parse(localStorage.getItem(FB_KEY) || "[]");
  } catch {
    return [];
  }
}

// save
function saveFeedback(arr) {
  localStorage.setItem(FB_KEY, JSON.stringify(arr));
}

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[m]);
}

// render
function renderFeedback() {
  const list = document.getElementById("feedbackList");
  const items = loadFeedback().reverse();
  list.innerHTML = "";

  if (!items.length) {
    list.innerHTML = "<p style='color:#777'>No feedback yet.</p>";
    return;
  }

  items.forEach(fb => {
    const div = document.createElement("div");
    div.className = "fb-item";
    div.innerHTML = `
      <div><strong>${escapeHTML(fb.name)}</strong> 
      • <span class="rating">${fb.rating}/5</span></div>
      <em>${escapeHTML(fb.subject)}</em>
      <p>${escapeHTML(fb.comments)}</p>
    `;
    list.appendChild(div);
  });
}

// save button
document.getElementById("fbSave").onclick = () => {
  const name = document.getElementById("fbName").value || "Anonymous";
  const subject = document.getElementById("fbSubject").value;
  const rating = parseInt(document.getElementById("fbRating").value);
  const comments = document.getElementById("fbComments").value.trim();

  if (rating < 1 || rating > 5) {
    alert("Rating must be between 1-5");
    return;
  }

  const fb = loadFeedback();
  fb.push({ name, subject, rating, comments });
  saveFeedback(fb);

  renderFeedback();
  document.getElementById("fbComments").value = "";
  alert("Feedback saved!");
};

// clear button

  document.getElementById("fbClear").onclick = () => {
  const pin = prompt("Only admins all allowed to clear feedback. Enter admin PIN to clear all feedback:");

  // Change this PIN to anything you want
  const ADMIN_PIN = "0612";

  if (pin === ADMIN_PIN) {
    if (confirm("Are you sure you want to clear all feedback?")) {
      localStorage.removeItem(FB_KEY);
      renderFeedback();
      alert("All feedback cleared.");
    }
  } else {
    alert("Incorrect PIN. You are not allowed to clear feedback.");
  }
};

  


// initial load
renderFeedback();
