<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\School;
use App\Services\SchoolApiService;

$school = School::first();

// Check siswas columns
$result = SchoolApiService::executeRawQuery($school, "DESCRIBE siswas");
echo "Siswas status columns:\n";
foreach ($result['data'] as $col) {
    if (stripos($col['Field'] ?? '', 'status') !== false || stripos($col['Field'] ?? '', 'aktif') !== false) {
        echo "- " . $col['Field'] . "\n";
    }
}

// Check gtks columns
$result = SchoolApiService::executeRawQuery($school, "DESCRIBE gtks");
echo "Gtks status columns:\n";
foreach ($result['data'] as $col) {
    if (stripos($col['Field'] ?? '', 'status') !== false || stripos($col['Field'] ?? '', 'aktif') !== false) {
        echo "- " . $col['Field'] . "\n";
    }
}
