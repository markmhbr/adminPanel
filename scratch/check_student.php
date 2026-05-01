<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\School;
use App\Services\SchoolApiService;

// Get the first school to test with
$school = School::first();

if (!$school) {
    echo "No school found in database.\n";
    exit;
}

echo "Checking school: {$school->name} ({$school->id})\n";

// Fetch columns
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

    // Fetch one student specifically for qr_token
    $query = "SELECT nama, nisn FROM siswas LIMIT 1"; // check columns first
    $result = SchoolApiService::executeRawQuery($school, $query);
    if (!empty($result['data'])) {
        echo "\nSample student data:\n";
        print_r($result['data'][0]);
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
