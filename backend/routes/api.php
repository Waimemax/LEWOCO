<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MemberController;

Route::get('/members', [MemberController::class, 'index']);
Route::post('/members', [MemberController::class, 'store']);

Route::get('/members/{member}', [MemberController::class, 'show']);
Route::put('/members/{member}', [MemberController::class, 'update']);
Route::patch('/members/{member}/status', [MemberController::class, 'updateStatus']);