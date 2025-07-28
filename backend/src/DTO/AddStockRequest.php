<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class AddStockRequest
{
    #[Assert\NotNull]
    #[Assert\GreaterThan(0)]
    public int $quantity;
}
