<?php

namespace App\Controller;

use App\DTO\AddStockRequest;
use App\DTO\CreateProductRequest;
use App\Entity\Product;
use App\Entity\StockMovement;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/products')]
class ProductController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly ProductRepository $productRepository,
        private readonly ValidatorInterface $validator
    ) {
    }

    #[Route('', name: 'api_products_list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $products = $this->productRepository->findAllWithStockMovements();

        $data = array_map(function (Product $product): array {
            return [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'currentStock' => $product->getCurrentStock()
            ];
        }, $products);

        return $this->json($data);
    }

    #[Route('', name: 'api_products_create', methods: ['POST'])]
    public function create(
        #[MapRequestPayload] CreateProductRequest $request
    ): JsonResponse {
        $product = new Product();
        $product->setName($request->name);

        $this->entityManager->persist($product);

        if ($request->quantity > 0) {
            $stockMovement = new StockMovement();
            $stockMovement->setProduct($product);
            $stockMovement->setQuantity($request->quantity);

            $this->entityManager->persist($stockMovement);
        }

        $this->entityManager->flush();

        return $this->json([
            'id' => $product->getId(),
            'name' => $product->getName(),
            'currentStock' => $product->getCurrentStock()
        ], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'api_products_show', requirements: ['id' => '\d+'], methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $product = $this->productRepository->find($id);

        if (!$product) {
            return $this->json(['error' => 'Product not found'], Response::HTTP_NOT_FOUND);
        }

        $movements = array_map(function (StockMovement $movement): array {
            return [
                'id' => $movement->getId(),
                'quantity' => $movement->getQuantity(),
                'createdAt' => $movement->getCreatedAt()?->format('Y-m-d H:i:s')
            ];
        }, $product->getStockMovements()->toArray());

        return $this->json([
            'id' => $product->getId(),
            'name' => $product->getName(),
            'currentStock' => $product->getCurrentStock(),
            'stockMovements' => $movements
        ]);
    }

    #[Route('/{id}/stock', name: 'api_products_add_stock', requirements: ['id' => '\d+'], methods: ['POST'])]
    public function addStock(
        int $id,
        #[MapRequestPayload] AddStockRequest $request
    ): JsonResponse {
        $product = $this->productRepository->find($id);

        if (!$product) {
            return $this->json(['error' => 'Product not found'], Response::HTTP_NOT_FOUND);
        }

        $stockMovement = new StockMovement();
        $stockMovement->setProduct($product);
        $stockMovement->setQuantity($request->quantity);

        $this->entityManager->persist($stockMovement);
        $this->entityManager->flush();

        return $this->json([
            'id' => $product->getId(),
            'name' => $product->getName(),
            'currentStock' => $product->getCurrentStock()
        ]);
    }
}
