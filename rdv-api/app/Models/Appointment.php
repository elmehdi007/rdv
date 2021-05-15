<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Appointment extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "appointments";
    protected $fillable = ["id_provider","id_client","title","date_appointment","description","clef","id_user_created" ,"created_at", "updated_at", "deleted_at"];
}
