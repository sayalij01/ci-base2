<?php namespace App\Controllers\admin;
use CodeIgniter\Controller;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;
use App\core\BASE_Controller;
use App\core\BASE_Enum;
use App\core\BASE_Result;
use App\Enums\EnumCollection ;
use App\Enums\E_STATUS_CODE , App\Enums\E_PLUGINS_JS ,App\Enums\E_RENDERMODE, App\Enums\E_SESSION_ITEM;


class Logout extends BASE_Controller 
{
	const DEBUG_FILENAME = "logout.log";
	
	/**
	 * Constructor for the logout controller
	 */

	public function initController(RequestInterface $request, ResponseInterface $response, LoggerInterface $logger )
	 {
		 parent::initController($request, $response, $logger);
		 write2Debugfile(self::DEBUG_FILENAME, "admin/logout", false);
		 $this->session = \Config\Services::session();
	 }
 	
	/**
	 * destroy the session
	 */
    public function index()
    {
    	write2Debugfile(self::DEBUG_FILENAME, " - destroying the session".print_r($this->session, true));
    	
    	$this->hasBreadcrump	= false;
    	$this->hasSidebar		= false;

    	$this->setViewData("online_time", number_format( (time() - $this->getSessionData(E_SESSION_ITEM::LOGGED_IN_AT)) / 60), 2);
    	
    	$this->session->destroy();
    	
    	write2Debugfile(self::DEBUG_FILENAME, " - session after ".print_r($this->session, true));
    	
    	$this->render('admin/logout', E_RENDERMODE::FULLPAGE);
    }
}