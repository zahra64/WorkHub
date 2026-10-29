//erbjudandena ligger i en array av objekt.varje objekt har id, namn,
// beskrivning och pris per person
const activities = [
  {
    id: "escape",
    name: "Escape room",
    description: "Lös gåtorna och ta er ut inom 60 minuter.",
    pricePerPerson: 250,
  },
  {
    id: "vr",
    name: "VR-upplevelse",
    description: "Stig in i en virtuell värld tillsammans med vännerna.",
    pricePerPerson: 300,
  },
  {
    id: "mystery",
    name: "Mordgåta",
    description: "Hitta mördaren bland gästerna under en spelkväll.",
    pricePerPerson: 200,
  },
];

// Regler som används på flera ställen får ett namn.
const MIN_GUESTS = 1;
const MAX_GUESTS = 5;
const GUESTS_ERROR = `Ange ett heltal mellan ${MIN_GUESTS} och ${MAX_GUESTS} personer.`;

// Element att läsa från och skriva till.
const form = document.querySelector("#booking-form");
const activityList = document.querySelector("#activity-list");
const guestsInput = document.querySelector("#guests");
const nameInput = document.querySelector("#customer-name");
const emailInput = document.querySelector("#customer-email");
const priceSummary = document.querySelector("#price-summary");
const totalPrice = document.querySelector("#total-price");
const priceMessage = document.querySelector("#price-message");
const confirmationBox = document.querySelector("#confirmation");
const confirmationList = document.querySelector("#confirmation-list");
const activityError = document.querySelector("#activity-error");
const guestsError = document.querySelector("#guests-error");
const nameError = document.querySelector("#name-error");
const emailError = document.querySelector("#email-error");
const resetButtons = document.querySelectorAll("[data-reset]");

//dessa värden ändras när användaren väljer, så vi använder let.
// null betyder att inget är valt ännu.
let selectedActivityId = null;


function formatPrice(amount) {
  return amount.toLocaleString("sv-SE") + " kr";
}

function formatGuests(guests) {
  return guests === 1 ? "1 person" : guests + " personer";
}

// ---------- Visa erbjudandena ----------
//en funktion bygger HTML för ett kort. 
//funktionen tar emot ett erbjudande som parameter

function createActivityCard(activity) {
  return `
    <button type="button" class="offer-card" data-id="${activity.id}" aria-pressed="false">
      <span class="offer-body">
        <span class="offer-name">${activity.name}</span>
        <span class="offer-description">${activity.description}</span>
        <span class="offer-price">${formatPrice(activity.pricePerPerson)} / person</span>
        <span class="offer-pick">Välj</span>
        <span class="offer-picked">✓ Vald</span>
      </span>
    </button>
  `;
}
//visar alla kort på sidan, 
function renderActivities() {
  // map ger en ny array med ett kort per erbjudande. join gör om arrayen till en enda text.
  activityList.innerHTML = activities.map(createActivityCard).join("");
}

// Markera det valda kortet. CSS reagerar på aria-pressed.
function updateSelection() {
  for (const card of activityList.children) {
    card.setAttribute("aria-pressed", card.dataset.id === selectedActivityId);
  }
}

// körs när användaren klickar i listan med kort.
// det finns bara en lyssnare på hela listan, inte en på varje kort.
// closest letar uppåt från det som klickades tills den hittar
// ett element med data-id, alltså själva kortet.

function handleActivityClick(event) {
  const card = event.target.closest("[data-id]");
  if (card === null) {
    return;
  }
  selectedActivityId = card.dataset.id;
  updateSelection();
  showError(activityError, "", null);
  updatePrice();
}
// ---------- Läsa formuläret och räkna ----------
function readBooking() {
  return {
    activityId: selectedActivityId,
    guests: Number(guestsInput.value),
    name: nameInput.value,
    email: emailInput.value,
  };
}

//find returnerar första objektet där villkoret är sant, annars undefined.
function getActivityById(id) {
  return activities.find((activity) => activity.id === id);
}

function calculateTotal(pricePerPerson, guests) {
  return pricePerPerson * guests;
}

function isValidGuests(guests) {
  return Number.isInteger(guests) && guests >= MIN_GUESTS && guests <= MAX_GUESTS;
}

function showPrice(summaryText, total, message) {
  priceSummary.textContent = summaryText;
  totalPrice.textContent = total;
  priceMessage.textContent = message;
}

// Uppdaterar prisrutan. Funktionen har tre fall:
function updatePrice() {
  const booking = readBooking();
  const activity = getActivityById(booking.activityId);

  // undefined räknas som falskt, så !activity betyder "inget erbjudande valt".
  if (!activity) {
    showPrice("Inget erbjudande valt", "–", "Välj ett erbjudande för att se priset.");
    return;
  }

  if (!isValidGuests(booking.guests)) {
    showPrice(activity.name, "–", GUESTS_ERROR);
    return;
  }

  const total = calculateTotal(activity.pricePerPerson, booking.guests);
  showPrice(
    `${activity.name} · ${formatGuests(booking.guests)}`,
    formatPrice(total),
    `${formatPrice(activity.pricePerPerson)} per person`,
  );
}

// ---------- Validering ----------
// Varje funktion returnerar ett felmeddelande, eller "" om uppgiften är giltig.
function validateName(name) {
  if (name.trim() === "") {
    return "Fyll i ditt namn. Fältet får inte vara tomt eller bara innehålla blanksteg.";
  }
  return "";
}

