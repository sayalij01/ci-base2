<?php 
namespace App\core;
 

use CodeIgniter\Controller;
use CodeIgniter\HTTP\CLIRequest;
use CodeIgniter\HTTP\IncomingRequest;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;
use Config\Services;
use Exception; 
use App\core\BASE_Enum;
use App\core\BASE_Permissions;
use App\core\BASE_Result;
use App\core\BASE_Model;
use App\Model\Locale_model;
// include APPPATH . 'Enums/EnumCollection.php';
use App\Enums\EnumCollection, App\Enums\E_STATUS_CODE, App\Enums\E_SESSION_ITEM , App\Enums\E_THEMES,  App\Enums\E_RENDERMODE,
App\Enums\E_RESEREVED_DATAKEYS,App\Enums\E_PLUGINS_JS,App\Enums\E_PLUGINS_CSS, App\Enums\E_PERMISSIONS;
use CodeIgniter\HTTP\URI;
// use App\Libraries\HtmlLibrary ,App\Libraries\HTMl


// use App\Enums\EnumCollection\EnumCollection;
// use App\Enums\EnumCollection\RoleEnum;
/**
* BASE_Controller
*
* Extension of the standard CI_Controller with common methods and shortcut functions.
* All Controllers should extend from this class and use the render-method for their purposes.
*
*
*  ============ Codeigniter Project Libraries ================
*
* @property base_mailer $base_mailer
*
*  ============ Codeigniter Project Models ================
*
* @property app_model $app_model
* @property locale_model $locale_model
* @property client_model $client_model
* @property user_model $user_model
* @property role_model $role_model
* @property article_model $article_model
* @property contract_model $contract_model
* @property contract_edit_model $contract_edit_model
* @property costcarrier_model $costcarrier_model
* @property debitor_model $debitor_model
* @property health_insurance_model $health_insurance_model
* @property order_model $order_model
* @property anamnesis_model $anamnesis_model
* @property prescription_model $prescription_model
* @property reminder_model $reminder_model
* @property task_prescription_renewal_model $task_prescription_renewal_model
*
*  ============ Codeigniter Core System ================
*
* @property CI_Benchmark $benchmark              This class enables you to mark points and calculate the time difference between them. Memory consumption can also be displayed.
* @property CI_Config $config                    This class contains functions that enable config files to be managed
* @property CI_Controller $controller            This class object is the super class that every library in. CodeIgniter will be assigned to.
* @property CI_Exceptions $exceptions            Exceptions Class
* @property CI_Hooks $hooks                      Provides a mechanism to extend the base system without hacking.
* @property CI_Input $input                      Pre-processes global input data for security
* @property CI_Lang $lang                        Language Class
* @property CI_Loader $load                      Loads views and files
* @property CI_Log $log                          Logging Class
* @property CI_Output $output                    Responsible for sending final output to browser
* @property CI_Profiler $profiler                This class enables you to display benchmark, query, and other data in order to help with debugging and optimization.
* @property CI_Router $router                    Parses URIs and determines routing
* @property CI_URI $uri                          Parses URIs and determines routing
* @property CI_Utf8 $utf8                        Provides support for UTF-8 environments
*
* @property CI_Driver $driver                    Codeigniter Drivers
* @property CI_Model $model                      CodeIgniter Model Class
*
*  ============ Codeigniter Libraries ================
*
* @property CI_Cache $cache                      Caching
* @property CI_Calendar $calendar                This class enables the creation of calendars
* @property CI_Cart $cart                        Shopping Cart Class
* @property CI_Email $email                      Permits email to be sent using Mail, Sendmail, or SMTP.
* @property CI_Encryption $encryption            The Encryption Library provides two-way data encryption.
* @property CI_Form_validation $form_validation  Form Validation Class
* @property CI_Ftp $ftp                          FTP Class
* @property CI_Image_lib $image_lib              Image Manipulation class
* @property CI_Javascript $javascript            Javascript Class
* @property CI_Jquery $jquery                    Jquery Class
* @property CI_Migration $migration              Tracks & saves updates to database structure
* @property CI_Pagination $pagination            Pagination Class
* @property CI_Parser $parser                    Parses pseudo-variables contained in the specified template view, replacing them with the data in the second param
* @property CI_Security $security                Security Class, xss, csrf, etc...
* @property CI_Session $session                  Session Class
* @property CI_Table $table                      HTML table generation lets you create tables manually or from database result objects, or arrays.
* @property CI_Trackback $trackback              Trackback Sending/Receiving Class
* @property CI_Typography $typography            Typography Class
* @property CI_Unit_test $unit_test              Simple testing class
* @property CI_Upload $upload                    File Uploading Class
* @property CI_User_agent $user_agent            Identifies the platform, browser, robot, or mobile devise of the browsing agent
* @property CI_Xmlrpc $xmlrpc                    XML-RPC request handler class
* @property CI_Xmlrpcs $xmlrpcs                  XML-RPC server class
* @property CI_Zip $zip                          Zip Compression Class
*
*  ============ Database Libraries ================
*
* @property CI_DB_query_builder $db              Database
* @property CI_DB_forge $dbforge                 Database Utility Class
* @property CI_DB_result $result                 Database
*
* ============ Codeigniter Deprecated  Libraries ================
*
* @property @deprcated CI_Encrypt $encrypt       Its included but move over to new Encryption Library CI_Encryption
*
* @author Marco Eberhardt
* @category controller
* @package application\core\BASE_Controller
* @version 1.0
*
*/

