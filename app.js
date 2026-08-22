const screens = [...document.querySelectorAll(".screen")];
const navItems = [...document.querySelectorAll(".nav-item")];
const breadcrumb = document.getElementById("breadcrumb");
const toast = document.getElementById("toast");

const screenNames = {
  home: "Dashboard",
  create: "Create Trip",
  trips: "My Trips",
  itinerary: "Itinerary"
};

let trips = JSON.parse(localStorage.getItem("globetrotter_trips") || "[]");

function showToast(message){
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(()=>toast.classList.remove("show"), 2600);
}

function goTo(screen){
  screens.forEach(s => s.classList.toggle("active", s.id === screen));
  navItems.forEach(n => n.classList.toggle("active", n.dataset.screen === screen));
  breadcrumb.textContent = screenNames[screen] || "GlobeTrotter";
  window.scrollTo({top:0, behavior:"smooth"});
  document.querySelector(".sidebar").classList.remove("open");
  if(screen === "home") renderDashboard();
  if(screen === "trips") renderTrips();
}

document.addEventListener("click", e=>{
  const target = e.target.closest("[data-go]");
  if(target) goTo(target.dataset.go);
});
navItems.forEach(item => item.addEventListener("click", ()=>goTo(item.dataset.screen)));
document.getElementById("sidebarCreate").addEventListener("click", ()=>goTo("create"));
document.getElementById("mobileMenu").addEventListener("click", ()=>document.querySelector(".sidebar").classList.toggle("open"));

const form = document.getElementById("tripForm");
const nameInput = document.getElementById("tripName");
const startInput = document.getElementById("startDate");
const endInput = document.getElementById("endDate");
const descInput = document.getElementById("description");
const photoInput = document.getElementById("coverPhoto");
const uploadBox = document.getElementById("uploadBox");
const previewImg = document.getElementById("preview");

uploadBox.addEventListener("click", ()=>photoInput.click());
photoInput.addEventListener("change", ()=>{
  const file = photoInput.files[0];
  if(!file) return;
  if(file.size > 5 * 1024 * 1024){
    showToast("Please choose an image under 5 MB.");
    photoInput.value = "";
    return;
  }
  const reader = new FileReader();
  reader.onload = e=>{
    previewImg.src = e.target.result;
    previewImg.style.display = "block";
    document.getElementById("previewCover").style.backgroundImage = `url("${e.target.result}")`;
    document.getElementById("previewCover").style.backgroundSize = "cover";
    document.getElementById("previewCover").style.backgroundPosition = "center";
  };
  reader.readAsDataURL(file);
});

function daysBetween(a,b){
  if(!a || !b) return 0;
  const diff = (new Date(b) - new Date(a)) / 86400000;
  return diff >= 0 ? Math.floor(diff) + 1 : 0;
}
function updatePreview(){
  document.getElementById("previewName").textContent = nameInput.value.trim() || "Your trip name";
  const days = daysBetween(startInput.value, endInput.value);
  document.getElementById("previewDates").textContent =
    startInput.value && endInput.value
      ? `${new Date(startInput.value).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})} — ${new Date(endInput.value).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}`
      : "Choose your travel dates";
  document.getElementById("previewDescription").textContent =
    descInput.value.trim() || "Your description will appear here as you type.";
  document.querySelector(".preview-meta").innerHTML = `<span>◎ 0 cities</span><span>◷ ${days} days</span>`;
}
[nameInput,startInput,endInput,descInput].forEach(el=>el.addEventListener("input",updatePreview));

form.addEventListener("submit", e=>{
  e.preventDefault();
  const days = daysBetween(startInput.value,endInput.value);
  if(days <= 0){
    showToast("End date must be after the start date.");
    return;
  }
  const trip = {
    id: Date.now(),
    name: nameInput.value.trim(),
    start: startInput.value,
    end: endInput.value,
    description: descInput.value.trim(),
    days,
    image: previewImg.src && previewImg.style.display !== "none" ? previewImg.src : ""
  };
  trips.unshift(trip);
  localStorage.setItem("globetrotter_trips", JSON.stringify(trips));
  form.reset();
  previewImg.style.display = "none";
  document.getElementById("previewCover").style.backgroundImage = "";
  updatePreview();
  showToast("Trip saved successfully ✦");
  setTimeout(()=>goTo("trips"), 500);
});

function tripCard(trip){
  const imgStyle = trip.image ? `style="background-image:url('${trip.image}')"` : "";
  return `<article class="trip-card">
    <div class="trip-image" ${imgStyle}><span class="trip-tag">UPCOMING</span></div>
    <div class="trip-info">
      <h3>${escapeHtml(trip.name)}</h3>
      <p>${formatDate(trip.start)} — ${formatDate(trip.end)}</p>
      <div class="trip-meta"><span>◎ 0 cities</span><span>◷ ${trip.days} days</span></div>
    </div>
  </article>`;
}
function formatDate(v){
  return new Date(v).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});
}
function escapeHtml(s){
  return s.replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}
function renderDashboard(){
  document.getElementById("statTrips").textContent = trips.length;
  document.getElementById("statDestinations").textContent = trips.length * 0;
  document.getElementById("statDays").textContent = trips.reduce((a,t)=>a+t.days,0);
  const box = document.getElementById("recentTrips");
  box.innerHTML = trips.length ? trips.slice(0,3).map(tripCard).join("") :
    `<div class="empty-itinerary" style="grid-column:1/-1;min-height:220px"><div><div class="empty-icon">✦</div><h2>No trips yet</h2><p>Create your first journey and it will appear here.</p><button class="primary-btn" data-go="create">＋ Plan a trip</button></div></div>`;
}
function renderTrips(filter=""){
  const box = document.getElementById("allTrips");
  const list = trips.filter(t=>t.name.toLowerCase().includes(filter.toLowerCase()));
  box.innerHTML = list.length ? list.map(tripCard).join("") :
    `<div class="empty-itinerary" style="grid-column:1/-1"><div><div class="empty-icon">✦</div><h2>${filter ? "No matching trips" : "Your trip collection is empty"}</h2><p>${filter ? "Try another search." : "Create a trip to start building your travel collection."}</p><button class="primary-btn" data-go="create">＋ New trip</button></div></div>`;
}
document.getElementById("tripSearch").addEventListener("input", e=>renderTrips(e.target.value));

renderDashboard();
updatePreview();
