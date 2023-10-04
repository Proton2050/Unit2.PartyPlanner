const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2309-FSA-ET-WEB-FT/events`;

const state = {
    parties: [],
};

const partyList = document.querySelector('#partyList');

const addPartyForm = document.querySelector('#addParty');
addPartyForm.addEventListener('submit', addParty);

// Sync state with the API and rerender
async function render() {
    await getParties();
    renderParties();
}
render();

// Update state with parties from API
async function getParties() {
    try {
        const response = await fetch(API_URL);
        const json = await response.json();
        state.parties = json.data;
    } catch (error) {
        console.log(error);
    }
}

// Render parties from state
function renderParties() {
    if (!state.parties.length) {
        partyList.innerHTML = '<li>No parties 😔';
        return;
    }
    const partyCards = state.parties.map((party) => {
        const li = document.createElement('li');
        li.innerHTML = `
        <h2>${party.name}</h2>
        <p>${party.description}</p>
        <h4>${party.date}</h4>
        <h4>${party.location}</h4>
        `;

        // Add button to delete party
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete Party';
        li.append(deleteButton);
        deleteButton.addEventListener('click', () => deleteParty(party.id));

        return li;
    });

    partyList.replaceChildren(...partyCards);
}

// Ask API to create a new party based on form data
async function addParty(event) {
    event.preventDefault();
    // Create a JS Date
    const dateObj = new Date(addPartyForm.date.value);
    
    console.log(addPartyForm.date.value);
    console.log(dateObj);
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: addPartyForm.name.value,
                description: addPartyForm.description.value,
                // make sure JS Date is in the right format
                date: dateObj.toISOString(),
                location: addPartyForm.location.value
            })
        });
        addPartyForm.name.value = '';
        addPartyForm.description.value = '';
        addPartyForm.date.value = '';
        addPartyForm.location.value = '';


        let result = await response.json();
        console.log(result);
        if (result.success) {
            console.log("added party successfully");
            // throw new Error('Failed to create party');
        } else {
            console.log('failed to add party');
        }

        render();
    } catch (error) {
        console.error(error);
    }
}

// Create delete party function
async function deleteParty(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Party could not be deleted.');
        }

        render();
    } catch (error) {
        console.log(error);
    }
}