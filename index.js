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
        <h6>${party.date}</h6>
        <h6>${party.location}`
    })
}

