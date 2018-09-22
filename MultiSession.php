<?php
function randomString($length = 6) {
	$str = "";
	$characters = array_merge(range('A','Z'), range('a','z'), range('0','9'));
	$max = count($characters) - 1;
	for ($i = 0; $i < $length; $i++) {
		$rand = mt_rand(0, $max);
		$str .= $characters[$rand];
	}
	return $str;
}
class MultiSession {
	public function sessionInit($host, $username, $password, $dbname){
		
		$this->conn = new mysqli($host, $username, $password, $dbname);
		echo "init";
		if ($this->conn->connect_error) {
			die("Connection failed: " . $this->conn->connect_error);
		}else{
			echo "succes";
		}
	}
	
	public function randomStringGenerator($lenght = 6){
		
		$str = "";
		$characters = array_merge(range('A','Z'), range('a','z'), range('0','9'));
		$max = count($characters) - 1;
		for ($i = 0; $i < $length; $i++) {
			$rand = mt_rand(0, $max);
			$str .= $characters[$rand];
		}
		return $str;
	}
	
	public function createSession($data, $name){
		$code = randomString(30);
		$sql = "SELECT * FROM session WHERE ID = '$code'";
		
		$stmt = $this->conn->prepare("SELECT * FROM session WHERE ID = '$code'");
		$stmt->bind_param('s', $name);
		$stmt->execute();
		$result = $stmt->get_result();
		//~ $result = $this->conn->query($sql);
		if ($result->num_rows > 0) {
    		// output data of each row
   			while($row == $result->fetch_assoc()) {
				while($row['ID'] == $code){
					$code = randomString(30);
				}
			}
		}
		
		
		$stmt = $this->conn->prepare("INSERT INTO session (data, ID) VALUES ('$data', '$code')");
		echo "part 2";
		$stmt->bind_param('s', $name);
		$stmt->execute();
		$result = $stmt->get_result();
		setcookie($name, $code, time() + (86400 * 30), "/");
	}
	
	public function deleteSession($name){
		$id = $_COOKIE[$name];
		setcookie($name, "", time() - 3600, "/");
		$sql = "DELETE FROM session WHERE ID = '$id'";
		$stmt = $this->conn->prepare("DELETE FROM session WHERE ID = '$id'");
		$stmt->bind_param('s', $name);
		$stmt->execute();
		$result = $stmt->get_result();
	}
	
	public function readSession($name){
		
		$id = $_COOKIE[$name];
		
		$sql = "SELECT * FROM session WHERE ID = '$id'";
		//~ $stmt = $this->conn->prepare($sql);
		//~ $stmt->bind_param('s', $name);
		//~ $stmt->execute();
		$stmt = $this->conn->prepare("SELECT * FROM session WHERE ID = '$id'");
		$stmt->bind_param('s', $name);
		$stmt->execute();
		$result = $stmt->get_result();
		$finalresult;
		
		while($row = $result->fetch_assoc()) {
			$finalresult = $row["data"];
		}
		
		return $finalresult;
	}
}
?>
