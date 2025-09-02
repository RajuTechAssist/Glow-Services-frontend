// --- THIS IS THE NEW, CORRECTED CODE ---

// Scroll-in animation for each row
const io = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      obs.unobserve(e.target); // Stop observing the element once it has animated in
    }
  });
}, { threshold: 0.25 }); // The animation triggers when 25% of the element is visible

// This selector now correctly finds all '.reveal' elements inside your '.how-it-works' section
document.querySelectorAll('.how-it-works .reveal').forEach(el => io.observe(el));