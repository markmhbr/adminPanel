<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\School;
use App\Services\SchoolApiService;

$school = School::first();

$query = "SELECT * FROM sekolahs LIMIT 1";
try {
    $result = SchoolApiService::executeRawQuery($school, $query);
    if (!empty($result['data'])) {
        print_r($result['data'][0]);
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
