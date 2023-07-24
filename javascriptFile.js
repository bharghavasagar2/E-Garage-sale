document.addEventListener('DOMContentLoaded', function () {
  renderForm(state.productInfoFieldsList, 'productInfoFields');
  renderForm(state.personalInfoFieldsList, 'personalInfoFields');
  quantityError.setAttribute('hidden', 'hidden');
  customerReceiptDiv.setAttribute('hidden', 'hidden');
});

// Checkbutton
let checkOutButton = document.getElementById('checkOutButton');
checkOutButton.addEventListener('click', () => checkOutHandler());

// Minimum Quanitity error element
let quantityError = document.getElementById('quantity-error');
// Purchase receipt div
let customerReceiptDiv = document.getElementById('customerReceipt');

// Global State
let state = {
  productInfoFieldsList: [
    {
      name: 'chairsQuantity',
      label: 'Chairs ($3 each)',
      value: null,
      price: 3,
      isInteger: true,
      placeHolder: 'Enter Quantity',
      type: 'text',
      isValidationError: false
    },
    {
      name: 'lampQuantity',
      label: 'Bed Lamps ($6 each)',
      value: null,
      price: 6,
      isInteger: true,
      placeHolder: 'Enter Quantity',
      type: 'text',
      isValidationError: false
    },
    {
      name: 'rubberFootballQuantity',
      label: 'Small Rubber Footballs ($5 each)',
      value: null,
      isInteger: true,
      price: 5,
      placeHolder: 'Enter Quantity',
      type: 'text',
      isValidationError: false
    },
    {
      name: 'toastersQuantity',
      label: 'Toasters ($12 each)',
      value: null,
      isInteger: true,
      price: 12,
      placeHolder: 'Enter Quantity',
      type: 'text',
      isValidationError: false
    },
    {
      name: 'golfBallsQuantity',
      label: 'Golf Balls ($1 each)',
      value: null,
      price: 1,
      isInteger: true,
      placeHolder: 'Enter Quantity',
      type: 'text',
      isValidationError: false
    },
  ],
  personalInfoFieldsList: [
    {
      name: 'name',
      label: 'Name',
      value: '',
      placeHolder: 'Enter name',
      type: 'text',
      isRequired: true,
      isValidationError: false
    },
    {
      name: 'email',
      label: 'Email Address',
      value: '',
      placeHolder: 'Enter Email',
      type: 'text',
      isRequired: true,
      isValidationError: false
    },
    {
      name: 'creditCardNumber',
      label: 'Credit Card Number',
      value: '',
      placeHolder: 'xxxx-xxxx-xxxx-xxxx',
      type: 'text',
      maxLength: 19,
      isValidationError: false
    },
    {
      name: 'cardExpiryMonth',
      label: 'Credit Card Expiry Month',
      value: '',
      placeHolder: 'MMM',
      maxLength: 3,
      isInteger: true,
      type: 'text',
      isValidationError: false
    },
    {
      name: 'cardExpiryYear',
      label: 'Credit Card Expiry Year',
      value: '',
      placeHolder: 'yyyy',
      maxLength: 4,
      isInteger: true,
      type: 'text',
      isValidationError: false
    },
  ],
  receiptFileds: {
    donationAmount: null,
    total: null,
  },

  isCheckOut: false,
  customerName: '',
  totalPrice: null,
  totalGst: null,
};
// Renders form
const renderForm = (fieldArr, id = 'productInfoFields') => {
  let form = document.getElementById(id);
  form.innerHTML = '';
  fieldArr.forEach((fieldObj, index) => {
    //Parent field div 
    let div = document.createElement('div');
    div.setAttribute("class", 'parent-div');
    // Label element
    let label = document.createElement('label');
    label.setAttribute("class", 'labelClass');
    label.innerHTML = !!fieldObj.isRequired ? `${fieldObj.label}*` : fieldObj.label;
    div.appendChild(label);
    // Input element
    let inputField = document.createElement('input');
    inputField.setAttribute("type", fieldObj.type);
    inputField.setAttribute("class", 'inputClass');
    inputField.setAttribute("value", fieldObj.value || '');
    inputField.setAttribute("placeholder", fieldObj.placeHolder);
    inputField.setAttribute("maxlength", fieldObj.maxLength);
    inputField.addEventListener('input', (e) => handleChange(e, id, index, fieldObj));
    if (fieldObj.name === 'creditCardNumber') {
      inputField.setAttribute("id", 'inputCreditCardNumber');
    }
    if (id === 'productInfoFields') {
      inputField.setAttribute("size", 13);
    } else {
      inputField.setAttribute("size", 30);
    }
    if (fieldObj.name === 'cardExpiryMonth') {
      inputField.setAttribute("style", "text-transform: uppercase;");
    }
    div.appendChild(inputField);
    // Error Div
    if (!!fieldObj.isValidationError) {
      let errorDiv = document.createElement('div');
      errorDiv.setAttribute("class", 'error-message');
      if (id === 'productInfoFields') {
        errorDiv.innerHTML = `Please input only numbers`;
      } else {
        errorDiv.innerHTML = `Please Enter ${!!fieldObj.isRequired && !(!!fieldObj.value) ? `` : `valid`} ${fieldObj.label}`;
      }
      div.appendChild(errorDiv);
    }
    form.appendChild(div);
  })
};
// Triggers on Input change in the form fields
const handleChange = (e, id, index, fieldObj) => {
  let fieldName = fieldObj.name;
  fieldObj.value = e.target.value;

  if (fieldName === 'creditCardNumber') {
    document.getElementById("inputCreditCardNumber").addEventListener("input", function () {
      var input = this.value.replace(/([1-9]\d{3})-?([0-9]\d{3})-?([0-9]\d{3})-?([0-9]\d{3})/, "$1-$2-$3-$4");
      this.value = input.replace(/^[0]|[a-zA-Z]/g, '');
      fieldObj.value = this.value;
    }
    );
  }
  //State update
  state[`${id}List`][index] = fieldObj;
}

