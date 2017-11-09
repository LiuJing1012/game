//限制不重复点击
var chessBoard=[];
var me=true;//声明变量，保证能够轮流下棋,初始化为黑棋
var over=false;//初始化变量，表示棋没有结束
//赢法数组
var wins=[];
//赢法的统计数组
var myWin=[];//统计我方（一维数组）
var computerWin=[];//统计计算机方（一维数组）

for(var i=0;i<15;i++){//已经点击过的不允许点击第二次
	chessBoard[i]=[];
	for(var j=0;j<15;j++){
		chessBoard[i][j]=0;
	}
}
//初始化赢法(三位数组)
for(var i=0;i<15;i++){
	wins[i]=[];
	for(var j=0;j<15;j++){
		wins[i][j]=[];
	}
}
var count=0;//赢法种类的索引，初始化为0
//填充赢法数组
//所有横线的赢法
for(var i=0;i<15;i++){
	//win[0][0][0]=true
	//win[0][1][0]=true
	//win[0][2][0]=true
	//win[0][3][0]=true
	//win[0][4][0]=true

	//win[0][1][1]=true
	//win[0][2][1]=true
	//win[0][3][1]=true
	//win[0][4][1]=true
	//win[0][5][1]=true
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[i][j+k][count]=true;
		}
		count++;
	}
}
//所有纵线的赢法
for(var i=0;i<15;i++){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[j+k][i][count]=true;
		}
		count++;
	}
}
//所有斜线的赢法
for(var i=0;i<11;i++){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[i+k][j+k][count]=true;
		}
		count++;
	}
}
//所有反斜线的赢法
for(var i=0;i<11;i++){
	for(var j=14;j>3;j--){
		for(var k=0;k<5;k++){
			wins[i+k][j-k][count]=true;
		}
		count++;
	}
}
console.log(count);//572种赢法（15*15的格子）
//赢法统计初始化
for(var i=0;i<count;i++){
	myWin[i]=0;
	computerWin[i]=0;
}
var chess=document.getElementById("chess");
var context=chess.getContext("2d");
context.strokeStyle="#BFBFBF";
//画水印
var logo=new Image();
logo.src="img/666.jpg";
logo.onload=function(){
	context.drawImage(logo,0,0,450,450);
	drawChessBoard();
//	oneStep(0,0,true);
//	oneStep(1,1,false);
}
//画棋盘
var drawChessBoard=function(){
	for(var i=0;i<15;i++){
		//画纵线
		context.moveTo(15+i*30,15);
		context.lineTo(15+i*30,435);
		context.stroke();
		//画横线
		context.moveTo(15,15+i*30);
		context.lineTo(435,15+i*30);
		context.stroke();
	}
}
var oneStep=function(i,j,me){
	context.beginPath();
	context.arc(15+i*30,15+j*30,13,0,2*Math.PI);
	context.closePath();
	var gradient=context.createRadialGradient(15+i*30+2,15+j*30-2,13,15+i*30+2,15+j*30-2,0);
	if(me){
		gradient.addColorStop(0,"#0a0a0a");
		gradient.addColorStop(1,"#636766");	
	}else{
		gradient.addColorStop(0,"#D1D1D1");
		gradient.addColorStop(1,"#F9F9F9");
	}
	context.fillStyle=gradient;
	context.fill();
}
chess.onclick=function(e){
	if(over){
		return;
	}
	//判断onclick只有在我方下棋的时候才有效
	if(!me){//如果不是我方下棋，直接退出
		return;
	}
	var x=e.offsetX;
	var y=e.offsetY;
	var i=Math.floor(x/30);
	var j=Math.floor(y/30);
	if(chessBoard[i][j]==0){
		oneStep(i,j,me);
		chessBoard[i][j]=1;
//		if(me){
//			chessBoard[i][j]=1;
//		}else{
//			chessBoard[i][j]=2;
//		}
//		me=!me;
		//我方落棋，更新赢法
		for(var k=0;k<count;k++){
			if(wins[i][j][k]){
				myWin[k]++;
				computerWin[k]=6;
				if(myWin[k]==5){
					window.alert("你赢了！");
					over=true;
				}
			}
		}
		if(!over){//假如游戏没结束，调用computerAI函数
			me=!me
			computerAI();
		}
	}
}
//定义computerAI
var computerAI=function(){
	//定义两个变量，计算我方得分和计算机方得分
	var myScore=[];
	var computerScore=[];
	//找到分数最高的点
	var max=0;//保存最高分数
	var u=0,v=0;//保存最高分数点的坐标
	for(var i=0;i<15;i++){
		myScore[i]=[];
		computerScore[i]=[];
		for(var j=0;j<15;j++){
			myScore[i][j]=0;
			computerScore[i][j]=0;
		}
	}
	//遍历整个棋盘
	for(var i=0;i<15;i++){
		for(var j=0;j<15;j++){
			if(chessBoard[i][j]==0){
				for(var k=0;k<count;k++){
					if(wins[i][j][k]){
						if(myWin[k]==1){
							myScore[i][j]+=200;
						}else if(myWin[k]==2){
							myScore[i][j]+=400;
						}else if(myWin[k]==3){
							myScore[i][j]+=2000;
						}else if(myWin[k]==4){
							myScore[i][j]+=10000;
						}
						//计算机本身
						if(computerWin[k]==1){
							computerScore[i][j]+=220;
						}else if(computerWin[k]==2){
							computerScore[i][j]+=420;
						}else if(computerWin[k]==3){
							computerScore[i][j]+=2100;
						}else if(computerWin[k]==4){
							computerScore[i][j]+=20000;
						}
					}
				}
				//myScore里面分数最高的点
				if(myScore[i][j]>max){
					max=myScore[i][j];
					u=i;
					v=j;
				}else if(myScore[i][j]==max){
					if(computerScore[i][j]>computerScore[u][v]){
						u=i;
						v=j;
					}
				}
				//computerScore里面分数最高的点
				if(computerScore[i][j]>max){
					max=computerScore[i][j];
					u=i;
					v=j;
				}else if(computerScore[i][j]==max){
					if(myScore[i][j]>myScore[u][v]){
						u=i;
						v=j;
					}
				}
			}
		}
	}
	oneStep(u,v,false);
	chessBoard[u][v]=2;
	for(var k=0;k<count;k++){
			if(wins[u][v][k]){
				computerWin[k]++;
				myWin[k]=6;
				if(computerWin[k]==5){
					window.alert("计算机赢了！");
					over=true;
				}
			}
		}
		if(!over){//假如游戏没结束，调用computerAI函数
			me=!me;
		}
}
