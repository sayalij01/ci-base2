<?php

use CodeIgniter\Files\File;
use CodeIgniter\Files\Exceptions\FileException;
/**
 * This helper is intenden to generate debug outputs (To file and via echo)
 * 
 * @author Marco Eberhardt
 * @category helper
 * @package application\helpers
 * @version 1.0
 */
include APPPATH . 'Enums/EnumCollection.php';

if ( ! function_exists('write2Debugfile'))
{
	/**
	 * Writes $data to a file. The default directory is $CI->config->item('log_path')."debug/"
	 * works only if php $CI->config->item('enable_debugFiles') == 1
	 *
	 * @author Marco Eberhardt
	 * @category helper
	 * @package application\helpers
	 * @subpackage debug_helper
	 * @version 1.0
	 *
	 * @param string $filename	>> the filename
	 * @param string $data		>> the content
	 * @param bool $append		>> append content if <code>true</code>
	 */
	function write2Debugfile($filename, $data, $append=true)
	{
		// $CI =& get_instance();
		
		// print_r($filename);die;
		$config = config('App');
		$file = new File($filename);
		$path = $config->log_path;
			// echo $path ;die;
		if ($config->app['enable_debug_files'] == 1)
		{
			helper('file_helper');
			$path = $config->log_path;

			// echo $path;die;
			if (!is_dir($path)){
				if (!mkdir($path, 0755, true) && !is_dir($path)) {

					throw new \RuntimeException(sprintf('Directory "%s" was not created', $path));
				}
			}


			$session = service('session');
			
			$client_id =  $session->get(\App\Enums\E_SESSION_ITEM::CLIENT_ID);
			// echo $client_id;die;

			if ($client_id != "")
			{
				$path .= "client_".$client_id."/";
				
				if (!is_dir($path)){
					if (!mkdir($path, 0600, true) && !is_dir($path)) {
						throw new \RuntimeException(sprintf('Directory "%s" was not created', $path));
					}
				}
			}
			$mode = $append ? 'a' : 'w+';

			helper('filesystem');
			write_file($path . $filename, "\n" . $data, $mode);
		}
	}
}

if ( ! function_exists('echome'))
{
	/**
	 * Echo an array, object or string within a <pre> element 
	 * 
	 * @author Marco Eberhardt
	 * @category helper
	 * @package application\helpers
	 * @subpackage debug_helper
	 * @version 1.0
	 *
	 * @param mixed $echo
	 * 
	 * @return void >> echoes a string
	 */
	function echome($echo, $return=false)
	{
		if (!$return)
		{
			echo "ECHOME:<br>";
			if (is_array($echo) || is_object($echo)){
				echo '<pre class="wells">'.print_r($echo, true)."</pre>";
			}else{
				echo '<pre class="wells">'.$echo."</pre>";
			}
		}
		else
		{
			$return = "";
			if (is_array($echo) || is_object($echo)){
					$return = '<pre class="wells">'.print_r($echo, true)."</pre>";
				}else{
					$return = '<pre class="wells">'.$echo."</pre>";
				}
			return $return;
		}

	}
}

if(!function_exists("buildPageAlertHTMLWrapper"))
{
    /**
     * Wrapper function to display errors, infos, warnings and so on, in main content page
     * displays strings only in DEVELOPMENT-Mode and only if given strings not empty
     * 
     * @author Marco Eberhardt
     * @category helper
     * @package application/helpers
     * @subpage debug_helper
     * @version 1.0
     * 
     * @param string $error
     * @param string $success
     * @param string $warning
     * @param string $info
     * 
     * @return string
     */
    function buildPageAlertHTMLWrapper($error, $success, $warning, $info)
    {
        if (ENVIRONMENT == E_ENVIRONMENT::DEVELOPMENT)
        {
            $return = "<div class=\"row\">
        		          <div class=\"col-xs-12\">
        			         ".buildPageAlerts($error, $success, $warning, $info)."
        		          </div>
        	           </div>";
        }
        return $return;
    }
}

if(!function_exists("addTimestamp"))
{
	/**
	 * Append timestamps to includes to avoid cacheing
	 * @see views/templates/skeleton 
	 * 
	 * @author Marco Eberhardt
     * @category helper
     * @package application/helpers
     * @version 1.0
     * 
	 * @return string
	 */
    function addTimestamp()
    {
        if(ENVIRONMENT == E_ENVIRONMENT::TESTING){
            return "?ts=".time();
        }
		return "";
    }
}

?>