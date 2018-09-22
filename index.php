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
<html lang="">

<head>
    <meta charset="UTF-8">
    <title>Kartišky</title>
    <meta name="Author" content="" />

</head>

<body>
    <style>
        table,
        td {
            border: 1px solid black;
        }

        button {
            border: 1px solid black;
            color: white;
            text-shadow: 1px 2px black;
        }

    </style>
    <h1>Kartišky</h1>
    <h3 id="whoPlay">Who is playing</h3>
    <div id="player1">
    </div>
    <button id="accept1">accept</button>
    <button id="cancel1">cancel</button>
    <button id="cancelaction1">cancel Action</button>
    <button id="skipround1">skip round</button>
    <!--<div id="player2">
    </div>
    <button id="accept2">accept</button>
    <button id="cancel2">cancel</button>
    <button id="cancelaction2">cancel Action</button>
    <button id="skipround2">skip round</button>-->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="/socket.io/socket.io.js"></script>
    <script src="js/kartisky.js"></script>
    <script src="js/main.js"></script>
</body>

</html>
