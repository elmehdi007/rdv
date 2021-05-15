<?php

namespace App\Models;

use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class User extends Authenticatable implements JWTSubject {

    use Notifiable;
    use SoftDeletes;
    //use EntrustuserTrait;

    protected $table = "users";
    protected $fillable = [
        "fname", "lname", "gender", "date_birth", "id_city", "root_user_folder",
        "address", "function", "phone", "email", "password", "stored_avatar_name", "avatar_origine_name",
        "id_entreprise","created_at", "updated_at", "deleted_at"
    ];
    
    protected $hidden = ['password'];

    public function getJWTIdentifier() {
        return $this->getKey();
    }

    public function getJWTCustomClaims() {
        $ids_roles = RoleUser::where(["id_user" => $this->id])->select('id_role')->get()->toArray();
        foreach ($ids_roles as $key => $value) {
            $ids_roles[$key] = $ids_roles[$key]["id_role"];
        }

        return [
            'ids_roles' => $ids_roles,
            'id_user' => $this->id,
        ];
    }

}
