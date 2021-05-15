<?php

namespace App\Repositories;

use App\Traits\UploadAble;
use App\Models\User;
use App\Models\RoleUser;
use Illuminate\Http\UploadedFile;
use Illuminate\Database\QueryException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Doctrine\Instantiator\Exception\InvalidArgumentException;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

/**
 * Class UserRepository
 *
 * @package \App\Repositories
 */
class RoleUserRepository extends BaseRepository {

    /**
     * UserRepository constructor.
     * @param Role $model
     */
    public function __construct(\App\Models\RoleUser $model, Request $request) {
        parent::__construct($model, $request);
        $this->model = $model;
    }

    /**
     * @param array $columns
     * @param string $orderBy
     * @param string $sortBy
     * @return mixed
     */
    public function checkRoleAssocierToUser($id_user, $id_role): bool {
        $state = $this->model->where(["id_user" => $id_user, "id_role" => $id_role])->count();
        return ($state > 0) ? true : false;
    }

    /**
     * @param array $columns
     * @param string $orderBy
     * @param string $sortBy
     * @return mixed
     */
    public function clearUserRole($id_user) {
         $this->model->where("id_user",$id_user)->delete();
    }

}