class BASE_Controller extends Controller
{

	const DEBUG_FILENAME 		= "BASE_Controller.log";

	protected $available_languages	= null;

	/**
	 * The breadcrump usually will be autogenerated from the URL.
	 * By setting this prop, the breadcrump generation stops at the controller and this string will be used
	 *
	 * @see views/templates/breadcrump.php
	 * @var string
	 */
	protected $breadcrump		= "";

	/**
	 * if true, the controller requires a logged in user.
	 * @var bool
	 */
	public $requires_login	= true;

	/**
	 * if true, the controller requires root account
	 * @var bool
	 */
	public $requires_root	= false;

	/**
	 * used to block rendering.
	 * @see hooks/permission_hook
	 * @var bool
	 */
	public $has_permission	= false;

	/**
	 * user logged in var
	 *
	 * @var bool
	 */
	public $authenticated	= false;

	/**
	 * the language to load
	 * @var E_LANGUAGES
	 */
	public $loaded_language	= "DE";

	/**
	 * goes to the title <head><title>...when rendering fullpage
	 * @var string
	 */
	protected $title 			= "";		//

	/**
	 * Name of the current page
	 *
	 * @deprecated
	 * @var string
	 */
	protected $pageName 		= "";		//

	/**
	 * The page heading. you can pass anything or leave empty (usually build with the createPageHeading()-Method)
	 * @var string
	 */
	protected $pageHeading		= "";

	/**
	 * META
	 * @var string
	 */
	protected $description 		= "";

	/**
	 * META
	 * @var string
	 */
	protected $keywords 		= "";

	/**
	 * META
	 * @var string
	 */
	protected $author 			= "";

	/**
	 * holds the controller derivate
	 * @var string
	 */
	protected $callerClass		= null;

	/**
	 * Generic data-array (BASE_RESULT) which will be passed to the view !!! use the setData()-Method and pass a BASE_Result
	 * @var array
	 */
	protected $data 			= Array();

	/**
	 * top navigation enabled?
	 * @var bool
	 */
	protected $hasNav 			= TRUE;

	/**
	 * footer enabled?
	 * @var string
	 */
	protected $hasFooter		= TRUE;

	/**
	 * breadcrump enabled?
	 * @var bool
	 */
	protected $hasBreadcrump	= TRUE;

	/**
	 * sidebar enabled?
	 * @var bool
	 */
	protected $hasSidebar		= TRUE;

	/**
	 * The bootstrap theme (@see E_THEMES).
	 * If defined, the value from the session will be used.
	 *
	 * @var string
	 */
	protected $theme			= NULL;

	/**
	 * For performance reasons we dont include every plugin by default. this is the place to tell the skeleton which css to include.
	 *
	 * Theese plugin-includes are seperated from the site specific ones because plugins can be stored at another location (@see config_custom >> $config['cdn'])
	 * The list of usable plugins is cared in <code>E_PLUGINS_JS</code> and <code>E_PLUGINS_CSS</code>. You can also extend and make use of <code>$this->addPlugin()</code>
	 */
	/**
	 * plugins stylesheets from the cdn-location
	 * @var array
	 */
	public $plugin_css		= array();

	/**
	 * plugins javascripts from the cdn-location
	 * @var array
	 */
	public $plugin_js		= array();

	/**
	 * YOUR custom css files, located in resources/css (!! dont add E_PLUGIN_CSS beside the CDN-URL in the config points to this folder )
	 * @var array
	 */
	protected $css 				= array();

	/**
	 * YOUR custom font files located in resources/fonts
	 * @var array
	 */
	protected $fonts 			= array();

	/**
	 * YOUR custom javascript files located in resources/js	(!! dont add E_PLUGIN_JS beside the CDN-URL in the config points to this folder )
	 * @var array
	 */
	protected $javascript 		= array();

	/**
	 * NOT YET SUPPORTED js-calls after the page has loaded
	 * @var array
	 */
	protected $javascriptCalls	= array();

	/**
	 * will include the client_id from the session
	 * @var mixed
	 */
	public $client_id		= null;

	/**
	 * will include the user_id from the session
	 * @var mixed
	 */
	public $user_id		= null;

	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	/**
	 * BASE_Controller constructor
	 *
	 * @param bool $requires_login	>> acces only for logged in users
	 * @param bool $requires_root	>> acces only for logged in root user
	 */
	/**
     * Instance of the main Request object.
     *
     * @var CLIRequest|IncomingRequest
     */
    protected $request;

    /**
     * An array of helpers to be loaded automatically upon
     * class instantiation. These helpers will be available
     * to all other controllers that extend BaseController.
     *
     * @var array
     */
    protected $helpers = ['EnumHelper','html_helper'];

    /**
     * Be sure to declare properties for any property fetch you initialized.
     * The creation of dynamic property is deprecated in PHP 8.2.
     */
    // protected $session;

    /**
     * @return void
     */

