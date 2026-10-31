document.addEventListener('DOMContentLoaded', () => {
  const activitySelect = document.getElementById('activity-select');
  const adultsInput = document.getElementById('adults-count');
  const childrenInput = document.getElementById('children-count');
  const totalPriceSpan = document.getElementById('total-price');
  const priceMessage = document.getElementById('price-message');
  const activityError = document.getElementById('activity-error');
  const nameError = document.getElementById('name-error');
  const bookingForm = document.getElementById('booking-form');
  const nameInput = document.getElementById('user-name');
  const emailInput = document.getElementById('user-email');
  const confirmationBox = document.getElementById('confirmation-box');
  const adultsError = document.getElementById('adults-error');
  const childrenError = document.getElementById('children-error');
  const emailError = document.getElementById('email-error');
  const resetButton = document.getElementById('reset-button');
  const newBookingButton = document.getElementById('new-booking-button');
 
  // regler för antal som används på flera ställen
  const MIN_ADULTS = 1;
  const MAX_ADULTS = 5;
  const MIN_CHILDREN = 0;
  const MAX_CHILDREN = 5;
 
  const offers = [
    { id: "Naturcamping", name: "Naturcamping", description: "Upplev tystnaden under stjärnorna i våra färdiga tält.", adult: 1500, child: 900 },
    { id: "Kanotpaddling", name: "Kanotpaddling", description: "Paddla genom klara vatten och njut av naturen.", adult: 800, child: 500 },
    { id: "Bergsvandring", name: "Bergsvandring", description: "En guidad tur uppför utmanande bergstoppar.", adult: 1200, child: 700 },
    { id: "Cykeltur", name: "Cykeltur", description: "Hyr våra cyklar och upplev äventyret på hjul.", adult: 950, child: 600 }
  ];
 
  offers.forEach(offer => {
    const option = document.createElement('option');
    option.value = offer.id;
    option.textContent = `${offer.name} (Vuxen: ${offer.adult} kr, Barn: ${offer.child} kr)`;
    option.dataset.adult = offer.adult;
    option.dataset.child = offer.child;
    activitySelect.appendChild(option);
  });
 
  const selectButtons = document.querySelectorAll('.select-activity');
  selectButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const activityName = button.getAttribute('data-activity');
      if (activitySelect) {
        activitySelect.value = activityName;
        calculateTotal();
        showFieldError(activityError, activitySelect, "");
        document.querySelector('#booking-section').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
 
  // kontrollerar att antalet är ett heltal mellan min och max.
  // number gör om texten till ett tal, så "2.5" och "abc" räknas inte som heltal.
  function isValidCount(value, min, max) {
    const count = Number(value);
    return Number.isInteger(count) && count >= min && count <= max;
  }
 
  // kontrollerar att e-posten har exakt ett @, text före och efter,
  // och en punkt i domänen med text på båda sidor
  function isValidEmail(email) {
    if (email === "" || email.includes(" ")) {
      return false;
    }
 
    const parts = email.split("@");
    if (parts.length !== 2 || parts[0] === "" || parts[1] === "") {
      return false;
    }
 
    const domainParts = parts[1].split(".");
    if (domainParts.length < 2) {
      return false;
    }
    for (const part of domainParts) {
      if (part === "") {
        return false;
      }
    }
    return true;
  }
 
  // visar ett fel under fältet och ger fältet röd ram. tom text tar bort felet.
  function showFieldError(errorElement, input, message) {
    errorElement.textContent = message;
    errorElement.hidden = message === "";
    input.style.borderColor = message === "" ? "" : "#d93025";
  }
 
  // returnerar ett felmeddelande för antalet, eller "" om antalet är rätt
  function getAdultsError() {
    if (!isValidCount(adultsInput.value, MIN_ADULTS, MAX_ADULTS)) {
      return `Ange ett heltal mellan ${MIN_ADULTS} och ${MAX_ADULTS} vuxna.`;
    }
    return "";
  }
 
  function getChildrenError() {
    if (!isValidCount(childrenInput.value, MIN_CHILDREN, MAX_CHILDREN)) {
      return `Ange ett heltal mellan ${MIN_CHILDREN} och ${MAX_CHILDREN} barn.`;
    }
    return "";
  }
 
  // "2 vuxna, 1 barn"
  function formatCount(adults, children) {
    const adultText = adults === 1 ? "1 vuxen" : adults + " vuxna";
    if (children === 0) {
      return adultText;
    }
    return adultText + ", " + children + " barn";
  }
 
  function calculateTotal() {
    const selectedOption = activitySelect.options[activitySelect.selectedIndex];
    // inget äventyr valt: ett meddelande visas i stället för ett pris
    if (!selectedOption || !selectedOption.dataset.adult) {
      totalPriceSpan.textContent = "–";
      priceMessage.textContent = "Välj ett äventyr för att se priset.";
      return;
    }
 
    // vid fel antal visas inget pris, bara ett meddelande i fältet
    const adultsMessage = getAdultsError();
    const childrenMessage = getChildrenError();
    showFieldError(adultsError, adultsInput, adultsMessage);
    showFieldError(childrenError, childrenInput, childrenMessage);
    if (adultsMessage !== "" || childrenMessage !== "") {
      totalPriceSpan.textContent = "–";
      priceMessage.textContent = "Ange ett giltigt antal för att se priset.";
      return;
    }
 
    const adultPrice = parseInt(selectedOption.dataset.adult) || 0;
    const childPrice = parseInt(selectedOption.dataset.child) || 0;
 
    const adultsCount = parseInt(adultsInput.value) || 0;
    const childrenCount = parseInt(childrenInput.value) || 0;
 
    const total = (adultPrice * adultsCount) + (childPrice * childrenCount);
    totalPriceSpan.textContent = total + " kr";
    priceMessage.textContent = formatCount(adultsCount, childrenCount);
  }
 
  if (activitySelect) activitySelect.addEventListener('change', () => {
    calculateTotal();
    showFieldError(activityError, activitySelect, "");
  });
  if (adultsInput) adultsInput.addEventListener('input', calculateTotal);
  if (childrenInput) childrenInput.addEventListener('input', calculateTotal);
 
  // när användaren rättar namn eller e-post försvinner felet direkt.
  // felet kontrolleras bara igen om det redan visas.
  nameInput.addEventListener('input', () => {
    if (!nameError.hidden && nameInput.value.trim() !== "") {
      showFieldError(nameError, nameInput, "");
    }
  });
 
  emailInput.addEventListener('input', () => {
    if (!emailError.hidden && isValidEmail(emailInput.value.trim())) {
      showFieldError(emailError, emailInput, "");
    }
  });
 
  // sidan har två lägen: formuläret eller bekräftelsen.
  // när confirmed är true döljs formuläret, så uppgifterna inte kan ändras.
  function setConfirmedView(confirmed) {
    bookingForm.hidden = confirmed;
    confirmationBox.hidden = !confirmed;
  }
 
  // fyller bekräftelsen med den bokning som redan är kontrollerad.
  // textcontent används eftersom namn och e-post kommer från användaren.
  function showConfirmation() {
    const selectedOption = activitySelect.options[activitySelect.selectedIndex];
    const adults = Number(adultsInput.value);
    const children = Number(childrenInput.value);
 
    document.getElementById('confirmation-name').textContent = nameInput.value.trim();
    document.getElementById('confirmation-email').textContent = emailInput.value.trim();
    document.getElementById('confirmation-activity').textContent = selectedOption.value;
    document.getElementById('confirmation-count').textContent = formatCount(adults, children);
    document.getElementById('confirmation-total').textContent = totalPriceSpan.textContent;
 
    setConfirmedView(true);
  }
 
  // börja om: återställer allt så att hela flödet kan göras igen.
  // form.reset tömmer bara fälten, resten återställer vi själva.
  function resetBooking() {
    bookingForm.reset();
    activitySelect.value = "";
    showFieldError(activityError, activitySelect, "");
    showFieldError(nameError, nameInput, "");
    showFieldError(adultsError, adultsInput, "");
    showFieldError(childrenError, childrenInput, "");
    showFieldError(emailError, emailInput, "");
    totalPriceSpan.textContent = "–";
    priceMessage.textContent = "Välj ett äventyr för att se priset.";
    setConfirmedView(false);
  }
 
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
 
      let hasError = false;
 
      // varje fält får ett eget felmeddelande under fältet
      if (!activitySelect.value || activitySelect.value === "") {
        showFieldError(activityError, activitySelect, "Välj ett äventyr i listan.");
        hasError = true;
      } else {
        showFieldError(activityError, activitySelect, "");
      }
 
      // antal kontrolleras med egna felmeddelanden under fälten
      const adultsMessage = getAdultsError();
      const childrenMessage = getChildrenError();
      showFieldError(adultsError, adultsInput, adultsMessage);
      showFieldError(childrenError, childrenInput, childrenMessage);
      if (adultsMessage !== "" || childrenMessage !== "") {
        hasError = true;
      }
 
      if (nameInput.value.trim() === "") {
        showFieldError(nameError, nameInput, "Fyll i ditt namn. Fältet får inte vara tomt.");
        hasError = true;
      } else {
        showFieldError(nameError, nameInput, "");
      }
 
      const emailValue = emailInput.value.trim();
      if (!isValidEmail(emailValue)) {
        showFieldError(emailError, emailInput, "Ange en giltig e-postadress med ett @ och en punkt i domänen, till exempel namn@mail.se.");
        hasError = true;
      } else {
        showFieldError(emailError, emailInput, "");
      }
 
      if (hasError) {
        return;
      }
 
      showConfirmation();
    });
  }
 
  // två börja om-knappar: en i formuläret och en i bekräftelsen
  resetButton.addEventListener('click', resetBooking);
  newBookingButton.addEventListener('click', resetBooking);
});