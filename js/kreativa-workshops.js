"use strict";

/* ===========================================================
   DATA
   Erbjudandena ligger i en array av objekt. Varje objekt har
   ett unikt id, ett namn, en kort beskrivning och ett pris
   per person. All text och alla priser kommer harifran, sa
   att en andring bara behover goras pa ett stalle.
   =========================================================== */

const WORKSHOPS = [
  {
    id: "ceramics",
    name: "Keramik – drejning för nybörjare",
    description: "Tre timmar vid drejskivan. Du formar din egen skål och vi bränner den åt dig.",
    pricePerPerson: 350,
  },
  {
    id: "watercolor",
    name: "Akvarellmåleri i ateljén",
    description: "Lär dig lasering och vått-i-vått. Allt material och en egen tavla ingår.",
    pricePerPerson: 420,
  },
  {
    id: "silversmithing",
    name: "Silversmide – gör din egen ring",
    description: "Såga, löd och polera en ring i äkta silver tillsammans med en silversmed.",
    pricePerPerson: 590,
  },
  {
    id: "linoprint",
    name: "Linoleumtryck och affischdesign",
    description: "Skär din egen tryckplatta och tryck en affisch i vår handpress.",
    pricePerPerson: 380,
  },
];

/* Regler och fasta texter. Samlade har sa att samma varde
   anvands i validering, prisvisning och felmeddelanden. */
const MIN_QUANTITY = 1;
const MAX_QUANTITY = 5;
const UNIT_SINGULAR = "person";
const UNIT_PLURAL = "personer";
const START_MESSAGE = "Välj en workshop för att se priset.";

/* ===========================================================
   REFERENSER TILL SIDAN
   Hamtas en gang och sparas i ett objekt, i stallet for att
   leta upp samma element om och om igen.
   =========================================================== */

const elements = {
  form: document.getElementById("bookingForm"),
  offerList: document.getElementById("offerList"),
  nameInput: document.getElementById("nameInput"),
  emailInput: document.getElementById("emailInput"),
  quantityInput: document.getElementById("quantityInput"),
  selectedOfferText: document.getElementById("selectedOfferText"),
  priceText: document.getElementById("priceText"),
  submitButton: document.getElementById("submitButton"),
  resetButton: document.getElementById("resetButton"),
  confirmation: document.getElementById("confirmation"),
};

/* Kopplar ihop varje falt med sin felruta, sa att showError
   och clearError kan hitta ratt ruta via ett faltnamn. */
const errorBoxes = {
  offer: document.getElementById("offerError"),
  name: document.getElementById("nameError"),
  email: document.getElementById("emailError"),
  quantity: document.getElementById("quantityError"),
};

/* ===========================================================
   BERAKNINGAR
   Rena funktioner: de tar emot varden, returnerar ett svar
   och ror aldrig sidan. Darfor ar de latta att ateranvanda.
   =========================================================== */

/* Letar upp ett erbjudande via id. Returnerar objektet,
   eller null om id:t inte finns i arrayen. */
function findWorkshop(id) {
  const match = WORKSHOPS.find(function (workshop) {
    return workshop.id === id;
  });
  return match || null;
}

/* Totalpriset: pris per enhet ganger antal. */
function calculateTotalPrice(pricePerUnit, quantity) {
  return pricePerUnit * quantity;
}

/* Skriver ut ett belopp pa svenskt vis, till exempel 1 750 kr. */
function formatPrice(amount) {
  return amount.toLocaleString("sv-SE") + " kr";
}

/* Valjer ratt form av enheten: 1 person, men 2 personer. */
function unitLabel(quantity) {
  return quantity === 1 ? UNIT_SINGULAR : UNIT_PLURAL;
}

/* ===========================================================
   VALIDERINGSREGLER
   Varje funktion returnerar null nar vardet ar giltigt, och
   annars en felmeddelandetext. Samma regler anvands bade nar
   priset raknas om och nar formularet skickas.
   =========================================================== */

/* Namnet maste innehalla nagot annat an blanksteg. */
function getNameError(value) {
  if (value.trim() === "") {
    return "Fyll i ditt namn. Fältet får inte vara tomt.";
  }
  return null;
}

