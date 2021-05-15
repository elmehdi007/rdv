<?php

namespace App\Repositories;

use App\Models\ClientProvider;
use App\Models\Entreprise;
use App\Traits\UploadAble;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Database\QueryException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Doctrine\Instantiator\Exception\InvalidArgumentException;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

/**
 * Class EntrepriseRepository
 *
 * @package \App\Repositories
 */
class ClientProviderRepository extends BaseRepository {
    //use UploadAble;

    /**
     * EntrepriseRepository constructor.
     * @param User $model
     */
    public function __construct(ClientProvider $model, Request $request) {
        parent::__construct($model, $request);
        $this->model = $model;
    }

    /**
     * @param array $columns
     * @param string $orderBy
     * @param string $sortBy
     * @return mixed
     */
    public function searching($columns = array('*'), $condition = [],&$count) {}

    /**
     * @param array $columns
     * @param string $orderBy
     * @param string $sortBy
     * @return mixed
     */
    public function getProviderAssociedClientByClientId($id_client,$columns = array('*'), $condition = []) {
        $rows = $this->model
                ->where($condition)->orderBy($this->sortBy, $this->sortDir);

        $count = $rows->count();
        return $rows->get($columns);
    }

    public function deleteByIdClientEtIdProvider(int $id_client ,int $id_provider){
        $state = false;
        if ($this->model->where("id_client", $id_client)
        ->where("id_entreprise", $id_provider)->count() > 0) {

            $state = $this->model->where("id_client", $id_client)
            ->where("id_entreprise", $id_provider)->delete();
        }

        return $state;
    }

    public function associateClientTofournisseur(int $id_client ,int $id_provider){

        $this->deleteByIdClientEtIdProvider( $id_client , $id_provider);
        $this->create(["id_client"=>$id_client,"id_entreprise"=> $id_provider]);
    }
}
