<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$profile = \App\Models\StoreProfile::first();
if ($profile) {
    print_r($profile->toArray());
} else {
    echo "No profile found.\n";
}
