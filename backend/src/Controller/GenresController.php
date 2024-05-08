<?php

namespace App\Controller;

use App\Repository\GenreRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

class GenresController extends AbstractController
{
    public function __construct(
        private GenreRepository $genreRepository,
        private SerializerInterface $serializer
    ) {}

    #[Route('/genres', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $genres = $this->genreRepository->findAll();
        $genreArray = [];

        foreach ($genres as $genre) {
            $genreArray[] = [
                'id' => $genre->getId(),
                'name' => $genre->getName(),
            ];
        }

        return new JsonResponse($genreArray);
    }
}