	//  protected $locale_model;
	protected $locale_model;
	protected $app_model;
	protected $user_model;
	protected $config;
    public function initController(RequestInterface $request, ResponseInterface $response, LoggerInterface $logger)
    {
        parent::initController($request, $response, $logger);

		$session = session();
		$requires_login=false;
		$requires_root=false;
		$EnumCollection = EnumCollection::PENDING;
		$this->locale_model = model('App\Models\Locale_model');
		$this->app_model = model('App\Models\App_model');
		$this->user_model = model('App\Models\User_model');

		/* $status = \App\Enums\E_SESSION_ITEM::CLIENT_ID;
		echo $status;die; */
		// $this->setData(new BASE_Result(array(), "", array(), E_STATUS_CODE::SUCCESS));	// lets begin with empty view-data
		$this->config = Services::config();
		$config = config('Config\Config');
		// $this->config = \Config\Services::config();
		$this->session = \Config\Services::session();
		$this->requires_login 	= $requires_login;
		$this->requires_root	= $requires_root;
		$this->client_id 		= self::getSessionData(E_SESSION_ITEM::CLIENT_ID);
		$this->user_id 			= self::getSessionData(E_SESSION_ITEM::USER_ID);
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		// ..:: !!! load and set config items from database
		// $this->setCustomConfig();
		// echo $this->client_id ;die;
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		// ..:: apply the language
		$this->available_languages = $this->locale_model->load_languages(0)->data;
		$sessionLanguage = $this->getSessionData(E_SESSION_ITEM::USER_LANGUAGE);

		if ($sessionLanguage != "" && array_key_exists($sessionLanguage, $this->available_languages) ){
			$this->loaded_language = $sessionLanguage;
		}
		$locale_folder = $this->available_languages[$this->loaded_language]->folder;

		$this->config = new \Config\App();

        // Set a new value for a config variable
        $this->config->language = $locale_folder;


		// write2Debugfile(self::DEBUG_FILENAME, "\nlanguages-available\n".print_r($this->available_languages, true)."\n\nlanguage-session[$sessionLanguage] loaded-language[$this->loaded_language]", true);

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		// ..:: Set some meta informations, title, theme, etc.
		$this->title 		= ucfirst(lang( strtolower(get_called_class()) ))." | ". $this->config->site_title;
		$this->description 	= $this->config->site_description;
		$this->keywords 	= $this->config->site_keywords.", ".$this->pageName;
		$this->author 		= $this->config->site_author;
		//$this->pageHeading	= buildPageHeading(ucfirst( lang( strtolower(get_called_class()) )), $this->config->item('site_title'));
		$this->pageName 	= ucfirst(get_class($this));
		$this->theme		= E_THEMES::STANDARD;
		// write2Debugfile(self::DEBUG_FILENAME, "\navailable themes\n".print_r(E_THEMES::getConstants(), true), true);

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		// ..:: apply the choosen user theme if set
		$sessionTheme	= $this->getSessionData(E_SESSION_ITEM::USER_THEME);
        if ($sessionTheme != "" && E_THEMES::isValidValue($sessionTheme) ){
			$this->theme = $sessionTheme;
			// write2Debugfile(self::DEBUG_FILENAME, "\ntheme override [".$sessionTheme."] from client setting \n", true);
		}

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		if (!isset($_SESSION[E_SESSION_ITEM::JS_ENABLED])){
			$_SESSION[E_SESSION_ITEM::JS_ENABLED] = false; // will be overwritten using javascript, if enabled
		}

		self::addDefaultIncludes();		// add the all time includes to the JS/CSS Array's
		self::checkAuthentification(); 	// initialize a redirect, if the session check fails (prevents execution of the controller method)
		// self::checkPermissions();
    }


	/**
	 * One of the most important methods in the whole Framework is this general render method.
	 * All request should go through this method.
	 * ! Note that you cannot render twice within one request/method as the render-method has an exit() at the end.
	 *
	 * - E_RENDERMODE::NONE			>> nothing
	 * - E_RENDERMODE::AJAX 		>> echo a json encoded BASE_Result containing the view in the data-attribute
	 * - E_RENDERMODE::AJAX_PLAIN	>> will only load the given view feeded with the view-data
	 * - E_RENDERMODE::JSON 		>> only echo's the current view-data as JSON-Encoded string
	 * - E_RENDERMODE::JSON_DATA	>> only echo's the data-portion from the view-data ($this->data["data"]) as JSON-Encoded string
	 * - E_RENDERMODE::FULLPAGE 	>> renders a complete site using the template views
	 *
	 * @param string $view
	 * @param E_RENDERMODE $rendermode
	 * @return mixed
	 */

