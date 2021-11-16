const viewSection = document.querySelector(".view-section");
const contactsSection = document.querySelector(".contacts-section");

const state = {
  contacts: [],
  selectedContact: null
};

/* [START] NO NEED TO EDIT */

function getContacts() {
  fetch("http://localhost:3000/contacts")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      state.contacts = data;

      renderContactsList();
    });
}

function renderContactsList() {
  const listEl = document.createElement("ul");
  listEl.className = "contacts-list";

  for (let i = 0; i < state.contacts.length; i++) {
    const contact = state.contacts[i];
    const listItemEl = renderContactListItem(contact);

    listEl.append(listItemEl);
  }

  contactsSection.append(listEl);
}

function renderAddressSection(address) {
  const containerEl = document.createElement("section");

  const headingEl = document.createElement("h2");
  headingEl.innerText = "Address";

  containerEl.append(headingEl);

  const streetText = document.createElement("p");
  streetText.innerText = address.street;

  containerEl.append(streetText);

  const cityText = document.createElement("p");
  cityText.innerText = address.city;

  containerEl.append(cityText);

  const postCodeText = document.createElement("p");
  postCodeText.innerText = address.postCode;

  containerEl.append(postCodeText);

  return containerEl;
}

function renderContactView() {
  const contact = state.selectedContact;

  if (!contact) return;

  viewSection.innerHTML = "";

  const containerEl = document.createElement("article");
  

  const headingEl = document.createElement("h1");

  const fullName = `${contact.firstName} ${contact.lastName}`;
  headingEl.innerText = fullName;

  containerEl.append(headingEl);

  const addressSectionEl = renderAddressSection(contact.address);

  containerEl.append(addressSectionEl);

  const blockBtn = document.createElement("button");
  blockBtn.className = "button blue";
  if(contact.blockContact) {
    blockBtn.innerText = "Unblock";
    containerEl.className = "center light-shadow address-card blocked";
  } else {
    blockBtn.innerText = "Block";
    containerEl.className = "center light-shadow address-card";
  }
  

  const butEl = document.createElement("div");
  butEl.className = "butEl";

  blockBtn.addEventListener("click", event => {
    event.preventDefault();
    if (!contact.blockContact) {

      if(window.confirm(`Block ${contact.firstName} ${contact.lastName}?`)) {

        fetch(`http://localhost:3000/contacts/${contact.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },      
          body: JSON.stringify({ blockContact: true })
        })
      }

    } else {
      if(window.confirm(`Unblock ${contact.firstName} ${contact.lastName}?`)) {
        fetch(`http://localhost:3000/contacts/${contact.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },      
          body: JSON.stringify({ blockContact: false })
        })
      }
    }
  });

  butEl.append(blockBtn);

  const delBtn = document.createElement("button");
  delBtn.className = "button blue";
  delBtn.innerText = "Delete";

  delBtn.addEventListener("click", function () {
    if(window.confirm(`Are you sure you want to delete ${contact.firstName} ${contact.lastName}?`)) {
      deleteContact();
    } else { return };
  });

  butEl.append(delBtn);

  containerEl.append(butEl);

  viewSection.append(containerEl);
}

/* [END] NO NEED TO EDIT */

function deleteContact() {
  const contact = state.selectedContact;
  
  fetch(`http://localhost:3000/contacts/${contact.id}`, {
    method: 'DELETE'
  }).then(response => response.json())

  fetch(`http://localhost:3000/addresses/${contact.id}`, {
    method: 'DELETE'
  }).then(response => response.json())

}

function renderContactListItem(contact) {
  const listItemEl = document.createElement("li");

  const headingEl = document.createElement("h3");

  const fullName = `${contact.firstName} ${contact.lastName}`;

  headingEl.innerText = fullName;

  listItemEl.append(headingEl);

  const viewBtn = document.createElement("button");
  viewBtn.className = "button grey";
  viewBtn.innerText = "View";

  viewBtn.addEventListener("click", function () {
    state.selectedContact = contact;

    renderContactView();
  });

  listItemEl.append(viewBtn);

  const editBtn = document.createElement("button");
  editBtn.className = "button blue";
  editBtn.innerText = "Edit";

  editBtn.addEventListener("click", function () {
    state.selectedContact = contact;

    renderContactEdit();
  });

  listItemEl.append(editBtn);

  

  return listItemEl;
}

function listenNewContactButton() {
  const btn = document.querySelector(".new-contact-btn");

  btn.addEventListener("click", function () {
    renderContactForm();
  });
}

// [TODO] Write Code

function main() {
  listenNewContactButton();
  getContacts();
}

main();

function postNewContact() {
  var tempContact = state.selectedContact;
  console.log("state", state.selectedContact)

  var tempAddress = state.selectedContact.address;
  console.log("address", tempAddress);
  delete tempContact["address"];
  console.log("contact", tempContact)

  fetch("http://localhost:3000/contacts", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    
    body: JSON.stringify(tempContact)
  })

  fetch("http://localhost:3000/addresses", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    
    body: JSON.stringify(tempAddress)
  })

  state.selectedContact = null;
}

