<?php
/*header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: X-Requested-With, Content-Type, X-Token-Auth, Authorization, Accept, Origin');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header("Access-Control-Allow-Credentials: true");*/

Route::post('/user/authenticate', "UserController@authenticate");

Route::post('/user/api-token-crypt-id', 'UserController@test');
Route::post('/user/register', 'UserController@register');

Route::group(
    ['middleware' => ['jwt.verify']],
    function () {
        // crud users
        /*Route::post('/user/register', [
            'uses' => 'UserController@register',
            'middleware' => 'check.jwt.role',
            'roles' => ['1']
        ]);*/

        Route::delete('/user/delete', [
            'uses' => 'UserController@deleteUser',
            'middleware' => 'check.jwt.role',
            'roles' => ['1']
        ]);

        Route::put('/user/update', [
            'uses' => 'UserController@updateUser',
            'middleware' => 'check.jwt.role',
            'roles' => ['1']
        ]);

        Route::get('/user/search', [
            'uses' => 'UserController@searchUsers',
            'middleware' => 'check.jwt.role',
            'roles' => ['1']
        ]);

        Route::post('/role/searchRole', [
            'uses' => 'ProfileController@searchRole',
            'middleware' => 'check.jwt.role',
            'roles' => ['1']
        ]);
    }
);
