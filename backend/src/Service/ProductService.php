<?php

namespace App\Service;

use App\Entity\Product;
use App\Entity\StockMovement;
use App\Exception\BusinessLogicException;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;

readonly class ProductService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ProductRepository $productRepository,
    ) {
    }

    /**
     * @throws BusinessLogicException
     */
    public function createProduct(string $name, int $initialQuantity = 0): Product
    {
        $name = trim($name);
        if (empty($name)) {
            throw new BusinessLogicException('Product name cannot be empty');
        }

        if (strlen($name) > 255) {
            throw new BusinessLogicException('Product name cannot exceed 255 characters');
        }

        $existingProduct = $this->productRepository->findOneBy(['name' => $name]);
        if ($existingProduct) {
            throw new BusinessLogicException('Product with this name already exists');
        }

        $product = new Product();
        $product->setName($name);

        $this->entityManager->persist($product);

        if ($initialQuantity > 0) {
            $this->addStock($product, $initialQuantity);
        }

        $this->entityManager->flush();

        return $product;
    }

    /**
     * @throws BusinessLogicException
     */
    public function addStock(Product $product, int $quantity): void
    {
        if ($quantity <= 0) {
            throw new BusinessLogicException('Quantity must be greater than 0');
        }

        if ($quantity > 10000) {
            throw new BusinessLogicException('Quantity cannot exceed 10,000 units per operation');
        }

        $newTotal = $product->getCurrentStock() + $quantity;
        if ($newTotal > 1000000) {
            throw new BusinessLogicException('Total stock cannot exceed 1,000,000 units');
        }

        $stockMovement = new StockMovement();
        $stockMovement->setProduct($product);
        $stockMovement->setQuantity($quantity);

        $this->entityManager->persist($stockMovement);
        $this->entityManager->flush();
    }

    public function findProduct(int $id): ?Product
    {
        return $this->productRepository->find($id);
    }

    public function getAllProducts(): array
    {
        return $this->productRepository->findAllWithStockMovements();
    }
}
