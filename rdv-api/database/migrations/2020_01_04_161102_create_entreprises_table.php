<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEntreprisesTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('entreprises', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('email', 50)->unique();
            $table->string('address', 256)->nullable();
            $table->string('name', 256)->nullable();
            $table->string('phone', 50)->nullable();
            $table->smallInteger('id_city')->nullable();
            $table->string('password', 256);
            $table->string('root_entreprise_folder', 256)->nullable();
            $table->string('stored_avatar_name', 356)->nullable();
            $table->string('avatar_origine_name', 256)->nullable();
            $table->string('rc', 10)->nullable();
            $table->enum('type_entreprise', ['client', 'prodvider']);
            $table->enum('form_juridique', ['SA', 'SARL',"AU"]);
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
