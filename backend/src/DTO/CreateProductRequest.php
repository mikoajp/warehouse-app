<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class CreateProductRequest
{
    #[Assert\NotBlank]
    #[Assert\Length(min: 1, max: 255)]
    public string $name;

    #[Assert\NotNull]
    #[Assert\GreaterThanOrEqual(0)]
    public int $quantity;
}
