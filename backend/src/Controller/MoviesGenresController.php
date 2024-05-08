<?php

namespace App\Controller;

use App\Repository\MovieGenreRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

class MoviesGenresController extends AbstractController
{
    public function __construct(
        private MovieGenreRepository $movieGenreRepository,
        private SerializerInterface $serializer
    ) {}

    #[Route('/movies_genres', methods: ['GET'])]
    public function index(Request $request): JsonResponse
    {
        $genreId = $request->query->get('genre_id');

        if ($genreId !== null) {
            // Esegui la query per ottenere solo i dati dei film associati al genere specificato
            $filteredGenres = $this->movieGenreRepository->findBy(['genre' => $genreId]);
        } else {
            // Se non viene specificato alcun genere, restituisci tutti i generi
            $filteredGenres = $this->movieGenreRepository->findAll();
        }
        
        // Estrai solo i dati necessari da ciascun oggetto MovieGenre
        $formattedGenres = [];
        foreach ($filteredGenres as $genre) {
            $formattedGenres[] = [
                'id' => $genre->getId(),
                'movie_id' => $genre->getMovie()->getId(),
                'genre_id' => $genre->getGenre()->getId(),
            ];
        }

        // Serializza i generi in formato JSON
        $data = $this->serializer->serialize($formattedGenres, 'json');

        // Aggiungi il log dei dati
        dump($data);

        return new JsonResponse($data, 200, [], true);
    }
}
