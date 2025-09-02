// =======================================================
//  ANIMATED STATS COUNTER SCRIPT
// =======================================================

function animateStats() {
  const counters = document.querySelectorAll('.stat-number');
  const speed = 200; // The lower the number, the faster the count

  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const isDecimal = target % 1 !== 0; // Check if the target is a decimal

    const updateCount = () => {
      const currentVal = +counter.innerText;
      const increment = target / speed;

      if (currentVal < target) {
        let newValue = currentVal + increment;
        // Format the number based on whether it's a decimal or integer
        if (isDecimal) {
          counter.innerText = newValue.toFixed(1); // Keep one decimal place
        } else {
          counter.innerText = Math.ceil(newValue);
        }
        setTimeout(updateCount, 10);
      } else {
        // Once done, set the final number and add symbols
        if (isDecimal) {
          counter.innerText = target + '%';
        } else if (counter.getAttribute('data-target') === '2847') {
          counter.innerText = target + '+';
        } else if (counter.getAttribute('data-target') === '24') {
          counter.innerText = target + '/7';
        } else {
          counter.innerText = target;
        }
      }
    };
    updateCount();
  });
}

// Use Intersection Observer to trigger the animation only when visible
const statsContainer = document.querySelector('.stats-container');
const statsObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateStats(); // Start the animation
      observer.unobserve(entry.target); // Stop observing to prevent re-triggering
    }
  });
}, { 
  threshold: 0.5 // Trigger when 50% of the section is visible
});

// Start observing the stats container
if (statsContainer) {
  statsObserver.observe(statsContainer);
}