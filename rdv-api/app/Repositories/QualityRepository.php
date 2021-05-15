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
class QualityRepository extends BaseRepository {

    /**
     * UserRepository constructor.
     * @param City $model
     */
    public function __construct(\App\Models\Qualite $model, Request $request) {
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
                ->leftjoin("entreprises as clients","clients.id","qualities.id_client")
                ->where($condition)->orderBy($this->sortBy, $this->sortDir);

        $count = $rows->count();

        if (false == $this->isAllRecorder){
                    $rows = $rows->skip($this->skip);
                    $rows = $rows->take($this->take);
        }

        return $rows->get($columns);
    }
}
