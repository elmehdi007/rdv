<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
use JWTAuth;
use Exception;
use Response;
use App\Repositories\UserRepository;
use App\Helpers\ResponseData;
use App\Helpers\Helpers;
use DB;
use Throwable;
use Illuminate\Support\Facades\Storage;
use File;
use PhpParser\Node\Stmt\TryCatch;
use App\Models\RoleUser;

class UserController extends Controller {

    private $userRepository;
    private $helpers;

    public function __construct(UserRepository $userRepository,Helpers $helpers) {
        $this->userRepository = $userRepository;
        $this->helpers = $helpers;
    }

    /**
     * authentication d'utilisateur
     *
     * @param  \Illuminate\Http\Request  $request
     * @return token
     */
    public function authenticate(Request $request) {

       //declaration
        $token = array(
            "token_value" => null,
            "expiration" => null,
        );
        $response = null;

        try {
            if ($request->get('email') && $request->get('password')) {
                $credentials = $request->only('email', 'password');
                $userFROM =  $this->userRepository->findByEmail($credentials['email']);

                if ($userFROM->count() == 0) {
                    throw new Exception(__("Email invalide"), ResponseData::USER_EXCEPTION);

                } else {
                    if (!Hash::check($credentials['password'], $userFROM->password)) {
                        throw new Exception(__("Password invalide"), ResponseData::USER_EXCEPTION);

                    } else {
                        $token["token_value"] = JWTAuth::fromUser($userFROM);
                        $token["expiration"] = (auth('api')->factory()->getTTL() * 60 / 3600) . ' ' . 'Heure';
                        $user = $this->userRepository->findWidthCityAndCountryByEmail($credentials['email']);
                        $userAuthenticated = array(
                            'lname' => $user->lname,
                            'fname' => $user->fname,
                            'date_birth' => $user->lname,
                            'id_city' => $user->id_city,
                            'address' => $user->address,
                            'phone' => $user->phone,
                            'email' => $user->email,
                            'date_birth' => $user->date_birth,
                            'id_user' => ($user->id),
                            'id_entreprise' => ($user->id_entreprise),
                            'id_country' => ($user->id_country),
                            'roles' => RoleUser::where(["id_user" => $user->id])->select('id_role')->get()
                        );

                        $response = Response::json(
                                        [
                                    'message' => 'Authentification Avec Success',
                                    'token' => $token,
                                    'user_authenticated' => $userAuthenticated
                                        ], ResponseData::OK
                        );
                    }
                }
            } // fin if paramètres valide
            else {
                throw new Exception(__("Parametres Invalides"), ResponseData::USER_EXCEPTION);
            }
        } // fin try
        catch (JWTException $e) {
            $response = Response::json(['message' => ($e->getCode() != ResponseData::USER_EXCEPTION) ? "Erreur interne du serveur" : $e->getMessage()], ResponseData::ERROR);
        } catch (Throwable $e) {
            dd($e);
            $response = Response::json(['message' => ($e->getCode() != ResponseData::USER_EXCEPTION) ? "Erreur interne du serveur" : $e->getMessage()], ($e->getMessage() == __('Password invalide') || $e->getMessage() == __('Email invalide')) ? ResponseData::FORBIDEN : ResponseData::ERROR);
        } finally {
            return $response;
        }
    }

