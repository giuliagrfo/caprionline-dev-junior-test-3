import React, { useEffect, useState } from 'react';
import { Button, Rating, Select, Spinner } from 'flowbite-react';

const App = props => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);

  useEffect(() => {
    fetchMovies();
    fetchGenres();
    fetchFilteredMovies();
    setSortBy('');
  }, []);

  const fetchMovies = () => {
    setLoading(true);
    fetch('http://localhost:8000/movies')
      .then(response => response.json())
      .then(data => {
        setMovies(data);
        setLoading(false);
      });
  };

  const fetchGenres = () => {
    fetch('http://localhost:8000/genres')
      .then(response => response.json())
      .then(data => setGenres(data));
  };

  const handleSortBy = criteria => {
    setSortBy(criteria);
  };

  const handleGenreChange = selectedGenreId => {
    setSelectedGenre(selectedGenreId);
    fetchFilteredMovies(selectedGenreId);
  };
  
  const fetchFilteredMovies = selectedGenreId => {
    setLoading(true);
    fetch(`http://localhost:8000/movies_genres?genre_id=${selectedGenreId}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // Ottieni l'elenco degli ID dei film associati al genere selezionato
        const movieIds = data.map(item => item.movie_id);
        // Filtra l'array di film in base agli ID ottenuti
        const filteredMovies = movies.filter(movie => movieIds.includes(movie.id));
        // Imposta l'array di film filtrati nello stato
        setFilteredMovies(filteredMovies);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching filtered movies:', error);
        setLoading(false);
      });
  };
  
  const applyFilters = () => {
    let filtered = [...movies];

    if (selectedGenre) {
      // Filtra i film in base al genere selezionato
      const filteredIds = filteredMovies.map(genre => genre.movie_id);
      filtered = filtered.filter(movie => filteredIds.includes(movie.id));
    }
  
    switch (sortBy) {
      case 'releaseDate':
        filtered.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
  
    return filtered;
  };
  return (
    <Layout>
      <Heading />
      <div className="flex justify-center items-center mb-4">
        <span className='font-light text-gray-500 mr-3 sm:text-xl dark:text-gray-400'>Ordina per:</span>
        <Select value={sortBy} onChange={(e) => handleSortBy(e.target.value)}>
          <option value="">Seleziona...</option>
          <option value="releaseDate">Più recenti</option>
          <option value="rating">Recensioni</option>
        </Select>
      </div>
      <div className="flex justify-center items-center mb-4">
        <span className='font-light text-gray-500 mr-3 sm:text-xl dark:text-gray-400'>Filtra per genere:</span>
        <Select value={selectedGenre} onChange={(e) => handleGenreChange(e.target.value)}>
          <option value="">Tutti i generi</option>
          {genres.map(genre => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
          ))}
        </Select>
      </div>

      <MovieList loading={loading}>
        {applyFilters().map((item, key) => (
          <MovieItem key={key} {...item} />
        ))}
      </MovieList>
    </Layout>
  );
};

const Layout = props => {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        {props.children}
      </div>
    </section>
  );
};

const Heading = props => {
  return (
    <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
      <h1 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
        Movie Collection
      </h1>

      <p className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
        Explore the whole collection of movies
      </p>
    </div>
  );
};

const MovieList = props => {
  if (props.loading) {
    return (
      <div className="text-center">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:gap-y-8 xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3">
      {props.children}
    </div>
  );
};

const MovieItem = props => {
  return (
    <div className="flex flex-col w-full h-full rounded-lg shadow-md lg:max-w-sm">
      <div className="grow">
        <img
          className="object-cover w-full h-60 md:h-80"
          src={props.imageUrl}
          alt={props.title}
          loading="lazy"
        />
      </div>

      <div className="grow flex flex-col h-full p-3">
        <div className="grow mb-3 last:mb-0">
          {props.year || props.rating
            ? <div className="flex justify-between align-middle text-gray-900 text-xs font-medium mb-2">
              <span>{props.year}</span>

              {props.rating
                ? <Rating>
                  <Rating.Star />

                  <span className="ml-0.5">
                    {props.rating}
                  </span>
                </Rating>
                : null
              }
            </div>
            : null
          }

          <h3 className="text-gray-900 text-lg leading-tight font-semibold mb-1">
            {props.title}
          </h3>

          <p className="text-gray-600 text-sm leading-normal mb-4 last:mb-0">
            {props.plot.substr(0, 80)}...
          </p>
        </div>

        {props.wikipediaUrl
          ? <Button
            color="light"
            size="xs"
            className="w-full"
            onClick={() => window.open(props.wikipediaUrl, '_blank')}
          >
            More
          </Button>
          : null
        }
      </div>
    </div>
  );
};

export default App;
