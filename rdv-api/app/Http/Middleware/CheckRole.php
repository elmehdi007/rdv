<?php

namespace App\Http\Middleware;

use Closure;
use JWTAuth;
use Illuminate\Http\Request;

class CheckRole {

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next) {
        $response = array("code_status" => 401, "text_status" => null, "text_response" => null);
        try {
            // route api roles
            $actions = $request->route()->getAction('roles');
            $roles = (JWTAuth::parseToken()->getPayload()->get('ids_roles'));

            if ($roles == null) {
                $response["code_status"] = 401;
                $response["text_status"] = "401 Unauthorized";
                $response["text_response"] = "Access Denied";
                return response()->json(compact('response'), $response["code_status"]);
            } else if (!$this->searchRole($roles, $actions)) {
                $response["code_status"] = 401;
                $response["text_status"] = "401 Unauthorized";
                $response["text_response"] = "Access Denied";
                return response()->json(compact('response'), $response["code_status"]);
            }

            return $next($request);
        } catch (Exception $e) {
            $response["code_status"] = 401;
            $response["text_status"] = "401 Unauthorized";
            $response["text_response"] = "Access Denied";
            return response()->json(compact('response'), $response["code_status"]);
        }
    }

    private function searchRole($role, $actions) {
        foreach ($role as $key => $value) {
            if (in_array($role[$key], $actions))
                return true;
        }

        return false;
    }

}
