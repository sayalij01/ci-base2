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

class Home extends BASE_Controller
{
 
	public function initController(RequestInterface $request, ResponseInterface $response, LoggerInterface $logger )
    {
        parent::initController($request, $response, $logger);
		helper('page_helper');
		$this->hasBreadcrump	= false;
		$this->hasNav			= true;
		$this->hasSidebar		= false;
		$this->javascript		= array("home.js");

	}

	/** 
	 * default entry point.
	 * @param string $page
	 */
	public function index(){

		$this->home();
	}

	/**
	 * Shortcut functions to about page
	 */

	public function contact(){
		// echo "hi";
		return view("template/skeleton");
	}

	/**
	 * Shortcut functions to home page
	 */
	public function home()
	{
		$this->title 		= lang("home")." | ". $this->config->site_title;
		$this->pageHeading 	= buildPageHeading(lang("welcome_text"),  $this->config->site_title);

		$this->render(PATH_STATIC_VIEWS . "home", E_RENDERMODE::FULLPAGE);
	}

    
}

?>
