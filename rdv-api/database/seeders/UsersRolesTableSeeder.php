<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RoleUser;

class UsersRolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        RoleUser::insert(
            [
                [
                  "id_user" => 1,
                  "id_role" => 1,
                  "created_at" => now()
                ]
            ]
        );
    }
}
