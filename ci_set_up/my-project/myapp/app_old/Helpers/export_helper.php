<?php 
/**
 * This helper is autoloaded and will be used by the views
 *
 * @author Marco Eberhardt
 * @category helper
 * @package application\helpers\markup_helper
 * @version 1.2
 */

if ( ! function_exists('sendmail_export_error')) {
	function sendmail_export_error($file, $error)
	{
		/*
		if(	   !defined(EXPORT_ERROR_MAIL_ADDRESS)
	   		|| EXPORT_ERROR_MAIL_ADDRESS == "")
		{
			return new BASE_Result();
		}
		*/

		$ci =& get_instance();

		$message_sent = false;
		$email = EXPORT_ERROR_MAIL_ADDRESS;

		if($email == "")
		{
			return $message_sent;
		}

		try {
			$ci->load->library("BASE_Mailer");

			$mailer = new BASE_Mailer();
			$mailer->setLanguage("DE");

			$data = array(
					"file" => $file,
					"error" => $error,
			);
			$message_sent = $mailer->send_emailFromTemplate(E_MAIL_TEMPLATES::EXPORT_TO_AX_ERROR, $email, $data, array());
		}
		catch(Throwable $e)
		{
			$message_sent = false;
		}

		return new BASE_Result($message_sent);
	}
}

if ( ! function_exists('moveExportFilesToFTPOrSFTP'))
{
	/**
	 * @param string $fromLocalFilename
	 * @param string $toRemoteFilename
	 * @param string $directorySub
	 * @param bool $useFTP
	 * @param bool $useSFTP
	 * @return BASE_Result
	 */
	function moveExportFilesToFTPOrSFTP(string $fromLocalFilename, string $toRemoteFilename, string $directorySub, bool $useFTP, bool $useSFTP): BASE_Result
	{
		try {


		$ci =& get_instance();
		$path = $ci->config->item("root_path") . "restricted/".SHARE_DRIVE."/";

		$result = new BASE_Result(FALSE);

		switch ($directorySub){
			case DIR_DEBITOR_EXPORT:
				$localProcessedFilepath = $path.DIR_DEBITOR_EXPORT_PROCESSED.$fromLocalFilename;
				$localFailFilepath = $path.DIR_DEBITOR_EXPORT_FAILED.$fromLocalFilename;
				break;
			case DIR_PRESCRIPTION_EXPORT:
				$localProcessedFilepath = $path.DIR_PRESCRIPTION_EXPORT_PROCESSED.$fromLocalFilename;
				$localFailFilepath = $path.DIR_PRESCRIPTION_EXPORT_FAILED.$fromLocalFilename;
				break;
			case DIR_ORDER_EXPORT:
				$localProcessedFilepath = $path.DIR_ORDER_EXPORT_PROCESSED.$fromLocalFilename;
				$localFailFilepath = $path.DIR_ORDER_EXPORT_FAILED.$fromLocalFilename;
				break;
			default:
				$result->error = "Invalid DirectorySub";
				return $result;
		}

		$fromLocalFilepath	= $path.$directorySub.$fromLocalFilename;
		if ($useSFTP)
		{
			$ci->load->library('Sftp', NULL, 'ftp');
		}
		else
		{
			$ci->load->library('ftp');
		}

		$toRemoteDirectorypath = FTP_SUB_DIR.$directorySub;
		$tmpToRemoteDirectorypath = FTP_SUB_DIR.$directorySub."tmp/";

		$toRemoteFilepath = $toRemoteDirectorypath.$toRemoteFilename;
		$tmpToRemoteFilepath = $tmpToRemoteDirectorypath.$toRemoteFilename;

		$ci->ftp->connect(); // @see config/sftp.php for connection details
		//$ci->ftp->changedir($toRemoteDirectorypath);
		$ok = false;
		if(!($ok = $ci->ftp->changedir($tmpToRemoteDirectorypath, true)))
		{
			if($ok = $ci->ftp->mkdir($tmpToRemoteDirectorypath))
			{
				$ok = $ci->ftp->changedir($tmpToRemoteDirectorypath, true);

				if(!$ok)
				{
					$result->error = "Error changing to temporary remote folder";
				}
			}
			else
			{
				$result->error = "Error creating temporary remote folder";
			}
		}

		if($ok)
		{
			// ..:: Upload remote file
			//if ($ci->ftp->upload($fromLocalFilepath, $toRemoteFilepath)){
			if ($ci->ftp->upload($fromLocalFilepath, $tmpToRemoteFilepath)) {
				$fileStats = $ci->ftp->getFileStats($tmpToRemoteFilepath);
				if(is_array($fileStats)) {

					$stat = stat($fromLocalFilepath);
					$sizeLocalFile = $stat['size'];
					$sizeRemoteFile = $fileStats['size'];

					if ($sizeLocalFile == $sizeRemoteFile)
					{
						if ($ci->ftp->move($tmpToRemoteFilepath, $toRemoteFilepath, true)) {

							$concurrentDirectory = pathinfo($localProcessedFilepath, PATHINFO_DIRNAME);
							if (!is_dir($concurrentDirectory) &&
								!mkdir($concurrentDirectory) && !is_dir($concurrentDirectory)) {
								$result->error = sprintf('Directory "%s" was not created', $concurrentDirectory);
							}
							$mv = @rename($fromLocalFilepath, $localProcessedFilepath);
							/*
							if ($mv === false) {
								$result->error = "Error moving local file";
							}
							*/
						} else {
							$result->error = "Error moving remote file";

							$concurrentDirectory = pathinfo($localFailFilepath, PATHINFO_DIRNAME);
							if (!is_dir($concurrentDirectory) &&
								!mkdir($concurrentDirectory) && !is_dir($concurrentDirectory)) {
								$result->error = sprintf('Directory "%s" was not created', $concurrentDirectory);
							}
							$mv = @rename($fromLocalFilepath, $localFailFilepath);
							/*
							if ($mv === false) {
								$result->error = "Error moving local file";
							}
							*/
						}
					}
					else
					{
						$result->error = "validation error: local and remote file sizes differ: '$sizeLocalFile' <> '$sizeRemoteFile'";
						$mv = @rename($fromLocalFilepath, $localFailFilepath);
						/*
						if ($mv === false) {
							$result->error = "Error moving local file";
						}
						*/
					}
				}
				else
				{
					$result->error = "Error getting remote file stats";
					$mv = @rename($fromLocalFilepath, $localFailFilepath);
					/*
					if ($mv === false) {
						$result->error = "Error moving local file";
					}
					*/
				}
			}
			else
			{
				$concurrentDirectory = pathinfo($localFailFilepath, PATHINFO_DIRNAME);
				if ( ! is_dir($concurrentDirectory) &&
					! mkdir($concurrentDirectory) && ! is_dir($concurrentDirectory))
				{
					$result->error = sprintf('Directory "%s" was not created', $concurrentDirectory);
				}
				$mv = rename ($fromLocalFilepath, $localFailFilepath);
				if ($mv === true)
				{
					$result->error = "Error moving remote file";
				}
				else
				{
					$result->error = "Error moving local file";
				}
			}
		}

		}
		catch(Throwable $e)
		{
			$result->error = $e->getMessage();
		}

		return $result;
	}
}

?>
