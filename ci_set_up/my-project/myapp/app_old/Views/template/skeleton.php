<?php 
	$stamp 			= (ENVIRONMENT == E_ENVIRONMENT::PRODUCTION ? "?".time() : "");
	$cdn			= './assets/';
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
	<title><?php echo $title ?></title>
</head>
<body>

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