	protected function render($view, $rendermode="FULLPAGE")
	{
		// $this->render(PATH_STATIC_VIEWS . "home", E_RENDERMODE::FULLPAGE);
		$benchmark = \Config\Services::timer();
		$benchmark->start('render');
		// $this->benchmark->mark('render_start');
		$callerClass = static::class;
		// echo $callerClass;die;
		$uri = new URI();

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		if ($rendermode == E_RENDERMODE::FULLPAGE){

			self::setSessionItem(E_SESSION_ITEM::LAST_URL,  $uri->getPath());
		}
		self::setViewCommon(E_RESEREVED_DATAKEYS::CLIENT_ID, $this->client_id);
		self::setViewCommon(E_RESEREVED_DATAKEYS::JS_ENABLED, $this->getSessionData(E_SESSION_ITEM::JS_ENABLED));
		self::profiler($rendermode);

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		// write2Debugfile(self::DEBUG_FILENAME, "->render[$view] render-mode[$rendermode]");
		//write2Debugfile(self::DEBUG_FILENAME, "view-data-".print_r($this->data, true));
        switch (strtoupper($rendermode))
        {
        	case E_RENDERMODE::NONE:			// this mode is just to pass the above methods
        		write2Debugfile(self::DEBUG_FILENAME, "NONE\n" );
        		break;

			case E_RENDERMODE::JSON:			// echo json encoded view-dataobject
				write2Debugfile(self::DEBUG_FILENAME, "JSON\n".json_encode($this->data) );
				$this->data["extra"]["breadcrumb"] = buildBreadcrumb($this->breadcrump);	// to replace the breadcrumb
				header('Content-Type: application/json');
				echo json_encode($this->data);
				break;

        	case E_RENDERMODE::JSON_DATA:
        		write2Debugfile(self::DEBUG_FILENAME, "JSON_DATA\n".json_encode($this->data["data"]) );
        		$this->data["extra"]["breadcrumb"] = buildBreadcrumb($this->breadcrump);	// to replace the breadcrumb
        		header('Content-Type: application/json');
        		echo json_encode($this->data["data"]);	// echo json encoded data
        		break;

        	case E_RENDERMODE::AJAX:		// echo a json encoded BASE_Result containing the view in the data-attribute
        		$this->data["extra"]["breadcrumb"] = buildBreadcrumb($this->breadcrump);	// to replace the breadcrumb
        		$response = new BASE_Result(view($view, $this->data), $this->data["error"], $this->data["extra"], $this->data["status"], $this->data["redirect"] );
        		write2Debugfile(self::DEBUG_FILENAME, "AJAX\n".json_encode($response) );
        		header('Content-Type: application/json');
        		echo json_encode($response);
        		break;

        	case E_RENDERMODE::AJAX_PLAIN:	// load/echo the view
        		write2Debugfile(self::DEBUG_FILENAME, "AJAX_PLAIN\n".view($view, $this->data) );
        		view($view, $this->data);
        		$output = $this->output->get_output();
        		echo $output;
        		break;

        	case E_RENDERMODE::FULLPAGE : // echo complete page
					// inject some additional vars in the view-data-array (the controller has already set its view-data).
        			self::setViewData(E_RESEREVED_DATAKEYS::BREADCRUMB, $this->breadcrump);
        			self::setViewData(E_RESEREVED_DATAKEYS::DEBUG_FILENAME,  "debug.log");

        	default :

				// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
				// ..:: goes to templates/main.php

				$cookies = service('cookies');

				$toBody						= array();
        		$toBody["menu"]				= null;						// will be filled up later if navigation is enabled ($this->hasNav)
				$toBody["breadcrump"]		= null;						// will be filled up later if beadcrump is enabled ($this->hasBreadcrump)
				$toBody["footer"]			= null;						// will be filled up later if footer is enabled ($this->hasFooter)
				$toBody["pageHeading"] 		= $this->pageHeading;
				$toBody["hasNav"]			= $this->hasNav;
				$toBody["hasFooter"]		= $this->hasFooter;
				$toBody["hasSidebar"]		= $this->hasSidebar;
				$toBody["sidebar_expanded"] = self::getSessionData(E_SESSION_ITEM::SIDEBAR_EXPANDED);

				// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
				// load the desired view and pass the view-data-array
				$toBody["content_body"] 	= view($view, array_merge($this->data));

				$localizations	= (array)$this->available_languages;

				$rights			= (array)$this->getSessionData(E_SESSION_ITEM::USER_PERMISSIONS);
				$menu			= (array)$this->getSessionData(E_SESSION_ITEM::USER_MENU);
				$menu_sidebar	= (array)$this->getSessionData(E_SESSION_ITEM::USER_MENU_SIDEBAR);
				
				$reload = true;
				if ($reload === true && $this->getSessionData(E_SESSION_ITEM::LOGGED_IN) === true)
				{

					$user_id 		= $this->getSessionData(E_SESSION_ITEM::USER_ID);

					$localizations	= (array)$this->available_languages;
					$rights			= (array)$this->user_model->loadPermissions($this->client_id, $user_id)->getData();
					$menu_sidebar	= (array)$this->user_model->loadMenu( $this->client_id, $user_id, $this->getSessionData(E_SESSION_ITEM::USER_PERMISSIONS) )->getData();
					//$menu_sidebar	= (array)$this->user_model->load_sidemenu( $this->client_id, $user_id, $this->loaded_language, $this->getSessionData(E_SESSION_ITEM::USER_COUNTRY), $this->getSessionData(E_SESSION_ITEM::USER_SHOW_ALL_ARTICLE) )->getData();
				}
				// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
				// ..:: build top navigation and overwrite $toBody["menu"] if enabled
				// ..:: The skeleton view will automaticly include navbar.css and navbar.js
				if($this->hasNav)
				{
					$toMenu 					= array();
					$toMenu[E_RESEREVED_DATAKEYS::CALLER_CLASS]	= $callerClass;

					$toMenu["pageName"] 		= $this->pageName;
					$toMenu["theme"] 			= $this->theme;			// just to activate the selected theme in the settings dropdown
					$toMenu["hasSidebar"]		= $this->hasSidebar;	// to add the additional class "has-sidebar" if set



					// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
					// ..:: lets call the app_model to load the default menu items (home, imprint etc.)
					$toMenu["menu_default"] 	= (array)$this->app_model->load_nav()->getData();

					// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
					// ..:: user specific stuff
					$toMenu["menu_localizations"]	= $localizations;
					$toMenu["menu_userRight"]		= $rights;
					$toMenu["menu_data"]			= $menu;
					$toMenu["username"]            = $this->getSessionData(E_SESSION_ITEM::USERNAME);

					write2Debugfile(self::DEBUG_FILENAME, " - toMenu:".print_r($toMenu, true));
					// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
					$toBody["menu"] =view("template/menu", $toMenu);
				}

				// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
				// ..:: build sidebar and overwrite $toBody["sidebar"] if enabled
				// ..:: The skeleton view will automaticly include sidebar.css and sidebar.js
				if ($this->hasSidebar)
				{
					$toSidebar							= array();
					$toSidebar["menu_data"]				= $menu_sidebar;
					$toSidebar["sidebar_expanded"]		= true;//self::getSessionData(E_SESSION_ITEM::SIDEBAR_EXPANDED);//get_cookie(E_SESSION_ITEM::SIDEBAR_EXPANDED);
					$toSidebar["sidebar_selected_item"]	=  request()->getCookie(E_SESSION_ITEM::SIDEBAR_SELECTED_ITEM);

					write2Debugfile(self::DEBUG_FILENAME, " - toSidebar:".print_r($toSidebar, true));
					// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
					$toBody["sidebar"] 					= view("template/sidebar", $toSidebar);
				}


				// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
				// ..:: build breadcrump and overwrite $toBody["breadcrump"] if enabled
				if ($this->hasBreadcrump)
				{
					$toBreadcrump				= array();
					$toBreadcrump["pageName"] 	= $this->pageName;
					$toBreadcrump["last_item"] 	= $this->breadcrump;

					// write2Debugfile(self::DEBUG_FILENAME, " - toBreadcrump:".print_r($toBreadcrump, true));
					// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
					$toBody["breadcrump"] 		= view("template/breadcrump", $toBreadcrump);
				}

				// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
				// ..:: overwrite $toBody["footer"] if footer is enabled
				if ($this->hasFooter)
				{
					$toFooter						= array();
					$toFooter["hasSidebar"]			= $this->hasSidebar;
					$toFooter["js_enabled"]			= $this->getSessionData(E_SESSION_ITEM::JS_ENABLED);
					$toFooter["loaded_language"]	= $this->loaded_language;

					// write2Debugfile(self::DEBUG_FILENAME, " - toFooter:".print_r($toFooter, true));
					// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
					$toBody["footer"] 		= view("template/footer", $toFooter);
				}
				// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
				// ..:: lets bring all together in templates/skeleton.php
				$toTpl						= array();
				$toTpl["title"] 			= $this->title;
				$toTpl["description"] 		= $this->description;
				$toTpl["keywords"] 			= $this->keywords;
				$toTpl["author"] 			= $this->author;
				$toTpl["has_bg"] 			= (strtolower($callerClass) == "home" && $view == 'pages/home' ? 1:0);
				$toTpl["javascript"] 		= $this->javascript;
				$toTpl["loaded_language"] 	= $this->loaded_language;
				$toTpl["plugins_js"]		= array_unique($this->plugin_js);
				$toTpl["body"] 				= view("template/main", $toBody );
				 
				write2Debugfile(self::DEBUG_FILENAME, " - toTpl:".print_r($toTpl, true));

				// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
			
				echo view("template/skeleton", $toTpl);
				// $output = $this->output->get_oRutput();
				 $output = service('response')->getBody();
			break;
    	}
		$benchmark->stop('render');
		$elapsedTime = $benchmark->getElapsedTime('render');
    	write2Debugfile(self::DEBUG_FILENAME, "\n - rendering finished in: ".$elapsedTime." Seconds\noutput:\n");
    	exit();
	}

