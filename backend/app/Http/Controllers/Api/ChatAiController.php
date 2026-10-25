<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\VillageAiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatAiController extends Controller
{
    public function __construct(
        protected VillageAiService $aiService
    ) {}

    /**
     * Endpoint API publik untuk menerima pertanyaan pengunjung dan dijawab oleh AI Desa.
     */
    public function handleChat(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:1000'],
            'history' => ['nullable', 'array', 'max:20'],
            'targetShopId' => ['nullable', 'string', 'max:100'],
        ]);

        $result = $this->aiService->generateReply(
            message: $validated['message'],
            history: $validated['history'] ?? [],
            targetShopId: $validated['targetShopId'] ?? null
        );

        return response()->json($result);
    }
}

