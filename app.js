const statusLore = {
  active: "on the trail",
  open: "uncharted",
  gated: "sealed crypt",
  audit: "under lantern",
  closed: "case closed",
  blocked: "stone wall",
};

const state = { data: null, status: "all", query: "" };

const esc = value => String(value ?? "").replace(/[&<>'"]/g, char => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
}[char]));

function updateCountdown() {
  const end = new Date("2026-11-02T23:59:59+08:00");
  const now = new Date();
  const label = document.querySelector("#season-label");
  const clock = document.querySelector("#countdown");
  const delta = end - now;
  if (delta <= 0) {
    label.textContent = "The lanterns are banked";
    clock.textContent = "Archive mode · the research hunt continues";
    return;
  }
  const days = Math.floor(delta / 86400000);
  const hours = Math.floor((delta % 86400000) / 3600000);
  const minutes = Math.floor((delta % 3600000) / 60000);
  const seconds = Math.floor((delta % 60000) / 1000);
  clock.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function renderScoreboard() {
  const counts = Object.fromEntries(Object.keys(statusLore).map(status => [status, 0]));
  for (const topic of state.data.topics) counts[topic.status] += 1;
  document.querySelector("#scoreboard").innerHTML = Object.entries(counts).map(([status, count]) => `
    <div class="score"><strong>${count}</strong><span>${esc(statusLore[status])}</span></div>
  `).join("");
}

function renderFilters() {
  const filters = [["all", "all trails"], ...Object.entries(statusLore)];
  document.querySelector("#filters").innerHTML = filters.map(([status, label]) => `
    <button class="filter ${state.status === status ? "active" : ""}" data-status="${status}" type="button">${esc(label)}</button>
  `).join("");
  document.querySelectorAll(".filter").forEach(button => button.addEventListener("click", () => {
    state.status = button.dataset.status;
    renderFilters();
    renderTopics();
  }));
}

function renderTopics() {
  const query = state.query.trim().toLowerCase();
  const topics = state.data.topics.filter(topic => {
    const statusMatch = state.status === "all" || topic.status === state.status;
    const text = [topic.id, topic.label, topic.question, topic.nextAction, topic.killTest, ...(topic.targetIds || [])].join(" ").toLowerCase();
    return statusMatch && (!query || text.includes(query));
  });
  document.querySelector("#result-count").textContent = `${topics.length} of ${state.data.topics.length} trails visible`;
  document.querySelector("#topic-grid").innerHTML = topics.length ? topics.map(topic => `
    <article class="topic-card">
      <div class="topic-top"><span class="topic-id">${esc(topic.id)} · ${esc(topic.priority)}</span><span class="status status-${esc(topic.status)}">${esc(topic.status)}</span></div>
      <h3>${esc(topic.label)}</h3>
      <p class="question">${esc(topic.question)}</p>
      <span class="detail-label">Next move</span><p class="detail">${esc(topic.nextAction)}</p>
      <span class="detail-label">Kill test</span><p class="detail">${esc(topic.killTest)}</p>
      <div class="topic-links">
        ${topic.evidenceUrl ? `<a href="${esc(topic.evidenceUrl)}">Evidence ↗</a>` : ""}
        <a href="${esc(state.data.source.openTopicsUrl)}">Controlling register ↗</a>
      </div>
    </article>
  `).join("") : `<div class="empty">No trail matches that lantern. Try a broader term or status.</div>`;
}

function renderTrophies() {
  document.querySelector("#trophy-grid").innerHTML = state.data.trophies.map(trophy => `
    <article class="trophy">
      <span class="stamp">Scoped no-go · ${esc(trophy.id)}</span>
      <h3>${esc(trophy.title)}</h3>
      <p>${esc(trophy.finding)}</p>
      <p class="escape"><b>Escape hatch:</b> ${esc(trophy.reopen)}</p>
      <a href="${esc(trophy.url)}">Inspect the ledger entry ↗</a>
    </article>
  `).join("");
}

function renderBounties() {
  document.querySelector("#bounty-list").innerHTML = state.data.bounties.map(item => `<li>${esc(item)}</li>`).join("");
}

async function init() {
  updateCountdown();
  setInterval(updateCountdown, 1000);
  const response = await fetch("data/hunt-map.json");
  if (!response.ok) throw new Error(`Could not load hunt map: ${response.status}`);
  state.data = await response.json();
  document.querySelector("#source-revision").innerHTML = `Corpus snapshot <a href="${esc(state.data.source.revisionUrl)}"><code>${esc(state.data.source.revision.slice(0, 12))}</code></a> · generated ${esc(state.data.generatedAt.slice(0, 10))}`;
  document.querySelector("#search").addEventListener("input", event => {
    state.query = event.target.value;
    renderTopics();
  });
  renderScoreboard();
  renderFilters();
  renderTopics();
  renderTrophies();
  renderBounties();
}

init().catch(error => {
  document.querySelector("#topic-grid").innerHTML = `<div class="empty">The map failed to materialize: ${esc(error.message)}</div>`;
});
