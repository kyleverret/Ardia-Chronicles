// ============================================================
// ARDIA PRIME CHRONICLE — Faction Reaction System
// Shared across index, archive, and individual story pages.
// Reactions are stored in localStorage, keyed per story.
// ============================================================

var ARDIA_FACTIONS = [
  { id: "grand-council",    emoji: "👑", name: "Grand Council"    },
  { id: "reform-coalition", emoji: "⚖️",  name: "Reform Coalition" },
  { id: "expansionist",     emoji: "⚔️",  name: "Expansionist"     },
  { id: "shadow-legion",    emoji: "🌑", name: "Shadow Legion"    },
  { id: "arcane-academy",   emoji: "🔮", name: "Arcane Academy"   },
  { id: "magitech-guild",   emoji: "⚙️",  name: "MagiTech Guild"   },
];

function ardia_getReactions(storyId) {
  try { return JSON.parse(localStorage.getItem("ardia-rx-" + storyId) || "{}"); }
  catch (e) { return {}; }
}

function ardia_getMyReactions(storyId) {
  try { return JSON.parse(localStorage.getItem("ardia-my-rx-" + storyId) || "[]"); }
  catch (e) { return []; }
}

function ardia_toggleReaction(storyId, factionId) {
  var reactions   = ardia_getReactions(storyId);
  var myReactions = ardia_getMyReactions(storyId);
  var idx = myReactions.indexOf(factionId);

  if (idx === -1) {
    myReactions.push(factionId);
    reactions[factionId] = (reactions[factionId] || 0) + 1;
  } else {
    myReactions.splice(idx, 1);
    reactions[factionId] = Math.max(0, (reactions[factionId] || 1) - 1);
  }

  try {
    localStorage.setItem("ardia-rx-"    + storyId, JSON.stringify(reactions));
    localStorage.setItem("ardia-my-rx-" + storyId, JSON.stringify(myReactions));
  } catch (e) {}

  return { reactions: reactions, myReactions: myReactions };
}

function ardia_renderFactionReactions(storyId) {
  var reactions   = ardia_getReactions(storyId);
  var myReactions = ardia_getMyReactions(storyId);

  var btns = ARDIA_FACTIONS.map(function (f) {
    var count  = reactions[f.id] || 0;
    var active = myReactions.indexOf(f.id) !== -1 ? " active" : "";
    return (
      '<button class="faction-btn' + active + '" ' +
              'data-story-id="' + storyId + '" ' +
              'data-faction-id="' + f.id + '" ' +
              'title="React as ' + f.name + '">' +
        '<span class="faction-emoji">' + f.emoji + '</span>' +
        '<span class="faction-name">' + f.name + '</span>' +
        '<span class="faction-count">' + (count || "") + '</span>' +
      '</button>'
    );
  }).join("");

  return (
    '<div class="faction-reactions" data-story-reactions="' + storyId + '">' +
      '<div class="faction-reactions-label">Faction Response</div>' +
      '<div class="faction-reactions-btns">' + btns + '</div>' +
    '</div>'
  );
}

// Attach a single delegated click handler for all faction buttons on the page.
// Safe to call multiple times — uses a flag to prevent duplicate registration.
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

    var result      = ardia_toggleReaction(storyId, factionId);
    var reactions   = result.reactions;
    var myReactions = result.myReactions;

    // Update every reaction widget showing this story
    var containers = document.querySelectorAll(
      '.faction-reactions[data-story-reactions="' + storyId + '"]'
    );
    containers.forEach(function (container) {
      container.querySelectorAll(".faction-btn").forEach(function (b) {
        var fid   = b.dataset.factionId;
        var cnt   = reactions[fid] || 0;
        var mine  = myReactions.indexOf(fid) !== -1;
        b.classList.toggle("active", mine);
        b.querySelector(".faction-count").textContent = cnt || "";
      });
    });
  }, true); // capture phase — fires before any bubbling handler
}
