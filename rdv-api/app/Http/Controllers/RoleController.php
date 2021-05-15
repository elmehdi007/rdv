<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\RoleRepository;
use App\Repositories\RoleUserRepository;
use App\Helpers\ResponseData;
use Response;
use Throwable;
use DB;

class RoleController extends Controller {

    private $roleRepositories;
    private $roleUserRepositories;

    public function __construct(RoleRepository $roleRepositories, RoleUserRepository $roleUserRepositories) {
        $this->roleRepositories = $roleRepositories;
        $this->roleUserRepositories = $roleUserRepositories;
    }

    public function search(Request $request) {

        //declaration
        $response = null;
        $condition = [];
        $name = null;

        //trailement
        try {
            $name = $request->get("name",null);
            if (isset($name)) {
                  $condition[] = array("name", "=", '' . $name . '');
            }
            $roles = $this->roleRepositories->search(["name","id"], $condition);
            $resultData = new ResponseData($roles, $this->roleRepositories->count($condition));
            $response = Response::json($resultData->getResponseDataToArray(), ResponseData::OK);
        } catch (Throwable $th) {
          $response = Response::json(['message' => ($th->getCode() != ResponseData::USER_EXCEPTION) ? "Erreur interne du serveur" : $th->getMessage()], ResponseData::ERROR);
        } finally {
            return $response;
        }
    }

    public function create(Request $request) {
        $response = null;

        try {
            $this->roleRepositories->create(array_merge($request->only(['name']), ['created_at' => now(), 'updated_at' => null]));
            $response = Response::json(['message' => __("Rôle crée")], ResponseData::OK);
        } catch (Throwable $th) {
          $response = Response::json(['message' => ($th->getCode() != ResponseData::USER_EXCEPTION) ? "Erreur interne du serveur" : $th->getMessage()], ResponseData::ERROR);
        } finally {
            return $response;
        }
    }

    public function update(Request $request,int $id) {
        $response = null;

        try {
            $this->roleRepositories->update(array_merge($request->only(['name'])), $id);
            $response = Response::json(['message' => __("Rôle modfier")], ResponseData::OK);
        } catch (Throwable $th) {
          $response = Response::json(['message' => ($th->getCode() != ResponseData::USER_EXCEPTION) ? "Erreur interne du serveur" : $th->getMessage()], ResponseData::ERROR);
        } finally {
            return $response;
        }
    }

    public function delete(Request $request,int $id) {

       //declaration
        $response = null;

        try {
            $this->roleRepositories->delete($id);
            $response = Response::json(['message' => __("Rôle suprimé")], ResponseData::OK);
        } catch (Throwable $th) {
            $response = Response::json(['message' => ($th->getCode() != ResponseData::USER_EXCEPTION) ? "Erreur interne du serveur" : $th->getMessage()], ResponseData::ERROR);
        } finally {
            return $response;
        }
    }

    public function addRolesToUser(Request $request) {

        //declaration
        $response = null;
        $id_user = $request->get("id_user");
        //ids_roles
        //traitement
        try {
            DB::beginTransaction();

            $this->roleUserRepositories->clearUserRole($id_user);
            foreach ($request->get("ids_roles",[]) as $key => $id_role) {
                  if (!$this->roleUserRepositories->checkRoleAssocierToUser($id_user, $id_role)) {
                      $this->roleUserRepositories->create(['id_user'=> $id_user, 'id_role' => $id_role,'created_at' => now(), 'updated_at' => null]);
                  }
            }

            $response = Response::json(['message' => __("Role associé")], ResponseData::OK);
            DB::commit();
        } catch (Throwable $th) {
          DB::rollback();
          $response = Response::json(['message' => ($th->getCode() != ResponseData::USER_EXCEPTION) ? "Erreur interne du serveur" : $th->getMessage()], ResponseData::ERROR);
        } finally {
            return $response;
        }
    }

}
