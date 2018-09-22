<?php
	include('MultiSession.php');
	$sessionHandeler = new MultiSession();
    $sessionHandeler->sessionInit("localhost", "session",  "tY+Pu>e}bP{72-s=ht7", "session");
    $verified = $sessionHandeler->readSession("login");
    echo $verified;
    if ($verified == true || $verified == "true"){
        echo "good job you are logged in";
    }else{
        echo " redirecting to login screen ";
        header("Location: http://localhost/login/index.php");
    }

?>


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title> Title </title>
</head>

<body>
    
</body>

</html>
