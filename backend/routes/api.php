<?php

use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\EnquiryController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\MemberController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProgrammeController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\PublicAnnouncementController;
use App\Http\Controllers\Api\PublicEnquiryController;
use App\Http\Controllers\Api\PublicOrderController;
use App\Http\Controllers\Api\PublicProductController;
use App\Http\Controllers\Api\PublicProgrammeController;
use App\Http\Controllers\Api\PublicProjectController;
use App\Http\Controllers\Api\PublicResourceController;
use App\Http\Controllers\Api\PublicTrainingEventController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\ResourceController;
use App\Http\Controllers\Api\TrainingEventController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// Public (no login)
Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

Route::middleware('throttle:60,1')->prefix('public')->group(function () {
    Route::get('/programmes', [PublicProgrammeController::class, 'index']);
    Route::get('/projects', [PublicProjectController::class, 'index']);
    Route::get('/announcements', [PublicAnnouncementController::class, 'index']);
    Route::get('/events', [PublicTrainingEventController::class, 'index']);
    Route::get('/resources', [PublicResourceController::class, 'index']);
    Route::get('/products', [PublicProductController::class, 'index']);
});

// Uploaded photos (only plain file names with an image extension are accepted)
Route::get('/media/products/{filename}', [MediaController::class, 'product'])
    ->where('filename', '[A-Za-z0-9_-]+\.(?:jpg|png|webp)')
    ->middleware('throttle:600,1');

// Contact form: strict limit of 5 enquiries per 10 minutes per visitor.
// Kept outside the group above so the two limits do not share a counter.
Route::post('/public/enquiries', [PublicEnquiryController::class, 'store'])->middleware('throttle:5,10');

// Shop: placing orders is limited like the contact form; order tracking has its own limit.
Route::post('/public/orders', [PublicOrderController::class, 'store'])->middleware('throttle:10,10');
Route::post('/public/orders/track', [PublicOrderController::class, 'track'])->middleware('throttle:20,1');

// Any signed-in administrator
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/password', [AuthController::class, 'changePassword']);

    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Super administrator only: member records contain personal information
    Route::middleware('role:super_admin')->group(function () {
        Route::get('/members', [MemberController::class, 'index']);
        Route::post('/members', [MemberController::class, 'store']);
        Route::get('/members/{member}', [MemberController::class, 'show']);
        Route::put('/members/{member}', [MemberController::class, 'update']);
        Route::patch('/members/{member}/status', [MemberController::class, 'updateStatus']);

        // Reports and exports (contain personal information)
        Route::get('/reports', [ReportController::class, 'index']);
        Route::get('/reports/members.csv', [ReportController::class, 'membersCsv']);
        Route::get('/reports/enquiries.csv', [ReportController::class, 'enquiriesCsv']);

        // Administrator accounts
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{user}', [UserController::class, 'update']);
        Route::patch('/users/{user}/password', [UserController::class, 'resetPassword']);
        Route::patch('/users/{user}/status', [UserController::class, 'updateStatus']);
    });

    // Super administrator and content administrator
    Route::middleware('role:super_admin,content_admin')->group(function () {
        Route::get('/programmes', [ProgrammeController::class, 'index']);
        Route::post('/programmes', [ProgrammeController::class, 'store']);
        Route::get('/programmes/{programme}', [ProgrammeController::class, 'show']);
        Route::put('/programmes/{programme}', [ProgrammeController::class, 'update']);
        Route::patch('/programmes/{programme}/status', [ProgrammeController::class, 'updateStatus']);

        Route::get('/projects', [ProjectController::class, 'index']);
        Route::post('/projects', [ProjectController::class, 'store']);
        Route::get('/projects/{project}', [ProjectController::class, 'show']);
        Route::put('/projects/{project}', [ProjectController::class, 'update']);
        Route::patch('/projects/{project}/status', [ProjectController::class, 'updateStatus']);

        Route::get('/announcements', [AnnouncementController::class, 'index']);
        Route::post('/announcements', [AnnouncementController::class, 'store']);
        Route::get('/announcements/{announcement}', [AnnouncementController::class, 'show']);
        Route::put('/announcements/{announcement}', [AnnouncementController::class, 'update']);
        Route::patch('/announcements/{announcement}/status', [AnnouncementController::class, 'updateStatus']);

        Route::get('/events', [TrainingEventController::class, 'index']);
        Route::post('/events', [TrainingEventController::class, 'store']);
        Route::get('/events/{event}', [TrainingEventController::class, 'show']);
        Route::put('/events/{event}', [TrainingEventController::class, 'update']);
        Route::patch('/events/{event}/status', [TrainingEventController::class, 'updateStatus']);

        Route::get('/resources', [ResourceController::class, 'index']);
        Route::post('/resources', [ResourceController::class, 'store']);
        Route::get('/resources/{resource}', [ResourceController::class, 'show']);
        Route::put('/resources/{resource}', [ResourceController::class, 'update']);
        Route::patch('/resources/{resource}/status', [ResourceController::class, 'updateStatus']);

        Route::get('/enquiries', [EnquiryController::class, 'index']);
        Route::get('/enquiries/{enquiry}', [EnquiryController::class, 'show']);
        Route::patch('/enquiries/{enquiry}', [EnquiryController::class, 'update']);

        Route::get('/products', [ProductController::class, 'index']);
        Route::post('/products', [ProductController::class, 'store']);
        Route::get('/products/{product}', [ProductController::class, 'show']);
        Route::put('/products/{product}', [ProductController::class, 'update']);
        Route::patch('/products/{product}/status', [ProductController::class, 'updateStatus']);
        Route::post('/products/{product}/image', [ProductController::class, 'uploadImage']);
        Route::delete('/products/{product}/image', [ProductController::class, 'deleteImage']);

        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/{order}', [OrderController::class, 'show']);
        Route::patch('/orders/{order}', [OrderController::class, 'update']);
        Route::post('/orders/{order}/approve', [OrderController::class, 'approve']);
        Route::post('/orders/{order}/reject', [OrderController::class, 'reject']);
        Route::post('/orders/{order}/deliver', [OrderController::class, 'deliver']);
    });
});
