<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Qualite extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "qualities";
    protected $fillable = ["id_client","id_provider","title","description", "created_at", "updated_at", "deleted_at"];
}
