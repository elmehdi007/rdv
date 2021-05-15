<?php

namespace App\Repositories;

use App\Contracts\BaseContract;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Helpers\ResultData;
use App\Helpers\ResponseJson;
use Carbon\Carbon;
use Illuminate\Http\Request;

/**
 * Class BaseRepository
 *
 * @package \App\Repositories
 */
class BaseRepository implements BaseContract {

    /**
     * @var Model
     */
    protected $model;

    /**
     * @var Request
     */
    protected $request;

    /**
     * @var skip
     */
    protected $skip;

    /**
     * @var take
     */
    protected $take;

    /**
     * @var sortBy
     */
    protected $sortBy;

    /**
     * @var sortDir
     */
    protected $sortDir;

    /**
     * @var isAllRecorder
     */
    protected $isAllRecorder;

    /**
     * BaseRepository constructor.
     * @param Model $model
     */
    public function __construct(Model $model, Request $request) {
      $this->model = $model;
      $this->request = $request;
      $this->skip = $request->get('skip', env("pagination.skip",0));
      $this->take = $request->get('take', env("pagination.take",10));
      $this->sortBy = $request->get('sortBy', env("tri.sortBy","id"));
      $this->sortDir = $request->get('sortDir', env("tri.sortDir","asc"));
      $this->isAllRecorder = $request->get('get_all_recorder', false);
      if($this->sortDir!="desc" && $this->sortDir!="asc") $this->sortDir!="asc";
    }

    /**
     * @param array $attributes
     * @return mixed
     */
    public function create(array $attributes) {
        $attributes = array_merge($attributes,['updated_at'=>null]);

        return $this->model->create($attributes);
    }

    /**
     * @param array $attributes
     * @param int $id
     * @return bool
     */
    public function update(array $attributes, int $id): bool {
        $state = false;
        $attributes = array_merge($attributes,['updated_at'=>Carbon::now()]);
        if ($this->find($id))
            $state = $this->find($id)->update($attributes);
        return $state;
    }

    /**
     * @param array $columns
     * @param string $orderBy
     * @param string $sortBy
     * @return mixed
     */
    public function search($columns = array('*'), $condition = []) {
        $rows = $this->model->where($condition)->orderBy($this->sortBy, $this->sortDir);
        if (false == $this->isAllRecorder){
            if(isset($this->skip)) $rows = $rows->skip($this->skip);
            if(isset($this->take)) $rows = $rows->take($this->take);
        }

        return $rows->select($columns)->get();
    }

    /**
     * @param array $columns
     * @param string $orderBy
     * @param string $sortBy
     * @return mixed
     */
    public function count(array $condition = []) {
        $rows = $this->model;
        if (count($condition) > 0) {
            $rows = $rows->where($condition);
        }
        return $rows->count();
    }

    /**
     * @param int $id
     * @return mixed
     */
    public function find(int $id,$column = ["*"] ) {
        return $this->model->find($id);
    }

    /**
     * @param int $id
     * @return mixed
     */
    public function findBy(string $column, string $val) {
        $condition = [];
        if(isset($column)){
          $condition[]=[ $column,"=",$val];
        }

        return $this->model->where($column)->first();
    }

    /**
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool {
        $state = false;
        if ($this->find($id)) {
            $state = $this->model->find($id)->delete();
        }

        return $state;
    }
}
