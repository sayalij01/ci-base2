<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * Superuser overview controller
 * 
 * @author Marco Eberhardt
 * @category controller
 * @package application\controllers\root\overview
 * @version 1.0
 */
class Overview extends BASE_Controller
{
	const DEBUG_FILENAME = "root_overview.log";
	
	/**
	 * Constructor for the root-overview controller
	 */
	function __construct()
	{
		parent::__construct(true, true);
		
		$this->javascript		= array("root_overview.js");
		$this->addPlugins();
		
		write2Debugfile(self::DEBUG_FILENAME, "root/overview", false);
	}
	
	/**
	 * default entry point. leads to the show method
	 */
	public function index()
	{
		self::show(E_RENDERMODE::FULLPAGE);
	}
	
	/**
	 * render the overview 
	 *
	 * @param E_RENDERMODE $rendermode
	 */
	public function show($rendermode="FULLPAGE")
	{
		$count_clients 				= $this->app_model->do_count(TBL_CLIENTS, array("deleted"=>0));
		$count_locales 				= $this->app_model->do_count(TBL_LOCALES_L18N, array("locale_code"=>$this->loaded_language));
		$count_contracts			= $this->app_model->count(TBL_CONTRACTS, array("client_id"=>$this->client_id, "deleted"=>0));
		$count_health_insuarances	= $this->app_model->count(TBL_INSURANCES, array("client_id"=>$this->client_id, "deleted"=>0));
		$count_prescriptions		= $this->app_model->count(TBL_PRESCRIPTIONS, array("client_id"=>$this->client_id, "deleted"=>0));
		
		$tiles_all = array(
			HTML_TileBox::tileObject(E_PERMISSIONS::ROOT_CLIENT_LIST, $count_clients, lang("clients"), base_url("root/clients"), E_ICONS::UNIVERSITY, E_BG_COLOR::APP_BLUE_DARK),
			//HTML_TileBox::tileObject(E_PERMISSIONS::ROOT_LOCALE_LIST, $count_locales, lang("locales"), base_url("root/locales"), E_ICONS::LOCATION_ARROW, E_BG_COLOR::APP_BLUE_DARK),
			HTML_TileBox::tileObject(E_PERMISSIONS::ROOT_CONTRACT_CREATE, $count_contracts, lang("contracts"), base_url("root/contracts/show"), E_ICONS::OBJECT_GROUP, E_BG_COLOR::APP_BLUE_DARK),
			HTML_TileBox::tileObject(E_PERMISSIONS::ROOT_HEALTH_INSURANCE_LIST, $count_health_insuarances, lang("health_insurances"), base_url("root/health_insurances/show"), E_ICONS::HEARTBEAT, E_BG_COLOR::APP_BLUE_DARK),
			HTML_TileBox::tileObject(E_PERMISSIONS::PRESCRIPTIONS_LIST, $count_prescriptions, lang("prescriptions"), base_url("admin/prescriptions/dashboard"), E_ICONS::BOOKMARK_WHITE, E_BG_COLOR::APP_BLUE_DARK)
		);
		$tiles = HTML_TileBox::cleanupTilesArray($this->getSessionData(E_SESSION_ITEM::USER_PERMISSIONS), $tiles_all);
		
		$this->setViewData("permissions", $this->getSessionData(E_SESSION_ITEM::USER_PERMISSIONS));
		
		$this->setViewData("tile_data", $tiles);
		$this->render("root/overview", $rendermode);
	}
}
?>