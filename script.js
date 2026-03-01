
const form = document.getElementById("checkout-form");
const payBtn = document.getElementById("pay-btn");
const btnText = document.querySelector(".btn-text");
const loader = document.querySelector(".loader");


payBtn.disabled = true;
 form.addEventListener("submit", async function (e) {
  e.preventDefault();
  if (!validateForm()) return;
  toggleLoading(true);
  const formData = {
    name: document.getElementById("name").value,
    cardNumber: document.getElementById("cardNumber").value.replace(/\s/g, ""),
    expiry: document.getElementById("expiry").value,
    cvv: document.getElementById("cvv").value,
  };

  try {
    //  Simulating API call (Level 3 requirement)
    const response = await fetch('https://mycheckoutapi.free.beeceptor.com', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    });

    if (response.ok) {     
      toggleLoading(false);
      payBtn.classList.add("success");
      btnText.innerText = "Payment Successful ✓";
      // Generate order ID
const orderId = "FIAT-" + Math.floor(1000 + Math.random() * 9000);

// Get current date
const today = new Date();
const formattedDate = today.toLocaleDateString("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric"
});

// Redirect with data in URL
setTimeout(() => {
  window.location.href = `success.html?order=${orderId}&date=${formattedDate}`;
}, 600);
    } 
    else {
      throw new Error("Payment Failed");
    }
  }
  catch (error) {
    alert("Payment Error: " + error.message);
    toggleLoading(false);
  }
});

// Auto-space card numbers
document.getElementById('cardNumber').addEventListener('input', function (e) {
    let value = e.target.value.replace(/[^\d]/g, '');
    e.target.value = value.replace(/(.{4})/g, '$1 ').trim();
});
document.getElementById('expiry').addEventListener('input', function (e) {
  let value = e.target.value.replace(/[^\d]/g, '');

  if (value.length > 4) {
    value = value.slice(0, 4);
  }

  if (value.length >= 3) {
    value = value.slice(0, 2) + '/' + value.slice(2);
  }

  e.target.value = value;
});
function validateForm() {
  let isValid = true;
  clearErrors();

  const name = document.getElementById("name");
  const cardNumber = document.getElementById("cardNumber");
  const expiry = document.getElementById("expiry");
  const cvv = document.getElementById("cvv");

  const nameRegex = /^[A-Za-z\s]+$/;
  const cardValue = cardNumber.value.replace(/\s/g, "");

  // Name Validation
  if (name.value.trim() === "") {
    showError(name, "Full name is required");
    isValid = false;
  } else if (!nameRegex.test(name.value.trim())) {
    showError(name, "Name must contain only letters");
    isValid = false;
  }

  // Card Number Validation
  if (!/^\d{16}$/.test(cardValue)) {
    showError(cardNumber, "Enter valid 16-digit card number");
    isValid = false;
  }

  // Expiry Validation (MM/YY + not past)
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry.value)) {
    showError(expiry, "Use MM/YY format");
    isValid = false;
  } else {
    const [month, year] = expiry.value.split("/");
    const expiryDate = new Date(`20${year}`, month-1);
    const today = new Date();

    if (expiryDate <= today) {
      showError(expiry, "Card has expired");
      isValid = false;
    }
  }

  // CVV Validation
  if (!/^\d{3}$/.test(cvv.value)) {
    showError(cvv, "CVV must be 3 digits");
    isValid = false;
  }

  return isValid;
}

function validateFormSilently() {
  const name = document.getElementById("name").value.trim();
  const cardNumber = document.getElementById("cardNumber").value.replace(/\s/g, "");
  const expiry = document.getElementById("expiry").value;
  const cvv = document.getElementById("cvv").value;

  const nameRegex = /^[A-Za-z\s]+$/;

  if (!nameRegex.test(name)) return false;
  if (!/^\d{16}$/.test(cardNumber)) return false;
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) return false;
  if (!/^\d{3}$/.test(cvv)) return false;

  return true;
}
function updatePayButtonState() {
  payBtn.disabled = !validateFormSilently();
}
function showError(input, message) {
  input.classList.add("invalid");
  // Find the error message element within the same form-group
  const errorElement = input.closest('.form-group').querySelector(".error-msg");
  if (errorElement) {
    errorElement.innerText = message;
  }
}

function clearErrors() {
  document.querySelectorAll("input").forEach(i => i.classList.remove("invalid"));
  document.querySelectorAll(".error-msg").forEach(e => e.innerText = "");
}

function toggleLoading(isLoading) {
  payBtn.disabled = isLoading;
  if (isLoading) {
    btnText.style.display = "none";
    loader.style.display = "inline-block";
  } else {
    btnText.style.display = "inline";
    loader.style.display = "none";
  }
}

document.querySelectorAll("input").forEach(input => {
  input.addEventListener("input", () => {
    validateForm();          
    updatePayButtonState(); 
  });
});