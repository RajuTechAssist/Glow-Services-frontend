// This is a common practice in jQuery to create a private scope.
// It helps avoid conflicts with other libraries that might also use the '$' symbol.
(function($) {
    'use strict'; // Enforces stricter parsing and error handling in JavaScript.

    // =========================================================================
    //  INITIALIZE OWL CAROUSEL FOR SERVICES
    // =========================================================================
    // Selects the element with the class 'service-caro' and turns it into a carousel.
    $('.service-caro').owlCarousel({
        loop: false,      // Carousel will not loop back to the beginning.
        margin: 5,        // Space between items in pixels.
        nav: false,       // Disables the default navigation arrows (prev/next).
        responsive: {     // Defines how many items to show at different screen widths.
            0: {          // For screen widths 0px and up...
                items: 1  // ...show 1 item.
            },
            600: {        // For screen widths 600px and up...
                items: 3  // ...show 3 items.
            },
            1000: {       // For screen widths 1000px and up...
                items: 4  // ...show 4 items.
            }
        }
    });

    // =========================================================================
    //  INITIALIZE OWL CAROUSEL FOR TESTIMONIALS
    // =========================================================================
    // Selects the element with the class 'test-caro' and turns it into a carousel.
    $('.test-caro').owlCarousel({
        autoplay: true,   // The carousel will automatically slide.
        dots: true,       // Shows the small navigation dots at the bottom.
        loop: true,       // The carousel will loop infinitely.
        nav: false,       // Disables the navigation arrows.
        items: 1          // Shows only one item at a time.
    });

    // =========================================================================
    //  MOBILE MENU TOGGLE FUNCTIONALITY
    // =========================================================================
    // Attaches a click event listener to the element with the class 'mobile-menu'.
    $('.mobile-menu').on('click', function() {
        // When clicked, it finds the 'ul' inside '.primary-menu' and toggles its visibility
        // with a smooth sliding animation.
        $('.primary-menu ul').slideToggle();
    });


    // =========================================================================
    //  CONTACT FORM SUBMISSION (AJAX)
    // =========================================================================
    // Intercepts the default 'submit' event of the contact form.
    $('#contact-form').on("submit", function (e) {
        // Prevents the default form submission, which would reload the page.
        e.preventDefault();

        // Get the form's action URL (where the data will be sent).
        var action = $(this).attr('action');

        // Hide the message display area before sending new data.
        $("#message").slideUp(750, function () {
            $('#message').hide();

            // Show a loading spinner and disable the submit button to prevent multiple submissions.
            $('#submit')
                .after('<img src="images/ajax-loader.gif" class="loader" />')
                .attr('disabled', 'disabled');

            // Use jQuery's $.post to send the form data to the server asynchronously.
            $.post(action, {
                // Collects the data from the form fields.
                name: $('#name').val(),
                email: $('#email').val(),
                subject: $('#subject').val(),
                comments: $('#comments').val()
            },
            function (data) {
                // This function is the callback that runs after the server responds.
                // 'data' contains the response from the server.
                document.getElementById('message').innerHTML = data;
                $('#message').slideDown('slow'); // Display the server response message.

                // Set a timer to automatically hide the message after 2 seconds.
                setTimeout(function () {
                    $('#message').slideUp('slow');
                }, 2000);

                // Remove the loading spinner and re-enable the submit button.
                $('#contact-form img.loader').fadeOut('slow', function () {
                    $(this).remove();
                });
                $('#submit').removeAttr('disabled');
            });
        });

        // Return false to ensure the default form submission is stopped.
        return false;
    });


    // =========================================================================
    //  APPOINTMENT FORM SUBMISSION (AJAX)
    // =========================================================================
    // This function is very similar to the contact form handler above.
    $('#apoint-form').on("submit", function (e) {
        // Prevents the default form submission.
        e.preventDefault();

        var action = $(this).attr('action');

        // Hide the appointment message display area.
        $("#amessage").slideUp(750, function () {
            $('#amessage').hide();

            // Show a loading spinner and disable the appointment submit button.
            $('#asubmit')
                .after('<img src="images/ajax-loader.gif" class="loader" />')
                .attr('disabled', 'disabled');

            // Send the appointment form data to the server via POST.
            $.post(action, {
                name: $('#name').val(),
                email: $('#email').val(),
                service: $('#service').val(),
                number: $('#number').val(),
                date: $('#date').val(),
                time: $('#time').val(),
                comments: $('#comments').val()
            },
            function (data) {
                // Display the server's response in the '#amessage' div.
                document.getElementById('amessage').innerHTML = data;
                $('#amessage').slideDown('slow');

                // Hide the message after 2 seconds.
                setTimeout(function () {
                    $('#amessage').slideUp('slow');
                }, 2000);

                // Remove the loader and re-enable the submit button.
                $('#apoint-form img.loader').fadeOut('slow', function () {
                    $(this).remove();
                });
                $('#asubmit').removeAttr('disabled');
            });
        });

        return false;
    });

// End of the jQuery private scope.
}) (jQuery);


// =========================================================================
//  VANILLA JS - HEADER SCROLL EFFECT
// =========================================================================
// This code is outside the jQuery wrapper and uses modern standard JavaScript.

