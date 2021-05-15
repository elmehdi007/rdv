<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('users', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigIncrements('id_entreprise')->nullable();
            $table->string('fname', 50)->nullable();
            $table->string('lname', 50)->nullable();
            $table->string('email', 50)->unique();
            $table->dateTime('email_verified_at')->nullable();
            $table->string('phone', 50)->nullable();
            $table->date('date_birth')->nullable();
            $table->string('address', 256)->nullable();
            $table->smallInteger('id_city')->nullable();
            $table->string('password', 256);
            $table->string('root_user_folder', 256)->nullable();
            $table->string('stored_avatar_name', 356)->nullable();
            $table->string('avatar_origine_name', 256)->nullable();
            $table->dateTime('created_at')->nullable();
            $table->dateTime('updated_at')->nullable();
            $table->dateTime('deleted_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('user');
    }

}
