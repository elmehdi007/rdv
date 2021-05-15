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
class CityRepository extends BaseRepository {

    /**
     * UserRepository constructor.
     * @param City $model
     */
    public function __construct(\App\Models\City $model, Request $request) {
        parent::__construct($model, $request);
        $this->model = $model;
    }
}
