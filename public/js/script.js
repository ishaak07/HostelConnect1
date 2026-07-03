// Form validation
(() => {
    'use strict';
    const form = document.querySelector('.needs-validation');
    if (form) {  // important - check karo form exist karta hai ya nahi
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    }
})();

// Password toggle
const toggleBtn = document.querySelector('.toggle-password');
if (toggleBtn) {  // important - check karo button exist karta hai ya nahi
    toggleBtn.addEventListener('click', function () {
        const input = document.getElementById('password');
        const icon = this.querySelector('i');
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });
}