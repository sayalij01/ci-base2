<?php
namespace App\core;
use App\Enums\E_PERMISSIONS;

class BASE_Permissions
{
	/**
	 * Return the permission-mapping
	 * @todo Maybe we outsource this to the database. while developing it comes more handy here imo.
	 *
	 * @return array >> array-map containing all perissions for the controller-methods
	 */
	public static function getMapping()
	{

		// echo "in ds permission";die;

		$permission_map = array();

		$permission_map["admin"]["login"]["index"] 				                    = "";
		$permission_map["admin"]["testcontroller"]["index"] 			                   	= "";
		$permission_map["admin"]["login"]["ajax_authenticate"]	                    = "";
		$permission_map["admin"]["login"]["authenticate"]		                    = "";

		$permission_map["admin"]["logout"]["index"] 			                    = "";
		
		// ..:: ROLES :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$permission_map["admin"]["Roles"]["index"] 				                    = E_PERMISSIONS::ROLE_LIST;
		$permission_map["admin"]["roles"]["show"] 				                    = E_PERMISSIONS::ROLE_LIST;
		$permission_map["admin"]["roles"]["datatable"]			                    = E_PERMISSIONS::ROLE_LIST;
		$permission_map["admin"]["roles"]["create"] 			                    = E_PERMISSIONS::ROLE_CREATE;
		$permission_map["admin"]["roles"]["edit"] 				                    = E_PERMISSIONS::ROLE_EDIT;
		$permission_map["admin"]["roles"]["remove"] 			                    = E_PERMISSIONS::ROLE_DELETE;
		$permission_map["admin"]["roles"]["export_roles_list"]                		= E_PERMISSIONS::ROLE_DELETE;
		$permission_map["admin"]["roles"]["download_export"]                		= E_PERMISSIONS::ROLE_DELETE;


		return $permission_map;
	}
}
?>
