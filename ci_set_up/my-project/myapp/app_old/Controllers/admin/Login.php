<?php 

namespace App\Controllers\admin;
use CodeIgniter\Controller;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;
use App\core\BASE_Controller;
use App\core\BASE_Enum;
use App\core\BASE_Result;
use App\Enums\EnumCollection ;
use App\Enums\E_STATUS_CODE , App\Enums\E_PLUGINS_JS ,App\Enums\E_RENDERMODE, App\Enums\E_SESSION_ITEM;


class Login extends BASE_Controller 
{
	const DEBUG_FILENAME = "login.log";
	
	/**
	 * Constructor for the login controller
	 */

	 public function initController(RequestInterface $request, ResponseInterface $response, LoggerInterface $logger )
	 {
		 parent::initController($request, $response, $logger);
		 $this->javascript		= array("login.js");
		 helper('form');
		 helper('page');
		 $this->user_model = model('App\Models\User_model');
		 $this->hasBreadcrump	= false;
		 $this->hasNav			= true;
		 $this->hasSidebar		= false;
		 $this->session = \Config\Services::session();
		 $uriString = service('request')->uri->getPath();
		 $this->config = \Config\Services::config();
		 $this->config = new \Config\App();
		 
		 write2Debugfile(self::DEBUG_FILENAME,$uriString, true);
 
	 }

    /**
     * If post is set, try to authenticate, set the session and redirect to overview first. 
     * The authenticate-method fills <code>$this->data</code>, which will passed to the view
     * 
     * @access public
     */
    public function index()
    {
    	$post = $this->request->getPost();
    	
    	// only if we have a post, we try to authenticate
    	if (is_array($post) && count($post) > 0 && $this->authenticate() === true )
    	{
    		write2Debugfile(self::DEBUG_FILENAME, "user has logged in with client-id[".$this->getSessionData(E_SESSION_ITEM::CLIENT_ID)."] - last-url[".$this->getSessionData(E_SESSION_ITEM::LAST_URL)."]");
    		
    		if ($this->getSessionData(E_SESSION_ITEM::LAST_URL) != "" && $this->getSessionData(E_SESSION_ITEM::LAST_URL) != $this->uri->uri_string())
    		{
    			$target = $this->getSessionData(E_SESSION_ITEM::LAST_URL);
    		}
    		else
    		{
    			// redirect to an overview-controller and skip rendering the login-view
    			$target = "overview";
    			if ($this->getSessionData(E_SESSION_ITEM::CLIENT_ID) == $this->config->root_client_id ){
    				$target = "root/overview";
    			}
    		}
    		write2Debugfile(self::DEBUG_FILENAME, "redirect to [$target]");
    		return redirect()->to(site_url($target));
    	}
    	
    	$this->render('admin/login', E_RENDERMODE::FULLPAGE);
    }

    /**
     * Authenticate via an AJAX-Request
     * This is a wrapper function to call the authenticate and perform a JSON-Rendermode
     * 
     * @access private
     */
    public function ajax_authenticate()
    {
    	$auth = $this->authenticate();
    	
    	$this->render($auth, E_RENDERMODE::JSON);
    }
    
    /**
     * Authentification method will call the user-model, if the form has passed through the validation
     * 
     * @access private
     * @return bool	$authenticated
     */
    private function authenticate()
    {
    	$authenticated = false;		// default return value
    	$validation = \Config\Services::validation();
    	// All the posts sent by the view
    	$username 	= $this->request->getPost("username");
    	$password 	= $this->request->getPost("password");


    	write2Debugfile(self::DEBUG_FILENAME, "authenticate with username: [".$username."] and password [".$password."]");
    	
    	/* $this->form_validation->set_rules('username', 'lang:username', 'required|min_length[3]');
    	$this->form_validation->set_rules('password', 'lang:password', 'required|min_length[5]'); */
		$rules = [
			'username' => 'required|min_length[3]',
			'password' => 'required|min_length[5]',
		];
		
		$validation->setRules($rules);

		if ($validation->run($this->request->getPost())) // if the form has passed through the validation
    	{
    		$result = $this->user_model->authenticate($username, $password);
    		
    		//$this->setData( $result ); // fill up the view data
    		
    		write2Debugfile(self::DEBUG_FILENAME, "auth-result\n".print_r($result, true));
    		
    		// check for model errors
    		if ($result->getError() == "") 
    		{
    			$userdata		= $result->data;

    			write2Debugfile(self::DEBUG_FILENAME, "\ncurrent-session".print_r($this->session, true));
    			// set session data
    			$this->setSessionData($userdata);
    			
    			$authenticated = true;
    			
    			
	    		// redirect to an overview-controller and skip rendering the login-view
    			$target = "overview";
    			if ($this->getSessionData(E_SESSION_ITEM::CLIENT_ID) == $this->config->root_client_id  ){
    				$target = "root/overview";
    			}
    			$this->setViewData("redirect_to", $target);
    			
    			write2Debugfile(self::DEBUG_FILENAME, "session\n".print_r($this->session, true));
    		}
    		else
    		{
    			$this->setData( $result );
    		}

    	}else {
    		write2Debugfile(self::DEBUG_FILENAME, "authentication failed:\n".validation_errors());
    		
    		// validation failed. set the error to the views data and go ahead. the view will show the errors 
    		$this->setData( new BASE_Result(array(), $this->validation->getError(), $this->validation->getErrors(), E_STATUS_CODE::ERROR));
    	}
    	return $authenticated;
    }
}