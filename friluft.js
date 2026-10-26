document.addEventListener('DOMContentLoaded', () => {
  const activitySelect = document.getElementById('activity-select');
  const adultsInput = document.getElementById('adults-count');
  const childrenInput = document.getElementById('children-count');
  const totalPriceSpan = document.getElementById('total-price');
  const bookingForm = document.getElementById('booking-form');
  const nameInput = document.getElementById('user-name');
  const emailInput = document.getElementById('user-email');
  const errorMessage = document.getElementById('error-message');

  const offers = [
    { id: "Naturcamping", name: "Naturcamping", adult: 1500, child: 900 },
    { id: "Kanotpaddling", name: "Kanotpaddling", adult: 800, child: 500 },
    { id: "Bergsvandring", name: "Bergsvandring", adult: 1200, child: 700 },
    { id: "Cykeltur", name: "Cykeltur", adult: 950, child: 600 }
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
        document.querySelector('#booking-section').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  function calculateTotal() {
    const selectedOption = activitySelect.options[activitySelect.selectedIndex];
    if (!selectedOption || !selectedOption.dataset.adult) {
      totalPriceSpan.textContent = "0 kr";
      return;
    }

    const adultPrice = parseInt(selectedOption.dataset.adult) || 0;
    const childPrice = parseInt(selectedOption.dataset.child) || 0;
    
    const adultsCount = parseInt(adultsInput.value) || 0;
    const childrenCount = parseInt(childrenInput.value) || 0;

    const total = (adultPrice * adultsCount) + (childPrice * childrenCount);
    totalPriceSpan.textContent = total + " kr";
  }

  if (activitySelect) activitySelect.addEventListener('change', calculateTotal);
  if (adultsInput) adultsInput.addEventListener('input', calculateTotal);
  if (childrenInput) childrenInput.addEventListener('input', calculateTotal);

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let hasError = false;

      if (!activitySelect.value) {
        activitySelect.style.borderColor = "#d93025";
        hasError = true;
      } else {
        activitySelect.style.borderColor = "";
      }

      if (!nameInput.value.trim()) {
        nameInput.style.borderColor = "#d93025";
        hasError = true;
      } else {
        nameInput.style.borderColor = "";
      }

      if (!emailInput.checkValidity() || !emailInput.value.trim()) {
        emailInput.style.borderColor = "#d93025";
        hasError = true;
      } else {
        emailInput.style.borderColor = "";
      }

      if (hasError) {
        if (errorMessage) {
          errorMessage.textContent = "Vänligen fyll i alla fält korrekt (äventyr, namn och e-post).";
        }
        return;
      }

      if (errorMessage) {
        errorMessage.textContent = "";
      }

      const selectedOption = activitySelect.options[activitySelect.selectedIndex].text;
      const total = totalPriceSpan.textContent;
      const name = nameInput.value.trim();

      alert(`Tack för din bokningsförfrågan, ${name}!\n\nÄventyr: ${selectedOption}\nTotalt att betala: ${total}\n\nVi har skickat en bekräftelse till din e-post.`);

      bookingForm.reset();
      totalPriceSpan.textContent = "0 kr";
    });
  }
});