    /**
     * register utilisateur
     *
     * @param  \Illuminate\Http\Request  $request
     * @return message
     */
    public function register(Request $request) {

        //declaration
        $response = null;
        $token = array("token_value" => null, "time_experation_token" => null, "time_experation_token_unit" => 'heure');
        $validator = null;
        $user = null;
        $contentFile = null;
        $now = Carbon::now();
        $formatNow = $now->second . "" . $now->minute . "" . $now->hour . "" . $now->day . "" . $now->month . "" . $now->year . "";
        $stokedAvatarName = "";
        $fname = $request->get('fname');
        $lname = $request->get('lname');
        $email = $request->get('email');
        $phone = $request->get('phone');
        $id_entreprise = $request->get('id_entreprise');
        $date_birth = \Carbon\Carbon::parse( $request->get('date_birth') )->format('Y/m/d') ;
        $address = $request->get('address');
        $city = $request->get('city');
        $password = ($request->get('password')) ? Hash::make($request->get('password')) : null;
        $now = date("Y_m_d_H_i_s");

        // traitement
        try {
            $validator = Validator::make($request->all(), [
                        'email' => 'required|string|email|max:256',
                        'password' => 'required|string|max:256',
            ]);
            if ($validator->fails()) {
                //$response["text_response"] = $validator->errors()->toJson();
                throw new Exception(__("Veuillez verifier les champs"), ResponseData::USER_EXCEPTION);
            } else {
                // pour verifier si l'mail d'user exsite ou pas
                $user = User::where('email', $request->get('email'))->whereNull("deleted_at")->first();
                if ($user == null) {

                    $stokedAvatarName = $formatNow . "_" . $request->get('avatar');
                    $user_created =  $this->userRepository->create([
                        'fname' => $fname,
                        'lname' => $lname,
                        'email' => $email,
                        'phone' => $phone,
                        'date_birth' => $date_birth,
                        'address' => $address,
                        'id_city' => $city,
                        "id_entreprise"=> $id_entreprise,
                        'password' => $password,
                        'created_at' => now(),
                        'updated_at' => null,
                    ]);


                    $response = Response::json(['message' => __("Compte Créer")], ResponseData::CREATED);
                    $user_created->root_user_folder = $now .'_'. $user_created->fname.'_'.$user_created->lname.'_'.$user_created->id."";
                    $user_created->save();
                    Storage::disk('users_folder')->makeDirectory($user_created->root_user_folder."/avatars");
                    Storage::disk('users_folder')->makeDirectory($user_created->root_user_folder."/files");
                } else {
                    throw new Exception(__("imposible de créer l'utilisateur, essayer avec une autre email"), ResponseData::USER_EXCEPTION);
                }
            }
        } catch (Throwable $e) {
            $response = Response::json(['message' => ($e->getCode() != ResponseData::USER_EXCEPTION) ? "Erreur interne du serveur" : $e->getMessage()], ResponseData::ERROR);
        } finally {
            return $response;
        }
    }

    /**
     * modifier utilisateur
     *
     * @param  \Illuminate\Http\Request  $request
     * @return message
     */
    public function update(Request $request, int $id) {

        //declaration
        $response = null;
        $validator = Validator::make($request->all(), ['email' => 'required|string|email|max:256']);
        $user = null;
        $id_role = $request->get('id_role');
        $fname = $request->get('fname');
        $lname = $request->get('lname');
        $email = $request->get('email');
        $phone = $request->get('phone');
        $date_birth = \Carbon\Carbon::parse( $request->get('date_birth') )->format('Y/m/d') ;
        $address = $request->get('address');
        $city = $request->get('id_city');
        $id_entreprise = $request->get('id_entreprise');

        // traitement
        try {

            if ($validator->fails()) {
                throw new Exception(__("Veuillez verifier les champs"), ResponseData::USER_EXCEPTION);
            } else {
                // pour verifier si l'mail d'user exsite ou pas
                $user = $this->userRepository->find($id);
                if (!$user) {
                    throw new Exception(__("utilisateur n'existe pas"), ResponseData::USER_EXCEPTION);
                }

                if ($this->userRepository->count(["email" => $email]) > 0 && $user->email != $email) {
                    throw new Exception(__("Veuillez utiliser une autre email"), ResponseData::USER_EXCEPTION);
                } else {
                    $updatedUser = $this->userRepository->update([
                        'fname' => $fname,
                        'lname' => $lname,
                        'email' => $email,
                        'phone' => $phone,
                        'date_birth' => $date_birth,
                        'address' => $address,
                        'id_city' => $city,
                        "id_entreprise"=> $id_entreprise,
                        'updated_at' => now(),
                            ], $user->id);
                        //avatar_content
                        //Storage::disk('users_folder')->put($user->root_user_folder."/avatars/".$avatar_name, $image_parts);
                    $response = Response::json(['message' => __("Compte modifer")], ResponseData::UPDATED);
                }
            }
        } catch (\Exception $e) {
            dd($e);
            $response = Response::json(['message' => ($e->getCode() != ResponseData::USER_EXCEPTION) ? "Erreur interne du serveur" : $e->getMessage()], ResponseData::ERROR);
        } finally {
            return $response;
        }
    }

