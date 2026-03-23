// ============================================================
// ARDIA PRIME CHRONICLE — Faction Reaction System
// Shared across index and archive pages.
// Counts are stored in Firebase Realtime Database (shared).
// "My reactions" (which factions I clicked) are in localStorage.
// ============================================================

// ── Firebase setup ───────────────────────────────────────────
var firebaseConfig = {
  apiKey:            "AIzaSyCQBcSqdsgqpuJaq8_SDre0h5ESs2mnWN0",
  authDomain:        "ardia-42a9d.firebaseapp.com",
  databaseURL:       "https://ardia-42a9d-default-rtdb.firebaseio.com",
  projectId:         "ardia-42a9d",
  storageBucket:     "ardia-42a9d.firebasestorage.app",
  messagingSenderId: "602179176464",
  appId:             "1:602179176464:web:72f758f51ed5af8765a295",
  measurementId:     "G-HXZ0Y3XEQL"
};

firebase.initializeApp(firebaseConfig);
var _ardia_db = firebase.database();

// ── Faction definitions ──────────────────────────────────────
var ARDIA_FACTIONS = [
  { id: "grand-council",    emoji: "👑", name: "Grand Council"    },
  { id: "reform-coalition", emoji: "⚖️",  name: "Reform Coalition" },
  { id: "expansionist",     emoji: "⚔️",  name: "Expansionist"     },
  { id: "shadow-legion",    emoji: "🌑", name: "Shadow Legion"    },
  { id: "arcane-academy",   emoji: "🔮", name: "Arcane Academy"   },
  { id: "magitech-guild",   emoji: "⚙️",  name: "MagiTech Guild"   },
];

// ── localStorage helpers (per-user, per-device) ──────────────
function ardia_getMyReactions(storyId) {
  try { return JSON.parse(localStorage.getItem("ardia-my-rx-" + storyId) || "[]"); }
  catch (e) { return []; }
}

function ardia_saveMyReactions(storyId, arr) {
  try { localStorage.setItem("ardia-my-rx-" + storyId, JSON.stringify(arr)); }
  catch (e) {}
}

// ── Firebase read / write ────────────────────────────────────

// Track which story IDs already have an active Firebase listener.
var _ardia_subscribed = {};

// Subscribe to real-time count updates for a story.
// Updates every matching reaction widget on the page whenever Firebase changes.
function ardia_subscribeStory(storyId) {
  if (_ardia_subscribed[storyId]) return;
  _ardia_subscribed[storyId] = true;

  _ardia_db.ref("reactions/" + storyId).on("value", function (snapshot) {
    var reactions   = snapshot.val() || {};
    var myReactions = ardia_getMyReactions(storyId);

    document.querySelectorAll(
      '.faction-reactions[data-story-reactions="' + storyId + '"]'
    ).forEach(function (container) {
      container.querySelectorAll(".faction-btn").forEach(function (btn) {
        var fid = btn.dataset.factionId;
        btn.classList.toggle("active", myReactions.indexOf(fid) !== -1);
        btn.querySelector(".faction-count").textContent = reactions[fid] || "";
      });
    });
  });
}

// Toggle a reaction: update localStorage immediately, then run a Firebase
// transaction so the count change is atomic even with concurrent users.
function ardia_toggleReaction(storyId, factionId) {
  var myReactions = ardia_getMyReactions(storyId);
  var idx   = myReactions.indexOf(factionId);
  var delta = idx === -1 ? 1 : -1;

  if (idx === -1) myReactions.push(factionId);
  else            myReactions.splice(idx, 1);
  ardia_saveMyReactions(storyId, myReactions);

  _ardia_db.ref("reactions/" + storyId + "/" + factionId).transaction(function (current) {
    return Math.max(0, (current || 0) + delta);
  });

  return myReactions; // returned so the click handler can update active states immediately
}

// ── Render ───────────────────────────────────────────────────

function ardia_renderFactionReactions(storyId) {
  var myReactions = ardia_getMyReactions(storyId);

  var btns = ARDIA_FACTIONS.map(function (f) {
    var active = myReactions.indexOf(f.id) !== -1 ? " active" : "";
    return (
      '<button class="faction-btn' + active + '" ' +
              'data-story-id="' + storyId + '" ' +
              'data-faction-id="' + f.id + '" ' +
              'title="React as ' + f.name + '">' +
        '<span class="faction-emoji">' + f.emoji + '</span>' +
        '<span class="faction-name">' + f.name + '</span>' +
        '<span class="faction-count"></span>' +
      '</button>'
    );
  }).join("");

  // Subscribe after a short delay so the DOM node exists before the first
  // Firebase snapshot arrives.
  setTimeout(function () { ardia_subscribeStory(storyId); }, 0);

  return (
    '<div class="faction-reactions" data-story-reactions="' + storyId + '">' +
      '<div class="faction-reactions-label">Faction Response</div>' +
      '<div class="faction-reactions-btns">' + btns + '</div>' +
    '</div>'
  );
}

// ── Event delegation ─────────────────────────────────────────

function ardia_attachReactionEvents() {
  if (window._ardia_reactions_attached) return;
  window._ardia_reactions_attached = true;

  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".faction-btn");
    if (!btn) return;

    var storyId   = btn.dataset.storyId;
    var factionId = btn.dataset.factionId;
    if (!storyId || !factionId) return;

    e.stopImmediatePropagation();
    e.preventDefault();

    var myReactions = ardia_toggleReaction(storyId, factionId);

    // Update active states immediately; counts update when Firebase responds.
    document.querySelectorAll(
      '.faction-reactions[data-story-reactions="' + storyId + '"]'
    ).forEach(function (container) {
      container.querySelectorAll(".faction-btn").forEach(function (b) {
        b.classList.toggle("active", myReactions.indexOf(b.dataset.factionId) !== -1);
      });
    });
  }, true);
}
