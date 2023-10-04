<?php

/*
 | --------------------------------------------------------------------
 | App Namespace
 | --------------------------------------------------------------------
 |
 | This defines the default Namespace that is used throughout
 | CodeIgniter to refer to the Application directory. Change
 | this constant to change the namespace that all application
 | classes should use.
 |
 | NOTE: changing this will require manually modifying the
 | existing namespaces of App\* namespaced-classes.
 */
defined('APP_NAMESPACE') || define('APP_NAMESPACE', 'App');

/*
 | --------------------------------------------------------------------------
 | Composer Path
 | --------------------------------------------------------------------------
 |
 | The path that Composer's autoload file is expected to live. By default,
 | the vendor folder is in the Root directory, but you can customize that here.
 */
defined('COMPOSER_PATH') || define('COMPOSER_PATH', ROOTPATH . 'vendor/autoload.php');

/*
 |--------------------------------------------------------------------------
 | Timing Constants
 |--------------------------------------------------------------------------
 |
 | Provide simple ways to work with the myriad of PHP functions that
 | require information to be in seconds.
 */
defined('SECOND') || define('SECOND', 1);
defined('MINUTE') || define('MINUTE', 60);
defined('HOUR')   || define('HOUR', 3600);
defined('DAY')    || define('DAY', 86400);
defined('WEEK')   || define('WEEK', 604800);
defined('MONTH')  || define('MONTH', 2_592_000);
defined('YEAR')   || define('YEAR', 31_536_000);
defined('DECADE') || define('DECADE', 315_360_000);

/*
 | --------------------------------------------------------------------------
 | Exit Status Codes
 | --------------------------------------------------------------------------
 |
 | Used to indicate the conditions under which the script is exit()ing.
 | While there is no universal standard for error codes, there are some
 | broad conventions.  Three such conventions are mentioned below, for
 | those who wish to make use of them.  The CodeIgniter defaults were
 | chosen for the least overlap with these conventions, while still
 | leaving room for others to be defined in future versions and user
 | applications.
 |
 | The three main conventions used for determining exit status codes
 | are as follows:
 |
 |    Standard C/C++ Library (stdlibc):
 |       http://www.gnu.org/software/libc/manual/html_node/Exit-Status.html
 |       (This link also contains other GNU-specific conventions)
 |    BSD sysexits.h:
 |       http://www.gsp.com/cgi-bin/man.cgi?section=3&topic=sysexits
 |    Bash scripting:
 |       http://tldp.org/LDP/abs/html/exitcodes.html
 |
 */
defined('EXIT_SUCCESS')        || define('EXIT_SUCCESS', 0);        // no errors
defined('EXIT_ERROR')          || define('EXIT_ERROR', 1);          // generic error
defined('EXIT_CONFIG')         || define('EXIT_CONFIG', 3);         // configuration error
defined('EXIT_UNKNOWN_FILE')   || define('EXIT_UNKNOWN_FILE', 4);   // file not found
defined('EXIT_UNKNOWN_CLASS')  || define('EXIT_UNKNOWN_CLASS', 5);  // unknown class
defined('EXIT_UNKNOWN_METHOD') || define('EXIT_UNKNOWN_METHOD', 6); // unknown class member
defined('EXIT_USER_INPUT')     || define('EXIT_USER_INPUT', 7);     // invalid user input
defined('EXIT_DATABASE')       || define('EXIT_DATABASE', 8);       // database error
defined('EXIT__AUTO_MIN')      || define('EXIT__AUTO_MIN', 9);      // lowest automatically-assigned error code
defined('EXIT__AUTO_MAX')      || define('EXIT__AUTO_MAX', 125);    // highest automatically-assigned error code

/**
 * @deprecated Use \CodeIgniter\Events\Events::PRIORITY_LOW instead.
 */
define('EVENT_PRIORITY_LOW', 200);

/**
 * @deprecated Use \CodeIgniter\Events\Events::PRIORITY_NORMAL instead.
 */
define('EVENT_PRIORITY_NORMAL', 100);

/**
 * @deprecated Use \CodeIgniter\Events\Events::PRIORITY_HIGH instead.
 */
