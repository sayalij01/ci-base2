<?php
$datatable = new HTML_Datatable("datasheet_table",$columns,$data,null,E_VISIBLE::YES,E_ENABLED::YES,array(),array(),array());


?>
<div class="col-lg-12">
    <div class="col-lg-12">
        <?php
        echo $datatable->generateHTML();
        ?>
    </div>
</div>
<script>
    let tbl_columns_datasheets = <?php echo json_encode($columns); ?>;
</script>
