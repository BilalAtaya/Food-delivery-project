// jQuery Document Ready
$(document).ready(function() {
    console.log("Page loaded successfully");
});

// Function to toggle meal details
function toggleDetails(button) {
    // Find the next row (details row)
    const detailsRow = $(button).closest('tr').next('.details-row');
    
    // Toggle visibility
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
    // Check if at least one meal is selected
    const selectedMeals = $('.meal-checkbox:checked');
    
    if (selectedMeals.length === 0) {
        alert('يرجى اختيار وجبة واحدة على الأقل');
        return;
    }
    
    // Show the form with animation
    $('#orderForm').slideDown();
    
    // Scroll to form
    $('html, body').animate({
        scrollTop: $('#orderForm').offset().top - 100
    }, 1000);
}

// Function to hide the order form
function hideForm() {
    $('#orderForm').slideUp();
    
    // Scroll back to meals table
    $('html, body').animate({
        scrollTop: $('.meals-table').offset().top - 100
    }, 1000);
}

// Function to validate the form
function validateForm(event) {
    event.preventDefault();
    
    let isValid = true;
    
    // Clear previous error messages
    $('.error-message').text('');
    
    // Get form values
    const fullName = $('#fullName').val().trim();
    const nationalId = $('#nationalId').val().trim();
    const birthDate = $('#birthDate').val().trim();
    const mobile = $('#mobile').val().trim();
    const email = $('#email').val().trim();
    
    // Validate Full Name (Arabic only)
    if (fullName !== '') {
        const arabicPattern = /^[\u0600-\u06FF\s]+$/;
        if (!arabicPattern.test(fullName)) {
            $('#nameError').text('الاسم يجب أن يحتوي على أحرف عربية فقط');
            isValid = false;
        }
    }
    
    // Validate National ID (11 digits, required)
    if (nationalId === '') {
        $('#nationalIdError').text('الرقم الوطني مطلوب');
        isValid = false;
    } else {
        const nationalIdPattern = /^\d{11}$/;
        if (!nationalIdPattern.test(nationalId)) {
            $('#nationalIdError').text('الرقم الوطني غير صالح');
            isValid = false;
        }
    }
    
    // Validate Birth Date (dd-mm-yyyy format)
    if (birthDate !== '') {
        const datePattern = /^\d{2}-\d{2}-\d{4}$/;
        if (!datePattern.test(birthDate)) {
            $('#birthDateError').text('تاريخ غير صالح');
            isValid = false;
        } else {
            // Additional validation for reasonable date
            const parts = birthDate.split('-');
            const day = parseInt(parts[0]);
            const month = parseInt(parts[1]);
            const year = parseInt(parts[2]);
            
            if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2024) {
                $('#birthDateError').text('تاريخ غير صالح');
                isValid = false;
            }
        }
    }
    
    // Validate Mobile Number (starts with 09, 10 digits)
    if (mobile !== '') {
        const mobilePattern = /^09\d{8}$/;
        if (!mobilePattern.test(mobile)) {
            $('#mobileError').text('رقم الموبايل غير صالح');
            isValid = false;
        }
    }
    
    // Validate Email (contains @)
    if (email !== '') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            $('#emailError').text('البريد الإلكتروني غير صالح');
            isValid = false;
        }
    }
    
    // If all validations pass, show order summary
    if (isValid) {
        showOrderSummary();
    }
    
    return false; // Prevent form submission
}

// Function to calculate total and show order summary
function showOrderSummary() {
    // Get selected meals
    const selectedMeals = $('.meal-checkbox:checked');
    let subtotal = 0;
    let mealsList = '';
    
    // Calculate subtotal and create meals list
    selectedMeals.each(function() {
        const name = $(this).data('name');
        const price = parseInt($(this).data('price'));
        subtotal += price;
        
        mealsList += `
            <tr>
                <td>${name}</td>
                <td>${price.toLocaleString()}</td>
            </tr>
        `;
    });
    
    // Calculate tax and total
    const tax = Math.round(subtotal * 0.05); // 5% tax
    const total = subtotal + tax;
    
    // Create summary HTML
    const summaryHTML = `
        <div class="order-summary">
            <h2>ملخص الطلب</h2>
            <table class="summary-table">
                <thead>
                    <tr>
                        <th>الوجبة</th>
                        <th>السعر</th>
                    </tr>
                </thead>
                <tbody>
                    ${mealsList}
                </tbody>
                <tfoot>
                    <tr>
                        <td><strong>المجموع:</strong></td>
                        <td><strong>${subtotal.toLocaleString()}</strong></td>
                    </tr>
                    <tr>
                        <td><strong>الضريبة (5%):</strong></td>
                        <td><strong>${tax.toLocaleString()}</strong></td>
                    </tr>
                    <tr class="total-row">
                        <td><strong>الإجمالي:</strong></td>
                        <td><strong>${total.toLocaleString()}</strong></td>
                    </tr>
                </tfoot>
            </table>
            <div class="summary-actions">
                <button onclick="confirmOrder()" class="confirm-btn">تأكيد الطلب</button>
                <button onclick="closeSummary()" class="close-btn">إغلاق</button>
            </div>
        </div>
    `;
    
    // Create modal overlay
    const modalHTML = `
        <div id="summaryModal" class="modal-overlay">
            <div class="modal-content">
                ${summaryHTML}
            </div>
        </div>
    `;
    
    // Add modal to body and show it
    $('body').append(modalHTML);
    $('#summaryModal').fadeIn();
    
    // Prevent body scroll
    $('body').css('overflow', 'hidden');
}

