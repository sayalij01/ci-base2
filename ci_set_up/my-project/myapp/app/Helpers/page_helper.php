<?php 
/**
 * This helper is autoloaded and will be used by the views  
 *
 * @author Marco Eberhardt
 * @category helper
 * @package application\helpers\markup_helper
 * @version 1.2
 */
use CodeIgniter\HTTP\URI;
if ( ! function_exists('buildPageAlerts'))
{
	/**
	 * create markup (Alerts) for 4 different message types.
	 * 
	 * @author Marco Eberhardt
	 * @category helper
	 * @package application\helpers\page_helper
	 * @version 1.1
	 * 
	 * @param string $error
	 * @param string $success
	 * @param string $warning
	 * @param string $info
	 *
	 * @return string
	 */


	function buildPageAlerts($error, $success, $warning, $info)
	{
		$dismissable = (isset($_SESSION[E_SESSION_ITEM::JS_ENABLED]) && $_SESSION[E_SESSION_ITEM::JS_ENABLED] == 1 ? true:false);
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$a_danger = "";
		if(isset($error) && $error)
		{
			$a_danger = new HTML_Alert("msg_error", lang("error"), $error, E_COLOR::DANGER, $dismissable);
			$a_danger = $a_danger->generateHTML();
		}
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$a_success = "";
		if(isset($success) && $success != "")
		{
			$a_success = new HTML_Alert("msg_error", lang("success"), $success, E_COLOR::SUCCESS, $dismissable);
			$a_success = $a_success->generateHTML();
		}
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$a_warning = "";
		if(isset($warning) && $warning != "")
		{
			$a_warning = new HTML_Alert("msg_warning", lang("warning"), $warning, E_COLOR::WARNING, $dismissable);
			$a_warning = $a_warning->generateHTML();
		}
		
		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		$a_info = "";
		if(isset($info) && $info != "")
		{
			$a_info = new HTML_Alert("msg_info", lang("info"), $info, E_COLOR::INFO, $dismissable);
			$a_info = $a_info->generateHTML();
		}
	
		
		$return = $a_danger . $a_warning . $a_info . $a_success;
		
		return $return;
	}
}

if ( ! function_exists('buildPageHeading'))
{
	/**
	 * Create markup for the page heading
	 * 
	 * @author Marco Eberhardt
	 * @category helper
	 * @package application\helpers\page_helper
	 * @version 1.0
	 *
	 * @param string $seg1
	 * @param string $seg2
	 * @param string $seperator
	 *
	 * @return string
	 */
	function buildPageHeading($seg1, $seg2="", $seperator='<i class="fa fa-angle-double-right"></i>')
	{
		$com = '
		<div class="row">
			<div class="col-xs-12">
				<div class="page-header">
					<h1>'.ucfirst($seg1).' <small>'.$seperator.' '.ucfirst($seg2).'</small></h1>
				</div>
			</div>
		</div>';

		return $com;
	}
}

if ( ! function_exists('buildBreadcrumb'))
{
	/**
	 * generates the markup for a breadcrump by the URI
	 * 
	 * @author Marco Eberhardt
	 * @category helper
	 * @package application\helpers\page_helper
	 * @version 1.2
	 *
	 * @return string
	 */
	function buildBreadcrumb($last_item="")
	{
		/**
		 * Breadcrump template view
		 * build a crump for every uri segment
		 */
		$controller_methods = E_CONTROLLER_METHOS::ALL;
		$stop_at_controller	= false;

		if ($last_item != ""){
			$stop_at_controller = true;
		}


		/* $ci =& get_instance();
		$segs = $ci->uri->segment_array();
 */
		$uri = service('uri');

		// Get an array of URI segments
		$segs = $uri->getSegments();


		$BREADCRUMB	= '<nav aria-label="breadcrumb">
						<ol class="breadcrumb">
							<li class="breadcrumb-item"><a href="'.site_url().'home">'.lang("home").'</a></li>';

		$tmp		= "";
		$uriString = $uri->getPath();
		helper('url');
		$currentURL = current_url();
		// $ex_uri 	= explode("/", $ci->uri->uri_string);
		$ex_uri = explode("/", $uriString);

		write2Debugfile("buildBreadcrumb.log", "uri_string[".$uri->getPath()."] exploded-uri_string".print_r($ex_uri, true)."\nsegments-array-".print_r($segs, true) , false);

		$is_parameter 	= false;
        //die("<pre>".print_r($ex_uri,true)."</pre>");

        // Abena Specials
        $newUriList = array();
        foreach($ex_uri as $key=>$uri)
        {
            if(strtolower($uri) == "prescriptions")
            {
                $newUriList[] = "debitors";
            }
            $newUriList[] = $uri;
        }
        $ex_uri = $newUriList;
		// print_r($ex_uri);

		foreach ($ex_uri as $key => $uri)
		{
			if ($uri == "home"){
				continue;
			}
			$tmp 	.= $uri."/";

			$icon	= "";
			if (array_key_exists($uri, $controller_methods))
			{
				$icon = $controller_methods[$uri]["icon"]." ";
					
				if ($stop_at_controller == true)
				{
					$last_piece 	= $tmp;
					$c 				= ($key+1);
					$lbl 			= lang($uri).'' ;

					if ($last_item != ""){
						$lbl .= ' <i class="fa fa-angle-double-right"></i> '.$last_item."/";
					}
                    // die("<pre>".print_r($ex_uri,true)."</pre>");die;
					while ($c < count($ex_uri))
					{
                        if ($last_item == ""){
                            $lbl .= $ex_uri[$c]."-";
                        }
                        $last_piece .= $ex_uri[$c]."/";
                        $c++;
                    }

					$BREADCRUMB .= '<li'.(count($ex_uri) == $c ? ' class="breadcrumb-item active"':"").'>';
					$BREADCRUMB .= '<a href="'.base_url().substr($last_piece, 0, -1).'">'.$icon.''.ucfirst(substr($lbl, 0, -1)).'</a>';
					$BREADCRUMB .= '</li>';
					break;
				}
			}
			$BREADCRUMB .= '<li class="breadcrumb-item active>';
            $BREADCRUMB .= '<a href="'.base_url().substr($tmp, 0, -1).'">'.$icon.''.ucfirst(lang($ex_uri[$key])).'</a>';
			$BREADCRUMB .= '</li>';
			//write2Debugfile("buildBreadcrumb.log", "key[".$key."] uri[".$uri."]" );
		}
		$BREADCRUMB .= '</ol>
						</nav>';
		return $BREADCRUMB;
	}
}

?>