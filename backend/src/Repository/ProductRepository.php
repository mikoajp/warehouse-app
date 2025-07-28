<?php

namespace App\Repository;

use App\Entity\Product;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Product>
 */
class ProductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Product::class);
    }

    /**
     * @return Product[]
     */
    public function findAllWithStockMovements(): array
    {
        return $this->createQueryBuilder('p')
            ->leftJoin('p.stockMovements', 's')
            ->addSelect('s')
            ->getQuery()
            ->getResult();
    }
}
