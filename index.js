/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    for (let game of games){
        // create a new div element, which will become the game card
        const gameCard = document.createElement('div');

        // add the class game-card to the list
        gameCard.classList.add('game-card');


        // set the inner HTML using a template literal to display some info 
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
        gameCard.innerHTML = `
        <h3>${game.name}</h3>
        <p>${game.description}</p>
        <p>Pledged: $${game.pledged} / Goal: $${game.goal}</p>
        <img src="${game.img}" alt="${game.name}" class="game-img">
      `;

        // append the game to the games-container
        gamesContainer.appendChild(gameCard);
    }

}
// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(GAMES_JSON);

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce((total, game) => {
    return total + game.backers;
  }, 0);  


// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = totalContributions.toLocaleString('en-US')

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

const totalRaised = GAMES_JSON.reduce((total, game) => {
    return total + game.pledged;
  }, 0);  

// set inner HTML using template literal
raisedCard.innerHTML = `$${totalRaised.toLocaleString('en-US')}`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");

const numGames = GAMES_JSON.reduce((total) => {
    return total + 1;
  }, 0);  

// set inner HTML using template literal
gamesCard.innerHTML = numGames.toLocaleString('en-US');


/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    let listOfUnfunded = GAMES_JSON.filter ( (game) => {
        return game.goal > game.pledged;
      });

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(listOfUnfunded);
}
//filterUnfundedOnly();

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    let listOfFunded = GAMES_JSON.filter ( (game) => {
        return game.goal <= game.pledged;
      });


    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(listOfFunded);
}
//filterFundedOnly();

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);



/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
let listUnfunded = GAMES_JSON.filter ( (game) => {
    return game.goal > game.pledged;
  });
const numUnfunded = listUnfunded.length;

// create a string that explains the number of unfunded games using the ternary operator
const secondPart = (numUnfunded > 1) ? `${numUnfunded} games remains unfunded. We need your help to fund these amazing games!` : ((numUnfunded == 1) ? `1 game remains unfunded. We need your help to fund this amazing game!` : "all games have been funded");
const displayStr = `A total of $${totalContributions.toLocaleString()} has been raised over ${numGames} games. Currently, ${secondPart}`

// create a new DOM element containing the template string and append it to the description container
const descriptionStr = document.createElement('p');
descriptionStr.textContent = displayStr;
descriptionContainer.appendChild(descriptionStr);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [firstGame, secondGame, ...otherGames] = sortedGames;
// console.log(firstGame.name);
// console.log(secondGame.name);

// create a new element to hold the name of the top pledge game, then append it to the correct element
const firstGameName = firstGame.name;
firstGameContainer.append(firstGameName);

// do the same for the runner up item
const secondGameName = secondGame.name;
secondGameContainer.append(secondGameName);


/*************************************************************************************
 * Add-ons to the website
*/
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-btn');

searchButton.addEventListener('click', () => {
    const searchText = searchInput.value.toLowerCase();

    if (searchText === '') {
        // If search text is empty, display all games
        displayGames(GAMES_JSON);
    } else {
        // Otherwise, filter and display matching games
        const filteredGames = GAMES_JSON.filter(game => 
            game.name.toLowerCase().includes(searchText)
        );
        displayGames(filteredGames);
    }
});

function displayGames(games) {
    gamesContainer.innerHTML = ''; // Clear existing games

    games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.classList.add('game-card'); // Assuming you have a CSS class for styling the game cards
        gameCard.innerHTML = `
            <h3>${game.name}</h3>
            <p>${game.description}</p>
            <img src="${game.img}" alt="${game.name}" class="game-img">
        `;
        gamesContainer.appendChild(gameCard);
    });

    // If no games match the search query, show a message
    if (games.length === 0) {
        gamesContainer.innerHTML = '<p>No games found.</p>';
    }
}

// Initial display of all games
displayGames(GAMES_JSON);