    /**
     * modifier utilisateur
     *
     * @param  \Illuminate\Http\Request  $request
     * @return message
     */
    public function updateAvatar(Request $request, int $id) {

        //declaration
        $response = null;
        $validator = Validator::make($request->all(), ['email' => 'required|string|email|max:256']);
        $user = null;
        $avatar = $request->file('avatar');
        $avatar_name = null;
        $avatar_stored_name = null;
        $date_birth = null;
        $path_folder_avatar_user = "";

        // traitement
        try {
                $avatar_name = $avatar->getClientOriginalName();
                $avatar_stored_name = $this->helpers->generateRandomString().".".$avatar->extension();
                $date_birth = \Carbon\Carbon::parse( $request->get('date_birth') )->format('Y/m/d') ;

                // pour verifier si l'mail d'user exsite ou pas
                $user = $this->userRepository->find($id);
                if (!$user) {
                    throw new Exception(__("utilisateur n'existe pas"), ResponseData::USER_EXCEPTION);
                }
                 else {
                    $this->userRepository->update([
                        "stored_avatar_name" => $avatar_stored_name,
                        "avatar_origine_name"=> $avatar_name,
                        'updated_at' => now(),
                            ], $user->id);

                    $path_folder_avatar_user = $user->root_user_folder."/avatars/";
                    if(!Storage::disk('users_folder')->exists($path_folder_avatar_user))  Storage::disk('users_folder')->makeDirectory($path_folder_avatar_user);
                    Storage::disk('users_folder')->putFileAs($path_folder_avatar_user,  $request->file('avatar'),$avatar_stored_name);
                    $response = Response::json(['message' => __("Compte modifer")], ResponseData::UPDATED);
            }
        } catch (\Exception $e) {
            $response = Response::json(['message' => ($e->getCode() != ResponseData::USER_EXCEPTION) ? "Erreur interne du serveur" : $e->getMessage()], ResponseData::ERROR);
        } finally {
            return $response;
        }
    }

    /**
     * modifier utilisateur password
     *
     * @param  \Illuminate\Http\Request  $request
     * @return message
     */
    public function updatePassword(Request $request, int $id) {

        //declaration
        $response = null;
        $password =  $request->get('password');
        $user = null;

        // traitement
        try {
            $password =  Hash::make($password);
            $date_birth = \Carbon\Carbon::parse( $request->get('date_birth') )->format('Y/m/d') ;
            $address = $request->get('address');
            $city = $request->get('id_city');

            // pour verifier si l'mail d'user exsite ou pas
            $user = $this->userRepository->find($id);
                if (!$user) {
                    throw new Exception(__("utilisateur n'existe pas"), ResponseData::USER_EXCEPTION);
                }
                 else {
                    $this->userRepository->update(['password' => $password ], $user->id);
                    $response = Response::json(['message' => __("Mot de passe modifer")], ResponseData::UPDATED);
                }
        } catch (\Exception $e) {
            $response = Response::json(['message' => ($e->getCode() != ResponseData::USER_EXCEPTION) ? "Erreur interne du serveur" : $e->getMessage()], ResponseData::ERROR);
        } finally {
            return $response;
        }
    }

    /**
     * spprimer utilisateur
     *
     * @param  \Illuminate\Http\Request  $request
     * @return message
     */
    public function delete(Request $request,int $id) {
        //declaration
        $id_user = null;
        $response = null;

        // traitement
        try {
            if ($this->userRepository->find($id)) {
                $this->userRepository->delete($id);
                $response = Response::json(['message' => __('Compte suprimé')], ResponseData::DELETED);
            } else {
                throw new Exception(__("imposible de supprimer l'utilisateur; il n'existe pas"), ResponseData::USER_EXCEPTION);
                $response = Response::json(['message' => __("imposible de supprimer l'utilisateur; il n'existe pas")], ResponseData::ERROR);
            }
        } catch (Throwable $e) {
            $response = Response::json(['message' => ($e->getCode() != ResponseData::USER_EXCEPTION) ? "Erreur interne du serveur" : $e->getMessage()], ResponseData::ERROR);
        } finally {
            return $response;
        }
    }

    /**
     * afficher les utilisateur
     *
     * @param  \Illuminate\Http\Request  $request
     * @return list
     */
    public function search(Request $request) {

        // declaration
        $id_user = $request->get('id_user', null);
        $lname = $request->get('lname', null);
        $fname = $request->get('fname', null);
        $pays = $request->get('pays', null);
        $email = $request->get('email', null);
        $phone = $request->get('phone', null);
        $response = null;
        $condition = [];

        //traitement
        try {

            if (isset($id_user)) {
                $condition[] = array("id", "=", $id_user);
            }

            if (isset($lname)) {
                $condition[] = array("lname", "LIKE", '%' . $lname . '%');
            }

            if (isset($fname)) {
                $condition[] = array("fname", "LIKE", '%' . $fname . '%');
            }

            if (isset($pays)) {
                $condition[] = array("contry", "LIKE", '%' . $pays . '%');
            }

            if (isset($pays)) {
                $condition[] = array("contry", "LIKE", '%' . $pays . '%');
            }

            if (isset($email)) {
                $condition[] = array("email", "=", '' . $email . '');
            }

            if (isset($phone)) {
                $condition[] = array("phone", "=", '' . $phone . '');
            }

            $users = $this->userRepository->search(["users.*"], $condition);
            $resultData = new ResponseData($users, $this->userRepository->count($condition));
            $response = Response::json($resultData->getResponseDataToArray(), ResponseData::OK);
        } catch (Throwable $th) {
            $response = Response::json(['message' => __("Erreur interne du serveur")], ResponseData::ERROR);
        } finally {
            return $response;
        }
    }

