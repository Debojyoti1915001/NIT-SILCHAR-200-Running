const getElement = (value) => {
	return document.getElementById(value);
}

const strengthMeter = getElement('strength-meter');
const passwordInput = getElement('LoginEmail');
const reasonsContainer = getElement('reasons');
const reasons = document.getElementsByClassName('reasons');
const passwordRate = document.getElementsByClassName('password-rate')
const confirmpassword = getElement('password');
const SignupButton = getElement("submitbtn1");

passwordInput.addEventListener('input',updateStrengthMeter);

function updateStrengthMeter(){

	strengthMeter.style.display = 'block'
    const weaknesses = calculateStrength(passwordInput.value);
	reasonsContainer.style.display = 'none';
    let strength = 100;
	reasonsContainer.innerHTML = '';
	weaknesses.forEach(weakness =>{
		if(weakness == null) return 
		strength -= weakness.deduction;
	});
	// strength += -5;
	backgroundSetter(strength)
	strengthMeter.style.setProperty('--strength',strength);
	if(passwordInput.value === ""){
		strengthMeter.style.display = 'none'
		passwordRate[0].style.display = 'none'
	}
}
function showreasonconfirmclick(){	
	reasonsContainer.innerHTML = '';

	const weaknesses = calculateStrength(passwordInput.value);
	weaknesses.forEach(weakness =>{
        if(weakness!= null){
                if(weakness.message!= null){
                    reasonsContainer.style.display = 'block'
                    const messageElement = document.createElement('div');
                    messageElement.innerHTML = weakness.message;
                    reasonsContainer.appendChild(messageElement);
                }
            }
		})
		if(reasonsContainer.innerHTML !== ""){
			reasonsContainer.style.display = 'block'
		}
	}

confirmpassword.addEventListener('click', showreasonconfirmclick)
function backgroundSetter(strength){
	let regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?.+\-^#&])[A-Za-z\d@$!%*?.+\-^#&]{8,}/
	let  passwordValue = passwordInput.value;
    if(strength < 33){
		document.body.style.setProperty('--newBackground', 'red');
		passwordRate[0].style.display = 'block'
        passwordRate[0].innerHTML = 'Your Password is too weak!'
	}
	else if(strength > 50 && passwordValue.length >= 8 && passwordValue.match(regex)){
		document.body.style.setProperty('--newBackground', 'green');
		passwordRate[0].style.display = 'block'
       	passwordRate[0].innerHTML = 'Good to go!'
	}
    else if(strength < 69 ){
		document.body.style.setProperty('--newBackground', '#FFC107');
		passwordRate[0].style.display = 'block'
		passwordRate[0].innerHTML = 'Not bad, but you know you can do better!'
	}
	else if(strength > 69 && !passwordValue.match(regex)){
		document.body.style.setProperty('--newBackground', '#FFC107');
		passwordRate[0].style.display = 'block'
		passwordRate[0].innerHTML = 'A strong password is recommended for security!'
	}
    else{
		document.body.style.setProperty('--newBackground', 'green');
		passwordRate[0].style.display = 'block'
       	passwordRate[0].innerHTML = 'Good to go!'
    }
}
function calculateStrength(password){
	const weaknesses = []
	weaknesses.push(lengthWeaknesses(password));
	weaknesses.push(lowerCaseWeakness(password));
	weaknesses.push(UpperCaseWeakness(password));
	weaknesses.push(NumberWeakness(password));
	weaknesses.push(SpecialWeakness(password));
	weaknesses.push(RepeatWeakness(password));
	weaknesses.push(emptyPassword(password));
	return weaknesses;
}
function emptyPassword(password){
	if(password == ""){
		return{
			message: 'Password cannot be empty',
			deduction: null
		}
	}
	else
	return {
		message: null,
		deduction: null
	}
}

function lengthWeaknesses(password){
	const length = password.length;
	if(length <= 5){
		return {
			message:'Your password is too short',
			deduction:40
		}
	}
	else if(length < 8){
		return {
			message : 'Short Password!',
			deduction : 35
		}
	}
	else if(length < 10){
		return{
		message: null,
		deduction:30
		}
		
	}
	else 
		return {
			message: null,
			deduction: null
		}
	
}

function lowerCaseWeakness(password){
	return characterTypeWeakness(password,/[a-z]/g,'Lowercase characters')
}
function UpperCaseWeakness(password){
	return characterTypeWeakness(password,/[A-Z]/g,'Uppercase characters')
}
function NumberWeakness(password){
	return characterTypeWeakness(password,/[0-9]/g,'Numbers')
}
function SpecialWeakness(password){
	return characterTypeWeakness(password,/[^0-9a-zA-Z\s]/g,'Special characters')
}
function characterTypeWeakness(password,regex,type){
	const matches = password.match(regex) || [];
	if(matches.length === 0){
		return{
			message: `Your password has no ${type}`,
			deduction: 20
		}
	}
	else 
		return {
			message: null,
			deduction: null
		}
}

function RepeatWeakness(password){
	const matches = password.match(/(.)\1/g) || [];
	if(matches.length > 0){
		return{
            // message: `Your password has repeated character`,
            message: null,

			deduction: matches.length * 5
		}

	}
	else
		return  {
			message: null,
			deduction: null
		}		
		

}
function samePassword(password, confirmPassword){
	if(password!= confirmPassword){
		return{
			message: `Your passwords do not match`
		}
	}
	else{
		return {
			message: null,
			deduction: null
		}
	}
}
 
SignupButton.addEventListener("click", (e) => {
	e.preventDefault();
	reasonsContainer.innerHTML = '';
	weaknesses = []
	weaknesses = calculateStrength(passwordInput.value)
	weaknesses.push(samePassword(passwordInput.value, confirmpassword.value))
	weaknesses.forEach(weakness =>{
        if(weakness!= null){
                if(weakness.message!= null){
                    reasonsContainer.style.display = 'block'
                    const messageElement = document.createElement('div');
                    messageElement.innerHTML = weakness.message;
                    reasonsContainer.appendChild(messageElement);
                }
            }
		})

		var valueArr = weaknesses.map(function(item){ return item.message });

		all = checkNull(valueArr)
		function checkNull(weaknesses){
			return weaknesses.every(x => Object.is(null, x));
		}
		// console.log(all);
	if(all){
		reasonsContainer.innerHTML = '';
		reasonsContainer.style.display = 'none';
		// console.log(all);
		document.forms["reset"].submit();
	}
	else{
		e.preventDefault();
		e.stopPropagation();
		confirmpassword.addEventListener('input', () => {
		reasonsContainer.style.display = 'none';
		})
	}
	confirmpassword.addEventListener('click', () => {
		reasonsContainer.style.display = 'none'
	})

	})