/* E-postadressen kontrolleras i sma steg, ett krav i taget. */
function getEmailError(value) {
  const email = value.trim();

  if (email === "") {
    return "Fyll i din e-postadress.";
  }
  if (email.includes(" ")) {
    return "E-postadressen får inte innehålla mellanslag.";
  }

  /* split delar texten vid varje snabel-a. Blir det inte exakt
     tva delar finns det noll eller flera snabel-a. */
  const parts = email.split("@");
  if (parts.length !== 2) {
    return "E-postadressen ska innehålla exakt ett @, till exempel namn@exempel.se.";
  }

  const localPart = parts[0];
  const domainPart = parts[1];

  if (localPart === "") {
    return "Det saknas text före @ i e-postadressen.";
  }
  if (domainPart === "") {
    return "Det saknas text efter @ i e-postadressen.";
  }

  /* Domanen delas vid varje punkt. Minst tva delar kravs, och
     ingen del far vara tom - da star punkten forst, sist eller
     direkt efter en annan punkt. */
  const domainSections = domainPart.split(".");
  if (domainSections.length < 2) {
    return "Domänen efter @ ska innehålla minst en punkt, till exempel exempel.se.";
  }

  const hasEmptySection = domainSections.some(function (section) {
    return section === "";
  });
  if (hasEmptySection) {
    return "Det måste finnas text på båda sidor om varje punkt i domänen.";
  }

  return null;
}

/* Ett giltigt erbjudande ar ett id som finns i arrayen. */
function getOfferError(id) {
  if (findWorkshop(id) === null) {
    return "Välj en av workshopparna ovan.";
  }
  return null;
}

/* Antalet ska vara ett heltal mellan MIN_QUANTITY och MAX_QUANTITY. */
function getQuantityError(value) {
  const text = value.trim();

  if (text === "") {
    return "Fyll i hur många " + UNIT_PLURAL + " ni är.";
  }

  const quantity = Number(text);

  /* Number.isInteger stoppar bade bokstaver (NaN) och decimaler. */
  if (!Number.isInteger(quantity)) {
    return "Antalet måste vara ett heltal, utan decimaler eller bokstäver.";
  }
  if (quantity < MIN_QUANTITY || quantity > MAX_QUANTITY) {
    return "Antalet måste vara mellan " + MIN_QUANTITY + " och " + MAX_QUANTITY + " " + UNIT_PLURAL + ".";
  }

  return null;
}

/* ===========================================================
   LASA OCH VALIDERA HELA FORMULARET
   =========================================================== */

/* Samlar ihop allt anvandaren fyllt i till ett objekt. */
function readForm() {
  const checkedRadio = elements.form.querySelector("input[name='offer']:checked");

  return {
    name: elements.nameInput.value,
    email: elements.emailInput.value,
    quantity: elements.quantityInput.value,
    offerId: checkedRadio ? checkedRadio.value : "",
  };
}

/* Kor alla regler och returnerar ett objekt med ett fel
   (eller null) per falt. */
function validateForm(formData) {
  return {
    offer: getOfferError(formData.offerId),
    name: getNameError(formData.name),
    email: getEmailError(formData.email),
    quantity: getQuantityError(formData.quantity),
  };
}

/* Sant bara nar samtliga falt ar null, alltsa utan fel. */
function isValid(errors) {
  return Object.values(errors).every(function (error) {
    return error === null;
  });
}

/* ===========================================================
   UPPDATERA SIDAN
   Funktioner som bara andrar DOM:en.
   =========================================================== */

/* Bygger ett kort for ett erbjudande. En radioknapp gor att
   webblasaren haller reda pa vilket kort som ar valt och att
   korten gar att na med tangentbordet. */
