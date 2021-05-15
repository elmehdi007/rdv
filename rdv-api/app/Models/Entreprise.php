<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;

class Entreprise extends Model
{
    use HasFactory;
    use Notifiable;
    use SoftDeletes;

    protected $table = "entreprises";
    protected $fillable = [
        "email", "address", "phone", "id_city", 
        "root_entreprise_folder", "stored_avatar_name", "avatar_origine_name","rc","name",
        "type_entreprise","form_juridique","created_at", "updated_at", "deleted_at"
    ];
    
}
