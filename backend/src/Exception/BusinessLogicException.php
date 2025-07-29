<?php

namespace App\Exception;

use Exception;

class BusinessLogicException extends Exception
{
    protected array $data = [];

    public function __construct(string $message = "", int $code = 400, ?Exception $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }

    public function getData(): array
    {
        return $this->data;
    }

    public function setData(array $data): self
    {
        $this->data = $data;
        return $this;
    }
}
