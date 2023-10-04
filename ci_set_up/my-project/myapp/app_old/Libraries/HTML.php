<?php
namespace App\Libraries;

use App\Enums\E_VISIBLE;

use App\Enums\E_ENABLED;

use App\Enums\E_DISMISSABLE;

use App\Enums\E_COLOR , App\Enums\E_SIZES, App\Enums\E_BUTTON_TYPES;
use App\Enums\E_ICONS ,App\Enums\E_HORIZONTAL_POSITION;

class HTML 
{
	const DEBUG_FILENAME 			= "HTML.log";

	protected $cls_draggable		= " draggable";
	protected $attributeBlacklist	= array("id", "name", "class", "style");
	protected $defaultStyles		= array();
	protected $defaultClasses		= array();

	protected $id 					= "";
	protected $name 				= "";
	protected $title 				= "";
	protected $visible 				= true;
	protected $enabled 				= true;
	protected $draggable			= false;

	public $styles					= array();
	public $classes					= array();
	public $attributes 				= array();

	// tmp
	protected $styleString			= "";
	protected $classString			= "";
	protected $attrString			= "";


	/**
	 * Base construct for all HTML-Elemets
	 *
	 * @param string $id			>> Id
	 * @param string $name			>> Name
	 * @param E_VISIBLE|bool $visible	>>
	 * @param E_ENABLED|bool $enabled	>>
	 * @param string $styles		>> array for custom style attributes.
	 * @param string $classes		>> array for custom class attributes.
	 * @param string $attributes	>> array for additional attributes.	@see <code>$this->$attributeBlacklist</code> for disallowed attributes
	 *
	 * @return void
	 */
	public function __construct($id, $name="", $visible=true, $enabled=true, $styles=array(), $classes=array(), $attributes=array() )
	{


		write2Debugfile(self::DEBUG_FILENAME, "\n", false);

		if (!E_VISIBLE::isValidValue($visible)){
			$visible = E_VISIBLE::YES;
		}
		if (!E_ENABLED::isValidValue($enabled)){
			$enabled = E_ENABLED::YES;
		}

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		if ($visible === false){
			//$styles["display"] = "none"; // override if exists
			$classes[] = "hidden";
		}

		self::setID($id);
		self::setName($name);
		self::setVisible($visible);
		self::setEnabled($enabled);

		self::setStyles($styles);
		self::setClasses($classes);
		self::setAttributes($attributes);

	}

	/**
	 * Generates the complete string with custom attributes, build from attrubutes array <code>$this->attributes</code>
	 * @return string
	 * */
	public function getAttributesString($forWhat="")
	{
		//$explizitClassName = get_called_class();

		$this->attrString = "";
		if(count($this->attributes) > 0){
			foreach ($this->attributes as $key => $val)
			{
				if (in_array($key, $this->attributeBlacklist))
				{
					log_message(E_LOGLEVEL::ERROR, "getAttributesString() => attribute key '$key' ignored (called by ".get_called_class().")");
					continue;
				}

				if (is_array($val)){
					$val = base64_encode(json_encode($val));
				}

				if ($key != ""){
					$this->attrString .= ' '.$key.'="'.str_replace('"', "'", $val).'"';
				}
			}
		}
		return ($this->attrString != "" ? " ".$this->attrString:"");
	}

	/**
	 * Generates the complete class-attribute string, build from
	 * default array <code>$this->defaultClasses</code> and also class array <code>$this->classString </code> if desired
	 *
	 * @param string $arrayKey 		>> specific item
	 * @param bool $includeCustoms 	>> when false, <code>$this->classes </code> will not be used (only <code>$this->defaultClasses </code>).
	 *
	 * @return string $this->string >> complete class-attribute string
	 *
	 * */
	public function getClassString($arrayKey, $includeCustoms=false)
	{
		$explizitClassName = get_called_class();

		if($includeCustoms == true)
		{
			$this->defaultClasses[$arrayKey] = array_merge($this->defaultClasses[$arrayKey], $this->classes);
		}

		$this->classString 	= "";


		if ($arrayKey != "" && array_key_exists($arrayKey, $this->defaultClasses) === false){
			show_error("Key ($arrayKey) not found for $explizitClassName");
		}
		foreach ($this->defaultClasses[$arrayKey] as $val)
		{
			if($val != ""){
				$this->classString .= $val.' ';
			}
		}
		$this->classString = 'class="'.substr($this->classString, 0, -1).'"';

		return $this->classString;
	}

