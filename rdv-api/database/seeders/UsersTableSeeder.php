<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::insert(
            [
                [
                  "fname" => "admin fname",
                  "lname" => "admin lname",
                  "password" => Hash::make("P@ssword123"),
                  "email" => rand(1,9999999)."@exemple.fr",
                  "address" => "22 anafa",
                  "date_birth"=>date("Y-m-d H:i:s"),
                  "created_at" => now()
                ],
            ]
        );
    }
}
