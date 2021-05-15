<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class Role extends Model {

    use SoftDeletes;

    protected $table = "roles";
    protected $fillable = ["name", 'id_user', "id_role", "created_at", "updated_at", "deleted_at"];

}