	/**
	 * Perform a redirect
	 *
	 * @param string $uri
	 * @param E_RENDERMODE $rendermode
	 */
	public function redirect_action($uri, $rendermode="FULLPAGE")
	{
		if ($rendermode == E_RENDERMODE::FULLPAGE){
			redirect($uri);
		}
	}

	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: VIEW DATA SETTER
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	/**
	 * Setter function for the view data (BASE_Result expected)
	 * !!! Overrides all existing view data !!!
	 *
	 * @param BASE_Result $data
	 */
	public function setData($data)
	{
		// print_r($data);die;
		// if (!is_a($data, "BASE_Result") ){
		// 	throw new Exception("BASE_Result expected!");
		// }
		$this->data					= array();
		// $this->data["common"] 		= (array) $data->common;
		$this->data["data"] 		= (array) $data->data;
		$this->data["extra"] 		= (array) $data->extra;
		$this->data["messages"]		= (array) $data->messages;
		$this->data["status"] 		= $data->status;
		$this->data["error"] 		= $data->error;
		$this->data["warning"] 		= $data->warning;
		$this->data["info"] 		= $data->info;
		$this->data["success"] 		= $data->success;
		$this->data["redirect"] 	= $data->redirect;


		//write2Debugfile("view-data-setter.log", "return-".print_r($this->data, true) );
		return $this;
	}

