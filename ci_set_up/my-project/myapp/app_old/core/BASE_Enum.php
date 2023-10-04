<?php
namespace app\core;

use ReflectionClass;

class BASE_Enum
{
	private static $constCache = NULL;

	/**
	 * Get all constants from caller class or by providing an class name as parameter
	 * 
	 * @param string $explizitClassName
	 * @return multitype:
	 */

	 public static function myBaseEnumFunction()
	 {
		 // Your function logic here
		 return "Hello from myBaseEnumFunction!";
	 }
	public static function getConstants($explizitClassName="")
	{
		if($explizitClassName == ""){
			$explizitClassName = get_called_class();
		}

		$reflect = new ReflectionClass($explizitClassName);
		self::$constCache = $reflect->getConstants();

		return self::$constCache;
	}
	
	/**
	 * Reverse of getConstants for Select2 options
	 * Get all constant names from caller class or by providing an class name as parameter with the values as index
	 *
	 * @param string $explizitClassName
	 * @param bool $forSelect2
	 * @param bool $translated
	 * @return array
	 */
	public static function getConstantNames($explizitClassName="", $forSelect2=true, $translated=true)
	{
		$return = array_flip((array)self::getConstants($explizitClassName));
		
		foreach ($return as $index => &$label)
		{
			if ($translated)
			{
                $newlabel = lang(($label));
			    if($newlabel == $label.'#')
                {
                    $label = lang(strtolower($label));
                }
			    else{
			        $label = $newlabel;
                }
			}
			
			if ($forSelect2)
			{
				$return[$index] = array("id" =>$index, "label"=> $label);
			}
		}
		
		return $return;
	}
	
	/** 
	 * Check, if the given $name is valid for the caller class
	 * 
	 * @param string $name
	 * @param bool $strict
	 * @return boolean
	 */
	public static function isValidName($name, $strict = false)
	{
		$constants = self::getConstants();

		if ($strict) {
			return array_key_exists($name, $constants);
		}
		$keys = array_map('strtolower', array_keys($constants));

		return in_array(strtolower($name), $keys);
	}

	/**
	 * Check, if the provided $value is valid for the class
	 *
	 * @param string $value
	 * @param string $explizitClassName
	 * @return boolean
	 */
	public static function isValidValue($value, $explizitClassName="")
	{
		$values = array_values(self::getConstants($explizitClassName));
		$return = in_array($value, $values, $strict = true);
		if ($return == false){
			//show_error("no validValue[$value]");
		}
		return $return ;
	}
}
?>