const performValidation = (fieldArr) => {
  fieldArr.forEach((fieldObj, index) => {
    let value = fieldObj.value;
    // Integer fields validation check
    if (fieldObj.isInteger && !!value) {
      if ((isNaN(value) || value.indexOf(".") !== -1)) {
        fieldObj.isValidationError = true;
      } else {
        value = parseInt(value);
        fieldObj.isValidationError = false;
      }
    }
    // Required fields validation check
    if (fieldObj.isRequired) {
      if (!(!!value) || !isNaN(value)) {
        fieldObj.isValidationError = true;
      } else {
        fieldObj.isValidationError = false;
      }
    }
    //E-mail Validation
    if (fieldObj.name === 'email') {
      let pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/i;
      pattern.test(value);
      fieldObj.isValidationError = pattern.test(value) === false ? true : false;
    }
    //Credit Card Number Validation
    if (fieldObj.name === 'creditCardNumber') {
      let pattern = /([1-9]\d{3})-?([0-9]\d{3})-?([0-9]\d{3})-?([0-9]\d{3})/;
      pattern.test(value);
      fieldObj.isValidationError = pattern.test(value) === false && !!value ? true : false;

    }
    //Card Expiry Validation Validation
    if (fieldObj.name === 'cardExpiryMonth') {
      let pattern = /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)$/i;
      pattern.test(value.toUpperCase());
      fieldObj.isValidationError = pattern.test(value) === false && !!value ? true : false;
    }
    if (fieldObj.name === 'cardExpiryYear') {
      let pattern = /^[1-9][0-9][0-9][0-9]$/;
      pattern.test(value);
      fieldObj.isValidationError = pattern.test(value) === false && !!value ? true : false;
    }
  });
  return fieldArr;
}

const isValidationError = () => {
  let { personalInfoFieldsList, productInfoFieldsList } = state;
  // Perform Validation 
  personalInfoFieldsList = performValidation(personalInfoFieldsList);
  productInfoFieldsList = performValidation(productInfoFieldsList);

  let totalFieldListArr = [...personalInfoFieldsList, ...productInfoFieldsList];
  let isValidatingFields = totalFieldListArr.some(({ isValidationError }) => {
    return isValidationError === true;
  });
  let isQuantityAdded = state.productInfoFieldsList.some(filedOj => !!filedOj.value);
  if (isQuantityAdded) {
    quantityError.setAttribute('hidden', 'hidden');
  } else {
    quantityError.removeAttribute('hidden');
  }
  return (isValidatingFields || !isQuantityAdded);
}