function renderContactForm() {
  viewSection.innerHTML = "";
  const formArr = ["First-Name", "Last-Name", "Street", "City", "Postcode"];

  const formEl = document.createElement("form")
  formEl.className = "form-stack light-shadow center contact-form";
  
  const h1El = document.createElement("h1");
  h1El.innerText = "Create Contact";

  formEl.append(h1El);

  formArr.forEach(element => {
    const tempLbl = document.createElement("label");
    tempLbl.setAttribute("for", element + "-input");
    tempLbl.innerText = `${element.split("-").join(" ")}:`;

    const tempInp = document.createElement("input");
    tempInp.setAttribute("id", element + "-input");
    tempInp.setAttribute("name", element + "-input");
    tempInp.setAttribute("type", "text");

    formEl.append(tempLbl, tempInp)
  })

  const blockEl = document.createElement("div");
  blockEl.className = "checkbox-section";

  const blockInp = document.createElement("input");
  blockInp.setAttribute("id", "block-checkbox");
  blockInp.setAttribute("name", "block-checkbox");
  blockInp.setAttribute("type", "checkbox");

  const blockLbl = document.createElement("label");
  blockLbl.setAttribute("for", "block-checkbox");
  blockLbl.innerText = "Block";

  const createEl = document.createElement("div");
  createEl.className = "actioons-section";

  const createBut = document.createElement("button");
  createBut.className = "button blue";
  createBut.setAttribute("type", "submit");
  createBut.innerText = "Create";

  blockEl.append(blockInp, blockLbl);
  createEl.append(createBut);
  formEl.append(blockEl, createEl)
  viewSection.append(formEl);

  formEl.addEventListener('submit', () => {
    state.selectedContact = {
      "id": state.contacts.length + 1,
      "firstName": document.getElementById("First-Name-input").value,
      "lastName": document.getElementById("Last-Name-input").value,
      "blockContact": blockInp.checked,
      "addressId": state.contacts.length + 1,
      "address": {
        "id": state.contacts.length + 1,
        "street": document.getElementById("Street-input").value,
        "city": document.getElementById("City-input").value,
        "postCode": document.getElementById("Postcode-input").value
      }
    }

    postNewContact();
  })
}

function renderContactEdit() {
  renderContactView()


  const formArr = ["First-Name", "Last-Name", "Street", "City", "Post-Code"];

  const formEl = document.createElement("form")
  formEl.className = "form-stack light-shadow center contact-form update-form";
  
  const h1El = document.createElement("h1");
  h1El.innerText = "Edit Contact";

  formEl.append(h1El);

  formArr.forEach(element => {
    const tempLbl = document.createElement("label");
    tempLbl.setAttribute("for", element + "-input");
    tempLbl.innerText = `New ${element.split("-").join(" ")}:`;

    const tempInp = document.createElement("input");
    tempInp.setAttribute("id", element + "-input");
    tempInp.setAttribute("name", element + "-input");
    tempInp.setAttribute("type", "text");

    formEl.append(tempLbl, tempInp)
  })


  const createEl = document.createElement("div");
  createEl.className = "actioons-section";

  const createBut = document.createElement("button");
  createBut.className = "button blue";
  createBut.setAttribute("type", "submit");
  createBut.innerText = "Update";

  createEl.append(createBut);
  formEl.append(createEl);

  const sectionEl = document.querySelector(".address-card")
  sectionEl.removeChild(sectionEl.lastChild)
  sectionEl.append(formEl);

  formEl.addEventListener('submit', (event) => {
    event.preventDefault()

    var newFirstName;
    if (document.getElementById("First-Name-input").value) {
      newFirstName = document.getElementById("First-Name-input").value
    } else {
      newFirstName = state.selectedContact.firstName;
    }

    var newLastName;
    if (document.getElementById("Last-Name-input").value) {
      newLastName = document.getElementById("Last-Name-input").value
    } else {
      newLastName = state.selectedContact.lastName;
    }

    var newStreet;
    if (document.getElementById("Street-input").value) {
      newStreet = document.getElementById("Street-input").value
    } else {
      newStreet = state.selectedContact.street;
    }

    var newCity;
    if (document.getElementById("City-input").value) {
      newCity = document.getElementById("City-input").value
    } else {
      newCity = state.selectedContact.city;
    }
    
    var newPostCode;
    if (document.getElementById("Post-Code-input").value) {
      newPostCode = document.getElementById("Postcode-input").value
    } else {
      newPostCode = state.selectedContact.postCode;
    }

    var tempContactId = state.selectedContact.id;
    var tempBlock = state.selectedContact.blockContact;

    state.selectedContact = {
      "id": tempContactId,
      "firstName": newFirstName,
      "lastName": newLastName,
      "blockContact": tempBlock,
      "addressId": tempContactId,
      "address": {
        "id": tempContactId,
        "street": newStreet,
        "city": newCity,
        "postCode": newPostCode
      }
    }

    updateContact()
  });
}

function updateContact() {
  var tempContact = state.selectedContact;
  console.log("state", state.selectedContact)

  var tempAddress = state.selectedContact.address;
  console.log("address", tempAddress);
  delete tempContact["address"];
  console.log("contact", tempContact)

  fetch(`http://localhost:3000/contacts/${state.selectedContact.id}`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    
    body: JSON.stringify(tempContact)
  })

  fetch(`http://localhost:3000/contacts/${state.selectedContact.id}`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    
    body: JSON.stringify(tempAddress)
  })

  state.selectedContact = null;
}