// Select the header element from the DOM.
const header = document.querySelector('.abs-header');
// Define the scroll distance (in pixels) after which the header style changes.
const threshold = 50;

// Add an event listener that triggers whenever the user scrolls the page.
window.addEventListener('scroll', () => {
    // Check if the vertical scroll position is greater than our threshold.
    if (window.scrollY > threshold) {
        // If it is, add the 'scrolled' class to the header.
        // This class can be styled in CSS to give the header a solid background.
        header.classList.add('scrolled');
    } else {
        // If it's not, remove the 'scrolled' class, making the header transparent again.
        header.classList.remove('scrolled');
    }
});

// =========================================================================

// ---------- Guard to prevent double-init ----------
if (!window.__glowNavInit) {
  window.__glowNavInit = true;

  (function () {
    // <-- paste the entire new nav JS here (the IIFE from my previous message)
    document.addEventListener('DOMContentLoaded', function () {
      const header = document.getElementById('header');
      if (!header) return;

      const nav = header.querySelector('nav');

      // Find mobile bars button (svg data-icon="bars" in markup)
      const mobileBtn = header.querySelector('button svg[data-icon="bars"]') ? header.querySelector('button svg[data-icon="bars"]').closest('button') : null;

      // Toggle mobile nav
      if (mobileBtn && nav) {
        mobileBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          header.classList.toggle('show-mobile-nav');  // used by CSS to show nav
          // toggle the hidden class for older tailwind usage
          nav.classList.toggle('hidden');
        });
      }

      // Dropdown parents (.relative.group)
      const dropdowns = Array.from(header.querySelectorAll('.relative.group'));

      dropdowns.forEach(drop => {
        const btn = drop.querySelector('button');
        if (!btn) return;

        btn.setAttribute('aria-haspopup', 'true');
        btn.setAttribute('aria-expanded', 'false');

        btn.addEventListener('click', function (ev) {
          ev.stopPropagation();
          // Close other dropdowns
          dropdowns.forEach(other => {
            if (other !== drop) {
              other.classList.remove('open');
              const ob = other.querySelector('button');
              if (ob) ob.setAttribute('aria-expanded', 'false');
            }
          });

          // Toggle this dropdown
          const opened = drop.classList.toggle('open');
          btn.setAttribute('aria-expanded', String(opened));
        });

        // prevent clicking inside the dropdown items from closing it
        const menu = drop.querySelector('.absolute');
        if (menu) menu.addEventListener('click', ev => ev.stopPropagation());
      });

      // Close everything when clicking outside
      document.addEventListener('click', function () {
        dropdowns.forEach(d => {
          d.classList.remove('open');
          const b = d.querySelector('button');
          if (b) b.setAttribute('aria-expanded', 'false');
        });
        if (header.classList.contains('show-mobile-nav')) {
          header.classList.remove('show-mobile-nav');
          if (nav) nav.classList.add('hidden');
        }
      });

      // Close on escape
      document.addEventListener('keydown', function (ev) {
        if (ev.key === 'Escape' || ev.key === 'Esc') {
          dropdowns.forEach(d => d.classList.remove('open'));
          dropdowns.forEach(d => {
            const b = d.querySelector('button');
            if (b) b.setAttribute('aria-expanded', 'false');
          });
          if (header.classList.contains('show-mobile-nav')) {
            header.classList.remove('show-mobile-nav');
            if (nav) nav.classList.add('hidden');
          }
        }
      });

      // On resize: if we cross into desktop width, make sure mobile nav is closed
      let prevWidth = window.innerWidth;
      window.addEventListener('resize', function () {
        const w = window.innerWidth;
        if (prevWidth < 1024 && w >= 1024) {
          header.classList.remove('show-mobile-nav');
          if (nav) nav.classList.remove('hidden');
          dropdowns.forEach(d => d.classList.remove('open'));
        }
        if (prevWidth >= 1024 && w < 1024) {
          if (nav) nav.classList.add('hidden');
        }
        prevWidth = w;
      });

    }); // DOMContentLoaded
    // end of pasted script
  })();

} // end guard

