<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Country;

class CountriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $now = now();
        Country::insert(
            [
                [
                  "name" => "Maroc",
                  "created_at" => $now
                ],
                [
                  "name" => "Italy",
                  "created_at" => $now
                ],
                [
                  "name" => "France",
                  "created_at" => $now
                ],
            ]
        );
    }
}
