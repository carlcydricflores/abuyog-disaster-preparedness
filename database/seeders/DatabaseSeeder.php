<?php
namespace Database\Seeders;

use App\Models\{Alert, EvacuationCenter, Guideline, Hotline, User};
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Default admin: CHANGE THE PASSWORD after first login. role uses forceFill (not mass-assignable).
        $admin = User::firstOrNew(['email' => 'admin@abuyog.test']);
        $admin->forceFill(['name' => 'System Admin', 'password' => Hash::make('ChangeMe!2026'), 'role' => 'admin'])->save();
        $user = User::firstOrNew(['email' => 'resident@abuyog.test']);
        $user->forceFill(['name' => 'Sample Resident', 'password' => Hash::make('password123'), 'role' => 'user'])->save();

        // SAMPLE DATA ONLY: replace with real MDRRMO figures, addresses and numbers.
        Alert::firstOrCreate(['title' => 'Sample: Heavy rainfall advisory'], ['user_id' => $admin->id, 'type' => 'flood', 'severity' => 'watch',
            'barangays' => 'Low-lying barangays', 'message' => 'Sample alert. Prepare go-bags and monitor official updates.', 'expires_at' => now()->addDays(3)]);

        foreach ([['Abuyog Central School (sample)', 'Poblacion', 300, 10.7440, 125.0130], ['Barangay Gym (sample)', 'Balocawe', 150, 10.7000, 125.0000]] as [$n, $b, $c, $la, $lo]) {
            EvacuationCenter::firstOrCreate(['name' => $n], ['barangay' => $b, 'capacity' => $c, 'occupied' => 0, 'status' => 'open', 'latitude' => $la, 'longitude' => $lo]);
        }

        Hotline::firstOrCreate(['number' => '911'], ['name' => 'National Emergency Hotline', 'category' => 'emergency']);
        Hotline::firstOrCreate(['number' => '143'], ['name' => 'Philippine Red Cross', 'category' => 'medical']);
        Hotline::firstOrCreate(['name' => 'Abuyog MDRRMO (update number)'], ['number' => '000-000-0000', 'category' => 'disaster']);

        foreach ([['Prepare a go-bag', 'before', 'Pack water, food, flashlight, radio, first-aid kit, medicines and copies of IDs.'],
                  ['Drop, cover and hold on', 'during', 'In an earthquake, get under sturdy furniture and stay away from windows.'],
                  ['Check for hazards', 'after', 'Avoid floodwater and damaged structures. Report hazards through this website.']] as [$t, $c, $b]) {
            Guideline::firstOrCreate(['title' => $t], ['category' => $c, 'body' => $b]);
        }
    }
}
