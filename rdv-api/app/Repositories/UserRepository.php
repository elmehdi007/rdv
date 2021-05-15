<?php

namespace App\Repositories;

use App\Traits\UploadAble;
use App\Models\User;
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
class UserRepository extends BaseRepository {
//use UploadAble;

    /**
     * UserRepository constructor.
     * @param User $model
     */
    public function __construct(User $model, Request $request) {
        parent::__construct($model, $request);
        $this->model = $model;
    }

    /**
     * @param array $columns
     * @param string $orderBy
     * @param string $sortBy
     * @return mixed
     */
    public function searching($columns = array('*'), $condition = [],&$count) {
        $rows = $this->model
                //->leftjoin("roles_users","roles_users.id_user","users.id")
                //->leftjoin("roles","roles.id","roles_users.id_role")
                ->leftjoin("cities","cities.id","users.id_city")
                ->leftjoin("countries","countries.id","cities.id_country")
                ->where($condition)->orderBy($this->sortBy, $this->sortDir);

        $count = $rows->count();

        if (false == $this->isAllRecorder){
                    $rows = $rows->skip($this->skip);
                    $rows = $rows->take($this->take);
        }

        return $rows->get($columns);
    }

    /**
     * @param array $attributes
     * @param int $id
     * @return bool
     */
    public function updatePassword($password, int $id): bool {
        $state = false;
        if ($this->find($id))
            $state = $this->find($id)->update(["password"=>$password,'updated_at' => now()]);
        return $state;
    }

      /**
         * @param array $attributes
         * @param int $id
         * @return
         */
     public function findWidthCityAndCountryByEmail(string $email) {
       $rows = $this->model
               ->leftjoin("cities","cities.id","users.id_city")
               ->leftjoin("countries","countries.id","cities.id_country")
               ->where("users.email",$email);
      return $rows->first(["lname","fname","date_birth","id_city","address","phone","email","date_birth","users.id","cities.id as id_city","countries.id as id_country"]);
    }

    /**
       * @param array $attributes
       * @param int $id
       * @return
       */
   public function findByEmail(string $email) {
     $rows = $this->model
             ->where("users.email",$email);
    return $rows->first(["lname","fname","date_birth","id_city","address","phone","email","date_birth","users.id","password"]);
  }


  /**
   * @param array $columns
   * @param string $orderBy
   * @param string $sortBy
   * @return mixed
   */
  public function getUserRoles($id_user,$columns = array('*')) {
      $rows = $this->model
              ->leftjoin("roles_users","roles_users.id_user","users.id")
              ->leftjoin("roles","roles.id","roles_users.id_role")
              ->where([["roles_users.id_user",$id_user]]);
      return $rows->distinct()->get($columns);
  }

  public function getEntrepriseClientAssocier($id_user,$columns = array('*')){
        $rows = $this->model
        ->leftjoin("entreprise_users","entreprise_users.id_user","users.id")
        ->leftjoin("entreprises","entreprises.id","entreprise_users.id_entreprise")
        ->where([["users.id",$id_user]])
        ->where("entreprises.type_entreprise","clients");

        return $rows->select($columns)->get($columns);      
  }

  public function getEntrepriseProviderAssocier($id_user,$columns = array('*')){

    $rows = $this->model
    ->leftjoin("entreprise_users","entreprise_users.id_user","users.id")
    ->leftjoin("entreprises","entreprises.id","entreprise_users.id_entreprise")
    ->where([["users.id",$id_user]])
    ->where("entreprises.type_entreprise","prodvider");

    return $rows->select($columns)->get($columns); 
  }

}
