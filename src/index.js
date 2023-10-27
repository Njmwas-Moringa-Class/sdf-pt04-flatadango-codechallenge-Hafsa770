// Your code here

const apiBaseURL = 'http://localhost:3000';

// Function to fetch movie details
async function fetchMovieDetails(id) {
  const response = await fetch(`${apiBaseURL}/films/${id}`);
  const movieData = await response.json();
  return movieData;
}

// Function to update the movie details on the page
async function updateMovieDetails(id) {
  const movieData = await fetchMovieDetails(id);

  const posterElement = document.getElementById('poster');
  const titleElement = document.getElementById('title');
  const runtimeElement = document.getElementById('runtime');
  const filmInfoElement = document.getElementById('film-info');
  const showtimeElement = document.getElementById('showtime');
  const ticketNumElement = document.getElementById('ticket-num');
  const buyTicketButton = document.getElementById('buy-ticket');

  posterElement.src = movieData.poster;
  titleElement.textContent = movieData.title;
  runtimeElement.textContent = `${movieData.runtime} minutes`;
  filmInfoElement.textContent = movieData.description;
  showtimeElement.textContent = movieData.showtime;

  const availableTickets = movieData.capacity - movieData.tickets_sold;
  ticketNumElement.textContent = availableTickets;

  if (availableTickets > 0) {
    buyTicketButton.textContent = 'Buy Ticket';
    buyTicketButton.disabled = false;
  } else {
    buyTicketButton.textContent = 'Sold Out';
    buyTicketButton.disabled = true;
  }
}

// Function to fetch all movies
async function fetchAllMovies() {
  const response = await fetch(`${apiBaseURL}/films`);
  const moviesData = await response.json();
  return moviesData;
}

// Function to populate the movie menu
async function populateMovieMenu() {
  const moviesData = await fetchAllMovies();
  const filmsList = document.getElementById('films');

  moviesData.forEach((movie) => {
    const li = document.createElement('li');
    li.className = 'film item';
    li.textContent = movie.title;
    li.addEventListener('click', () => updateMovieDetails(movie.id));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-button';
    deleteButton.addEventListener('click', () => deleteMovie(movie.id, li));
    
    li.appendChild(deleteButton);
    
    filmsList.appendChild(li);
  });
}

// Function to delete a movie
async function deleteMovie(id, listItem) {
  const response = await fetch(`${apiBaseURL}/films/${id}`, {
    method: 'DELETE',
  });

  if (response.status === 200) {
    listItem.remove();
  }
}

// Function to handle the "Buy Ticket" button click
async function buyTicket() {
  const ticketNumElement = document.getElementById('ticket-num');
  const availableTickets = parseInt(ticketNumElement.textContent);

  if (availableTickets > 0) {
    const newAvailableTickets = availableTickets - 1;
    ticketNumElement.textContent = newAvailableTickets;

    // Update the tickets_sold on the server
    const movieId = 1; // Change this to the actual movie ID
    await updateTicketsSold(movieId, newAvailableTickets);
  }
}

// Function to update the tickets_sold on the server
async function updateTicketsSold(movieId, newAvailableTickets) {
  const response = await fetch(`${apiBaseURL}/films/${movieId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tickets_sold: movieData.capacity - newAvailableTickets }),
  });

  if (response.status === 200) {
    // Successfully updated tickets_sold on the server
  }
}

// Event listener for the "Buy Ticket" button
document.getElementById('buy-ticket').addEventListener('click', buyTicket);

// Initialize the page by populating the movie menu and displaying the first movie's details
populateMovieMenu();
updateMovieDetails(1);
