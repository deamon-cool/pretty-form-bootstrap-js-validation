class Input {
  #input;
  #value;
  #disabled;

  constructor(idString) {
    this.#input = document.querySelector(idString);
    this.#input.addEventListener('input', this.#inputHandler);
    this.#value = '';
    this.#disabled = false;
  }

  #inputHandler = (e) => {
    this.#value = e.target.value;
  }

  setValue = (valueString) => {
    this.#value = '';
    this.#input.value = valueString;
  }

  getValue = () => {
    return this.#value;
  }

  disableInput = (disableBool) => {
    this.#input.disabled = disableBool;
    this.#disabled = disableBool;
  }

  isDisabled = () => {
    return this.#disabled;
  }

  setValidStyle() {
    this.#input.classList.add('is-valid');
  }

  setInvalidStyle() {
    this.#input.classList.add('is-invalid');
  }

  clearValidationStyle() {
    this.#input.classList.remove('is-invalid');
    this.#input.classList.remove('is-valid');
  }
}

let nameInput = new Input('#name-input');
const validateName = (nameString) => {
  if (nameString.length < 1) {
    return false;
  }

  return nameString.length < 40 ? true : false;
}

let emailInput = new Input('#email-input');
const validateEmail = (emailString) => {
  const tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  if (!emailString) return false;

  const emailParts = emailString.split('@');

  if (emailParts.length !== 2) return false

  let account = emailParts[0];
  let address = emailParts[1];

  if (account.length > 64) return false

  else if (address.length > 255) return false

  const domainParts = address.split('.');
  if (domainParts.some(function (part) {
    return part.length > 63;
  })) return false;

  if (!tester.test(emailString)) return false;

  return true;
};

let phoneInput = new Input('#phone-input');
const validatePhone = (phoneString) => {
  const tester1 = /^\d\d\d\s\d\d\d\s\d\d\d$/;
  const tester2 = /^\d\d\d\-\d\d\d\-\d\d\d$/;
  const tester3 = /^\+\d\d\s\d\d\d\s\d\d\d\s\d\d\d$/;
  const tester4 = /^\+\d\d\s\d\d\d\-\d\d\d\-\d\d\d$/;
  const tester5 = /^\(\d\d\)\s\d\d\d\s\d\d\d\s\d\d\d$/;
  const tester6 = /^\(\d\d\)\s\d\d\d\-\d\d\d\-\d\d\d$/;

  if (!tester1.test(phoneString) && !tester2.test(phoneString)
    && !tester3.test(phoneString) && !tester4.test(phoneString)
    && !tester5.test(phoneString) && !tester6.test(phoneString)) {
    return false;
  }

  return true;
};

let peselInput = new Input('#pesel-input');
const validatePesel = (peselString) => {
  const tester = /^\d\d\d\d\d\d\d\d\d\d\d$/;

  if (!tester.test(peselString)) {
    return false;
  }

  return true;
}

let noPeselCheckbox = document.querySelector('#no-pesel-checkbox');
noPeselCheckbox.addEventListener('change', (e) => {
  peselInput.setValue('');
  peselInput.disableInput(e.target.checked);
  e.target.checked ? noPeselCheckbox.classList.add('active') : noPeselCheckbox.classList.remove('active');
});

let postcodeInput = new Input('#postcode-input');
const validatePostcode = (postcodeString) => {
  const tester = /^\d\d\-\d\d\d$/;

  if (!tester.test(postcodeString)) {
    return false;
  }

  return true;
};

let sendButton = document.querySelector('#send-button');
sendButton.addEventListener('click', (e) => {
  e.preventDefault();
  clearValidation();

  const validate = validateInputs();
  if (validate) {
    fetchData();
  }
});

const clearValidation = () => {
  nameInput.clearValidationStyle();
  emailInput.clearValidationStyle();
  phoneInput.clearValidationStyle();
  peselInput.clearValidationStyle();
  postcodeInput.clearValidationStyle();
}

const validateInputs = () => {
  let nameValid = validateName(nameInput.getValue());
  let emailValid = validateEmail(emailInput.getValue());
  let phoneValid = true;
  if (phoneInput.getValue().length > 0) {
    phoneValid = validatePhone(phoneInput.getValue());
  }
  let peselValid = true;
  if (!peselInput.isDisabled()) {
    peselValid = validatePesel(peselInput.getValue());
  }
  let postcodeValid = validatePostcode(postcodeInput.getValue());

  if (nameValid && emailValid && phoneValid && peselValid && postcodeValid) {
    return true;
  }

  showValidationToUser(nameValid, emailValid, phoneValid, peselValid, postcodeValid);

  return false;
};

const showValidationToUser = (nameValid, emailValid, phoneValid, peselValid, postcodeValid) => {
  nameValid ? nameInput.setValidStyle() : nameInput.setInvalidStyle();
  emailValid ? emailInput.setValidStyle() : emailInput.setInvalidStyle();

  if (phoneInput.getValue().length > 0) {
    phoneValid ? phoneInput.setValidStyle() : phoneInput.setInvalidStyle();
  }

  if (!peselInput.isDisabled()) {
    peselValid ? peselInput.setValidStyle() : peselInput.setInvalidStyle();
  }

  postcodeValid ? postcodeInput.setValidStyle() : postcodeInput.setInvalidStyle();
}

const fetchData = async () => {
  const data = {
    name: nameInput.getValue(),
    email: emailInput.getValue(),
    phone: phoneInput.getValue(),
    pesel: peselInput.getValue(),
    postcode: postcodeInput.getValue()
  };
  const url = 'url';
  const init = {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }

  try {
    const response = await fetch(url, init);
    const serverData = await response.json();
    // handle server data
  } catch (err) {
    // handle error
  }
}