<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MemberController;
use Illuminate\Support\Facades\Route;

// Public
Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

// Any signed-in administrator
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Super administrator only: member records contain personal information
    Route::middleware('role:super_admin')->group(function () {
        Route::get('/members', [MemberController::class, 'index']);
        Route::post('/members', [MemberController::class, 'store']);
        Route::get('/members/{member}', [MemberController::class, 'show']);
        Route::put('/members/{member}', [MemberController::class, 'update']);
        Route::patch('/members/{member}/status', [MemberController::class, 'updateStatus']);
    });

    // Super administrator and content administrator
    // (Programmes, Projects, Training & Events, News, Resources, Enquiries go here later)
    Route::middleware('role:super_admin,content_admin')->group(function () {
        //
    });
});
