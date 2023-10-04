<?php
ini_set('MAX_EXECUTION_TIME', -1);
set_time_limit(0);

require_once (APPPATH.'core/BASE_Result.php');
require_once (APPPATH.'helpers/enum_helper.php');
require_once (APPPATH.'helpers/enum_abena_helper.php');

use App\core\BASE_Result;
use App\helpers\enum_helper;
use App\helpers\enum_base_helper;

/**
 * BASE_Task - Controller
 *
 * ============ Codeigniter Project Libraries ================
 *
 * @property Sftp $sftp                       This class enables you to use sFTP methods like CodeIgniter's default FTP Library
 *
 * ============ Codeigniter Project Models ================
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
 * @property prescription_model $prescription_model
 * @property reminder_model $reminder_model
 *
 *  * ============ Tasks_models ================
 *
 * @property task_continuous_delivery_model  $task_continuous_delivery_model
 * @property task_planned_order_model $task_planned_order_model
 * @property task_egeko_model $task_egeko_model
 * @property task_prescription_flatrate_overlapping_model $task_prescription_flatrate_overlapping_model
 * @property task_import_model $task_import_model
 * @property task_update_and_send_zz_befreiung_model $task_update_and_send_zz_befreiung_model
 * @property task_sql_model $task_sql_model
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
 * @package application\core\BASE_Task
 * @version 1.0
 */
class BASE_Task extends CI_Controller
{
	/**
	 * Codeigniter instance
	 */
	public $ci						= null;
	/**
	 *
	 */
	private $task_id				= "";

	/**
	 * Taskname
	 * @var string
	 */
	private $task_name				= "";

	/**
	 * Task start time
	 * @var string
	 */
	private $starttime				= "";

	/**
	 * recipient for sending email notifications on task error
	 * @var string
	 */
	private $mailToOnError			= "";

	/**
	 * recipient for sending email notifications on task finish
	 * @var string
	 */
	private $mailToWhenFinished		= "";

	/**
	 * Switch to only allow calls from command line
	 * @var bool
	 */
	private $onlyCLI				= true;

	/**
	 * trigger to write logs into database
	 * @var bool
	 */
	public $logEvents 				= true;

	/**
	 * trigger to enable email notifications
	 * @var bool
	 */
	public $sendMails				= true;

	/**
	 * @var bool
	 */
	public $task_messages			= array();
	public $task_messages_levels	= array("debug", "error", "info", "warning", "ok");

	/**
	 *
	 * @param string $logEvents
	 * @param string $mailToOnError
	 * @param string $mailToWhenFinished
	 * @param bool $onlyCLI
	 */
	public function __construct($onlyCLI=true,$mailToOnErrorOverride=null,$mailToWhenFinishedOverride=null)
	{
		parent::__construct();

		if ($onlyCLI === true && $this->is_cli() === false)
		{
			// no access via browser allowed
			header('HTTP/1.1 403 Forbidden');
			die("<h3>403 Forbidden</h3>");
		}
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$this->ci 					=& get_instance();
		$this->task_name 			= get_class($this);
		$this->task_id 				= $this->task_name."_".substr(uniqid(), 0, 6)."#".time();
		$this->logEvents			= true;
		$this->starttime			= date("d.m.Y H:i:s");;
		$this->onlyCLI				= $onlyCLI;
		if($mailToOnErrorOverride != null && $mailToOnErrorOverride != "")
        {
            $this->mailToOnError		= $mailToOnErrorOverride;
        }
		else
        {
            $this->mailToOnError		= $this->config->item('email_task_error');
        }
		if($mailToWhenFinishedOverride != null && $mailToWhenFinishedOverride != "")
        {
            $this->mailToWhenFinished	= $mailToWhenFinishedOverride;
        }
		else
        {
            $this->mailToWhenFinished	= $this->config->item('email_task_finished');
        }

		$locale_folder = "german";
		$this->lang->load($locale_folder, $locale_folder);
		$this->load->model("app_model");
		$this->load->library("BASE_Mailer", "base_mailer");
		$this->load->helper("debug");

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$this->logEvent(E_TASK_EVENT::START, "Task started at: ".date("Y-m-d H:i:s"));

		if (!is_cli()){
			echo '<style>body{font-family: Consolas;font-size:12px;font-weight:bold;color:green;background-color:black;}</style>';

		}

		self::taskMessage("BASE_Task constructed at [".$this->starttime."] onlyCLI[".($onlyCLI ? "TRUE":"FALSE")."] isCLI[".($this->is_cli() == 1 ? 'TRUE':'FALSE')."] Host[".gethostname()."]", "info");
		self::taskMessage("OnError [".$this->mailToOnError."]", "info");
		self::taskMessage("OnFinish [$this->mailToWhenFinished]", "info");
		self::taskMessage("Task-Name [".$this->task_name."]", "info");
		self::taskMessage("Task-ID [".$this->task_id."]", "info");
		self::taskMessage("Task started...\n", "info");
	}

