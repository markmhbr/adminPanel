<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\School;
use App\Services\SchoolApiService;

$school = School::first();

// Sample GTK
$result = SchoolApiService::executeRawQuery($school, "SELECT * FROM gtks LIMIT 1");
if (!empty($result['data'])) {
    print_r($result['data'][0]);
}
