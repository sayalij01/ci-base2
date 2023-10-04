<?php

    const DB_ERROR		= "DB-ERROR";
	const ERROR			= "ERROR";
	const FORBIDDEN		= "403";
	const NOT_FOUND		= "404";
	const SUCCESS		= "SUCCESS";

    const DEBUG		= "debug";
	const INFO		= "info";
	const ERROR 	= "error";
	const WARNING 	= "warning";
	const OK 	    = "ok";
/**
 * @package application\helpers\enum_helper
 * @see resources/css/global.css
 */
// E_BG_COLOR
    const APP_BLUE			= "bg-app-blue";
	const APP_BLUE_DARK		= "bg-app-blue-dark";
	const APP_BLUE_DARKER	= "bg-app-blue-darker";

	const GREY			= "bg-grey";
	const BLACK			= "bg-black";
	const RED			= "bg-red";
	const YELLOW		= "bg-yellow";
	const AQUA			= "bg-aqua";
	const BLUE			= "bg-blue";
	const LIGHT_BLUE	= "bg-light-blue";
	const GREEN			= "bg-green";
	const NAVY			= "bg-navy";
	const TEAL			= "bg-teal";
	const OLIVE			= "bg-olive";
	const LIME			= "bg-lime";
	const ORANGE		= "bg-orange";
	const FUCHSIA		= "bg-fuchsia";
	const PURPLE		= "bg-purple";
	const MAROON		= "bg-maroon";
	const WHITE			= "bg-white";
	const SILVER		= "bg-silver";
//E_BUTTON_TYPES
    const BUTTON	= "button";
	const SUBMIT	= "submit";
	const RESET		= "reset";

    // E_CACHE_CONTROL
    

if (!function_exists('E_STATUS_CODE')) {
    function E_STATUS_CODE($value)
    {
        return $value ;
    }
}

if (!function_exists('E_TASK_MESSAGE_LEVEL')) {
    function E_TASK_MESSAGE_LEVEL($value)
    {
        return $value ;
    }
}

if (!function_exists('custom_helper_function')) {
    function custom_helper_function($param1, $param2)
    {
        // Your custom helper function logic here
        return $param1 + $param2;
    }
}