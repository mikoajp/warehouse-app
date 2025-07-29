<?php

namespace App\EventListener;

use App\Exception\BusinessLogicException;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

readonly class ExceptionListener
{
    public function __construct(
        private LoggerInterface $logger,
        private string          $environment
    ) {
    }

    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();
        $request = $event->getRequest();

        $this->logger->error('Exception occurred', [
            'exception' => $exception->getMessage(),
            'file' => $exception->getFile(),
            'line' => $exception->getLine(),
            'trace' => $exception->getTraceAsString(),
            'request_uri' => $request->getRequestUri(),
            'request_method' => $request->getMethod(),
        ]);

        if (str_starts_with($request->getPathInfo(), '/api/')) {
            $response = $this->createApiErrorResponse($exception);
            $event->setResponse($response);
        }
    }

    private function createApiErrorResponse(\Throwable $exception): JsonResponse
    {
        $statusCode = Response::HTTP_INTERNAL_SERVER_ERROR;
        $data = [
            'error' => 'Internal Server Error',
            'message' => 'An unexpected error occurred'
        ];

        if ($exception instanceof BusinessLogicException) {
            $statusCode = $exception->getCode();
            $data = [
                'error' => $exception->getMessage(),
                'data' => $exception->getData()
            ];
        } elseif ($exception instanceof HttpExceptionInterface) {
            $statusCode = $exception->getStatusCode();
            $data = [
                'error' => $exception->getMessage()
            ];
        }

        if ($this->environment === 'dev') {
            $data['debug'] = [
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
                'trace' => $exception->getTraceAsString()
            ];
        }

        return new JsonResponse($data, $statusCode);
    }
}