function createOfferCard(workshop) {
  const card = document.createElement("label");
  card.className = "offer";

  const input = document.createElement("input");
  input.type = "radio";
  input.name = "offer";
  input.value = workshop.id;
  input.className = "offer__input";

  const body = document.createElement("span");
  body.className = "offer__body";

  const name = document.createElement("span");
  name.className = "offer__name";
  name.textContent = workshop.name;

  const description = document.createElement("span");
  description.className = "offer__description";
  description.textContent = workshop.description;

  const price = document.createElement("span");
  price.className = "offer__price";
  price.textContent = formatPrice(workshop.pricePerPerson) + " per " + UNIT_SINGULAR;

  /* Texten Vald visas bara pa det markerade kortet, sa att
     valet syns med mer an bara en farg. */
  const badge = document.createElement("span");
  badge.className = "offer__badge";
  badge.textContent = "✓ Vald";

  body.append(name, description, price);
  card.append(input, body, badge);
  return card;
}

/* Itererar over arrayen och ritar ut alla erbjudanden. */
function renderOffers() {
  elements.offerList.replaceChildren();

  for (const workshop of WORKSHOPS) {
    elements.offerList.append(createOfferCard(workshop));
  }
}

/* Hjalpfunktion: vilket inmatningsfalt hor till ett faltnamn?
   Erbjudandena har inget eget inmatningsfalt, darfor null. */
function inputForField(field) {
  if (field === "name") return elements.nameInput;
  if (field === "email") return elements.emailInput;
  if (field === "quantity") return elements.quantityInput;
  return null;
}

/* Visar ett felmeddelande under ratt falt och markerar faltet. */
function showError(field, message) {
  errorBoxes[field].textContent = message;
  errorBoxes[field].classList.add("field-error--visible");

  const input = inputForField(field);
  if (input) {
    input.classList.add("input--invalid");
    input.setAttribute("aria-invalid", "true");
  }
}

/* Tar bort felmeddelandet for ett falt. */
function clearError(field) {
  errorBoxes[field].textContent = "";
  errorBoxes[field].classList.remove("field-error--visible");

  const input = inputForField(field);
  if (input) {
    input.classList.remove("input--invalid");
    input.removeAttribute("aria-invalid");
  }
}

/* Visar eller doljer felen for samtliga falt pa en gang. */
function showAllErrors(errors) {
  for (const field of Object.keys(errors)) {
    if (errors[field] === null) {
      clearError(field);
    } else {
      showError(field, errors[field]);
    }
  }
}

/* Tommer alla felmeddelanden. */
function clearAllErrors() {
  for (const field of Object.keys(errorBoxes)) {
    clearError(field);
  }
}

/* Flyttar markoren till det forsta faltet som har ett fel. */
function focusFirstError(errors) {
  const order = ["offer", "name", "email", "quantity"];

  for (const field of order) {
    if (errors[field] !== null) {
      const input = inputForField(field);
      if (input) {
        input.focus();
      } else {
        const firstRadio = elements.offerList.querySelector("input");
        if (firstRadio) {
          firstRadio.focus();
        }
      }
      return;
    }
  }
}

/* Raknar om och skriver ut priset. Gar priset inte att rakna
   ut visas ett forklarande meddelande i stallet for NaN. */
function updatePrice() {
  const formData = readForm();
  const workshop = findWorkshop(formData.offerId);

  if (workshop === null) {
    elements.selectedOfferText.textContent = "Ingen workshop är vald ännu.";
    elements.priceText.textContent = START_MESSAGE;
    return;
  }

  elements.selectedOfferText.textContent =
    "Vald workshop: " + workshop.name + " – " +
    formatPrice(workshop.pricePerPerson) + " per " + UNIT_SINGULAR + ".";

  /* Samma regel som vid inskickning, inte en egen kopia. */
  if (getQuantityError(formData.quantity) !== null) {
    elements.priceText.textContent =
      "Ange ett heltal mellan " + MIN_QUANTITY + " och " + MAX_QUANTITY + " för att se totalpriset.";
    return;
  }

  const quantity = Number(formData.quantity);
  const total = calculateTotalPrice(workshop.pricePerPerson, quantity);

  elements.priceText.textContent =
    "Totalpris: " + formatPrice(total) + " för " + quantity + " " + unitLabel(quantity) + ".";
}

/* ===========================================================
   BEKRAFTELSE OCH ATERSTALLNING
   =========================================================== */

/* Bygger en rad i sammanfattningen. textContent anvands sa att
   det anvandaren skrivit aldrig tolkas som HTML. */