	/**
	 * Add mixed value to the viewdata by key and value
	 * In your view you can access the value with <code>$data[$key]</code>
	 *
	 * @version 1.1
	 * @todo throw exception if restricted key (as error, client_id etc.) is used
	 *
	 * @param string $key
	 * @param mixed $data
	 * @return BASE_Controller
	 */
	public function setViewData($key, $data){
	
		$this->data["data"][$key] = $data;
		/* echo "<pre>";
		print_r($data);
		echo "</pre>";die; */
		//write2Debugfile("view-data-setter.log", " - return-".print_r($this->data["data"][$key], true) );
		return $this;
	}

	/**
	 * Add error string to the viewdata
	 * In your view you can access this value always with <code>$error</code>
	 *
	 * @version 1.20
	 *
	 * @param string $error	>> the error text
	 * @param bool $append 	>> append string to existing error if present
	 * @return BASE_Controller
	 */
	public function setViewError($error, $append=true){
		if ($append){
			$this->data["error"] .= ($this->data["error"] == '' ? $error : "<br>".$error);
		}else{
			$this->data["error"] = $error;
		}
		return $this;
	}

	/**
	 * Add success string to the viewdata
	 * In your view you can access this value with <code>$success</code>
	 *
	 * @version 1.20
	 *
	 * @param string $success
	 * @param bool $append >> append string to existing error if present
	 * @return BASE_Controller
	 */
	public function setViewSuccess($success, $append=false){
		if ($append){
			$this->data["success"] .= ($this->data["success"] == '' ? $success : "<br>".$success);
		}else{
			$this->data["success"] = $success;
		}
		return $this;
	}

	/**
	 * Add info string to the viewdata
	 * In your view you can access this value with <code>$info</code>
	 *
	 * @version 1.20
	 *
	 * @param string $info
	 * @param bool $append >> append string to existing error if present
	 * @return BASE_Controller
	 */
	public function setViewInfo($info, $append=true){
		if ($append){
			$this->data["info"] .= ($this->data["info"] == '' ? $info : "<br>".$info);
		}else{
			$this->data["info"] = $info;
		}
		return $this;
	}

	/**
	 * Add warning string to the viewdata
	 * In your view you can access this value with <code>$warning</code>
	 *
	 * @version 1.20
	 *
	 * @param string $warning
	 * @param bool $append >> append string to existing error if present
	 * @return BASE_Controller
	 */
	public function setViewWarning($warning, $append=true){
		if ($append){
			$this->data["warning"] .= ($this->data["warning"] == '' ? $warning : "<br>".$warning);
		}else{
			$this->data["warning"] = $warning;
		}
		return $this;
	}

	/**
	 * Add status code to the viewdata
	 * In your view you can access this value with <code>$status</code>
	 *
	 * @version 1.2
	 *
	 * @param string $status
	 * @return BASE_Controller
	 */
	public function setViewStatus($status){
		$this->data["status"] = $status;
		return $this;
	}

	/**
	 * Add mixed extra data to the viewdata
	 * In your view you can access this value with <code>$extra</code>
	 *
	 * @version 1.2
	 *
	 * @param string $extra
	 * @return BASE_Controller
	 */
	public function setViewExtra($extra){
		$this->data["extra"] = $extra;
		return $this;
	}

	/**
	 * Add mixed common data to the viewdata
	 * In your view you can access this value with <code>$common</code>
	 *
	 * @version 1.2
	 *
	 * @param string $common
	 * @return BASE_Controller
	 */
	public function setViewCommon($key, $common){
		$this->data["common"][$key] = $common;
		return $this;
	}

	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: SESSION HANDLING
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..

	/**
	 *  for the full list of session stuff
	 *  @see https://www.codeigniter.com/user_guide/libraries/sessions.htm
	 *
	 *   $this->session->has_userdata('some_name')
	 *   $this->session->unset_userdata('some_name');
	 *   $this->session->mark_as_flash('item');
	 *   $this->session->set_flashdata('item', 'value');
	 *   $this->session->mark_as_temp('item', 300);
	 */

	/**
	 * retrieve all or a specific session item
	 *
	 * @param E_SESSION_ITEM $item
	 */
	public function getSessionData($item=null){

		// $session = \Config\Services::session();
		$session = session();
		if ($item)
		{
			if (E_SESSION_ITEM::isValidValue($item)){
				$return =  $session->get($item);
			}
			else{
				throw new Exception("invalid session item [$item]");
			}
		}
		//write2Debugfile("BASE_Controller-getSessionData.log", "\n - item[$item]\n".print_r($return, true) );

		return $return;
	}

	/**
	 * set the whole session-data
	 * @param string $data
	 */
	public function setSessionData($data=""){
		if ($data != ""){
			return $this->session->set($data);
		}
	}

