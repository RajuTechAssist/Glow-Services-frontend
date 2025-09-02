/* =========================================
   JAVASCRIPT FOR PRODUCT DETAIL PAGE
   ========================================= */
$(document).ready(function() {

    // Quantity Selector Logic
    $('.quantity-btn.plus').on('click', function() {
        var input = $(this).siblings('input[type="number"]');
        var currentValue = parseInt(input.val());
        input.val(currentValue + 1);
    });

    $('.quantity-btn.minus').on('click', function() {
        var input = $(this).siblings('input[type="number"]');
        var currentValue = parseInt(input.val());
        if (currentValue > 1) { // Prevent going below 1
            input.val(currentValue - 1);
        }
    });

});