const movieDetailsContainer = document.getElementById('movie-details-container');
const filmsList = document.getElementById('films');


fetchMovieDetails(1);


fetchMovies();


function fetchMovieDetails(movieId) {
  fetch(`http://localhost:3000/films/${movieId}`)
    .then(response => response.json())
    .then(movie => {
      displayMovieDetails(movie);
    })
    .catch(error => {
      console.log('Error:', error);
    });
}


function fetchMovies() {
  fetch('http://localhost:3000/films')
    .then(response => response.json())
    .then(movies => {
      displayMoviesList(movies);
    })
    .catch(error => {
      console.log('Error:', error);
    });
}


function displayMovieDetails(movie) {
  const movieDetailsHTML = `
    <div>
      <img src="${movie.poster}" alt="Movie Poster">
    </div>
    <div>
      <h3>${movie.title}</h3>
      <p>Runtime: ${movie.runtime} minutes</p>
      <p>Showtime: ${movie.showtime}</p>
      <p>Available Tickets: ${movie.capacity - movie.tickets_sold}</p>
      <div class="button-container">
        <button id="buy-ticket-btn" ${movie.capacity - movie.tickets_sold === 0 ? 'disabled' : ''}>Buy Ticket</button>
      </div>
    </div>
  `;

  movieDetailsContainer.innerHTML = movieDetailsHTML;

  const buyTicketBtn = document.getElementById('buy-ticket-btn');
  buyTicketBtn.addEventListener('click', () => {
    buyTicket(movie);
  });
}


function displayMoviesList(movies) {
  filmsList.innerHTML = '';

  movies.forEach(movie => {
    const filmItem = document.createElement('li');
    filmItem.className = 'film-item';
    filmItem.textContent = movie.title;
    filmItem.addEventListener('click', () => {
      fetchMovieDetails(movie.id);
    });

    if (movie.capacity - movie.tickets_sold === 0) {
      filmItem.classList.add('sold-out');
    }

    filmsList.appendChild(filmItem);
  });
}


function buyTicket(movie) {
  const updatedTicketsSold = movie.tickets_sold + 1;

  fetch(`http://localhost:3000/films/${movie.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tickets_sold: updatedTicketsSold }),
  })
    .then(response => response.json())
    .then(updatedMovie => {
      fetchMovieDetails(updatedMovie.id);
      fetchMovies();
    })
    .catch(error => {
      console.log('Error:', error);
    });
}


