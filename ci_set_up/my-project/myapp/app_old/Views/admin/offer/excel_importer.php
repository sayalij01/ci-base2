<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.13.5/xlsx.full.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.13.5/jszip.js"></script>
<?php
    $upload_btn = '<input id="input_upload_excel_importer" name="upload_excel_importer[]" multiple class="btn btn-block btn-default" type="file">';
?>

<div class="row">
    <div class="col-xs-12">
        <?php echo $upload_btn; ?>
    </div>
</div>
<div id="uploaded_data"></div>
<br><br>
<div class="row">
    <div class='col-xs-2'>
        <button class='btn btn-primary'  id='' onclick='import_DataExcel()'>Import</button>
    </div>
</div>
