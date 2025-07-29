<?php

namespace App\DTO;

use App\Entity\Product;
use App\Entity\StockMovement;

class ProductResponse
{
    public static function fromEntity(Product $product): array
    {
        return [
            'id' => $product->getId(),
            'name' => $product->getName(),
            'currentStock' => $product->getCurrentStock(),
            'createdAt' => $product->getId() ? new \DateTime()->format('Y-m-d H:i:s') : null
        ];
    }

    public static function fromEntityDetailed(Product $product): array
    {
        $movements = array_map(
            fn(StockMovement $movement) => [
                'id' => $movement->getId(),
                'quantity' => $movement->getQuantity(),
                'type' => $movement->getQuantity() > 0 ? 'addition' : 'removal',
                'createdAt' => $movement->getCreatedAt()?->format('Y-m-d H:i:s')
            ],
            $product->getStockMovements()->toArray()
        );

        usort($movements, fn($a, $b) => strcmp($b['createdAt'], $a['createdAt']));

        return [
            'id' => $product->getId(),
            'name' => $product->getName(),
            'currentStock' => $product->getCurrentStock(),
            'stockMovements' => $movements,
            'totalMovements' => count($movements)
        ];
    }
}
