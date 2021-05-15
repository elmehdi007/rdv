<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\City;

class CitiesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $now = now();
        City::insert(
            [
                [
                  "name" => "Casablanca",
                  "id_country" => 1,
                  "created_at" => $now
                ],
                [
                  "name" => "Rabat",
                  "id_country" => 1,
                  "created_at" => $now
                ],
                [
                  "name" => "Tanger",
                  "id_country" => 1,
                  "created_at" => $now
                ],
                [
                  "name" => "Fés",
                  "id_country" => 1,
                  "created_at" => $now
                ]
            ]
        );
    }
}
