<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\School;
use App\Services\SchoolApiService;

$school = School::first();

$query = "DESCRIBE gtks";
try {
    $result = SchoolApiService::executeRawQuery($school, $query);
    if (isset($result['data'])) {
        echo "Columns in gtks table:\n";
        foreach ($result['data'] as $col) {
            $col = (array)$col;
            echo "- " . ($col['Field'] ?? $col['column_name'] ?? 'unknown') . "\n";
        }
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
