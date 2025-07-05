const SHEET_ID = "1RhgrZf8Ww6HeJn2iTJ8T9_6k7qLLkh4IZ5zwVqXNLAY";
const languageToggle = document.getElementById("languageToggle");
let currentLang = "EN";

const sectionList = document.getElementById("sections");
const sectionTitle = document.getElementById("sectionTitle");
const quotesList = document.getElementById("quotesList");

const sectionListArea = document.getElementById("sectionList");
const quotesArea = document.getElementById("quotesArea");
const backBtn = document.getElementById("backBtn");

languageToggle.addEventListener("change", () => {
  currentLang = languageToggle.value;
  loadSections();
});

backBtn.addEventListener("click", () => {
  sectionListArea.style.display = "block";
  quotesArea.style.display = "none";
});

async function fetchSheet(tabName) {
  const url = `https://opensheet.elk.sh/${SHEET_ID}/${tabName}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch sheet: " + tabName);
  return res.json();
}

async function loadSections() {
  sectionList.innerHTML = `<li>Loading...</li>`;
  try {
    const tab = currentLang === "EN" ? "Reference_EN" : "Reference_TA";
    const data = await fetchSheet(tab);
    sectionList.innerHTML = "";
    data.forEach(row => {
      if (row.section && row.reference) {
        const li = document.createElement("li");
        li.className = "section-item";
        li.textContent = row.section;  // ✅ Show only section title
        li.onclick = () => loadQuotes(row.section);
        sectionList.appendChild(li);
      }
    });
  } catch (e) {
    sectionList.innerHTML = `<li>Error loading sections</li>`;
    console.error(e);
  }
}

async function loadQuotes(sectionName) {
  quotesList.innerHTML = `<li>Loading...</li>`;
  sectionTitle.textContent = sectionName;
  sectionListArea.style.display = "none";
  quotesArea.style.display = "block";

  const tab = `${sectionName.replaceAll(" ", "_")}_${currentLang}`;
  try {
    const data = await fetchSheet(tab);
    quotesList.innerHTML = "";
    data.forEach(row => {
      const quote = row.quote || row.Quote || row[Object.keys(row)[0]];
      if (quote) {
        const li = document.createElement("li");
        li.className = "quo
