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

	public function home()
	{
		$this->title 		= lang("home")." | ". $this->config->site_title;
		$this->pageHeading 	= buildPageHeading(lang("welcome_text"),  $this->config->site_title);

		$this->render(PATH_STATIC_VIEWS . "home", E_RENDERMODE::FULLPAGE);
	}

	public function about(){
		return view("public/about");
	}

	public function imprint()
	{
		return view("public/imprint");
	}

	public function tos()
	{
		$view_fullpath	= APPPATH.'views/public/tos.php';
		$view			= 'public/tos.php';
		$file			= FCPATH.'resources/files/tos_'.strtolower($this->loaded_language).'.pdf';
		$dl_filename	= lang("terms_of_service")." - ".$this->loaded_language.".pdf";
		
		if (file_exists($view_fullpath))
		{	// we have a own view for it, so we show it
			$this->pageHeading = buildPageHeading( ucfirst( lang( "tos" )), $this->config->item('site_title'));
			$this->render($view, E_RENDERMODE::FULLPAGE);
		}
		else if (file_exists($file))
		{	// we have a file to download
			$this->load->library("BASE_Downloader");
			BASE_Downloader::download($file, $dl_filename, $this->client_id, false);
		}
		else{
			// @todo inform sys-admins via mail
			echo $view_fullpath;
		}
	}
    
}

?>