function createSummaryRow(label, value) {
  const row = document.createElement("div");
  row.className = "confirmation__row";

  const term = document.createElement("dt");
  term.textContent = label;

  const definition = document.createElement("dd");
  definition.textContent = value;

  row.append(term, definition);
  return row;
}

/* Visar sammanfattningen av den bekraftade forfragan. */
function showConfirmation(formData) {
  const workshop = findWorkshop(formData.offerId);
  const quantity = Number(formData.quantity);
  const total = calculateTotalPrice(workshop.pricePerPerson, quantity);

  const heading = document.createElement("h2");
  heading.textContent = "Tack! Din bokningsförfrågan är skickad";

  const intro = document.createElement("p");
  intro.textContent = "Vi hör av oss till din e-postadress. Så här såg förfrågan ut:";

  const list = document.createElement("dl");
  list.className = "confirmation__list";
  list.append(
    createSummaryRow("Namn", formData.name.trim()),
    createSummaryRow("E-postadress", formData.email.trim()),
    createSummaryRow("Workshop", workshop.name),
    createSummaryRow("Antal", quantity + " " + unitLabel(quantity)),
    createSummaryRow("Totalpris", formatPrice(total))
  );

  const note = document.createElement("p");
  note.className = "confirmation__note";
  note.textContent = "Förfrågan är avslutad. Välj Börja om för att göra en ny.";

  elements.confirmation.replaceChildren(heading, intro, list, note);
  elements.confirmation.hidden = false;
}

/* Laser eller laser upp formularet. Efter en bekraftelse ska
   uppgifterna inte ga att andra. */
function setFormLocked(locked) {
  const inputs = elements.form.querySelectorAll("input");

  for (const input of inputs) {
    input.disabled = locked;
  }

  elements.submitButton.disabled = locked;
  elements.form.classList.toggle("booking--locked", locked);
}

/* Aterstaller hela sidan till utgangslaget. */
function resetBooking() {
  elements.form.reset();                             // tommer namn och e-post, avmarkerar korten
  setFormLocked(false);                              // laser upp falten igen
  elements.quantityInput.value = String(MIN_QUANTITY); // antalet tillbaka till 1

  clearAllErrors();
  elements.confirmation.hidden = true;
  elements.confirmation.replaceChildren();

  updatePrice();                                     // prisrutan far sitt startmeddelande
  elements.nameInput.focus();
}

/* ===========================================================
   HANDELSER
   Kopplar anvandarens handlingar till funktionerna ovan.
   =========================================================== */

/* Ett fel som redan visas uppdateras eller tas bort sa snart
   faltet blivit ratt. Nya fel visas forst vid inskickning, sa
   att anvandaren inte varnas mitt i att hen skriver. */
function refreshErrorIfShown(field, currentError) {
  const isShowing = errorBoxes[field].textContent !== "";

  if (!isShowing) {
    return;
  }
  if (currentError === null) {
    clearError(field);
  } else {
    showError(field, currentError);
  }
}

function handleSubmit(event) {
  event.preventDefault(); // ingen omladdning av sidan

  const formData = readForm();
  const errors = validateForm(formData);

  showAllErrors(errors);

  if (!isValid(errors)) {
    focusFirstError(errors);
    return; // forfragan bekraftas inte
  }

  showConfirmation(formData);
  setFormLocked(true);
}

function registerEvents() {
  elements.form.addEventListener("submit", handleSubmit);
  elements.resetButton.addEventListener("click", resetBooking);

  elements.offerList.addEventListener("change", function () {
    clearError("offer");
    updatePrice();
  });

  elements.nameInput.addEventListener("input", function () {
    refreshErrorIfShown("name", getNameError(elements.nameInput.value));
  });

  elements.emailInput.addEventListener("input", function () {
    refreshErrorIfShown("email", getEmailError(elements.emailInput.value));
  });

  elements.quantityInput.addEventListener("input", function () {
    refreshErrorIfShown("quantity", getQuantityError(elements.quantityInput.value));
    updatePrice();
  });
}

/* ===========================================================
   START
   Tre rader som startar sidan: rita korten, lyssna pa
   handelser och visa prisrutans startmeddelande.
   =========================================================== */

renderOffers();
registerEvents();
updatePrice();
