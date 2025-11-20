// ------------------------------
// GitHub-based universal feedback system
// ------------------------------

const FB_FILE_URL =
  "https://raw.githubusercontent.com/HarshitTrivedi-HT/kalpostav-feedback/main/feedback.json";

const FB_API_URL =
  "https://api.github.com/repos/HarshitTrivedi-HT/kalpostav-feedback/contents/feedback.json";

// IMPORTANT — Replace with your GitHub token
const GITHUB_TOKEN = "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";

// ------------------------------
// Load Feedback (from GitHub JSON)
// ------------------------------
async function loadFB() {
  const res = await fetch(FB_FILE_URL + "?t=" + Date.now()); // avoid caching
  return await res.json();
}

// ------------------------------
// Save Feedback (overwrite JSON on GitHub)
// ------------------------------
async function saveFB(arr) {
  // 1. Get current file SHA (required by GitHub API to overwrite)
  const oldFile = await fetch(FB_API_URL, {
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
  }).then((r) => r.json());

  // 2. Convert updated JSON to Base64
  const newContent = btoa(JSON.stringify(arr, null, 2));

  // 3. Upload (PUT request)
  await fetch(FB_API_URL, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "Update feedback.json",
      content: newContent,
      sha: oldFile.sha
    })
  });
}

// ------------------------------
// Escape HTML (for safety)
// ------------------------------
function escapeHTML(str) {
  return String(str || "").replace(/[&<>"']/g, (m) => {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
