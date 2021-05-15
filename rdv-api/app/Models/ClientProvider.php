<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class ClientProvider extends Model {

    use SoftDeletes;

    protected $table = "clients_providers";
    protected $fillable = ["id_client", "id_entreprise", "created_at", "updated_at", "deleted_at"];
}
