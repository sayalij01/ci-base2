<?php

namespace App\Controllers;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;
use Config\Database;
use App\core\BASE_Controller;
use App\core\BASE_Enum;
use App\core\BASE_Result;
use App\Enums\EnumCollection ;
use App\Enums\E_STATUS_CODE , App\Enums\E_PLUGINS_JS ,App\Enums\E_RENDERMODE;

class TestController extends BASE_Controller
{
 
	public function index(){
		echo "in test";
	}
   
    
}

?>
