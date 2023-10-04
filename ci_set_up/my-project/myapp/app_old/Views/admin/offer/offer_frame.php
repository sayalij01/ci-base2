<?php

?>
<div class="row offer-frame">
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="#">Kopfdaten</a></li>
            <li class="breadcrumb-item"><a href="#"><i class="fa fa-archive pr-4-px" aria-hidden="true"></i> Kitpack anlegen</a></li>
            <li class="breadcrumb-item active" aria-current="page"><i class="fa fa-calculator" aria-hidden="true"> Kalkulation</i></li>
        </ol>
    </nav>
</div>

<div class="row bg-mykit-gray-light">
    <div class="col-md-3 border-offer-frame bg-white " id="offer-frame-side-panel-left" >
        <div class="row " >
            <div class="col-sm-12 offer-frame-sidebar">

                <div class="tabbable-line offer-frame">
                    <ul class="nav nav-tabs padding_top_20" style="width: 100%">
                        <li class="active offer-frame-tabs" >
                            <a href="#tab_default_1" data-toggle="tab" > Alle Komponenten </a>
                        </li>
                        <li class="offer-frame-tabs">
                            <a href="#tab_default_2" data-toggle="tab"> Favoriten </a>
                        </li>
                    </ul>
                        <div class="tab-content">
                            <div class="tab-pane active" id="tab_default_1">
                                <h1>Test</h1>
                                <div class="row component-border ">
                                    <a data-toggle="collapse" data-target="#demo" >
                                        <div class="col-sm-1" > <i class="fa fa-plus fa-2x" aria-hidden="true"></i> </div>
                                        <div class="col-sm-2" ></div>
                                        <div class="col-sm-9 " >Raucodrape OP.</div>
                                    </a>
                                </div>
<!--                                <button type="button" class="btn btn-info" >Simple collapsible</button>-->
                                <div id="demo" class="collapse frame-collapse">
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                                    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </div>
                                <div class="row component-border " style="border-top: none">
                                    <a data-toggle="collapse" data-target="#demo1" >
                                        <div class="col-sm-1" > <i class="fa fa-plus fa-2x" aria-hidden="true"></i> </div>
                                        <div class="col-sm-2" ></div>
                                        <div class="col-sm-9 " >Raucodrape OP.</div>
                                    </a>
                                </div>
<!--                                <button type="button" class="btn btn-info" >Simple collapsible</button>-->
                                <div id="demo1" class="collapse frame-collapse">
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                                    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </div>
                            </div>
                            <div class="tab-pane" id="tab_default_2">
                                <h1>Test2</h1>

                            </div>
                        </div>
                </div>
            </div>
            <div class="btn-arrow text-right">
                <a id="btn-offer-frame-side-panel-left"><i class="fa fa-chevron-circle-left fa-2x" aria-hidden="true"></i></a>
            </div>
        </div>
    </div>
    <div class="col-md-6 border-offer-frame bg-white" data-col="6" id="offer-frame-side-panel-center">
        <div class="row">
            <div class="col-md-12 offer-frame-sidebar">
                <a class="display-none" id="btn-left-offer-frame-center"><i class="fa fa-chevron-circle-right fa-2x" aria-hidden="true"></i></a>
                <a class="display-none" id="btn-right-offer-frame-center"><i class="fa fa-chevron-circle-left fa-2x" aria-hidden="true"></i></a>
            </div>
        </div>
    </div>
    <div class="col-md-3 border-offer-frame bg-white" id="offer-frame-side-panel-right">
        <div class="row" >
            <div class="col-sm-12 offer-frame-sidebar"></div>

            <div class="btn-arrow offer-position-absolut " >
                <a id="btn-offer-frame-side-panel-right"><i class="fa fa-chevron-circle-right fa-2x" aria-hidden="true"></i></a>
            </div>
        </div>
    </div>
</div>