function validateEmail(email) {
  if (email === "") {
    return "Fyll i din e-postadress.";
  }
  if (email.includes(" ")) {
    return "E-postadressen får inte innehålla blanksteg.";
  }

  const parts = email.split("@");
  if (parts.length !== 2) {
    return "E-postadressen måste innehålla exakt ett @-tecken.";
  }
  if (parts[0] === "" || parts[1] === "") {
    return "Det måste finnas text både före och efter @.";
  }

  // domänen (efter @) ska ha minst en punkt med text på båda sidor.
  const domainParts = parts[1].split(".");
  if (domainParts.length < 2) {
    return "Domänen efter @ måste innehålla en punkt, till exempel mail.se.";
  }
  for (const part of domainParts) {
    if (part === "") {
      return "Det måste finnas text på båda sidor om punkten i domänen.";
    }
  }
  return "";
}

function validateActivity(activityId) {
  if (!getActivityById(activityId)) {
    return "Välj en upplevelse för att kunna boka.";
  }
  return "";
}

function validateGuests(guests) {
  if (!isValidGuests(guests)) {
    return GUESTS_ERROR;
  }
  return "";
}

// Visar ett felmeddelande intill fältet. Tom text tar bort felet.
///tar tre parametrar: var felet ska visas, vilket meddelande, 
// och vilket fält som ska få röd ram.
//  Samma funktion både visar och tar bort fel.
//  om meddelandet är tomt döljs felet.
function showError(errorElement, message, input) {
  errorElement.textContent = message;
  errorElement.hidden = message === "";

  if (input !== null) {
    if (message === "") {
      input.removeAttribute("aria-invalid");
    } else {
      input.setAttribute("aria-invalid", "true");
    }
  }
}

// Kontrollerar alla fält och visar fel. Returnerar true om allt är giltigt.
// Fälten som är rätt behåller sina värden.
function validateForm() {
  const booking = readBooking();
  let allValid = true;

  const activityMessage = validateActivity(booking.activityId);
  showError(activityError, activityMessage, null);
  if (activityMessage !== "") {
    allValid = false;
  }

  const guestsMessage = validateGuests(booking.guests);
  showError(guestsError, guestsMessage, guestsInput);
  if (guestsMessage !== "") {
    allValid = false;
  }

  const nameMessage = validateName(booking.name);
  showError(nameError, nameMessage, nameInput);
  if (nameMessage !== "") {
    allValid = false;
  }

  const emailMessage = validateEmail(booking.email);
  showError(emailError, emailMessage, emailInput);
  if (emailMessage !== "") {
    allValid = false;
  }

  return allValid;
}

// ---------- Bekräftelse----------

// visar sammanfattningen efter en giltig bokning.
// funktionen tar emot bokningen, erbjudandet och totalpriset som parametrar.

function showConfirmation(booking, activity, total) {
  const rows = [
    "Namn: " + booking.name.trim(),
    "E-post: " + booking.email,
    "Erbjudande: " + activity.name,
    "Antal: " + formatGuests(booking.guests),
    "Totalpris: " + formatPrice(total),
  ];

  confirmationList.innerHTML = "";
  for (const row of rows) {
    const item = document.createElement("li");
    item.textContent = row; // textContent tolkar inte HTML som användaren skrivit
    confirmationList.appendChild(item);
  }
}

// Sidan har två lägen: formuläret eller bekräftelsen.
// När confirmed är true döljs formuläret och bekräftelsen visas, och tvärtom.
// Formuläret är dolt, så de bekräftade uppgifterna kan inte redigeras.
function setConfirmedView(confirmed) {
  form.hidden = confirmed;
  confirmationBox.hidden = !confirmed;
}

// Händelser ----------
function handleSubmit(event) {
  event.preventDefault(); // stoppar att sidan laddas om
  if (!validateForm()) {
    return;
  }

  const booking = readBooking();
  const activity = getActivityById(booking.activityId);
  const total = calculateTotal(activity.pricePerPerson, booking.guests);

  showConfirmation(booking, activity, total);
  setConfirmedView(true);
}

// Börja om: nollställer allt så att hela flödet kan göras igen.
//tömmer namn och e-post, tar bort valet, sätter antalet till 1,
//  tar bort alla fel och bekräftelsen, 
// visar formuläret igen och visar startmeddelandet för priset.
function resetForm() {
  selectedActivityId = null;
  nameInput.value = "";
  emailInput.value = "";
  guestsInput.value = String(MIN_GUESTS);

  updateSelection();
  showError(activityError, "", null);
  showError(guestsError, "", guestsInput);
  showError(nameError, "", nameInput);
  showError(emailError, "", emailInput);

  confirmationList.innerHTML = "";
  setConfirmedView(false);
  updatePrice();
}

renderActivities();
updatePrice();

activityList.addEventListener("click", handleActivityClick);
form.addEventListener("submit", handleSubmit);

// Priset uppdateras när antalet ändras. Om ett fel redan visas rättas det direkt.
guestsInput.addEventListener("input", () => {
  updatePrice();
  if (!guestsError.hidden) {
    showError(guestsError, validateGuests(readBooking().guests), guestsInput);
  }
});
nameInput.addEventListener("input", () => {
  if (!nameError.hidden) {
    showError(nameError, validateName(nameInput.value), nameInput);
  }
});
emailInput.addEventListener("input", () => {
  if (!emailError.hidden) {
    showError(emailError, validateEmail(emailInput.value), emailInput);
  }
});

for (const button of resetButtons) {
  button.addEventListener("click", resetForm);
}