	/**
	 * Generates the complete styles-attribute string, build from default array <code>$this->defaultStyles</code> and custom styles array <code>$this->styles </code>

	 * @return string >> complete style string
	 */
	public function getStyleString()
	{
		if ($this->visible === false){
			$this->defaultStyles["display"] = "none";
		}


		$styleString = "";
		if (is_array($this->styles))
		{
			foreach ($this->defaultStyles as $key => $val)
			{
				if (array_key_exists($key, $this->styles))
				{
					unset($this->defaultStyles[$key]); // unset from default array
				}
			}
		}
		if (count($this->defaultStyles) > 0)
		{
			$this->styles = array_merge($this->defaultStyles, $this->styles);
		}

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		foreach ($this->styles as $key => $val)
		{
			$styleString .= ' '.$key.':'.$val.';';
		}

		// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
		if ($styleString != "")
		{
			$styleString = 'style="'.substr($styleString, 1).'"';
		}

		$this->styleString = $styleString;

		return $styleString;
	}

	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: SOME GETTER
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	public function getIDString(){
		if ($this->id != ""){
			return 'id="'.$this->id.'"';
		}
		return "";
	}

	public function getNameString(){
		if ($this->name != ""){
			return 'name="'.$this->name.'"';
		}
		return "";
	}

	public function getTitleString(){
		if ($this->title != "")
		{
			$placement = (isset($this->attributes["data-placement"]) ? "_".$this->attributes["data-placement"]:"");
			return 'title'.$placement.'="'.$this->title.'"';
		}
		return "";
	}

	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// ..:: SETTER METHODS
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..

	/**
	 * Setter for custom attributes <code>$this->attributes </code>
	 *
	 * @param array $attributes
	 * @return $this
	 */
	public function setAttributes($attributes=array())
	{
		if ( is_array($attributes) && count($attributes) > 0 ){
			$this->attributes 	= $attributes;
		}
		return $this;
	}

	/**
	 * Simply add a class string to the classes array
	 *
	 * @param string $class
	 * @return $this
	 */
	public function addAttribute($key, $value="")
	{
		$this->attributes[$key] = $value;

		return $this;
	}

	/**
	 * simply add a class string to the classes array
	 * @param string $class
	 * @return $this
	 */
	public function addClass($class)
	{
		if (! in_array($class, $this->classes)){
			$this->classes[] = $class;
		}
		return $this;
	}

	/**
	 * setter for custom classes <code>$this->classes </code>
	 *
	 * @param array $classes
	 * @return $this
	 */
	public function setClasses($classes=array())
	{
		if ( is_array($classes) && count($classes) > 0 ){
			$this->classes = array_unique($classes);
		}
		return $this;
	}

	/**
	 * setter for <code>$this->draggable </code>
	 *
	 * @param E_DRAGGABLE $draggable
	 * @return $this
	 */
	public function setDraggable($draggable=true)
	{
		if (! E_DRAGGABLE::isValidValue($draggable) ){
			$draggable	= E_DRAGGABLE::NO;
		}

		$this->draggable = $draggable;
		return $this;
	}

	/**
	 * setter for custom styles <code>$this->styles </code>
	 *
	 * @param array $styles
	 * @return $this
	 */
	public function setStyles($styles=array())
	{
		if ( is_array($styles) && count($styles) > 0 ){
			$this->styles 	= $styles;
		}
		return $this;
	}

	/**
	 * setter for the id value
	 * @param string $string
	 * @return $this
	 */
	public function setID($string){
		$this->id = $string;
		return $this;
	}

	/**
	 * setter for the name value
	 * @param string $string
	 * @return $this
	 */
	public function setName($string){
		$this->name = $string;
		return $this;
	}

	/**
	 * setter for the title
	 * @param string $string
	 * @return $this
	 */
	public function setTitle($string, $position="top"){
		$this->title = $string;
		if (! E_TOOLTIP_POSITION::isValidValue($position) ){
			$position	= E_TOOLTIP_POSITION::TOP;
		}
		$this->attributes["data-placement"] = $position;
		return $this;
	}

	/**
	 * setter for the enabled state
	 * @param E_ENABLED|bool $bool
	 * @return $this
	 */
	public function setEnabled($bool){
		$this->enabled = boolval($bool);
		return $this;
	}

	/**
	 * setter for the visible state
	 * @param E_VISIBLE|bool|bool $bool
	 * @return $this
	 */
	public function setVisible($bool){
		$this->visible = boolval($bool);
		return $this;
	}
}
// END OF >> HTML