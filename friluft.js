document.addEventListener('DOMContentLoaded', () => {
  const activitySelect = document.getElementById('activity-select');
  const adultsInput = document.getElementById('adults-count');
  const childrenInput = document.getElementById('children-count');
  const totalPriceSpan = document.getElementById('total-price');
  const bookingForm = document.getElementById('booking-form');

  
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

  // 
  if (activitySelect) activitySelect.addEventListener('change', calculateTotal);
  if (adultsInput) adultsInput.addEventListener('input', calculateTotal);
  if (childrenInput) childrenInput.addEventListener('input', calculateTotal);

  // 
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('user-name').value;
      const selectedOption = activitySelect.options[activitySelect.selectedIndex].text;
      const total = totalPriceSpan.textContent;

      alert(`Tack för din bokningsförfrågan, ${name}!\n\nÄventyr: ${selectedOption}\nTotalt att betala: ${total}\n\nVi har skickat en bekräftelse till din e-post.`);
      bookingForm.reset();
      totalPriceSpan.textContent = "0 kr";
    });
  }
});