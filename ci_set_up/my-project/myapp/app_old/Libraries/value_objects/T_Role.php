<?php 
namespace App\Libraries\value_objects;
use App\Libraries\value_objects\T_Pseudo;
use App\Enums\E_SORTABLE, App\Enums\E_VISIBLE, App\Enums\E_SEARCHABLE , App\Enums\E_ICONS;;
use App\Helpers\HTML_DTColumn;
class T_Role extends T_Pseudo
{
	const DEBUG_FILENAME 	= "T_Role.log";
	
	public $role_id 		= "";
	public $role_name 		= "";
	public $role_desc		= "";
	public $is_static		= false;
	public $created_at		= NULL;
	
	public $deleted			= NULL;
	public $deleted_by		= NULL;
	public $deleted_at		= NULL;

	function __construct($data=array())
	{
		
		parent::__construct($data);
		write2Debugfile(self::DEBUG_FILENAME, "T_Role src-".print_r($data, true)."\nresult-".print_r($this, true), false);
	}
	
	/**
	 * get table columns array containing HTML_DTColumn  
	 * @return array
	 */
	static function get_table_columns()
	{

		return array(
			new HTML_DTColumn("control_col", "&nbsp;", E_SORTABLE::NO, E_VISIBLE::YES, E_SEARCHABLE::NO, null, array(), array("control"), array()),

			new HTML_DTColumn("role_name", lang("name"), E_SORTABLE::YES),
			new HTML_DTColumn("role_desc", lang("desc"), E_SORTABLE::YES),
			new HTML_DTColumn("is_static", E_ICONS::SHIELD."&nbsp;".lang("static"), E_SORTABLE::YES, E_VISIBLE::YES, E_SEARCHABLE::NO, null, array(), array(), array())
		);
	}
}
	
?>