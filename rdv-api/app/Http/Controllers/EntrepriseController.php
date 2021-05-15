<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
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
use App\Repositories\ClientProviderRepository;
use App\Repositories\EntrepriseRepository;
use DB;
use Throwable;
use Illuminate\Support\Facades\Storage;
use File;

class EntrepriseController extends Controller {

    private $entrepriseRepository;
    private $clientProviderRepository;
    private $helpers;

    public function __construct(EntrepriseRepository $entrepriseRepository,ClientProviderRepository $clientProviderRepository,Helpers $helpers) {
        $this->entrepriseRepository = $entrepriseRepository;
        $this->clientProviderRepository = $clientProviderRepository;
        $this->helpers = $helpers;
    }


    public function create(Request $request) {
        $response = null;
        $params = [];

        try {
            $params = array_merge($request->only(['id_city',"id_country","email","address","phone","rc","type_entreprise","form_juridique","name"]), ['created_at' => now(), 'updated_at' => null]);
            $this->entrepriseRepository->create($params);
            $response = Response::json(['message' => __("Entreprise crée")], ResponseData::OK);
        } catch (Throwable $th) {
          $response = Response::json(['message' => ($th->getCode() != ResponseData::USER_EXCEPTION) ? "Erreur interne du serveur" : $th->getMessage()], ResponseData::ERROR);
        } finally {
            return $response;
        }
    }

    public function update(Request $request,int $id) {
        $response = null;
        $params = [];

        try {
            $params = array_merge($request->only(['id_city',"id_country","email","address","phone","rc","type_entreprise","form_juridique","name"]), ['created_at' => now(), 'updated_at' => null]);
            $this->entrepriseRepository->update($params, $id);
            $response = Response::json(['message' => __("Entreprise modfier")], ResponseData::OK);
        } catch (Throwable $th) {
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

            $entreprise= $this->entrepriseRepository->search(["entreprises.*"], $condition);
            $resultData = new ResponseData($entreprise, $this->entrepriseRepository->count($condition));
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

            $users = $this->entrepriseRepository->searching(["entreprises.id","entreprises.name","email","address","phone","id_city","stored_avatar_name","rc","type_entreprise","form_juridique", "cities.name as city","countries.name as country","cities.id as id_city","countries.id as id_country"], $condition, $count);
            $resultData = new ResponseData($users, $count);
            $response = Response::json($resultData->getResponseDataToArray(), ResponseData::OK);
        } catch (Throwable $th) {
            dd($th);
            $response = Response::json(['message' => __("Erreur interne du serveur")], ResponseData::ERROR);
        } finally {
            return $response;
        }
    }

    public function getProviderAssociedClientByClientId(Request $request){
        // declaration
        $response = null;
        $condition = [];
        $id_client = $request->get("id_client");

        //traitement
        try {

            $condition[] = ["id_client", $id_client];
            $entreprise = $this->clientProviderRepository->search(["id_entreprise"],$condition);
            $resultData = new ResponseData($entreprise, $entreprise->count());
            $response = Response::json($resultData->getResponseDataToArray(), ResponseData::OK);
        } catch (Throwable $th) {
            dd($th);
            $response = Response::json(['message' => __("Erreur interne du serveur")], ResponseData::ERROR);
        } finally {
            return $response;
        }
    }

    public function associateProvider(Request $request){
        // declaration
        $response = null;
        $condition = [];
        $id_client = $request->get("id_client");
        $ids_providers = $request->get("ids_providers",[]);

        //traitement
        try {
            DB::beginTransaction();
            $condition[] = ["id_client", $id_client];
            foreach ($ids_providers as $key => $id_provider) {
                $this->clientProviderRepository->associateClientTofournisseur( $id_client,$id_provider);
            }
            $response = Response::json(['message' => __("provider associé")], ResponseData::OK);
            DB::commit();
        } catch (Throwable $th) {
            DB::rollBack();
            $response = Response::json(['message' => __("Erreur interne du serveur")], ResponseData::ERROR);
            dd($th);
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

        if ($this->entrepriseRepository->find($id)) {
            $this->entrepriseRepository->delete($id);
            $response = Response::json(['message' => __('entreprise suprimé')], ResponseData::DELETED);
        } 
        
        else {
            throw new Exception(__("imposible de supprimer l'entreprise; elle n'existe pas"), ResponseData::USER_EXCEPTION);
            $response = Response::json(['message' => __("imposible de supprimer l'entreprise; elle n'existe pas")], ResponseData::ERROR);
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
