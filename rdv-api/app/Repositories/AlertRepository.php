<?php

namespace App\Repositories;

use App\Traits\UploadAble;
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
class AlertRepository extends BaseRepository {

    /**
     * UserRepository constructor.
     * @param City $model
     */
    public function __construct(\App\Models\Alert $model, Request $request) {
        parent::__construct($model, $request);
        $this->model = $model;
    }

    /**
     * @param array $columns
     * @param string $orderBy
     * @param string $sortBy
     * @return mixed
     */
    public function searching($columns = array('*'), $condition = []) {

        $rows = $this->model->leftJoin("entreprises as clients","clients.id","alerts.id_client")
                      ->where($condition)->where("clients.type_entreprise","client")
                      ->orderBy($this->sortBy, $this->sortDir);

        if (false == $this->isAllRecorder){
            if(isset($this->skip)) $rows = $rows->skip($this->skip);
            if(isset($this->take)) $rows = $rows->take($this->take);
        }

        return $rows->select($columns)->get();
    }
}
