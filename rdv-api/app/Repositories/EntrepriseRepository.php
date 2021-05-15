<?php

namespace App\Repositories;

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
class EntrepriseRepository extends BaseRepository {
    //use UploadAble;

    /**
     * EntrepriseRepository constructor.
     * @param User $model
     */
    public function __construct(Entreprise $model, Request $request) {
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
                ->leftjoin("cities","cities.id","entreprises.id_city")
                ->leftjoin("countries","countries.id","cities.id_country")
                ->where($condition)->orderBy($this->sortBy, $this->sortDir);

        $count = $rows->count();

        if (false == $this->isAllRecorder){
                    $rows = $rows->skip($this->skip);
                    $rows = $rows->take($this->take);
        }

        return $rows->get($columns);
    }
}
