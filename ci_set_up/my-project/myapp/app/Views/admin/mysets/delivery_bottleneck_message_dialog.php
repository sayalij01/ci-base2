<?php
    $h_client_id = new HTML_Input("i_hidden_dbn_client_id","hidden_dbn_client_id",E_INPUTTYPE::HIDDEN,"",$data["parameters"]["client_id"]);
    $h_kitpack_id = new HTML_Input("i_hidden_dbn_kitpack_id","hidden_dbn_kitpack_id",E_INPUTTYPE::HIDDEN,"",$data["parameters"]["kitpack_id"]);
    $h_component_id = new HTML_Input("i_hidden_dbn_component_id","hidden_dbn_component_id",E_INPUTTYPE::HIDDEN,"",$data["parameters"]["component_id"]);

    echo $h_client_id->generateHTML();
    echo $h_kitpack_id->generateHTML();
    echo $h_component_id->generateHTML();
?>
<div class="row">
    <div class="col-xs-12">
        <?php echo $data["html"]; ?>
    </div>
</div>
