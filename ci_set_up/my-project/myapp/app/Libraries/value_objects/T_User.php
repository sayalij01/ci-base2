<?php 
namespace App\Libraries\value_objects;
use App\Libraries\value_objects\T_Pseudo;
use App\Enums\E_SORTABLE, App\Enums\E_VISIBLE, App\Enums\E_SEARCHABLE , App\Enums\E_ICONS;;
use App\Helpers\HTML_DTColumn;

class T_User extends T_Pseudo
{
	const DEBUG_FILENAME 	        = "T_User.log";
	
	public $client_id 		        = "";
	public $user_id 		        = NULL;
	public $employee_id 	        = NULL;
	public $team_id			        = null;
	public $username 		        = "";
	
	public $password		        = "";	// hashed password
	public $salt			        = "";	// password salt
	
	public $email			        = "";
	public $phone			        = "";
	public $firstname		        = "";
	public $lastname		        = "";
	public $street			        = "";
	public $house_number	        = "";
	public $zipcode			        = "";
	public $location 		        = "";
	
	public $country			        = "DE";
	public $language		        = "DE";
	public $scanagent_computer_id   = NULL;

	public $created_at		        = NULL;
	
	public $activated		        = 0;
	public $activated_at	        = NULL;

	public $locked			        = NULL;
	public $locked_by		        = NULL;
	public $locked_at		        = NULL;
	
	public $deleted			        = NULL;
	public $deleted_by		        = NULL;
	public $deleted_at		        = NULL;

	public $failed_logins	        = "";
	public $last_login		        = NULL;
	
	public $permissions		        = "";	// array
	
	function __construct($data=array())
	{
		if (isset($data->created_at)){
			$data->created_at = DateTime::createFromFormat('U', $data->created_at);			// U for unix timestamp
		}
		
		if (isset($data->activated_at)){
			$data->activated_at = DateTime::createFromFormat('U', $data->activated_at);		// U for unix timestamp
		}
		
		if (isset($data->last_login)){
			$data->last_login = DateTime::createFromFormat('U', $data->last_login);			// U for unix timestamp
		}
		
		if (isset($data->language) && $data->language == ""){
			$data->language = "EN";
		}

		parent::__construct($data);
		
		write2Debugfile(self::DEBUG_FILENAME, "T_User src-".print_r($data, true)."\nresult-".print_r($this, true), false);
	}
	
	/**
	 * get table columns array containing HTML_DTColumn
	 * @return array
	 */
	static function get_table_columns()
	{
		return array(
			new HTML_DTColumn("control_col", "&nbsp;", E_SORTABLE::NO, E_VISIBLE::YES, E_SEARCHABLE::NO, null, array(), array(), array()),
			new HTML_DTColumn(TBL_USER . ".username", lang("username"), E_SORTABLE::YES, E_VISIBLE::YES, E_SEARCHABLE::YES),
			new HTML_DTColumn(TBL_USER . ".firstname", lang("firstname")),
			new HTML_DTColumn(TBL_USER . ".lastname", lang("lastname")),
			new HTML_DTColumn(TBL_USER . ".email", lang("email")),
			new HTML_DTColumn(TBL_TEAMS . ".team_name", lang("team")),
			//new HTML_DTColumn(TBL_USER . ".created_at", lang("created_at")),
			new HTML_DTColumn(TBL_USER . ".locked", E_ICONS::LOCK . " " . lang("locked"), E_SORTABLE::YES, E_VISIBLE::YES, E_SEARCHABLE::NO),
			new HTML_DTColumn(TBL_USER . ".activated", E_ICONS::ADJUST . " " . lang("activated"), E_SORTABLE::YES, E_VISIBLE::YES, E_SEARCHABLE::NO),
			new HTML_DTColumn(TBL_USER . ".last_login", lang("last_login")),
		);
	}
	
	static function get_table_columns_assigned_project_users()
	{
		return array(
			new HTML_DTColumn("control_col", "&nbsp;", E_SORTABLE::NO, E_VISIBLE::NO, E_SEARCHABLE::NO, null, array(), array("control"), array()),
			new HTML_DTColumn("selection_col", "&nbsp;", E_SORTABLE::NO, E_VISIBLE::YES, E_SEARCHABLE::NO, null, array(), array(), array()),
			new HTML_DTColumn("assigned", ' ', E_SORTABLE::NO, E_VISIBLE::NO, E_SEARCHABLE::YES),
    		new HTML_DTColumn(TBL_USER.".user_id", lang("user_id"), E_SORTABLE::NO, E_VISIBLE::NO, E_SEARCHABLE::YES),
    		new HTML_DTColumn(TBL_USER.".username", lang("username"), E_SORTABLE::YES, E_VISIBLE::YES, E_SEARCHABLE::YES),
    		new HTML_DTColumn(TBL_USER.".firstname", lang("firstname"), E_SORTABLE::YES, E_VISIBLE::YES, E_SEARCHABLE::YES, null, array(), array(), array()),
			new HTML_DTColumn(TBL_USER.".lastname", lang("lastname"), E_SORTABLE::YES, E_VISIBLE::YES, E_SEARCHABLE::YES, null, array(), array(), array()),
			new HTML_DTColumn(TBL_USER.".email", lang("email"), E_SORTABLE::YES, E_VISIBLE::YES, E_SEARCHABLE::YES, null, array(), array(), array()),
		);
	}
}
	
?>