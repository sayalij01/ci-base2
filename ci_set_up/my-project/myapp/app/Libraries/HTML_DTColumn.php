<?php
namespace App\Libraries;
use App\Libraries\HTML;

use App\Enums\E_VISIBLE;

use App\Enums\E_ENABLED;

use App\Enums\E_DISMISSABLE;

use App\Enums\E_COLOR , App\Enums\E_SIZES, App\Enums\E_BUTTON_TYPES;
use App\Enums\E_ICONS ,App\Enums\E_HORIZONTAL_POSITION;


class HTML_DTColumn extends HTML
{
	public $table			= "";
	public $data			= "";
	public $label 			= "";
	public $bSortable		= true;
	public $sSortDataType	= "string"; // string | numeric | date
	public $bVisible 		= true;
	public $visible 		= true;
	public $mRender			= NULL;
	public $searchable		= true;
	public $name		= true;

	public $filter			= null;	//

	/**
	 * Table column
	 *
	 * @param string $data_field		>> will also be used as identifier
	 * @param string $label				>> column label / heading
	 * @param E_SORTABLE $sortable		>> sortable column (datatable specific)
	 * @param E_VISIBLE|bool $visible		>> visible column
	 * @param string $jsRowCallback		>>
	 * @param E_SEARCHABLE $searchable	>> searchable column (datatable specific)
	 *
	 * @param array $styles				>> the usual tata
	 * @param array $classes			>> the usual tata
	 * @param array $attributes			>> the usual tata
	 *
	 *
	 * @return $this
	 */
	function __construct($data_field="", $label="", $sortable=true, $visible=true, $searchable = true, $filter=null, $styles=array(), $classes=array(), $attributes=array())
	{
		parent::__construct($data_field, $data_field, $visible, E_ENABLED::YES, $styles, $classes, $attributes);


		$segm = explode(".",$data_field);
		if (count($segm) == 2)
		{
			list($this->table, $this->data) = explode(".",$data_field);
		}
		else
		{
			$this->data	 		= $data_field;
		}
		$this->defaultClasses["column"] = $classes;
		$this->addAttribute("data-field", $data_field);


		$this->label		= $label;
		$this->bSortable 	= $sortable;
		$this->bVisible		= $visible;
		$this->visible		= $visible;
		$this->mRender 		= null;//$jsRowCallback;
		$this->searchable	= $searchable;
		$this->filter		= $filter;
		$this->name			= $this->data;


		write2Debugfile("html_table_column.log", "this->\n".print_r($this, true), true);


		return $this;
	}

	/**
	 * @param string $id >> prefix filter will be added autom.
	 */
	public static function buildInputFilter($id, $placeholder=""){
		return new HTML_Input("filter_".$id, "filter_".$id, E_INPUTTYPE::TEXT, $placeholder, "", "", "", E_ENABLED::YES, E_VISIBLE::YES, array(), array("table-filter"), array());
	}

	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..
	// Setter functions for HTML_DTColumn
	// ..:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::..

	/**
	 * setter for <code>$this->label</code>
	 *
	 * @param string $value
	 * @return $this
	 */
	public function setLabel($value){
		$this->label = $value;
		return $this;
	}

	/**
	 * setter for <code>$this->bSortable</code>
	 *
	 * @param string $value
	 * @return $this
	 */
	public function setSortable($bool){
		$this->bSortable = $bool;
		return $this;
	}


	/**
	 * setter for <code>$this->filter</code>
	 *
	 * @param string $value
	 * @return $this
	 */
	public function setFilter($value){
		$this->label = $value;
		return $this;
	}
}
// END OF >> HTML_DTColumn