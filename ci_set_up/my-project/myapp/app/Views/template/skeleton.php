<?php 
use Config\Services;
$this->config = \Config\Services::config();
$this->config = new \Config\App();
// $language = service('language');	
$this->lang = \Config\Services::language();
	$stamp 			= (ENVIRONMENT == E_ENVIRONMENT::PRODUCTION ? "?".time() : "");
	// $cdn			= './assets/';
	$uri = service('uri');
	$numSegments = $uri->getTotalSegments();

	if($numSegments == 1){
		$cdn			= './assets/';
	}else{
		$cdn			= '../assets/';

	}
	

	$lang			= (isset($_SESSION[E_SESSION_ITEM::USER_LANGUAGE]) ? strtolower($_SESSION[E_SESSION_ITEM::USER_LANGUAGE]) : "de");
	$cache_control	= E_CACHE_CONTROL::NO_CACHE.",".E_CACHE_CONTROL::NO_STORE.",".E_CACHE_CONTROL::MUST_REVALIDATE.",".E_CACHE_CONTROL::MAX_AGE(31536000);
?>
<!doctype html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="Cache-Control" content="<?php echo $cache_control;?>">
	<meta http-equiv="pragma" content="<?php echo $cache_control;?>">
	<meta http-equiv="content-language" content="<?php echo $loaded_language;?>" />
	<meta http-equiv="Accept-encoding" content="gzip, deflate"/>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
	<meta name="description" content="<?php echo $description ?>" />
	<meta name="keywords" content="<?php echo $keywords ?>" />
	<meta name="robots" content="noindex,nofollow">
	<meta name="author" content="<?php echo $author ?>" />
	<meta name="date" content="<?php echo date("c");?>"/>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.2.1/css/fontawesome.min.css" />
	<title><?php echo $title ?></title>
</head>
<body>
	<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
	<script>var baseUrl 	= "<?php echo base_url(); ?>";</script>
	<script>
		
		var baseUrl 	= "<?php echo base_url(); ?>";
		var env			= "<?php echo ENVIRONMENT; ?>";
		$.lang = {
			locale		: "<?php echo $this->config->language; ?>",
			language 	: <?php echo json_encode($this->lang);?>,
			item : function(languageItem)
			{
				var i = $.lang.language[languageItem];
				if (i == undefined || i == ""){
					i = languageItem;
				}
				return i;
			} 
		}
		
	</script>

	<script src="<?php echo base_url(PATH_JS."generic/app.js");?>"></script>
	<script src="<?php echo base_url(PATH_JS."generic/dialogs.js");?>"></script>
	<script src="<?php echo base_url(PATH_JS."generic/validate.js");?>"></script>
	<?php foreach($plugins_js as $plugin): ?>
	<script src="<?php echo $cdn.$plugin; ?>"></script>
	<?php endforeach;?>
    <?php echo $body; ?> 
	<?php foreach($javascript as $js)
	      {
            if($js != "overview.js")
            {
                if (preg_match('/^http/', $js.$stamp))
                {
                    echo "<script src=\"".$js."\"></script>";
                }
                else
                {
                    echo "<script src=\"".base_url().PATH_JS.$js.$stamp."\"></script>";
                }

            }
	      }
    ?>
	

</body>
</html>