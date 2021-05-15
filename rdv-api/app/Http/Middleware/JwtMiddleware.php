<?php

namespace App\Http\Middleware;

use Closure;
use JWTAuth;

class JwtMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $response = array("code_status" => null, "text_status" => null, "text_response" => "", "data_source" => null);
        try {
            $user = JWTAuth::parseToken()->authenticate();
        } catch (Exception $e) {
            if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenInvalidException) {
                $response["code_status"] = 401;
                $response["text_status"] = "401 Unauthorized";
                $response["text_response"] = "Token is Invalid";
                return   response()->json(compact('response'), $response["code_status"]);;
            } else if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenExpiredException) {
                $response["code_status"] = 401;
                $response["text_status"] = "401 Unauthorized";
                $response["text_response"] = "Token is Expired";
                return   response()->json(compact('response'), $response["code_status"]);;
            } else {
                $response["code_status"] = 401;
                $response["text_status"] = "401 Unauthorized";
                $response["text_response"] = "Authorization Token not found";
                return   response()->json(compact('response'), $response["code_status"]);;
            }
        }

        return $next($request);
    }
}
