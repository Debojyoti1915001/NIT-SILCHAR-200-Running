const togglePassword = document.querySelectorAll('#eyeIcon');
const password = document.querySelector('#password-input');
togglePassword.forEach(icon => icon.addEventListener('click', function (e) {
    const type = this.previousElementSibling.getAttribute('type') === 'password' ? 'text' : 'password';
    this.previousElementSibling.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
}))

const loginLink = document.getElementById('loginLink');
const signupLink = document.getElementById('signUpLink');
const signupPart = document.getElementById('signUpform');
const loginPart = document.getElementById('logInform');

signupLink.addEventListener('click', () => {

    loginPart.classList.toggle("fadeOut")
    signupPart.classList.toggle("fadeOut")
    loginPart.classList.toggle("fadeIn")
    signupPart.classList.toggle("fadeIn")

});

loginLink.addEventListener('click', () => {
    loginPart.classList.toggle("fadeOut")
    signupPart.classList.toggle("fadeOut")
    loginPart.classList.toggle("fadeIn")
    signupPart.classList.toggle("fadeIn")
    
});
