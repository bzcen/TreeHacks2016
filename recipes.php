<?php 
    require 'database/aws/aws-autoloader.php';

    $sdk = new Aws\Sdk([
        'region'   => 'us-east-1',
        'version'  => 'latest',
        'endpoint' => 'https://dynamodb.us-east-1.amazonaws.com',
        'credentials' => [
            'key'    => 'AKIAI6QGMWIWAPXYQISQ',
            'secret' => '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'
        ]
    ]);

    $dynamodb = $sdk->createDynamoDb();

    $response = $dynamodb->scan([
        'TableName' => 'Recipes'
    ]);    
?>
<html lang="en">
<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Echo Chef</title>

    <!-- Bootstrap Core CSS -->
    <link rel="stylesheet" href="css/bootstrap.min.css" type="text/css">

    <!-- Custom Fonts -->
    <link href='http://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Merriweather:400,300,300italic,400italic,700,700italic,900,900italic' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="font-awesome/css/font-awesome.min.css" type="text/css">

    <!-- Plugin CSS -->
    <link rel="stylesheet" href="css/animate.min.css" type="text/css">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/creative.css" type="text/css">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

</head>

<body id="page-top">   
    <nav id="mainNav" class="navbar navbar-default navbar-fixed-top">
        <div class="container-fluid">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand page-scroll" href="index.html">Echo Chef</a>
                <div class="navbar-brand recipe-list-header"><a href="#">RECIPE DATABASE</a></div>
            </div>

            <!-- Collect the nav links, forms, and other content for toggling -->
            <!--<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav navbar-right">
                    <li>
                        <a class="page-scroll" href="#about">About</a>
                    </li>
                    <li>
                        <a class="page-scroll" href="#services">Services</a>
                    </li>
                    <li>
                        <a class="page-scroll" href="#portfolio">Data Visualization</a>
                    </li>
                    <li>
                        <a class="page-scroll" href="#contact">Contact</a>
                    </li>
                </ul>
            </div>-->
            <!-- /.navbar-collapse -->
        </div>
        <!-- /.container-fluid -->
    </nav> 

    <div id="fixed-bg">        
    </div>
    
    <div class="scrollable">
        <div class="recipe-list container bg-dark">
            <?php foreach ($response['Items'] as $key => $value): ?>    
                <div class="row">
                    <div class="col-lg-4 text-left">
                        <h2 id="recipe-title" class="section-heading">
                            <?php echo $value['actual_title']['S']; ?>
                        </h2>    
                        <h5 id="category">
                            <?php 
                                foreach($value['categories'] as $cValue){   
                                    foreach($cValue as $cKey => $c){
                                        echo $c['S']; 
                                        
                                        if($cKey < count($cValue) - 1)
                                        {
                                            echo ', ';
                                        }
                                    }
                                }
                            ?>
                        </h5>
                        <h4>Ingredients</h4>
                        <ul>
                            <?php foreach ($value['ingredients'] as $iValue): ?>
                                <?php foreach ($iValue as $i): ?>        
                                    <li>
                                        <?php echo $i['S']; ?>       
                                    </li>                            
                                <?php endforeach; ?>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                    <div class="col-lg-8 text-left">                           
                        <h4 style="margin-top:0">Step by Step Instructions</h4>
                        <h5>
                            Makes <?php echo $value['servings']['N']; ?> servings. 
                            <?php echo $value['calories']['N']; ?> calories per serving.
                        </h5> 
                        <ol>
                            <?php foreach ($value['steps'] as $sValue): ?>
                                <?php foreach ($sValue as $s): ?>
                                <li>
                                    <?php echo $s['S']; ?>
                                </li>
                                <?php endforeach; ?>
                            <?php endforeach; ?>
                        </ol>
                        <h5>
                            Rating: <?php echo $value['ratings']['N']; ?> of 5.0
                        </h5>
                    </div>
                </div>          
                <br /><hr class="full" /><br />            
            <?php endforeach; ?>
        </div>
    </div>
    
    <!-- jQuery -->
    <script src="js/jquery.js"></script>

    <!-- Bootstrap Core JavaScript -->
    <script src="js/bootstrap.min.js"></script>

    <!-- Plugin JavaScript -->
    <script src="js/jquery.easing.min.js"></script>
    <script src="js/jquery.fittext.js"></script>
    <script src="js/wow.min.js"></script>

    <!-- Custom Theme JavaScript -->
    <script src="js/creative.js"></script>

</body>

</html>