// Checkout Handler
const checkOutHandler = () => {
  if (isValidationError() === false) {
    // Scroll the page to the top of the div
    customerReceiptDiv.removeAttribute('hidden');
    renderPurchaseReceiptTable();
    // Scrolls into customerReceiptDiv 
    customerReceiptDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  renderForm(state.productInfoFieldsList, 'productInfoFields');
  renderForm(state.personalInfoFieldsList, 'personalInfoFields');
};

// Customer details table
let customerDetailTable = document.getElementById('customerDetailsTableElement');

// Purchase Table Element
let tableElement = document.getElementById('purchaseTableElement');

// Renders Purchase receipt table
const renderCustomerDetailsTable = () => {
  let customerReqDetlArr = ['name', 'email', 'creditCardNumber'];
  let filteredCustomerDetailsArr = state.personalInfoFieldsList.filter(({ name, value }) => {
    return customerReqDetlArr.indexOf(name) !== -1 && value;
  });
  // Emptying contents of the customer details table
  customerDetailTable.innerHTML = '';
  filteredCustomerDetailsArr.forEach(({ label, value, name }, index) => {
    let customerDetailTableRow = document.createElement('tr');
    customerDetailTableRow.innerHTML = `<tr>
    <td>${label}</td>
    <td>${name === 'creditCardNumber' ? maskedCardNumber(value) : value}</td>
    </tr>`
    customerDetailTable.appendChild(customerDetailTableRow);
  });
}

// Renders Purchase receipt table
const renderPurchaseReceiptTable = () => {
  // Customer details table
  renderCustomerDetailsTable();
  // Emptying contents of the purchase table
  tableElement.innerHTML = '';
  // Row header
  tableElement.innerHTML = `  <tr>
    <th>Items</th>
    <th>Quanitity</th>
    <th>Unit Cost</th>
    <th>Total Cost</th>
  </tr>`;
  let productList = state.productInfoFieldsList.filter((prod) => !!prod.value);
  productList.forEach((product, index) => {
    let totalPrice = (product.price * product.value).toFixed(2);
    let row = document.createElement('tr');
    // Row cells
    row.innerHTML = `<td>${product.label.slice(0, product.label.indexOf("("))}</td>
      <td>${product.value}</td>
      <td>$${product.price}</td>
      <td>$${totalPrice}</td>`;

    tableElement.appendChild(row);
  });
  renderTotal_DiscountRows();
};

const renderTotal_DiscountRows = () => {
  let { receiptFileds } = state;
  let minimumDonationAmnt = 10;
  receiptFileds.donationAmount = calculateAmount('donationAmount');
  receiptFileds.total = calculateAmount('totalPrice');
  let donation_Total_Row = document.createElement('tfoot');
  donation_Total_Row.innerHTML = `      <tr>
    <td colspan="3">Donation Amount- ${receiptFileds.donationAmount > minimumDonationAmnt ? '10%' : 'Minimum'}</td>
    <td>$${receiptFileds.donationAmount}</td>
  </tr>
  <tr>
  <td colspan="3">Total Amount</td>
  <td>$${receiptFileds.total}</td>
</tr>`;

  tableElement.appendChild(donation_Total_Row);
}

//Calculates and returns donation amount or total cost based on the type
const calculateAmount = (type) => {
  let total = state.productInfoFieldsList.reduce((total, curr) => {
    let totalPrice = !!curr.value ? curr.value * curr.price : 0;
    return total + totalPrice;
  }, 0);
  let donationAmount = (total * 0.1);
  let minimumDonationAmnt = 10;
  donationAmount = parseFloat(donationAmount.toFixed(2));
  donationAmount = donationAmount > minimumDonationAmnt ? donationAmount : minimumDonationAmnt;
  if (type === 'donationAmount') {
    donationAmount = donationAmount.toFixed(2);
    return parseFloat(donationAmount);
  } else {
    total = (total + donationAmount).toFixed(2);
    return total;
  }
};

// Masks the credit card number except last 4 digits
const maskedCardNumber = (cardNumber) => {
  let visibleDigits = cardNumber.slice(-4);
  let hiddenDigits = cardNumber.replace(/\d/g, "X").slice(0, -4);
  let maskedCardNumber = hiddenDigits + visibleDigits;
  return maskedCardNumber
}