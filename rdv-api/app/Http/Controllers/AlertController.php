<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Helpers\ResponseData;
use App\Repositories\AlertRepository;
use Carbon\Carbon;
use Response;
use Throwable;

class AlertController extends Controller {

    private $alertRepository;

    public function __construct(AlertRepository $alertRepository) {
        $this->alertRepository = $alertRepository;
    }

    public function searching(Request $request) {

        //declaration
        $response = null;
        $condition = [];
        $title = $request->get('title');
        $description = $request->get('description');
        $id_client = (int)$request->get('id_client');

        //trailement
        try {
            
            if (isset($title)) {
                $condition[] = array("alerts.title", "=", $title);
            }

            if (isset($description)) {
                $condition[] = array("alerts.description", "=", $description);
            }

            if (isset($id_client) && $id_client > 0) {
                $condition[] = array("alerts.id_client", "=", $id_client);
            }

            $alerts = $this->alertRepository->searching(["alerts.id","alerts.title",
                                                        "alerts.description","alerts.created_at",
                                                        "clients.name as client_name","clients.id as id_client","date_alert"
                                                        ], $condition);
            $resultData = new ResponseData($alerts, $this->alertRepository->count($condition));
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
            $this->alertRepository->create(array_merge($request->only(['title','description',"id_client"]), 
                                           ["date_alert"=>Carbon::parse($request->get("date_appointment"), 'UTC')],
                                           ['updated_at' => null]));
     
            $response = Response::json(['message' => __("Alert crée")], ResponseData::OK);
        } catch (Throwable $th) {
          $response = Response::json(['message' => ($th->getCode() != ResponseData::USER_EXCEPTION) ? "Erreur interne du serveur" : $th->getMessage()], ResponseData::ERROR);
        } finally {
            return $response;
        }
    }

    public function update(Request $request,int $id) {
        $response = null;

        try {
            $this->alertRepository->update(array_merge($request->only(['title',"description"]),
                                           ["date_alert"=>Carbon::parse($request->get("date_appointment"), 'UTC')]), $id);
            $response = Response::json(['message' => __("Alert modfier")], ResponseData::OK);
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
            $this->alertRepository->delete($id);
            $response = Response::json(['message' => __("Alert suprimé")], ResponseData::OK);
        } catch (Throwable $th) {
            $response = Response::json(['message' => ($th->getCode() != ResponseData::USER_EXCEPTION) ? "Erreur interne du serveur" : $th->getMessage()], ResponseData::ERROR);
        } finally {
            return $response;
        }
    }


}
