<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Alert extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "alerts";
    protected $fillable = ["id_client","title","description", "date_alert","created_at", "updated_at", "deleted_at"];
}