	/**
	 * sets a value to a specific E_SESSION_ITEM
	 *
	 * @param E_SESSION_ITEM|string $key 	>> key
	 * @param string $data			>> values
	 * @throws Exception
	 */
	public function setSessionItem($key, $data){
		if (!E_SESSION_ITEM::isValidValue($key)){
			throw new Exception("invalid session key");
		}
		$session = session();
		$session->set($key, $data);
	}

	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: PLUGIN SETTER
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	/**
	 * Instead of adding manually the CSS & JS files to $this->plugins_js and $this->plugins_css, this method collects all required stuff for common plugin and push it for you.
	 * Accepts either an array of E_PLUGINS or single E_PLUGINS, E_PLUGIN_JS or E_PLUGIN_CSS object (or any file existing in the CDN).
	 *
	 * @todo
	 * If your plugins require a specific sequence you have to check this by your own.
	 * We should have an check for dependencies and inclusion order. For example the Datetimepicker requires moment.js and
	 * the bootstrap tooltip don't like jQuery UI (there are a few names conflict and 'tooltip' is one of them). The solution is changing the script loading order: jQuery UI first, bootstrap.js after.
	 *
	 * @version 1.3
	 * @param mixed $plugins 	>> ellipsis will convert passed parameter to array.
	 * @return void
	 * @throws Exception 		>> if an unsupported plugin has been provided
	 */
	public function addPlugins(...$plugins)
	{
		foreach ($plugins as $plugin)
		{
			if (is_array($plugin) && array_key_exists("css", $plugin) && array_key_exists("js", $plugin))
			{
				// seems that we have an full E_PLUGIN here. No check for valid values here because we trust our E_PLUGIN-enumerations

				foreach ($plugin["css"] as $file){
					array_push($this->plugin_css, $file);
				}

				foreach ($plugin["js"] as $file){
					array_push($this->plugin_js, $file);
				}

				if (array_key_exists("locales_dir", $plugin))
				{	// the locale index contains the path to the locales folder
					$locale = $plugin["locales_dir"].strtolower($this->loaded_language).".js";
					array_push($this->plugin_js, $locale);
				}
			}
			else
			{	// maybe we got single files (E_PLUGINS_JS or E_PLUGINS_CSS) here for inclusion
				if (E_PLUGINS_JS::isValidValue($plugin)){
					array_push($this->plugin_js, $plugin);
				}
				elseif (E_PLUGINS_CSS::isValidValue($plugin)){
					array_push($this->plugin_css, $plugin);
				}
				elseif (url_exists($this->config->item('cdn').$plugin))
				{
					// other urls from cdn
					$extendion = pathinfo($this->config->item('cdn').$plugin, PATHINFO_EXTENSION);

					if ($extendion == "css"){
						array_push($this->plugin_css, $plugin);
					}
					else if ($extendion == "js"){
						array_push($this->plugin_js, $plugin);
					}
				}
				else {
					throw new Exception("unknown plugin [$plugin] passed");
				}
			}
		}
	}

	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: PROFILER
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	/**
	 * Activates the profiler if enabled (Only available on FULLPAGE-Rendermode)
	 * @see config/config_custom.php
	 *
	 * The Profiler Class will display benchmark results, queries you have run, $_POST data etc. at the bottom of your pages.
	 * This information can be useful during development in order to help with debugging and optimization.
	 *
	 * !! Because the profiler uses the output class we cannot allow it with JSON or AJAX rendermodes !!.
	 *
	 * @param E_RENDERMODE $rendermode
	 */
	private function profiler($rendermode)
	{
		if ($rendermode == E_RENDERMODE::FULLPAGE)
		{
			if ( $this->config->enable_profiler == 1 && ENVIRONMENT != E_ENVIRONMENT::PRODUCTION){
				$this->output->enable_profiler(true);
			}
		}
	}

	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: SESSION CHECK
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	/**
	 * Checks the session if the user is logged and, when needed, if the user has root permissions.
	 * Depending on the called controller and the requested rendermode
	 *
	 * @return bool
	 */
	private function checkAuthentification()
	{
		$request = service('request');
		$rendermode 			=  $request->getPost("rendermode") != "" ? $request->getPost("rendermode") : E_RENDERMODE::FULLPAGE;
		$this->authenticated 	= true;//self::getSessionData(E_SESSION_ITEM::LOGGED_IN);

		// write2Debugfile(self::DEBUG_FILENAME, " - checkAuthentification login-required [".$this->requires_login."] root-required[".$this->requires_root."] uri[". $this->uri->uri_string."] rendermode[".$rendermode."]", true);

		if ($this->requires_login == true)
		{
			if(self::getSessionData(E_SESSION_ITEM::LOGGED_IN) !== true || self::getSessionData(E_SESSION_ITEM::CLIENT_ID) === null )
			{
				$this->authenticated = false;
				self::setSessionItem(E_SESSION_ITEM::GOTO_AFTER_LOGIN, $this->uri->uri_string);

				// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
				if ($rendermode == E_RENDERMODE::FULLPAGE || $rendermode == "")
				{
					$this->redirect_action(base_url("admin/login"));
				}
				else
				{
					$link 	= '<a href="'.base_url("admin/login").'">'.lang("login").'</a>';
					$result = new BASE_Result(null, sprintf(lang("msg_your_session_has_been_expired"), $link));
					$result->redirect = base_url("admin/login");

					self::setData($result);
					self::render("errors/error_session", $rendermode);
				}
			}
		}
		return $this->authenticated;
	}

	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: PERMISSIONS
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	/**
	 * check the users session for a specific permission
	 *
	 * @version 1.2
	 * @since 1.0
	 *
	 * @param string $permission
	 * @return bool
	 */
	public static function hasPermission($permission)
	{
		$hasPermission = false;

		// echo E_SESSION_ITEM::USER_PERMISSIONS;die;

		if (!E_PERMISSIONS::isValidValue($permission))
		{
			$permissions 	= session()->get(E_SESSION_ITEM::USER_PERMISSIONS);

			if (!is_array($permissions)){
				$hasPermission = false;
			}
			else{
				$hasPermission 	= array_key_exists($permission, $permissions);
			}
			write2Debugfile("BASE_Controller-checkPermission.log", " - checkPermission [$permission] RETURN [".$hasPermission."] - allPermissions-".(is_array($permissions) ? print_r(array_keys($permissions), true):NULL). "\n\n".print_r($_SESSION, true), false);
		}


		return $hasPermission;
	}

