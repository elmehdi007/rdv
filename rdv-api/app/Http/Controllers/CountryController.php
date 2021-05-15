<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\CountryRepository;
use App\Repositories\CityRepository;
use App\Helpers\ResponseData;
use Throwable;
use Response;

class CountryController extends Controller
{

    private $countryRepository;

    public function __construct(CountryRepository $countryRepository,CityRepository $cityRepository) {
        $this->countryRepository = $countryRepository;
        $this->cityRepository = $cityRepository;
    }

    public function search(){
        //declaration
        $response = null;
        $countries = [];
        $condition = [];

        //traitement
        try {
          $countries = $this->countryRepository->search(["id","name"], $condition);
          $resultData = new ResponseData($countries, $this->countryRepository->count($condition));
          $response = Response::json($resultData->getResponseDataToArray(), ResponseData::OK);
        } catch (Throwable $th) {
          $response = Response::json(['message' => __("Erreur interne du serveur")], ResponseData::ERROR);
        }
        finally {
           return $response;
       }
    }

    public function getCityByCountry(Request $request){
        //declaration
        $response = null;
        $condition = [];
        $id_country  = $request->get("id_country");

        //traitement
        try {
          $condition[] = array("id_country", "=",  $id_country );

          $countries = $this->cityRepository->search(["id","name"], $condition);
          $resultData = new ResponseData($countries, $this->cityRepository->count($condition));
          $response = Response::json($resultData->getResponseDataToArray(), ResponseData::OK);
        } catch (Throwable $th) {
          $response = Response::json(['message' => __("Erreur interne du serveur")], ResponseData::ERROR);
        }
        finally {
           return $response;
       }
    }

}
