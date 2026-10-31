<?php
namespace Database\Seeders;

use App\Models\EvacuationCenter;
use Illuminate\Database\Seeder;

/**
 * Imports the official LIST OF EVACUATION CENTERS (Abuyog South/North/East districts + municipal centers).
 * Safe to re-run: it matches on center name (update or create) and never deletes anything.
 * Latitude/longitude are intentionally left empty (the source list has none); add them in Admin > Manage > centers.
 */
class EvacuationCenterSeeder extends Seeder
{
    public function run(): void
    {
        // [barangay, facility, units, capacity, agency, remarks, district, status]
        $rows = [
            ['Hampipila', 'Classroom/ Gym', '10', 1400, 'DepEd', 'In Good Condition', 'Abuyog South District', 'open'],
            ['Matagnao', 'Classroom/ Gym', '10', 601, 'DepEd', 'In Good Condition', 'Abuyog South District', 'open'],
            ['Pagsang-an', 'Classroom/ Gym', '8', 1960, 'DepEd', 'In Good Condition', 'Abuyog South District', 'open'],
            ['Odiongan', 'Classroom/ Gym', '5', 1660, 'DepEd', 'In Good Condition', 'Abuyog South District', 'open'],
            ['Capili-an', 'Classroom/ Gym', '9', 907, 'DepEd', 'In Good Condition', 'Abuyog South District', 'open'],
            ['Sta. Fe', 'Classroom', '25', 684, 'DepEd', 'In Good Condition', 'Abuyog South District', 'open'],
            ['Burubud-an', 'Classroom/ Gym', '2', 572, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog South District', 'open'],
            ['Salavacion', 'Classroom/ Gym', '8', 540, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog South District', 'open'],
            ['Laray', 'Classroom/ Gym', '2', 244, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog South District', 'open'],
            ['New Taligue', 'Classroom/ Gym', '6', 388, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog South District', 'open'],
            ['Libertad', 'Classroom/ Gym', '16', 1046, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog South District', 'open'],
            ['Anibongon', 'Classroom/ Gym', '2', 330, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog South District', 'open'],
            ['Nebga', 'Classroom/ Gym', '7', 489, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog South District', 'open'],
            ['Combis', 'Classroom/ Gym', '4', 383, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog South District', 'open'],
            ['Cagbolo', 'Classroom/ Gym', '2', 1003, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog South District', 'open'],
            ['Mahagna', 'Classroom/ Gym', '8', 448, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog South District', 'open'],
            ['Tadoc', 'Classroom/ Gym', '2', 340, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog South District', 'open'],
            ['Maitum', 'Classroom/ Gym', '5', 471, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog South District', 'open'],
            ['Victory', 'Multi-Purpose Hall', '1', 1052, 'BLGU', 'In Good Condition', 'Abuyog South District', 'open'],
            ['Sto. Niño', 'Classroom/ Multi-Purpose Hall', '23', 2644, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog South District', 'open'],
            ['Pinamanagan', 'Classroom/ Gym', '4', 585, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog North District', 'open'],
            ['Mahayahay', 'Classroom/ Gym', '2', 157, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog North District', 'open'],
            ['Tinocolan', 'Classroom/ Gym', '2', 353, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog North District', 'open'],
            ['Old Taligue', 'Classroom/ Gym', '5', 359, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog North District', 'open'],
            ['Parasanon', 'Classroom/ Gym', '5', 679, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog North District', 'open'],
            ['Tuy-a', 'Classroom/ Gym', '6', 709, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog North District', 'open'],
            ['Alangilan', 'Classroom/ Gym', '3', 235, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog North District', 'open'],
            ['Dingle', 'Classroom/ Gym', '6', 643, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog North District', 'open'],
            ['Bayabas', 'Classroom/ Gym', '7', 776, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog North District', 'open'],
            ['Picas Sur', 'Classroom/ Gym', '4', 616, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog North District', 'open'],
            ['Balinsasayao', 'Classroom/ Gym', '13', 2242, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog North District', 'open'],
            ['Paguite', 'Classroom/ Gym', '5', 811, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog North District', 'open'],
            ['Balocawehay', 'Classroom/ Gym', '36', 3439, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog North District', 'open'],
            ['Katipunan', 'Classroom/ Gym', '9', 1078, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog North District', 'open'],
            ['Balocawe', 'Classroom/ Gym', '8', 1602, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog North District', 'open'],
            ['Barayong', 'Classroom/ Gym', '6', 1307, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog North District', 'open'],
            ['Bunga', 'Classroom/ Gym', '9', 1713, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog North District', 'open'],
            ['Guintagbucan', 'Classroom/ Gym', '3', 617, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog North District', 'open'],
            ['San Isidro', 'Classroom/ Gym', '6', 569, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog North District', 'open'],
            ['Bito', 'Classroom/ Gym', '38', 1943, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog North District', 'open'],
            ['Bagacay', 'Classroom/ Multipurpose Hall', '4', 513, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog East District', 'open'],
            ['Nalibunan', 'Multipurpose Hall/ Terminal', '2', 773, 'BLGU', 'In Good Condition', 'Abuyog East District', 'open'],
            ['Can-uguib', 'Gym/ Multipurpose Hall', '2', 1328, 'BLGU', 'In Good Condition', 'Abuyog East District', 'open'],
            ['Loyonsawang', 'Municipal Compound', '12', 1190, 'MLGU/ BLGU', 'In Good Condition', 'Abuyog East District', 'open'],
            ['Buntay', 'Classroom/ Gym/ Church', '20', 2195, 'DepEd', 'In Good Condition', 'Abuyog East District', 'open'],
            ['Tabigue', 'Classroom/ Gym', '7', 893, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog East District', 'open'],
            ['Mag-atubang', 'Classroom/ Gym', '2', 215, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog East District', 'open'],
            ['Can-aporong', 'Classroom/ Gym', '3', 412, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog East District', 'open'],
            ['Cadac-an', 'Classroom/ Gym', '3', 268, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog East District', 'open'],
            ['Tinali-an', 'Classroom/ Gym', '3', 247, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog East District', 'open'],
            ['Buenavista', 'Classroom/ Gym', '7', 524, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog East District', 'open'],
            ['Lawaan', 'Classroom/ Gym', '3', 248, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog East District', 'open'],
            ['Bahay', 'Classroom/ Gym', '3', 157, 'DepEd/ BLGU', 'Unsafe for Landslide', 'Abuyog East District', 'closed'],
            ['Malaguicay', 'Classroom/ Gym', '7', 200, 'DepEd/ BLGU', 'Unsafe for Landslide', 'Abuyog East District', 'closed'],
            ['Buaya', 'Classroom/ Gym', '8', 285, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog East District', 'open'],
            ['San Francisco', 'Classroom/ Gym', '3', 336, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog East District', 'open'],
            ['Sta. Lucia', 'Classroom/ Gym', '3', 319, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog East District', 'open'],
            ['Tib-o', 'Classroom/ Gym', '4', 254, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog East District', 'open'],
            ['San Roque', 'Classroom/ Gym', '7', 351, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog East District', 'open'],
            ['Kikilo', 'Classroom/ Gym', '7', 234, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog East District', 'open'],
            ['Bulak', 'Classroom/ Gym', '5', 629, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog East District', 'open'],
            ['Canamarating', 'Classroom/ Gym', '9', 1100, 'DepEd/ BLGU', 'In Good Condition', 'Abuyog East District', 'open'],
            ['Balocawe', 'LGU-Evacuation Center 1', '1', 200, 'LGU', 'In Good Condition', 'Municipal Evacuation Centers', 'open'],
            ['Balocawe', 'LGU-Evacuation Center 2', '1', 200, 'LGU', 'In Good Condition', 'Municipal Evacuation Centers', 'open'],
            ['Pagsang-an', 'LGU-Evacuation Center 3', '1', 200, 'LGU', 'In Good Condition', 'Municipal Evacuation Centers', 'open'],
            ['Guintagbucan', 'LGU-Evacuation Center 4', '1', 200, 'LGU', 'In Good Condition', 'Municipal Evacuation Centers', 'open'],
            ['Tinali-an', 'OCD Transitional Shelters', '-', 0, 'LGU', 'Ongoing construction', 'Municipal Evacuation Centers', 'closed'],
        ];

        foreach ($rows as [$barangay, $facility, $units, $capacity, $agency, $remarks, $district, $status]) {
            // Details with no dedicated column are kept in the address text so nothing from the list is lost.
            $details = array_filter([$district, $units !== '-' ? "$units unit(s)" : null, $agency, $remarks !== 'In Good Condition' ? $remarks : null]);

            EvacuationCenter::updateOrCreate(
                ['name' => "$barangay - $facility"],
                [
                    'barangay' => $barangay,
                    'address'  => 'Brgy. ' . $barangay . ' · ' . implode(' · ', $details),
                    'capacity' => $capacity,
                    'status'   => $status,
                    // 'occupied' is left untouched on re-run so live numbers are not reset.
                ]
            );
        }
    }
}
