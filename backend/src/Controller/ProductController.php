<?php

namespace App\Controller;

use App\DTO\AddStockRequest;
use App\DTO\CreateProductRequest;
use App\DTO\ProductResponse;
use App\Entity\Product;
use App\Exception\BusinessLogicException;
use App\Service\ProductService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/products')]
class ProductController extends AbstractController
{
    public function __construct(
        private readonly ProductService $productService,
    ) {
    }

    #[Route('', name: 'api_products_list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $products = $this->productService->getAllProducts();

        $data = array_map(
            fn(Product $product) => ProductResponse::fromEntity($product),
            $products
        );

        return $this->json($data);
    }

    /**
     * @throws BusinessLogicException
     */
    #[Route('', name: 'api_products_create', methods: ['POST'])]
    public function create(
        #[MapRequestPayload] CreateProductRequest $request
    ): JsonResponse {
        $product = $this->productService->createProduct($request->name, $request->quantity);

        return $this->json(
            ProductResponse::fromEntity($product),
            Response::HTTP_CREATED
        );
    }

    #[Route('/{id}', name: 'api_products_show', requirements: ['id' => '\d+'], methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $product = $this->productService->findProduct($id);

        if (!$product) {
            return $this->json(['error' => 'Product not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json(ProductResponse::fromEntityDetailed($product));
    }

    /**
     * @throws BusinessLogicException
     */
    #[Route('/{id}/stock', name: 'api_products_add_stock', requirements: ['id' => '\d+'], methods: ['POST'])]
    public function addStock(
        int $id,
        #[MapRequestPayload] AddStockRequest $request
    ): JsonResponse {
        $product = $this->productService->findProduct($id);

        if (!$product) {
            return $this->json(['error' => 'Product not found'], Response::HTTP_NOT_FOUND);
        }

        $this->productService->addStock($product, $request->quantity);

        return $this->json(ProductResponse::fromEntity($product));
    }

}
