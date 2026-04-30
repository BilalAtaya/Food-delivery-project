// jQuery Document Ready
$(document).ready(function() {
    console.log("Page loaded successfully");
});

// Function to toggle meal details
function toggleDetails(button) {
    const detailsRow = $(button).closest('tr').next('.details-row');
    if (detailsRow.is(':visible')) {
        detailsRow.slideUp();
        $(button).text('إظهار التفاصيل');
    } else {
        detailsRow.slideDown();
        $(button).text('إخفاء التفاصيل');
    }
}

// Function to show the order form
function showForm() {
    const selectedMeals = $('.meal-checkbox:checked');
    if (selectedMeals.length === 0) {
        alert('يرجى اختيار وجبة واحدة على الأقل');
        return;
    }
    $('#orderForm').slideDown();
    $('html, body').animate({
        scrollTop: $('#orderForm').offset().top - 100
    }, 1000);
}

// Function to hide the order form
function hideForm() {
    $('#orderForm').slideUp();
    $('html, body').animate({
        scrollTop: $('.meals-table').offset().top - 100
    }, 1000);
}

// Function to validate the form
function validateForm(event) {
    event.preventDefault();
    let isValid = true;
    $('.error-message').text('');
    
    const fullName = $('#fullName').val().trim();
    const nationalId = $('#nationalId').val().trim();
    const birthDate = $('#birthDate').val().trim();
    const mobile = $('#mobile').val().trim();
    const email = $('#email').val().trim();
    
    // Full Name: Arabic only (allow empty)
    if (fullName !== '') {
        var arabicPattern = /^[\u0600-\u06FF\s]+$/;
        if (!arabicPattern.test(fullName)) {
            $('#nameError').text('الاسم يجب أن يحتوي على أحرف عربية فقط');
            isValid = false;
        }
    }
    
    // National ID: 11 digits and first two digits (governorate) from 01 to 14
    if (nationalId === '') {
        $('#nationalIdError').text('الرقم الوطني مطلوب');
        isValid = false;
    } else {
        var nationalIdPattern = /^\d{11}$/;
        if (!nationalIdPattern.test(nationalId)) {
            $('#nationalIdError').text('الرقم الوطني غير صالح (11 خانة)');
            isValid = false;
        } else {
            var govCode = nationalId.substring(0,2);
            var validGovCodes = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14'];
            if (!validGovCodes.includes(govCode)) {
                $('#nationalIdError').text('رمز المحافظة غير صالح (يجب أن يكون 01-14)');
                isValid = false;
            }
        }
    }
    
    // Birth Date: dd-mm-yyyy and reasonable
    if (birthDate !== '') {
        var datePattern = /^\d{2}-\d{2}-\d{4}$/;
        if (!datePattern.test(birthDate)) {
            $('#birthDateError').text('تاريخ غير صالح (dd-mm-yyyy)');
            isValid = false;
        } else {
            var parts = birthDate.split('-');
            var day = parseInt(parts[0],10);
            var month = parseInt(parts[1],10);
            var year = parseInt(parts[2],10);
            if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2024) {
                $('#birthDateError').text('تاريخ غير صالح');
                isValid = false;
            }
        }
    }
    
    // Mobile: must match Syriatel & MTN (093,094,095,096 followed by 7 digits)
    if (mobile !== '') {
        var mobilePattern = /^(093|094|095|096)\d{7}$/;
        if (!mobilePattern.test(mobile)) {
            $('#mobileError').text('رقم الموبايل غير صالح (يجب أن يبدأ بـ 093 أو 094 أو 095 أو 096)');
            isValid = false;
        }
    }
    
    // Email: basic format
    if (email !== '') {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            $('#emailError').text('البريد الإلكتروني غير صالح');
            isValid = false;
        }
    }
    
    if (isValid) {
        showOrderSummary();
    }
    
    return false;
}

// Function to calculate total and show order summary using static modal
function showOrderSummary() {
    var selectedMeals = $('.meal-checkbox:checked');
    var subtotal = 0;
    var mealsList = '';
    
    selectedMeals.each(function() {
        var name = $(this).data('name');
        var price = parseInt($(this).data('price'),10);
        subtotal += price;
        mealsList += '<tr><td>' + name + '</td><td>' + price.toLocaleString() + '</td></tr>';
    });
    
    var tax = Math.round(subtotal * 0.05);
    var total = subtotal + tax;
    
    var summaryHTML = '<div class="order-summary">' +
        '<h2>ملخص الطلب</h2>' +
        '<table class="summary-table">' +
        '<thead><tr><th>الوجبة</th><th>السعر</th></tr></thead>' +
        '<tbody>' + mealsList + '</tbody>' +
        '<tfoot>' +
        '<tr><td><strong>المجموع:</strong></td><td><strong>' + subtotal.toLocaleString() + '</strong></td></tr>' +
        '<tr><td><strong>الضريبة (5%):</strong></td><td><strong>' + tax.toLocaleString() + '</strong></td></tr>' +
        '<tr class="total-row"><td><strong>الإجمالي:</strong></td><td><strong>' + total.toLocaleString() + '</strong></td></tr>' +
        '</tfoot></table>' +
        '<div class="summary-actions">' +
        '<button onclick="confirmOrder()" class="confirm-btn">تأكيد الطلب</button>' +
        '<button onclick="closeSummary()" class="close-btn">إغلاق</button>' +
        '</div></div>';
    
    $('#summaryContent').html(summaryHTML);
    $('#summaryModal').fadeIn();
    $('body').css('overflow', 'hidden');
}

// Function to confirm order
function confirmOrder() {
    $('#summaryModal').fadeOut();
    $('body').css('overflow', 'auto');
    
    var successMessage = '<div class="success-message">' +
        '<h3>تم إرسال طلبك بنجاح!</h3>' +
        '<p>سيتم التواصل معك قريباً لتأكيد التفاصيل.</p>' +
        '<button onclick="resetForm()" class="ok-btn">موافق</button></div>';
    
    $('#customerForm').html(successMessage);
    $('html, body').animate({
        scrollTop: $('#customerForm').offset().top - 100
    }, 1000);
}

// Function to close summary modal
function closeSummary() {
    $('#summaryModal').fadeOut();
    $('body').css('overflow', 'auto');
}

// Function to reset the form after confirmation
function resetForm() {
    // Reload the page to reset everything (simple solution)
    window.location.href = 'Meals.html';
}

// Function to exit the site
function exitSite() {
    if (confirm('هل أنت متأكد أنك تريد الخروج من الموقع؟')) {
        alert('شكراً لزيارتكم موقعنا!');
        window.location.href = 'home.html';
    }
}