// ---------- Products multi-level toggle (safe to append) ----------
if (!window.__glowProductsInit) {
  window.__glowProductsInit = true;

  (function () {
    document.addEventListener('DOMContentLoaded', function () {
      const productsMenu = document.getElementById('products-menu');
      if (!productsMenu) return;

      // Helper to close all sublists at a given root
      function closeAll(root, selector) {
        Array.from(root.querySelectorAll(selector)).forEach(el => {
          el.classList.remove('open');
          // set aria-expanded if it's a button
          const btn = el.querySelector('button') || el.closest('.prod-cat') && el.closest('.prod-cat').querySelector('button');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        });
      }

      // Toggle main categories
      Array.from(productsMenu.querySelectorAll('.prod-cat-btn')).forEach(btn => {
        btn.addEventListener('click', function (ev) {
          ev.stopPropagation();
          const targetId = btn.getAttribute('data-target');
          const container = document.getElementById(targetId);
          if (!container) return;

          const prodCat = container.closest('.prod-cat');
          const isOpen = prodCat.classList.toggle('open');
          btn.setAttribute('aria-expanded', String(isOpen));

          // close other main categories (optional — keeps UI tidy)
          Array.from(productsMenu.querySelectorAll('.prod-cat')).forEach(other => {
            if (other !== prodCat) {
              other.classList.remove('open');
              const obtn = other.querySelector('.prod-cat-btn');
              if (obtn) obtn.setAttribute('aria-expanded', 'false');
            }
          });
        });
      });

      // Toggle subcategories that have further sub-sub lists
      Array.from(productsMenu.querySelectorAll('.subcat-btn')).forEach(sbtn => {
        sbtn.addEventListener('click', function (ev) {
          ev.stopPropagation();
          const tid = sbtn.getAttribute('data-target');
          const submenu = document.getElementById(tid);
          if (!submenu) return;
          const subWrap = submenu.closest('.subcat');
          const open = subWrap.classList.toggle('open');
          sbtn.setAttribute('aria-expanded', String(open));

          // close sibling subcats within same main category
          const parentList = subWrap.parentElement;
          if (parentList) {
            Array.from(parentList.querySelectorAll('.subcat')).forEach(sib => {
              if (sib !== subWrap) {
                sib.classList.remove('open');
                const sb = sib.querySelector('.subcat-btn');
                if (sb) sb.setAttribute('aria-expanded', 'false');
              }
            });
          }
        });
      });

      // Close all product menu lists when clicking outside
      document.addEventListener('click', function (ev) {
        // if click is outside productsMenu, close
        if (!productsMenu.contains(ev.target)) {
          Array.from(productsMenu.querySelectorAll('.prod-cat')).forEach(pc => pc.classList.remove('open'));
          Array.from(productsMenu.querySelectorAll('.subcat')).forEach(sc => sc.classList.remove('open'));
          // reset aria
          Array.from(productsMenu.querySelectorAll('.prod-cat-btn, .subcat-btn')).forEach(b => b.setAttribute('aria-expanded', 'false'));
        }
      });

      // Close on esc
      document.addEventListener('keydown', function (ev) {
        if (ev.key === 'Escape' || ev.key === 'Esc') {
          Array.from(productsMenu.querySelectorAll('.prod-cat, .subcat')).forEach(el => el.classList.remove('open'));
          Array.from(productsMenu.querySelectorAll('.prod-cat-btn, .subcat-btn')).forEach(b => b.setAttribute('aria-expanded', 'false'));
        }
      });

      // If the site switches from mobile to desktop, make sure accordions are reset (optional)
      let prevW = window.innerWidth;
      window.addEventListener('resize', function () {
        const w = window.innerWidth;
        if (prevW < 1024 && w >= 1024) {
          // close mobile accordions (desktop hover will handle)
          Array.from(productsMenu.querySelectorAll('.prod-cat, .subcat')).forEach(el => el.classList.remove('open'));
          Array.from(productsMenu.querySelectorAll('.prod-cat-btn, .subcat-btn')).forEach(b => b.setAttribute('aria-expanded', 'false'));
        }
        prevW = w;
      });

    }); // DOM ready
  })();
}


// ---------- Products menu runtime height fallback ----------
(function(){
  // run after DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    const productsBtn = document.querySelector('#products-btn');
    const productsMenu = document.querySelector('#products-menu');
    const header = document.getElementById('header');

    if (!productsBtn || !productsMenu) return;

    function setProductsMenuHeight() {
      // compute how much vertical space is available beneath header
      const headerBottom = header ? header.getBoundingClientRect().bottom : 64;
      const viewportH = window.innerHeight;
      // keep a 20px gap bottom
      const avail = Math.max(120, viewportH - headerBottom - 20);
      // limit not more than 70% of viewport
      const max = Math.min(avail, Math.round(viewportH * 0.7));
      productsMenu.style.maxHeight = max + 'px';
      productsMenu.style.overflowY = 'auto';
      productsMenu.style.webkitOverflowScrolling = 'touch';
    }

    // apply when Products button is clicked or hovered (desktop)
    productsBtn.addEventListener('click', function (e) {
      // give the CSS time to show menu (if using hover) then set height
      setTimeout(setProductsMenuHeight, 50);
    });

    // on mouseenter (desktop hover)
    productsBtn.addEventListener('mouseenter', setProductsMenuHeight);

    // also adjust on resize / orientationchange
    window.addEventListener('resize', setProductsMenuHeight);
    window.addEventListener('orientationchange', setProductsMenuHeight);

    // If your dropdown opens via adding .open class somewhere, observe mutations and set height
    const obs = new MutationObserver(function(mutations){
      for (const m of mutations) {
        if (m.type === 'attributes' && (m.attributeName === 'class' || m.attributeName === 'style')) {
          // if menu is visible (not invisible)
          const vis = window.getComputedStyle(productsMenu).visibility;
          if (vis !== 'hidden') {
            setProductsMenuHeight();
          }
        }
      }
    });
    obs.observe(productsMenu, { attributes: true, attributeFilter: ['class', 'style'] });

    // initial
    setProductsMenuHeight();
  });
})();