define('EVENT_PRIORITY_HIGH', 10);
// require_once 'db_tables.php';
/**
 * Definition of all table names
 */
define("DATABASE_NAME", "abena");
define('TABLE_PREFIX', 'app_');
define('MODEL_PREFIX', 'model_');

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: APP ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
define('TBL_APP', 'app');											                    // application version etc.
define('TBL_APP_SETTINGS', TABLE_PREFIX.'_settings');									// application settings
define('TBL_APP_SESSIONS', TABLE_PREFIX.'_sessions');				                    // sessions table
define('TBL_APP_MENU', TABLE_PREFIX.'_menu');						                    // menu items
define('TBL_APP_NAV', TABLE_PREFIX.'_nav');												// top navigation items (no permissions required)
define('TBL_APP_LINKS', TABLE_PREFIX.'_links');											// Links
define('TBL_APP_PW_BLACKLIST', TABLE_PREFIX.'_pw_blacklist');							// blacklisted password parts

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: CLIENTS ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
define('TBL_CLIENTS', TABLE_PREFIX.'clients');						                    // application clients
define('TBL_DOMAIN_CONFIG', TABLE_PREFIX.'_domain_config');						    	// custom, domain depending configs

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: APP_LOG ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
define('TBL_LOG_ACCESS', TABLE_PREFIX.'log__access');				                    // log controller access
define('TBL_LOG_DATABASE', TABLE_PREFIX.'log__database');			                    // log database actions
define('TBL_LOG_TASKS', TABLE_PREFIX.'log__tasks');					                    // log sheduled task executions
define('TBL_LOG_EMAIL', TABLE_PREFIX.'log__email');					                    // log sent emails

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: ROLES & RIGHTS :::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
define('TBL_ROLES', TABLE_PREFIX.'roles');							                    // roles table (permission groups)
define('TBL_ROLES_RIGHTS', TABLE_PREFIX.'roles__rights');			                    // permissions 2 roles relation table

define('TBL_RIGHTS', TABLE_PREFIX.'_rights');						                    // permissions table

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: TEMPLATES ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
define('TBL_TEMPLATES_EMAIL', TABLE_PREFIX.'templates__mails');		                    // templates for emails

// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: USER :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
define('TBL_USER', TABLE_PREFIX.'user');                                                // application users
define('TBL_USER_PW_HISTORY', TABLE_PREFIX.'user__pw_history');							// password history
define('TBL_USER_ROLES', TABLE_PREFIX.'user__roles');				                    // roles 2 user relation table


// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: GENERIC MODELS :::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
define('TBL_CONTINENS', MODEL_PREFIX."_continents");						            // continents table
define('TBL_CONTINENS_L18N', MODEL_PREFIX."_continents_l18n");				            // continents localizations
define('TBL_COUNTRIES', MODEL_PREFIX."_countries");						                // country table
define('TBL_COUNTRIES_L18N', MODEL_PREFIX."_countries_l18n");				            // country localizations
define('TBL_LOCALES', TABLE_PREFIX."locales");							                // available localizations / supported application languages
define('TBL_LOCALES_L18N', TABLE_PREFIX."locales__l18n");								// actually the translations
define('TBL_SUBDIVISIONS', MODEL_PREFIX."_subdivisions");				    			// Bundesländer
define('TBL_HISTORY', TABLE_PREFIX."history");								            // History
define('TBL_HISTORY_DETAILS', TABLE_PREFIX."history__details");                         //History Daten


// Tasks
/* End of file db_tables.php */
/* Location: ./application/config/db_tables.php */

define("APP_SALT_SEPERATOR", "~"); 				                                // Dont change... existing users will not be able to login anymore
define('PATH_STATIC_VIEWS','public/');			                                // path to static views
define('PATH_ADMIN_VIEWS','admin/');			                                // path to views which require authorized user
define('PATH_ROOT_VIEWS','root/');				                                // path to views for the superuser
define('PATH_IMAGES','resources/img/');			                                // images
define('PATH_UPLOADS','resources/uploads/');	                                // upload path
define('PATH_JS','resources/js/');				                                // path to own JS files
define('PATH_CSS','resources/css/');			                                // path to own CSS files


// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:: :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..

