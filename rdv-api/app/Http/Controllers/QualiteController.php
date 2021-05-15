<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\RoleRepository;
use App\Repositories\RoleUserRepository;
use App\Helpers\ResponseData;
use App\Repositories\AlertRepository;
use App\Repositories\QualityRepository;
use Response;
use Throwable;
use DB;

class QualiteController extends Controller {

    private $qualityRepository;

    public function __construct(QualityRepository $qualityRepository) {
        $this->qualityRepository = $qualityRepository;
    }

    public function searching(Request $request) {

        //declaration
        $response = null;
        $condition = [];
        $title = null;

        //trailement
        try {
            $title = $request->get("title",null);
            if (isset($title)) {
                  $condition[] = array("title", "=", '' . $title . '');
            }

            $roles = $this->qualityRepository->searching(["qualities.title","qualities.id","qualities.description","clients.name as client_name","clients.id as id_client"], $condition, $count);
            $resultData = new ResponseData($roles, $this->qualityRepository->count($condition));
            $response = Response::json($resultData->getResponseDataToArray(), ResponseData::OK);
        } catch (Throwable $th) {
            dd($th);
          $response = Response::json(['message' => ($th->getCode() != ResponseData::USER_EXCEPTION) ? "Erreur interne du serveur" : $th->getMessage()], ResponseData::ERROR);
        } finally {
            return $response;
        }
    }

    public function create(Request $request) {
        $response = null;

        try {
            $this->qualityRepository->create($request->only(['title','description','id_client']));
          
            $response = Response::json(['message' => __("Qualité crée")], ResponseData::OK);
        } catch (Throwable $th) {
            dd($th);
          $response = Response::json(['message' => ($th->getCode() != ResponseData::USER_EXCEPTION) ? "Erreur interne du serveur" : $th->getMessage()], ResponseData::ERROR);
        } finally {
            return $response;
        }
    }

    public function update(Request $request,int $id) {
        $response = null;

        try {
            $this->qualityRepository->update(array_merge($request->only(['title',"description"])), $id);
            $response = Response::json(['message' => __("Qualité modfier")], ResponseData::OK);
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
            $this->qualityRepository->delete($id);
            $response = Response::json(['message' => __("Qualité suprimé")], ResponseData::OK);
        } catch (Throwable $th) {
            $response = Response::json(['message' => ($th->getCode() != ResponseData::USER_EXCEPTION) ? "Erreur interne du serveur" : $th->getMessage()], ResponseData::ERROR);
        } finally {
            return $response;
        }
    }


}
