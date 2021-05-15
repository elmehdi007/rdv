<?php

namespace App;
use Exception;

class ExceptionLog extends Exception
{

    // Redéfinissez l'exception ainsi le message n'est pas facultatif
    public function __construct($message, $code = 0, Exception $previous = null)
    {
        parent::__construct($message, $code, $previous);
        if (!is_null($previous)) {
            //$this->previous = $previous;
        }
    }

    /*public function getPrevious()
    {
        return '$this->previous';
    }*/

    // chaîne personnalisée représentant l'objet
    public function __toString()
    {
        //return __CLASS__ . ": [{$this->code}]: {$this->message}\n";
    }
}