    /**
     * afficher les utilisateur
     *
     * @param  \Illuminate\Http\Request  $request
     * @return list
     */
    public function searching(Request $request) {

        // declaration
        $id_user = $request->get('id_user', null);
        $lname = $request->get('lname', null);
        $fname = $request->get('fname', null);
        $pays = $request->get('pays', null);
        $email = $request->get('email', null);
        $response = null;
        $condition = [];

        //traitement
        try {

            if (isset($id_user)) {
                $condition[] = array("id", "=", $id_user);
            }

            if (isset($lname)) {
                $condition[] = array("lname", "LIKE", '%' . $lname . '%');
            }

            if (isset($fname)) {
                $condition[] = array("fname", "LIKE", '%' . $fname . '%');
            }

            if (isset($pays)) {
                $condition[] = array("contry", "LIKE", '%' . $pays . '%');
            }

            if (isset($pays)) {
                $condition[] = array("contry", "LIKE", '%' . $pays . '%');
            }

            if (isset($email)) {
                $condition[] = array("email", "=", '' . $email . '');
            }

            $users = $this->userRepository->searching(["users.id","fname","lname","email","phone","users.id_entreprise","date_birth","address",/*"roles.name as role_name",*/"cities.name as city","countries.name as country","cities.id as id_city","countries.id as id_country"], $condition, $count);
            $resultData = new ResponseData($users, $count);
            $response = Response::json($resultData->getResponseDataToArray(), ResponseData::OK);
        } catch (Throwable $th) {
            $response = Response::json(['message' => __("Erreur interne du serveur")], ResponseData::ERROR);
        } finally {
            return $response;
        }
    }

    public function getUserRoles(Request $request){
      // declaration
      $response = null;
      $condition = [];
      $id_user = $request->get("id_user");

      //traitement
      try {
          $userRoles = $this->userRepository->getUserRoles($id_user, ["roles.*"]);
          $resultData = new ResponseData($userRoles, $userRoles->count());
          $response = Response::json($resultData->getResponseDataToArray(), ResponseData::OK);
      } catch (Throwable $th) {
          $response = Response::json(['message' => __("Erreur interne du serveur")], ResponseData::ERROR);
      } finally {
          return $response;
      }
    }

    public function imageProfile(Request $request,int $id_user){
      // declaration
      $response = null;
      $condition = []; //->getMimeType()
      $user = null;
      $fullPath_avatar = null;
      $mimetype = null;

      //traitement
      try {

          $user = $this->userRepository->find($id_user);
          $fullPath_avatar = storage_path("/app/private/users_folder/").$user->root_user_folder."/avatars/".$user->stored_avatar_name;

          if( (!isset($user->stored_avatar_name) || null == $user->stored_avatar_name) || !File::exists($fullPath_avatar) ) {
            $fullPath_avatar = public_path("/img/default-avatar.png");
          }
          $mimetype =  mime_content_type($fullPath_avatar);
          header('Content-type: '.$mimetype);
          switch ($mimetype) {
            case 'image/png':
            imagepng(imagecreatefrompng($fullPath_avatar));
              break;
            case 'image/jpeg':
              imagejpeg(imagecreatefromjpeg($fullPath_avatar));
                break;
            default:
              // code...
              break;
          }
      } catch (Throwable $th) {}
    }

    public function getEntrepriseClientAssocier(Request $request,int $id_user){

      //traitement
      $response = null;

      try {
        $entrepriseAssocier = $this->userRepository->getEntrepriseClientAssocier($id_user, ["*"]);
        $resultData = new ResponseData($entrepriseAssocier, $entrepriseAssocier->count());
        $response = Response::json($resultData->getResponseDataToArray(), ResponseData::OK);
      }
        catch (Throwable $th) {
            $response = Response::json(['message' => __("Erreur interne du serveur")], ResponseData::ERROR);
        } finally {
            return $response;
        }
    }

    public function getEntrepriseProviderAssocier(Request $request,int $id_user){

        //traitement
        $response = null;
  
        try {
          $entrepriseAssocier = $this->userRepository->getEntrepriseProviderAssocier($id_user, ["*"]);
          $resultData = new ResponseData($entrepriseAssocier, $entrepriseAssocier->count());
          $response = Response::json($resultData->getResponseDataToArray(), ResponseData::OK);
        }
          catch (Throwable $th) {
              $response = Response::json(['message' => __("Erreur interne du serveur")], ResponseData::ERROR);
          } finally {
              return $response;
          }
      }
}
