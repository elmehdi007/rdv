<?php

use App\Http\Controllers\EntrepriseController;
use App\Http\Controllers\UserController;

Route::post('/user/authenticate', "UserController@authenticate");
Route::post('/user/api-token-crypt-id', 'UserController@test');
Route::post('/user/register_', [UserController::class, 'register']);
Route::get('/user/search_', [UserController::class, 'searching']);

Route::group( ['middleware' => ['jwt.verify']], function () {
    //////////////////////////////////////////// crud users ////////////////////////////////////////////
    Route::post('/user/register', [
        'uses' => 'UserController@register' ,
        'middleware' => 'check.jwt.role',
        'roles' => [1]
    ]);

    Route::delete('/user/delete/{id}', [
        'uses' => 'UserController@delete',
        'middleware' => 'check.jwt.role',
        'roles' => [1]
    ]);

    Route::put('/user/update/{id}', [
        'uses' => 'UserController@update',
        'middleware' => 'check.jwt.role',
        'roles' => [1]
    ]);

    Route::post('/user/update-avatar/{id}', [
        'uses' => 'UserController@updateAvatar',
        'middleware' => 'check.jwt.role',
        'roles' => [1]
    ]);

    Route::put('/user/update-password/{id}', [
        'uses' => 'UserController@updatePassword',
        'middleware' => 'check.jwt.role',
        'roles' => [1]
    ]);

    Route::get('/user/search', [
        'uses' => 'UserController@search',
        'middleware' => 'check.jwt.role',
        'roles' => [1]
    ]);

    Route::get('/user/searching', [
        'uses' => 'UserController@searching',
        'middleware' => 'check.jwt.role',
        'roles' => [1]
    ]);

    Route::get('/user/get-user-roles', [
        'uses' => 'UserController@getUserRoles',
        'middleware' => 'check.jwt.role',
        'roles' => [1,2,3]
    ]);
    

    //////////////////////////////////////////// crud entrepise ////////////////////////////////////////////
    Route::get('/entreprise/search', [
        'uses' => 'EntrepriseController@search',
        'middleware' => 'check.jwt.role',
        'roles' => [1,2,3]
    ]);

    Route::get('/entreprise/searching', [
        'uses' => 'EntrepriseController@searching',
        'middleware' => 'check.jwt.role',
        'roles' => [1,2,3]
    ]);

    Route::post('/entreprise/create/', [
        'uses' => 'EntrepriseController@create',
        'middleware' => 'check.jwt.role',
        'roles' => [1,2,3]
    ]);

    Route::put('/entreprise/update/{id}', [
        'uses' => 'EntrepriseController@update',
        'middleware' => 'check.jwt.role',
        'roles' => [1,2,3]
    ]);

    Route::delete('/entreprise/delete/{id}', [
        'uses' => 'EntrepriseController@delete',
        'middleware' => 'check.jwt.role',
        'roles' => [1,2,3]
    ]);

    Route::get('/entreprise/getProviderAssociedClient/', [
        'uses' => 'EntrepriseController@getProviderAssociedClientByClientId',
        'middleware' => 'check.jwt.role',
        'roles' => [1,2,3]
    ]);

    Route::post('/entreprise/associateProvider/', [
        'uses' => 'EntrepriseController@associateProvider',
        'middleware' => 'check.jwt.role',
        'roles' => [1,2,3]
    ]);

    //Route::get('/user/getEntrepriseProviderAssocier/{id_user}', [UserController::class, 'getEntrepriseProviderAssocier']);
    //Route::get('/user/getEntrepriseClientAssocier/{id_user}', [UserController::class, 'getEntrepriseClientAssocier']);
    
    //////////////////////////////////////////// crud appointment ////////////////////////////////////////////

    Route::get('/appointment/searching/', [
        'uses' => 'AppoitmentController@searching',
        'middleware' => 'check.jwt.role',
        'roles' => [1,2,3]
    ]);

    Route::put('/appointment/update/{id}', [
        'uses' => 'AppoitmentController@update',
        'middleware' => 'check.jwt.role',
        'roles' => [1,2,3]
    ]);

    Route::post('/appointment/create/', [
        'uses' => 'AppoitmentController@create',
        'middleware' => 'check.jwt.role',
        'roles' => [1,2,3]
    ]);

    Route::delete('/appointment/delete/{id}', [
        'uses' => 'AppoitmentController@delete',
        'middleware' => 'check.jwt.role',
        'roles' => [1,2,3]
    ]);

    //////////////////////////////////////////// crud alertt ////////////////////////////////////////////
  
    Route::get('/alert/searching/', [
        'uses' => 'AlertController@searching',
        'middleware' => 'check.jwt.role',
        'roles' => [1,2,3]
    ]);

    Route::put('/alert/update/{id}', [
        'uses' => 'AlertController@update',
        'middleware' => 'check.jwt.role',
        'roles' => [1,2,3]
    ]);

    Route::post('/alert/create/', [
        'uses' => 'AlertController@create',
        'middleware' => 'check.jwt.role',
        'roles' => [1,2,3]
    ]);

    Route::delete('/alert/delete/{id}', [
        'uses' => 'AlertController@delete',
        'middleware' => 'check.jwt.role',
        'roles' => [1,2,3]
    ]);

    //////////////////////////////////////////// crud qualty ////////////////////////////////////////////
    Route::get('/quality/searching/', [
        'uses' => 'QualiteController@searching',
        'middleware' => 'check.jwt.role',
        'roles' => [1,2,3]
    ]);

    Route::put('/quality/update/{id}', [
        'uses' => 'QualiteController@update',
        'middleware' => 'check.jwt.role',
        'roles' => [1,2,3]
    ]);

    Route::post('/quality/create/', [
        'uses' => 'QualiteController@create',
        'middleware' => 'check.jwt.role',
        'roles' => [1,2,3]
    ]);

    Route::delete('/quality/delete/{id}', [
        'uses' => 'QualiteController@delete',
        'middleware' => 'check.jwt.role',
        'roles' => [1,2,3]
    ]);

    //////////////////////////////////////////// crud country ////////////////////////////////////////////
    Route::get('/country/search', [
        'uses' => 'CountryController@search',
        'middleware' => 'check.jwt.role',
        'roles' => [1,2,3]
    ]);

    Route::get('/country/city-by-country/', [
        'uses' => 'CountryController@getCityByCountry',
        'middleware' => 'check.jwt.role',
        'roles' => [1,2,3]
    ]);
    //////////////////////////////////////////// crud role ////////////////////////////////////////////
    Route::get('/role/search', [
        'uses' => 'RoleController@search',
        'middleware' => 'check.jwt.role',
        'roles' => [1,2,3]
    ]);

    Route::post('/role/link-roles-to-user', [
        'uses' => 'RoleController@addRolesToUser',
        'middleware' => 'check.jwt.role',
        'roles' => [1]
    ]);

    Route::post('/role/create', [
        'uses' => 'RoleController@create',
        'middleware' => 'check.jwt.role',
        'roles' => [1]
    ]);

    Route::put('/role/update/{id}', [
        'uses' => 'RoleController@update',
        'middleware' => 'check.jwt.role',
        'roles' => [1]
    ]);

    Route::delete('/role/delete/{id}', [
        'uses' => 'RoleController@delete',
        'middleware' => 'check.jwt.role',
        'roles' => [1]
    ]);
}
);
