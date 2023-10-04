<?php
namespace App\Controllers\admin;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;
use Config\Database;
use App\core\BASE_Controller;
use App\core\BASE_Enum;
use App\core\BASE_Result;
use App\Enums\EnumCollection ;
use App\Enums\E_STATUS_CODE , App\Enums\E_PLUGINS_JS ,App\Enums\E_RENDERMODE, App\Enums\E_SESSION_ITEM;

class Overview extends BASE_Controller
{
	const DEBUG_FILENAME = "overview.log";

	/**
	 * Constructor for the admin-overview controller
	 */
	public function initController(RequestInterface $request, ResponseInterface $response, LoggerInterface $logger )
    {
        parent::initController($request, $response, $logger);
		helper('page_helper');
		$this->hasBreadcrump	= false;
		$this->hasNav			= true;
		$this->hasSidebar		= true;
		$this->javascript		= array("home.js");
        $this->user_model = model('App\Models\User_model');
        // $this->components_model =  model('App\Models\Components_model');

	}

	/**
	 * default entry point. leads to the show method
	 */
	public function index()
	{
		self::show(E_RENDERMODE::FULLPAGE);
	}

	/**
	 * Render the overview
	 *
	 * @param E_RENDERMODE $rendermode
	 */
	public function show($rendermode="FULLPAGE")
	{

		//$this->page_heading	= buildPageHeading($this->config->item('site_title'), lang("dashboard"));
        $cookies = service('cookies');
		$toSidebar							= array();
		$toSidebar["menu_data"]				= (array)$this->user_model->loadMenu( $this->client_id, $this->user_id, $this->getSessionData(E_SESSION_ITEM::USER_PERMISSIONS) )->getData();
		$toSidebar["sidebar_expanded"]		= self::getSessionData(E_SESSION_ITEM::SIDEBAR_EXPANDED);//get_cookie(E_SESSION_ITEM::SIDEBAR_EXPANDED);
		$toSidebar["sidebar_selected_item"]	= request()->getCookie(E_SESSION_ITEM::SIDEBAR_SELECTED_ITEM);
         
		// $components_result = $this->components_model->loadComponentsPreview(0,7);
		$this->setViewData("permissions", $this->getSessionData(E_SESSION_ITEM::USER_PERMISSIONS));
		//echome($components_result->extra);
		$this->setViewData("toSidebar", $toSidebar);

		$this->render("admin/overview", $rendermode);
	}

}
?>
