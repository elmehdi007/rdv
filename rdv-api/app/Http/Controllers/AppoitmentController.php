<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
use JWTAuth;
use Exception;
use Response;
use App\Repositories\UserRepository;
use App\Helpers\ResponseData;
use App\Helpers\Helpers;
use App\Models\ClientProvider;
use App\Repositories\AppointmentRepository;
use DB;
use Carbon\Carbon;
use Throwable;

class AppoitmentController extends Controller {

    private $apoitementRepository;
    private $helpers;

    public function __construct(AppointmentRepository $apoitementRepository, Helpers $helpers) {
        $this->apoitementRepository = $apoitementRepository;
        $this->helpers = $helpers;
    }


    public function create(Request $request) {
        $response = null;
        $params = [];

        try {
            $params = array_merge($request->only(['id_provider',"id_client",'title',"description","clef","id_user_created"]),
                                  ["date_appointment"=>Carbon::parse($request->get("date_appointment"), 'UTC')],
                                  ['created_at' =>Carbon::now(), 'updated_at' => null]);
           
           $this->apoitementRepository->create($params);
           
            $response = Response::json(['message' => __("rendez-vous crée")], ResponseData::OK);
        } catch (Throwable $th) {
            dd($th);
          $response = Response::json(['message' => ($th->getCode() != ResponseData::USER_EXCEPTION) ? "Erreur interne du serveur" : $th->getMessage()], ResponseData::ERROR);
        } finally {
            return $response;
        }
    }

    public function update(Request $request,int $id) {
        $response = null;
        $params = [];

        try {
            $params = array_merge($request->only(['id_provider',"status","id_client",'title',
                                  "description","cle","id_user_created"]),["date_appointment"=>Carbon::parse($request->get("date_appointment"), 'UTC')],
                                  ['updated_at' => Carbon::now()]);
            
            $this->apoitementRepository->update($params, $id);
            $response = Response::json(['message' => __("rendez-vous modfier")], ResponseData::OK);
        } catch (Throwable $th) {
            dd($th);
          $response = Response::json(['message' => ($th->getCode() != ResponseData::USER_EXCEPTION) ? "Erreur interne du serveur" : $th->getMessage()], ResponseData::ERROR);
        } finally {
            return $response;
        }
    }

    /**
     * afficher les entreprises
     *
     * @param  \Illuminate\Http\Request  $request
     * @return list
     */
    public function search(Request $request) {

        // declaration
        $name = $request->get('name', null);
        $phone = $request->get('phone', null);
        $email = $request->get('email', null);
        $type = $request->get('type_entreprise', null);
        $response = null;
        $condition = [];

        //traitement
        try {

            if (isset($name)) {
                $condition[] = array("entreprises.name", "=", $name);
            }

            if (isset($phone)) {
                $condition[] = array("entreprises.phone", "=", $phone);
            }

            if (isset($email)) {
                $condition[] = array("entreprises.email", "=", $email);
            }

            if (isset($type)) {
                $condition[] = array("entreprises.type_entreprise", "=", $type);
            }

            $entreprise= $this->apoitementRepository->search(["entreprises.*"], $condition);
            $resultData = new ResponseData($entreprise, $this->apoitementRepository->count($condition));
            $response = Response::json($resultData->getResponseDataToArray(), ResponseData::OK);
        } catch (Throwable $th) {
            $response = Response::json(['message' => __("Erreur interne du serveur")], ResponseData::ERROR);
        } finally {
            return $response;
        }
    }

    /**
     * afficher les entreprises; join avec d'autre table
     *
     * @param  \Illuminate\Http\Request  $request
     * @return list
     */
    public function searching(Request $request) {

        // declaration
        $title = $request->get('title');
        $description = $request->get('description');
        $id_client = (int)$request->get('id_client');
        $id_provider = (int)$request->get('id_provider');
        $response = null;
        $condition = [];
        
        //traitement
        try {

            if (isset($title)) {
                $condition[] = array("appointments.title", "=", $title);
            }

            if (isset($description)) {
                $condition[] = array("appointments.description", "=", $description);
            }

            if (isset($id_client) && $id_client > 0) {
                $condition[] = array("appointments.id_client", "=", $id_client);
            }

            if (isset($id_provider) && $id_provider > 0) {
                $condition[] = array("appointments.id_provider", "=", $id_provider);
            }
            
            $appoitement = $this->apoitementRepository->searching(["appointments.*","client.name as client_name","provider.name as provider_name"], $condition, $count);

            $resultData = new ResponseData($appoitement, $count);
            $response = Response::json($resultData->getResponseDataToArray(), ResponseData::OK);
        } catch (Throwable $th) {
            dd($th);
            $response = Response::json(['message' => __("Erreur interne du serveur")], ResponseData::ERROR);
        } finally {
            return $response;
        }
    }

    /**
     * spprimer entreprsie
     *
     * @param  \Illuminate\Http\Request  $request
     * @return message
     */
    public function delete(Request $request,int $id) {
        //declaration
        $response = null;

        if ($this->apoitementRepository->find($id)) {
            $this->apoitementRepository->delete($id);
            $response = Response::json(['message' => __('Rendez-vous suprimé')], ResponseData::DELETED);
        } 
        
        else {
            throw new Exception(__("imposible de supprimer le Rendez-vous elle n'existe pas"), ResponseData::USER_EXCEPTION);
            $response = Response::json(['message' => __("imposible de supprimer le Rendez-vous; elle n'existe pas")], ResponseData::ERROR);
        }

        // traitement
        try {
       
        } catch (Throwable $e) {
            dd($e);
            $response = Response::json(['message' => ($e->getCode() != ResponseData::USER_EXCEPTION) ? "Erreur interne du serveur" : $e->getMessage()], ResponseData::ERROR);
        } finally {
            return $response;
        }
    }
}