	/**
	 * Checks the permission for the controller::method and set the <code>has_permission</code> property
	 *
	 * @return bool
	 */
	protected function checkPermissions()
	{
		$request = service('request');
		$rendermode 		= $request->getPost("rendermode") != "" ? $request->getPost("rendermode") : E_RENDERMODE::FULLPAGE;
		$grant_without_rule = true;
		$public_controllers = array('home', 'register', 'modal', 'login', 'logout','testcontroller'); // these controllers do not require immediate login credentials or permissions
		$permission_map 	= BASE_Permissions::getMapping();
		
		/* $dir				= str_replace("/", "", $this->router->directory);
		$class 				= $this->router->class;
		$method 			= $this->router->method; */

		$dir				= str_replace("/", "", \Config\Services::request()->uri->getSegment(1));
		$class 				= \Config\Services::router()->controllerName();
		$method 			=  \Config\Services::router()->methodName();
		$this->has_permission = true;
		write2Debugfile(self::DEBUG_FILENAME, " -> checkPermission[$class] method[$method] grant_without_rule[$grant_without_rule]", true);
	/* 	echo "<pre>";
		print_r($permission_map);
		die; */

		if ($this->requires_root && self::hasPermission(E_PERMISSIONS::IS_ROOT) == false)
		{
			// echo "1st if";die;
			$this->has_permission = false;

        }
		else if( ! in_array($class, $public_controllers))
		{

			$required_permission = ( isset( $permission_map[$dir][$class][$method] ) ? $permission_map[$dir][$class][$method] : null);


			if ($required_permission !== null)
			{
				// echo "2st if";die;

				if ($required_permission != ""){
					$this->has_permission = self::hasPermission($required_permission) ;
                   // die($this->has_permission);
                }
				else{
					write2Debugfile(self::DEBUG_FILENAME, "\nno explicit permission needed", true);

				}
			}
			else{
				// missing permission?
				$this->has_permission = $grant_without_rule;

				log_message("debug", "\nBASE: Missing permission rule => [$dir][$class][$method] in BASE_Hooks::getPermissionMap()\n");
			}
			write2Debugfile(self::DEBUG_FILENAME, "\nrequired_permission[$required_permission] has_permission[".$this->has_permission."]", true);
		}
		else{
			write2Debugfile(self::DEBUG_FILENAME, " is a public controller", true);
		}

		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		if ($this->has_permission !== true)
		{
			// echo "3st if";die;

		    $result = new BASE_Result(null, lang("msg_you_dont_have_the_permission_to_access_this_method")." ". " -> checkPermission[$class] method[$method] grant_without_rule[$grant_without_rule]");
			self::setData($result);
			self::render("errors/error_permission", $rendermode);
		}

		// die ($this->has_permission);

		return $this->has_permission;
	}

	/**
	 * Push the "All-Time-Includes" from the CDN-STUFF
	 *
	 * @return void
	 */
	private function addDefaultIncludes()
	{
		array_push($this->plugin_js,
			E_PLUGINS_JS::MAIN,
			E_PLUGINS_JS::TOASTR,	// we cannot allow to add this lib via 'addPlugins' until we have a solution for the correct inclusion order
			E_PLUGINS_JS::SCROLLBAR,
			//E_PLUGINS_JS::JQUERY_UI_TOUCHPUNCH,	// touch support
			E_PLUGINS_JS::FULL_CALENDER,
			E_PLUGINS_JS::MAPS,
			E_PLUGINS_JS::CHART);

		array_push($this->plugin_css,
			E_PLUGINS_CSS::ANIMATE, 		// @link https://daneden.github.io/animate.css/
			E_PLUGINS_CSS::FONTAWESOME,
			E_PLUGINS_CSS::JQUERY_GROWL
			);
	}


	private function setCustomConfig()
	{

		if ($this->client_id != "")
		{
			// $config_result 	= $this->app_model->getConfig($this->client_id);
			$config_result 	= $this->app_model->getConfig($this->client_id);
			$config			= $config_result->data;
			write2Debugfile(self::DEBUG_FILENAME, "\napp-config client[".$this->client_id."] config\n".print_r($config_result->data, true), true);

			if (is_object($config))
			{
				foreach ($config as $key => $value) {
					if ($key == "site_copyright"){
						$value = '&copy; '.date("Y").' '.$value." | Powered by code'n'ground AG";
					}
					$this->config->set($key, $value);
					// $this->config->set($key, $value);
				}
			}
		}

	}

	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: ERROR-GENERATION
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	/**
	 * load an error view
	 *
	 * @param string $error_view >> should match a filename located at views/errors
	 * @throws Exception
	 */
	public function display_error($error_view)
	{
		if (E_ERROR_VIEW::isValidValue($error_view)){

			view($error_view, $this->data);
		}
		else{
			throw new Exception("unknown view provided");
		}
	}
}// END OF CLASS
