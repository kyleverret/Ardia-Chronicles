// ============================================================
// ARDIA PRIME CHRONICLE — Sports Page Script
// Populates sports.html with:
//   - In-season banner
//   - Recent scores & results
//   - League standings
//   - Monthly Athlete of the Month hero card
//   - Sports news stories (from STORIES in data.js)
//   - Sports staff cards (expanded profiles)
//   - Tournament calendar sidebar
//   - Story modal
// ============================================================

(function () {
  "use strict";

  // ── Ardia calendar helpers ───────────────────────────────────

  const ARDIA_MONTH_NAMES = (typeof ARDIA_MONTHS !== "undefined")
    ? ARDIA_MONTHS.map((m) => m.name)
    : ["Frosthold","Iceveil","Thawbreak","Bloomrise","Brightmantle","Highsun",
       "Embertide","Harvestmoon","Goldenveil","Shadowfall","Ashgale","Starnight"];

  const currentRealMonth = new Date().getMonth(); // 0-based
  const currentArdiaMonth = ARDIA_MONTH_NAMES[currentRealMonth];

  function setCurrentDate() {
    const el = document.getElementById("current-date");
    if (!el) return;
    const now = new Date();
    el.textContent = `${now.getDate()} ${currentArdiaMonth}, Year 847 AP`;
  }

  // ── In-season sports definition ──────────────────────────────
  // Each entry: { name, months[] (0-based real month indices), status }

  const ALL_SPORTS = [
    { name: "Crystal Shields",      months: [0, 1],             color: "#6699cc" },
    { name: "Mageball",             months: [2, 3, 4],          color: "#44bb66" },
    { name: "Grand Mage Duels",     months: [2, 9],             color: "#9944cc" },
    { name: "Dragonrider Racing",   months: [3, 4, 5, 6],       color: "#ff6600" },
    { name: "Archery Circuit",      months: [3, 4, 5],          color: "#cc9900" },
    { name: "Alch. Athletics",      months: [4, 5, 6],          color: "#22aaaa" },
    { name: "Griffin Polo",         months: [5, 6, 7, 8],       color: "#aa44aa" },
    { name: "Free-Flying",          months: [7, 8, 9],          color: "#55aaff" },
    { name: "Jousting Circuit",     months: [7, 8, 9],          color: "#cc4422" },
    { name: "Runeblade Fencing",    months: [0,1,2,3,4,5,6,7,8,9,10,11], color: "#888888" },
  ];

  function getSportsInSeason() {
    return ALL_SPORTS.filter((s) => s.months.includes(currentRealMonth));
  }

  // ── Recent Scores (world-canon results) ──────────────────────

  const RECENT_SCORES = [
    {
      sport: "Mageball",
      home: "Praxis Stormcrest", homeScore: 16,
      away: "Valdris Tidebreakers", awayScore: 11,
      date: "20 Thawbreak, 847 AP",
      venue: "Crystal Arena, Praxis",
    },
    {
      sport: "Mageball",
      home: "Ironkeep Bulwarks", homeScore: 8,
      away: "Ashfield Reapers", awayScore: 14,
      date: "21 Thawbreak, 847 AP",
      venue: "Ironkeep League Ground",
    },
    {
      sport: "Mageball",
      home: "Thornhaven Foxes", homeScore: 10,
      away: "Arcane Academy Scholars", awayScore: 13,
      date: "21 Thawbreak, 847 AP",
      venue: "Thornhaven Pitch",
      note: "Academy's 3rd straight away win",
    },
    {
      sport: "Grand Mage Duels",
      home: "Magister Solvaine Dex", homeScore: 27,
      away: "Pyxis Ashbloom", awayScore: 24,
      date: "18 Thawbreak, 847 AP",
      venue: "Dueling Citadel, Praxis",
      note: "Spring Tournament — Semifinal",
    },
    {
      sport: "Grand Mage Duels",
      home: "Goran Vexstrike", homeScore: 28,
      away: "Reln Ashford", awayScore: 19,
      date: "18 Thawbreak, 847 AP",
      venue: "Dueling Citadel, Praxis",
      note: "Spring Tournament — Semifinal (result under review)",
    },
    {
      sport: "Dragonrider Racing",
      home: "Praxis Falcons", homeScore: null,
      away: "Team Emberveil", awayScore: null,
      date: "Postponed",
      venue: "Ashfield Stadium",
      note: "Championship Final postponed — sabotage investigation ongoing",
      suspended: true,
    },
  ];

  // ── Standings data ───────────────────────────────────────────

  const STANDINGS = [
    {
      sport: "Mageball — Ardian Mageball League",
      note: "Season in progress · Thawbreak 847 AP",
      cols: ["#", "Team", "W", "D", "L", "Pts"],
      rows: [
        { pos: 1, name: "Praxis Stormcrest",         w: 9, d: 1, l: 2, pts: 28, top: true },
        { pos: 2, name: "Valdris Tidebreakers",       w: 7, d: 3, l: 2, pts: 24, top: true },
        { pos: 3, name: "Ironkeep Bulwarks",          w: 6, d: 2, l: 4, pts: 20, top: true },
        { pos: 4, name: "Ashfield Reapers",           w: 5, d: 3, l: 4, pts: 18, top: true },
        { pos: 5, name: "Arcane Academy Scholars",    w: 5, d: 1, l: 6, pts: 16 },
        { pos: 6, name: "Thornhaven Foxes",           w: 3, d: 2, l: 7, pts: 11 },
        { pos: 7, name: "Greyward Golems",            w: 2, d: 2, l: 8, pts:  8 },
        { pos: 8, name: "Verdant Wanderers",          w: 1, d: 2, l: 9, pts:  5 },
      ],
    },
    {
      sport: "Dragonrider League — 847 AP Season",
      note: "Season suspended pending sabotage investigation",
      cols: ["#", "Team", "Races", "Pts"],
      rows: [
        { pos: 1, name: "Praxis Falcons",        races: 9, pts: 71, top: true },
        { pos: 2, name: "Team Emberveil",         races: 9, pts: 68, top: true },
        { pos: 3, name: "Valdris Stormriders",    races: 9, pts: 52, top: true },
        { pos: 4, name: "Ironkeep Ironwings",     races: 9, pts: 44, top: true },
        { pos: 5, name: "Ashfield Blazers",       races: 9, pts: 33 },
        { pos: 6, name: "Greyward Thunderclaws",  races: 9, pts: 21 },
        { pos: 7, name: "Thornhaven Gliders",     races: 9, pts: 14 },
      ],
      customCols: true,
    },
    {
      sport: "Grand Mage Duels — Spring Tournament 847 AP",
      note: "Final TBD · Shadowfall Autumn Tournament scheduled",
      cols: ["#", "Competitor", "Result"],
      rows: [
        { pos: 1, name: "Magister Solvaine Dex",  result: "Final (TBD)", top: true },
        { pos: 2, name: "Goran Vexstrike",         result: "Final (TBD — result under review)", top: true },
        { pos: 3, name: "Pyxis Ashbloom",          result: "Semifinal (eliminated)" },
        { pos: 4, name: "Brennic Talvorn",         result: "Semifinal (eliminated)" },
      ],
      customCols: true,
    },
  ];

  // ── Star Athletes ────────────────────────────────────────────

  const STAR_ATHLETES = [
    {
      name: "Kira Stormwell",
      sport: "Dragonrider Racing",
      team: "Praxis Falcons",
      desc: "Two-time individual race champion and the most recognizable athlete in Ardia. Currently sidelined amid an investigation into sabotaged feed crystals. Her public statement alleging tampering shook the league.",
    },
    {
      name: "Brynn Shadowmane",
      sport: "Dragonrider Racing",
      team: "Team Emberveil",
      desc: "Controlled and technical elven rider who led Emberveil to the 846 AP Championship. Holds the record for most Crystal Gate bonuses in a single season.",
    },
    {
      name: "Torren Quickflame",
      sport: "Mageball",
      team: "Praxis Stormcrest",
      desc: "League's top scorer last season with 34 goals. Known for an almost supernatural instinct for the Surge Ball. Currently on course to beat his own record.",
    },
    {
      name: "Zenna Brightleaf",
      sport: "Mageball",
      team: "Valdris Tidebreakers",
      desc: "The best goalkeeper in the Ardian Mageball League. Holds the single-season record for clean sheets. Her reflexes are widely suspected to exceed elven baseline — her rivals call it unfair; she calls it practice.",
    },
    {
      name: "Magister Solvaine Dex",
      sport: "Grand Mage Duels",
      team: "Independent",
      desc: "Four of the last six Grand Mage Duels tournaments have ended with Solvaine Dex holding the trophy. Clinical, precise, and utterly unsentimental in competition.",
    },
    {
      name: "Dame Rowena Ironfist",
      sport: "Jousting",
      team: "Ironkeep Iron Guard",
      desc: "First woman to win the Ashfield Cup (845 AP). Her charging style is aggressive and she has unseated knights twice her size. Currently the favourite for this season's Cup.",
    },
    {
      name: "Kyra Windweave",
      sport: "Mageball",
      team: "Arcane Academy Scholars",
      desc: "The young half-elf prodigy leading the league in assists despite playing for the league's 7th-place club. Multiple teams are in transfer talks. She hasn't commented publicly.",
    },
    {
      name: "Zola Springfoot",
      sport: "Alch. Athletics",
      team: "Independent",
      desc: "Reigning multi-event champion in Alchemical Athletics. The satyr athlete from the Verdant Expanse dominates the Sprint and Long Jump with natural speed that coaches have been struggling to replicate through alchemy.",
    },
  ];

  // ── Tournament Calendar (sidebar) ───────────────────────────

  const TOURNAMENTS = [
    {
      name: "Grand Mage Duels — Spring Final",
      detail: "Thawbreak 847 AP · Dueling Citadel, Praxis",
      status: "active",
      statusLabel: "In Progress",
    },
    {
      name: "Mageball Cup",
      detail: "Final in Brightmantle (May) · Crystal Arena, Praxis",
      status: "upcoming",
      statusLabel: "Upcoming",
    },
    {
      name: "Dragonrider Championship Final",
      detail: "Scheduled Embertide (July) · Ashfield Stadium",
      status: "suspended",
      statusLabel: "Suspended — Investigation",
    },
    {
      name: "Archery Circuit Grand Final",
      detail: "Highsun (June) · Praxis Royal Range",
      status: "upcoming",
      statusLabel: "Season Opens Bloomrise",
    },
    {
      name: "Alch. Athletics Championship",
      detail: "Embertide (July) · Praxis Grand Athletics Ground",
      status: "upcoming",
      statusLabel: "Season Opens Brightmantle",
    },
    {
      name: "Ashfield Cup — Jousting",
      detail: "Shadowfall (October) · Ashfield Tiltyard",
      status: "upcoming",
      statusLabel: "Season Opens Harvestmoon",
    },
    {
      name: "Griffin Polo Grand Championship",
      detail: "Goldenveil (September) · Sunfield Polo Ground",
      status: "upcoming",
      statusLabel: "Season Opens Highsun",
    },
    {
      name: "Grand Mage Duels — Autumn Tournament",
      detail: "Shadowfall (October) · Dueling Citadel, Praxis",
      status: "upcoming",
      statusLabel: "Upcoming",
    },
    {
      name: "Free-Flying Grand Final",
      detail: "Shadowfall (October) · Sunfield Basin, Praxis",
      status: "upcoming",
      statusLabel: "Season Opens Highsun",
    },
    {
      name: "Runeblade Grand Circuit Final",
      detail: "Starnight (December) · Praxis Blade Hall",
      status: "upcoming",
      statusLabel: "Year-round season",
    },
  ];

  // ── Individual Sports Champions (kept for writing context only) ─
  // Not rendered on page; used as reference by generate-content.js

  const INDIVIDUAL_CHAMPIONS = [
    { name: "Magister Solvaine Dex", sport: "Grand Mage Duels", detail: "4× Champion" },
    { name: "Tryn Goldeneye",        sport: "Archery Circuit",  detail: "Reigning Champion · All-time record 71 pts" },
    { name: "Zola Springfoot",       sport: "Alch. Athletics",  detail: "Reigning Multi-Event Champion" },
    { name: "Master Celan Dawnblade",sport: "Runeblade Fencing",detail: "7× Grand Circuit Champion" },
    { name: "Ilex Skydancer",        sport: "Free-Flying",      detail: "3× Grand Final Champion" },
    { name: "Coran Dustweave",       sport: "Dragonrider Racing",detail: "Record 47 career race wins" },
  ];

  // ── Monthly Athlete of the Month ─────────────────────────────
  // One entry per real-calendar month (index 0 = January).
  // Each entry highlights an athlete whose sport is in-season or
  // who has a notable off-season storyline for that month.

  const MONTHLY_HEROES = [
    // 0 Jan — Frosthold: Crystal Shields season
    {
      name: "Holt Frostcleave",
      sport: "Crystal Shields",
      team: "Praxis Frostthorn",
      species: "Half-Orc",
      initials: "HF",
      stats: [
        { value: "14", label: "Power Surge Goals" },
        { value: "3rd", label: "Season Overall" },
        { value: "6", label: "Seasons Played" },
      ],
      desc: "The most physical player in the Crystal Shields league, Holt Frostcleave brings a battering-ram intensity that the Frostthorn faithful love. His Power Surge goal count leads the league every season, even when his Penalty Enclosure time threatens to undermine it. This Frosthold he is chasing a personal record — and the Praxis crowd has shown up in record numbers to watch him try.",
    },
    // 1 Feb — Iceveil: Crystal Shields Finals
    {
      name: "Lira Snowveil",
      sport: "Crystal Shields",
      team: "Iceveil Glaciers",
      species: "Elf",
      initials: "LS",
      stats: [
        { value: "1st", label: "Speed Rankings" },
        { value: "22", label: "Scoring Assists" },
        { value: "4th", label: "Finals Appearance" },
      ],
      desc: "Lira Snowveil is the fastest skater the Crystal Shields league has ever recorded, and in Iceveil she is chasing her first championship. Where Holt Frostcleave wins through force, Snowveil wins through angles — finding passing lanes that simply do not exist until she opens them. Her fourth Finals appearance is, her coaches say quietly, her best chance yet.",
    },
    // 2 Mar — Thawbreak: Mageball season opens
    {
      name: "Torren Quickflame",
      sport: "Mageball",
      team: "Praxis Stormcrest",
      species: "Human",
      initials: "TQ",
      stats: [
        { value: "34", label: "Goals Last Season" },
        { value: "12", label: "Surge Ball Goals" },
        { value: "9", label: "AML Seasons" },
      ],
      desc: "When the Mageball season opens in Thawbreak, all eyes turn to Torren Quickflame. The Stormcrest striker led the league last season with 34 goals and shows no sign of slowing. What makes him exceptional is not raw speed but instinct — he finds the Surge Ball before anyone else has spotted it, and finishes with a clinical calm that younger players study obsessively.",
    },
    // 3 Apr — Bloomrise: Dragonrider Racing opens
    {
      name: "Talissa Firebright",
      sport: "Dragonrider Racing",
      team: "Ashfield Blazers",
      species: "Half-Elf",
      initials: "TF",
      stats: [
        { value: "#1", label: "Fastest Pre-Season Trial" },
        { value: "1st", label: "Full Season Debut" },
        { value: "4", label: "Top-3 Trial Finishes" },
      ],
      desc: "Nobody in the history of the Dragonrider League has posted faster pre-season trial times than Talissa Firebright in her debut year. The half-elf rookie from Ashfield has speed in abundance — what she is building this season is race-craft. Her opening Bloomrise performance will tell the realm whether she can match her raw talent with the composure the sky-course demands.",
    },
    // 4 May — Brightmantle: Mageball Cup Final month
    {
      name: "Zenna Brightleaf",
      sport: "Mageball",
      team: "Valdris Tidebreakers",
      species: "Elf",
      initials: "ZB",
      stats: [
        { value: "7", label: "Season Shutouts (Record)" },
        { value: "0", label: "Open-Play Goals Conceded" },
        { value: "3", label: "Cup Final Appearances" },
      ],
      desc: "The best goalkeeper in the Ardian Mageball League does not need loud celebration — her record speaks. Seven shutouts in a single season is a standard no other keeper has approached. As the Mageball Cup Final approaches in Brightmantle, the question is not whether Zenna Brightleaf will have a great game, but whether the rest of her team can score enough to make her saves matter.",
    },
    // 5 Jun — Highsun: Griffin Polo opens, Archery Grand Final
    {
      name: "Sylara Windwhisper",
      sport: "Griffin Polo",
      team: "Verdant Wind",
      species: "Elf",
      initials: "SW",
      stats: [
        { value: "7", label: "Grand Championship Medals" },
        { value: "43", label: "Career High-Hoop Goals" },
        { value: "21", label: "Circuit Seasons" },
      ],
      desc: "Seven Grand Championship medals across a career that has outlasted entire rival teams. Sylara Windwhisper is the most decorated polo player in living memory, and her bond with her griffin Dawnmere has been described by commentators as less rider-and-mount, more two-minds-in-one. Highsun is her season, and she has never failed to make it count.",
    },
    // 6 Jul — Embertide: Dragonrider Championship, Alch. Athletics Championship
    {
      name: "Brynn Shadowmane",
      sport: "Dragonrider Racing",
      team: "Team Emberveil",
      species: "Elf",
      initials: "BS",
      stats: [
        { value: "846 AP", label: "Championship Year" },
        { value: "28", label: "Crystal Gate Bonuses" },
        { value: "5", label: "Consecutive Podiums" },
      ],
      desc: "Defending Dragonrider Champion Brynn Shadowmane is the embodiment of controlled precision in a sport where riders who push too hard end up in freefall. Her record for Crystal Gate bonuses in a single season reflects a style of racing built on accuracy over bravado. As Embertide's Championship Final approaches — when it is eventually rescheduled — Emberveil's title defence rests on her shoulders.",
    },
    // 7 Aug — Harvestmoon: Jousting Circuit opens, Free-Flying opens
    {
      name: "Brennan Swiftlance",
      sport: "Jousting",
      team: "Ashfield Lancers",
      species: "Human",
      initials: "BS",
      stats: [
        { value: "Ashfield", label: "Home Ground Record" },
        { value: "3", label: "Circuit Seasons" },
        { value: "12.4", label: "Avg Bout Score" },
      ],
      desc: "Brennan Swiftlance is the Ashfield crowd's favourite — a hometown jouster who turns the Tiltyard into a wall of noise whenever he enters the lists. His form at home is exceptional; away from Ashfield, the nerves show. This Harvestmoon he has reportedly worked with a mental conditioning coach over the off-season. The Ashfield faithful are cautiously optimistic. Everyone else is watching.",
    },
    // 8 Sep — Goldenveil: Griffin Polo Grand Championship Final
    {
      name: "Dame Rowena Ironfist",
      sport: "Jousting",
      team: "Ironkeep Iron Guard",
      species: "Human",
      initials: "RI",
      stats: [
        { value: "845 AP", label: "Ashfield Cup Winner" },
        { value: "1st", label: "Woman to Win the Cup" },
        { value: "8", label: "Circuit Seasons" },
      ],
      desc: "Dame Rowena Ironfist won the Ashfield Cup in 845 AP as the first woman in the tournament's history to do so, and she won it in a way that silenced every doubter: three knockdowns in four bouts, the highest Power Score of the tournament, and a final against Sir Aldric Stonebrow that is still debated in every tavern along the road to Ironkeep. She is the current favourite for the 847 AP Cup.",
    },
    // 9 Oct — Shadowfall: Grand Mage Duels Autumn, Free-Flying Final
    {
      name: "Pyxis Ashbloom",
      sport: "Grand Mage Duels",
      team: "Independent",
      species: "Half-Elf",
      initials: "PA",
      stats: [
        { value: "Arcane", label: "Tier Last Season" },
        { value: "Grand Arcane", label: "Tier This Season" },
        { value: "3", label: "Consecutive Wins" },
      ],
      desc: "Pyxis Ashbloom won the Arcane-tier championship so convincingly that the judges promoted her directly to Grand Arcane seeding — a jump that happens perhaps once in a decade. Her style is everything Magister Solvaine Dex is not: theatrical, unpredictable, and driven by a flair for Creativity scoring that the crowd rewards with thunderous response. The Autumn Tournament in Shadowfall is her first test at the highest tier.",
    },
    // 10 Nov — Ashgale: off-season, veteran features
    {
      name: "Coran Dustweave",
      sport: "Dragonrider Racing",
      team: "Ironkeep Ironwings",
      species: "Dwarf",
      initials: "CD",
      stats: [
        { value: "47", label: "Career Race Wins (Record)" },
        { value: "14", label: "League Seasons" },
        { value: "2", label: "Seasons Until Retirement" },
      ],
      desc: "Fourteen seasons. Forty-seven race wins. No other rider in Dragonrider League history has won more. Coran Dustweave is nearing the end of a career that redefined what a dwarf could achieve in a sport dominated by elves and humans, and the off-season in Ashgale always brings renewed speculation: will this be his final year? He has not said. He never says. He just keeps winning.",
    },
    // 11 Dec — Starnight: Runeblade Grand Circuit Final
    {
      name: "Master Celan Dawnblade",
      sport: "Runeblade Fencing",
      team: "Independent",
      species: "Elf",
      initials: "CD",
      stats: [
        { value: "7×", label: "Grand Circuit Champion" },
        { value: "0", label: "Grand Circuit Finals Lost" },
        { value: "34", label: "Years of Competition" },
      ],
      desc: "Seven Grand Circuit titles. An unbroken record in Finals. A career stretching across thirty-four years of competition. Master Celan Dawnblade is the greatest Runeblade fencer Ardia has ever produced, and Starnight's Grand Circuit Final is the one event where the whole realm pays attention to a sport it otherwise treats as background decoration. He has never lost a Final. He does not plan to start.",
    },
  ];

  // ── Helpers ──────────────────────────────────────────────────

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getReporter(id) {
    if (typeof REPORTERS === "undefined") return null;
    const r = REPORTERS.find((r) => r.id === id);
    if (r) return r;
    if (typeof EDITORIAL_BOARD !== "undefined") {
      return EDITORIAL_BOARD.find((m) => m.id === id) || null;
    }
    return null;
  }

  function getCategory(id) {
    if (typeof CATEGORIES === "undefined") return null;
    return CATEGORIES.find((c) => c.id === id) || null;
  }

  // ── In-Season Banner ─────────────────────────────────────────

  function renderInSeasonBar() {
    const chipsEl = document.getElementById("in-season-chips");
    if (!chipsEl) return;
    const active = getSportsInSeason();
    if (active.length === 0) {
      chipsEl.innerHTML = "<span class='season-chip'>Off-season (Runeblade Fencing year-round)</span>";
      return;
    }
    chipsEl.innerHTML = active
      .map((s) => `<span class="season-chip" style="background:rgba(0,0,0,0.18)">${escapeHtml(s.name)}</span>`)
      .join("");
  }

  // ── Recent Scores ────────────────────────────────────────────

  function renderScores() {
    const grid = document.getElementById("scores-grid");
    if (!grid) return;
    grid.innerHTML = RECENT_SCORES.map((s) => {
      const homeWin = !s.suspended && s.homeScore !== null && s.homeScore > s.awayScore;
      const awayWin = !s.suspended && s.awayScore !== null && s.awayScore > s.homeScore;
      const scoreHtml = s.suspended
        ? `<div class="score-numbers"><span style="font-size:0.85rem;color:#cc2200">POSTPONED</span></div>`
        : `<div class="score-numbers">
             <span>${escapeHtml(s.homeScore)}</span>
             <span class="score-sep">–</span>
             <span>${escapeHtml(s.awayScore)}</span>
           </div>`;
      return `
        <div class="score-card">
          <div class="score-card-sport">${escapeHtml(s.sport)}</div>
          <div class="score-card-match">
            <div class="score-team${homeWin ? " winner" : ""}">${escapeHtml(s.home)}</div>
            ${scoreHtml}
            <div class="score-team right${awayWin ? " winner" : ""}">${escapeHtml(s.away)}</div>
          </div>
          <div class="score-card-meta">${escapeHtml(s.date)} · ${escapeHtml(s.venue)}</div>
          ${s.note ? `<div class="score-card-note">${escapeHtml(s.note)}</div>` : ""}
        </div>`;
    }).join("");
  }

  // ── Standings ────────────────────────────────────────────────

  function renderStandings() {
    const container = document.getElementById("standings-container");
    if (!container) return;
    container.innerHTML = STANDINGS.map((league) => {
      const rowsHtml = league.rows.map((row) => {
        const topClass = row.top ? " top-team" : "";
        if (league.customCols && row.result !== undefined) {
          return `<tr class="${topClass}">
            <td class="standings-pos">${row.pos}</td>
            <td>${escapeHtml(row.name)}</td>
            <td>${escapeHtml(row.result)}</td>
          </tr>`;
        } else if (league.customCols && row.races !== undefined) {
          return `<tr class="${topClass}">
            <td class="standings-pos">${row.pos}</td>
            <td>${escapeHtml(row.name)}</td>
            <td class="num">${row.races}</td>
            <td class="num">${row.pts}</td>
          </tr>`;
        } else {
          return `<tr class="${topClass}">
            <td class="standings-pos">${row.pos}</td>
            <td>${escapeHtml(row.name)}</td>
            <td class="num">${row.w}</td>
            <td class="num">${row.d}</td>
            <td class="num">${row.l}</td>
            <td class="num">${row.pts}</td>
          </tr>`;
        }
      }).join("");

      const headerCells = league.cols.map((c, i) => {
        const isNum = i > 1 || (league.customCols && i > 1);
        return `<th class="${i > 1 ? "num" : ""}">${escapeHtml(c)}</th>`;
      }).join("");

      return `
        <div class="standings-block">
          <h3 class="standings-sport-title">${escapeHtml(league.sport)}</h3>
          <table class="standings-table">
            <thead><tr>${headerCells}</tr></thead>
            <tbody>${rowsHtml}</tbody>
          </table>
          ${league.note ? `<p class="standings-note">${escapeHtml(league.note)}</p>` : ""}
        </div>`;
    }).join("");
  }

  // ── Sports News Stories ──────────────────────────────────────

  function renderSportsNews() {
    const grid = document.getElementById("sports-news-grid");
    const countEl = document.getElementById("sports-story-count");
    if (!grid) return;

    const stories = (typeof STORIES !== "undefined")
      ? STORIES.filter((s) => s.category === "sports")
      : [];

    if (countEl) countEl.textContent = `${stories.length} stories`;

    if (stories.length === 0) {
      grid.innerHTML = `<p style="font-style:italic;color:var(--ink-light)">No sports stories on file yet — check back after the next edition.</p>`;
      return;
    }

    grid.innerHTML = stories.slice(0, 12).map((story) => {
      const reporter = getReporter(story.reporter) || { name: story.reporter, avatar: "?", avatarColor: "#555" };
      const category = getCategory(story.category) || { label: "Sports", color: "#ffaa00" };
      return `
        <article
          class="story-card"
          tabindex="0"
          role="button"
          data-story-id="${escapeHtml(story.id)}"
          aria-label="Read story: ${escapeHtml(story.headline)}"
          style="display:grid;grid-template-columns:120px 1fr;gap:0"
        >
          <img
            class="card-image"
            src="${escapeHtml(story.image)}"
            alt="${escapeHtml(story.imageAlt)}"
            loading="lazy"
            style="height:100%;object-fit:cover;min-height:100px"
          />
          <div class="card-body" style="padding:0.75rem">
            <span class="card-category" style="background-color:${escapeHtml(category.color)}">${escapeHtml(category.label)}</span>
            <h3 class="card-headline" style="font-size:0.95rem">${escapeHtml(story.headline)}</h3>
            <p class="card-deck" style="font-size:0.8rem">${escapeHtml(story.subheadline)}</p>
            <div class="card-byline">
              <div class="byline-avatar" style="background-color:${escapeHtml(reporter.avatarColor)}">${escapeHtml(reporter.avatar)}</div>
              <div class="byline-info">
                <span class="byline-name">${escapeHtml(reporter.name)}</span>
                <span class="byline-meta">${escapeHtml(story.date)}</span>
              </div>
            </div>
          </div>
        </article>`;
    }).join("");

    // Attach click handlers
    grid.querySelectorAll("[data-story-id]").forEach((el) => {
      el.addEventListener("click", () => openModal(el.dataset.storyId));
      el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") openModal(el.dataset.storyId); });
    });
  }

  // ── Monthly Hero ─────────────────────────────────────────────

  function renderMonthlyHero() {
    const card = document.getElementById("monthly-hero-card");
    const label = document.getElementById("hero-month-label");
    if (!card) return;

    const hero = MONTHLY_HEROES[currentRealMonth];
    if (!hero) return;

    if (label) label.textContent = currentArdiaMonth;

    const portraitHtml = hero.image
      ? `<img src="${escapeHtml(hero.image)}" alt="${escapeHtml(hero.name)}" style="width:120px;height:120px;border-radius:50%;object-fit:cover;border:3px solid var(--gold)" />`
      : `<div class="hero-card-portrait-placeholder">${escapeHtml(hero.initials)}</div>`;

    const statsHtml = (hero.stats || []).map((s) => `
      <div class="hero-stat">
        <span class="hero-stat-value">${escapeHtml(s.value)}</span>
        <span class="hero-stat-label">${escapeHtml(s.label)}</span>
      </div>`).join("");

    card.innerHTML = `
      <div class="hero-card">
        <div class="hero-card-portrait">${portraitHtml}</div>
        <div class="hero-card-body">
          <div class="hero-card-sport">${escapeHtml(hero.sport)}</div>
          <h3 class="hero-card-name">${escapeHtml(hero.name)}</h3>
          <div class="hero-card-team">${escapeHtml(hero.team)} &middot; ${escapeHtml(hero.species)}</div>
          <p class="hero-card-desc">${escapeHtml(hero.desc)}</p>
          ${statsHtml ? `<div class="hero-card-stat-row">${statsHtml}</div>` : ""}
        </div>
      </div>`;
  }

  // ── Sports Staff (expanded) ───────────────────────────────────

  function renderSportsStaff() {
    const grid = document.getElementById("sports-staff-grid");
    if (!grid || typeof REPORTERS === "undefined") return;

    const staffIds = ["gareth-ironwood", "oakimus-pan"];
    const staff = staffIds.map((id) => REPORTERS.find((r) => r.id === id)).filter(Boolean);

    grid.innerHTML = staff.map((r) => {
      const portraitHtml = r.image
        ? `<img class="sports-staff-portrait" src="${escapeHtml(r.image)}" alt="${escapeHtml(r.name)}" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:2px solid var(--gold);flex-shrink:0" />`
        : `<div class="sports-staff-avatar" style="background-color:${escapeHtml(r.avatarColor)};width:72px;height:72px;border-radius:50%;flex-shrink:0;border:2px solid var(--gold);display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:1.5rem;font-weight:700;color:white">${escapeHtml(r.avatar)}</div>`;

      const articlesNote = r.articles > 0
        ? `<div class="staff-card-articles">${r.articles} stories published</div>`
        : `<div class="staff-card-articles">Joined ${currentArdiaMonth} 847 AP</div>`;

      return `
        <div class="sports-staff-card-expanded">
          <div class="staff-card-header">
            ${portraitHtml}
            <div style="flex:1">
              <div class="staff-card-species">${escapeHtml(r.species || "")}</div>
              <div class="sports-staff-name">${escapeHtml(r.name)}</div>
              <div class="sports-staff-title">${escapeHtml(r.title)}</div>
              ${articlesNote}
            </div>
          </div>
          <p class="sports-staff-bio">${escapeHtml(r.bio)}</p>
          ${r.personality ? `<p class="staff-card-personality">${escapeHtml(r.personality)}</p>` : ""}
        </div>`;
    }).join("");
  }

  // ── Tournament Calendar (sidebar) ───────────────────────────

  function renderTournamentCalendar() {
    const container = document.getElementById("tournament-calendar");
    if (!container) return;
    container.innerHTML = TOURNAMENTS.map((t) => {
      const statusClass = `status-${t.status}`;
      return `
        <div class="tournament-item">
          <span class="tournament-name">${escapeHtml(t.name)}</span>
          <span class="tournament-detail">${escapeHtml(t.detail)}</span>
          <span class="tournament-status ${statusClass}">${escapeHtml(t.statusLabel)}</span>
        </div>`;
    }).join("");
  }

  // ── Story Modal ──────────────────────────────────────────────

  function openModal(storyId) {
    if (typeof STORIES === "undefined") return;
    const story = STORIES.find((s) => s.id === storyId);
    if (!story) return;

    const reporter = getReporter(story.reporter) || { name: story.reporter, title: "", avatar: "?", avatarColor: "#555", bio: "" };
    const category = getCategory(story.category) || { label: "Sports", color: "#ffaa00" };

    const modalContent = document.getElementById("modal-content");
    if (!modalContent) return;

    modalContent.innerHTML = `
      <img class="story-hero-image" src="${escapeHtml(story.image)}" alt="${escapeHtml(story.imageAlt)}" />
      <div class="modal-article-body">
        <span class="story-category" style="background-color:${escapeHtml(category.color)}">${escapeHtml(category.label)}</span>
        <h2 class="story-headline" id="modal-headline">${escapeHtml(story.headline)}</h2>
        <p class="story-deck">${escapeHtml(story.subheadline)}</p>
        <div class="story-byline">
          <div class="byline-avatar-lg" style="background-color:${escapeHtml(reporter.avatarColor)}">${escapeHtml(reporter.avatar)}</div>
          <div class="byline-text">
            <span class="byline-reporter-name">${escapeHtml(reporter.name)}</span>
            <span class="byline-reporter-title">${escapeHtml(reporter.title || reporter.beat || "")}</span>
            <span class="byline-date">${escapeHtml(story.date)}</span>
          </div>
        </div>
        <div class="story-body">${story.body}</div>
        ${reporter.bio ? `<div class="reporter-bio-footer"><strong>${escapeHtml(reporter.name)}</strong> — ${escapeHtml(reporter.bio)}</div>` : ""}
      </div>`;

    const overlay = document.getElementById("modal-overlay");
    if (overlay) {
      overlay.classList.add("visible");
      document.body.style.overflow = "hidden";
    }
  }

  function closeModal() {
    const overlay = document.getElementById("modal-overlay");
    if (overlay) {
      overlay.classList.remove("visible");
      document.body.style.overflow = "";
    }
  }

  function bindModal() {
    const closeBtn = document.getElementById("modal-close");
    const overlay = document.getElementById("modal-overlay");
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (overlay) overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
  }

  // ── Init ─────────────────────────────────────────────────────

  function init() {
    setCurrentDate();
    renderInSeasonBar();
    renderScores();
    renderStandings();
    renderMonthlyHero();
    renderSportsNews();
    renderSportsStaff();
    renderTournamentCalendar();
    bindModal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