	public function taskMessage($msg, $level="debug")
	{
		if (in_array($level, $this->task_messages_levels)){
			$this->task_messages[$level][] = $msg;
			$this->task_messages["chronic"][] = $msg;

			$msg = "[".str_pad(strtoupper($level), 8, ".", STR_PAD_RIGHT)."] ".$msg."\n";
			if ($this->is_cli()){
				echo $msg;
			}else {
				echo nl2br($msg);
			}
		}else{
			throw new Exception("invalid level provided");
		}
	}

	public function getMessages($level="ALL", $return=true)
	{
		$br		= "<br>";
		$isCLI 	= $this->is_cli();
		if ($isCLI){
			$br = "\n";
		}

		if ($level == "ALL"){
			if ($return){
				return $this->task_messages["chronic"];
			}
			else{
				echo implode($br, $this->task_messages);
			}
		}
		else
		{
			if (array_key_exists($level, $this->task_messages))
			{
				if ($return){
					return $this->task_messages[$level];
				}
				else
				{
					echo implode($br, $this->task_messages[$level]);
				}
			}
		}
	}

	/**
	 * Call this at the end, when your task has finished all jobs
	 *
	 * @author Marco Eberhardt
	 * @version 1.0
	 */
	public function task_finished()
	{
		$errors 	= $this->getMessages("error");
		$runtime	= time() - $this->starttime();
		$message	= "Task finished with at [".time()."] with [".count((array)$errors)."] errors. Runtime [".($runtime)."]";

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$this->taskMessage(str_repeat("_", 80), "debug");
		$this->taskMessage($message, "debug");

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		// ..:: Log the Finish
		$this->logEvent(E_TASK_EVENT::NOTICE, implode("\n - ", $this->getMessages()));

		if (count((array)$errors) > 0)
		{
			$this->logEvent(E_TASK_EVENT::ERROR, "Errors:\n".print_r($errors, true));
		}
		$this->logEvent(E_TASK_EVENT::STOP, $message);

		//write2Debugfile("BASE_Task.log",  implode("\n", self::getMessages("ALL") ));
	}

	/**
	 * @param string $eventname
	 * @param string $comment
	 * @throws Exception
	 */
	public function logEvent($eventname, $comment="")
	{
		if ($this->logEvents === false){
			// logging disabled
			return;
		}

		if ( E_TASK_EVENT::isValidValue($eventname) === false){
			throw new Exception("invalid event name ($eventname) provided");
		}

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		if ($eventname == E_TASK_EVENT::START){
			// remember the start time
			$this->starttime = time();
		}

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		if ($eventname == E_TASK_EVENT::ERROR and trim($this->mailToOnError) != "")
		{
			if ($this->sendMails === true)
			{
				$data = array(
					"task_name"=>$this->task_name,
					"task_details"=> implode("<br><li>", self::getMessages("error") )
				);
				$result = $this->base_mailer->send_emailFromTemplate(E_MAIL_TEMPLATES::TASK_ERROR, $this->mailToOnError, $data, array(), null);
			}

		}
		else if ($eventname == E_TASK_EVENT::ERROR and trim($this->mailToOnError) === "" ){
			log_message("error", "task error in $this->task_name:".$comment);
		}

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		if ($eventname == E_TASK_EVENT::STOP and $this->starttime !="")
		{
			$runtime 	= time() - $this->starttime;
			$comment 	= "runtime: $runtime\n\n".$comment;

			// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
			if (trim($this->mailToWhenFinished) != "")
			{
				if ($this->sendMails === true)
				{
					$data = array(
						"task_name"=>$this->task_name,
						"task_details"=> implode("<br>", self::getMessages("ALL") )
					);

					$result = $this->base_mailer->send_emailFromTemplate(E_MAIL_TEMPLATES::TASK_FINISHED, $this->mailToWhenFinished, $data, array(), null);
				}
			}
		}



		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$this->log_taskEvent($this->task_name, $eventname, $comment, $this->task_id);
	}


	public function log_taskEvent($taskname, $eventname, $comment, $taskID)
	{
		$insert_array = array(
			"task_id"				=>  $taskID,
			"task_name"				=>	$taskname,
			"event_time" 			=> 	date("Y-m-d H:i:s"),
			"event_type"			=> 	$eventname,
			"comment"				=> 	$comment
		);
		$this->db->insert(TBL_LOG_TASKS, $insert_array);
	}

	/**
	 * check for command line interface
	 * @return boolean
	 */
	public function is_cli()
	{
		if( defined('STDIN') ){
			return true;
		}

		if( empty($_SERVER['REMOTE_ADDR']) and !isset($_SERVER['HTTP_USER_AGENT']) and count($_SERVER['argv']) > 0){
			return true;
		}

		return false;
	}

	/**
	 * Getter for the starttime
	 * @return string
	 */
	public function starttime(){
		return $this->starttime;
	}
}
