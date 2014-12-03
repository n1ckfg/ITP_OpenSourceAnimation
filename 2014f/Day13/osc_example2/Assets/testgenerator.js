#pragma strict

var target : GameObject;

function Start () {
	if(target != null){
		for(var i=0;i<10;i++){
			Instantiate(target);
			var x = Random.Range(0,10);
			var y = Random.Range(0,10);
			var z = Random.Range(0,10);
			target.transform.position = new Vector3(x,y,z);
		}
	}

}

function Update () {

}