// Function to confirm order
function confirmOrder() {
    // Hide modal
    $('#summaryModal').fadeOut();
    $('body').css('overflow', 'auto');
    
    // Show success message
    const successMessage = `
        <div class="success-message">
            <h3>تم إرسال طلبك بنجاح!</h3>
            <p>سيتم التواصل معك قريباً لتأكيد التفاصيل.</p>
            <button onclick="resetForm()" class="ok-btn">موافق</button>
        </div>
    `;
    
    // Replace form with success message
    $('#orderForm').html(successMessage);
    
    // Scroll to success message
    $('html, body').animate({
        scrollTop: $('#orderForm').offset().top - 100
    }, 1000);
}

// Function to close summary modal
function closeSummary() {
    $('#summaryModal').fadeOut();
    $('body').css('overflow', 'auto');
    
    // Remove modal from DOM after animation
    setTimeout(function() {
        $('#summaryModal').remove();
    }, 300);
}

// Function to reset the form
function resetForm() {
    // Reset form fields
    $('#customerForm')[0].reset();
    
    // Clear error messages
    $('.error-message').text('');
    
    // Uncheck all meals
    $('.meal-checkbox').prop('checked', false);
    
    // Hide form
    $('#orderForm').slideUp();
    
    // Scroll to top of meals table
    $('html, body').animate({
        scrollTop: $('.meals-table').offset().top - 100
    }, 1000);
}

// Function to exit the site
function exitSite() {
    if (confirm('هل أنت متأكد أنك تريد الخروج من الموقع؟')) {
        // In a real application, this would redirect to a logout page
        // For demo purposes, we'll show a message
        alert('شكراً لزيارتك موقعنا!');
        window.location.href = 'index.html';
    }
}

// Add styles for modal (dynamically)
$(document).ready(function() {
    const modalStyles = `
        <style>
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: none;
            z-index: 1000;
            justify-content: center;
            align-items: center;
        }
        
        .modal-content {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
        }
        
        .order-summary h2 {
            text-align: center;
            margin-bottom: 1.5rem;
            color: #2c3e50;
        }
        
        .summary-table {
            width: 100%;
            margin-bottom: 1.5rem;
            border-collapse: collapse;
        }
        
        .summary-table th,
        .summary-table td {
            padding: 10px;
            text-align: right;
            border-bottom: 1px solid #ddd;
        }
        
        .summary-table th {
            background-color: #34495e;
            color: white;
        }
        
        .total-row {
            background-color: #e74c3c;
            color: white;
            font-size: 1.2rem;
        }
        
        .summary-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
        }
        
        .confirm-btn,
        .close-btn {
            padding: 10px 25px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        
        .confirm-btn {
            background-color: #27ae60;
            color: white;
        }
        
        .confirm-btn:hover {
            background-color: #229954;
        }
        
        .close-btn {
            background-color: #e74c3c;
            color: white;
        }
        
        .close-btn:hover {
            background-color: #c0392b;
        }
        
        .success-message {
            text-align: center;
            padding: 2rem;
            background: #d4edda;
            border: 1px solid #c3e6cb;
            border-radius: 8px;
            color: #155724;
        }
        
        .success-message h3 {
            margin-bottom: 1rem;
            color: #155724;
        }
        
        .ok-btn {
            background-color: #28a745;
            color: white;
            border: none;
            padding: 10px 25px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            margin-top: 1rem;
        }
        
        .ok-btn:hover {
            background-color: #218838;
        }
        </style>
    `;
    
    $('head').append(modalStyles);
});
