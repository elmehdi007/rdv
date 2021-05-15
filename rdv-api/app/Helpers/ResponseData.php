<?php

namespace App\Helpers;

use Response;
use Illuminate\Database\Eloquent\Collection;

/**
 * Class ResultData
 *
 * @package \App\Helpers
 */
class ResponseData extends Response {

    const CREATED = 201;
    const DELETED = 200;
    const UPDATED = 200;
    const OK = 200;
    const ERROR = 500;
    const UNAUTHORIZED = 401;
    const FORBIDEN = 403;
    const USER_EXCEPTION = -111006;

    protected $row = [];
    protected $total_without_pagination = 0;
    protected $messageApi = "";

    public function __construct(Collection $row = null, int $total_without_pagination = null) {
        $this->row = $row ?? [];
        $this->total_without_pagination = ($total_without_pagination > 0) ? $total_without_pagination : 0;
    }

    public function setMessageApiToArray($message) {
        $this->messageApi = "$message";
    }

    public function getResponseMessageApiToArray() {
        $array = array("message" => __($this->messageApi));
        return $array;
    }

    public function getRows(): Collection {
        return $this->row;
    }

    public function getTotalWithoutPagination(): int {
        return $this->total_without_pagination;
    }

    public function getResponseDataToArray(): array {
        $array = array("data" => array("rows" => $this->getRows(), "total_without_filter" => $this->getTotalWithoutPagination()));
        return $array;
    }

}
