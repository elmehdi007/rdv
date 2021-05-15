<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use DB;
use App\Models\Role;

class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Role::insert(
            [
                [
                  "name" => "admin",
                  "created_at" => now()
                ],
                [
                  "name" => "user",
                  "created_at" => now()
                ]
            ]
        );
    }
}
