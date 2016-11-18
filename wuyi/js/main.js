//简化id的引用
function id(obj){
	return document.getElementById(obj);
}
function bind(obj, ev, fn) { 
    if (obj.addEventListener) {
        obj.addEventListener(ev, fn, false);
    } else {
        obj.attachEvent('on' + ev, function() {
            fn.call(obj);
        });
    }
}
//获取可视区的高度和宽度
function view(){
	return {
		w: document.documentElement.clientWidth,
        h: document.documentElement.clientHeight
	};
}
//添加class
function addClass(obj, sClass) { 
    var aClass = obj.className.split(' ');
    if (!obj.className) {
        obj.className = sClass;
        return;
    }
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] === sClass) return;
    }
    obj.className += ' ' + sClass;
}
//移除class
function removeClass(obj, sClass) { 
    var aClass = obj.className.split(' ');
    if (!obj.className) return;
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] === sClass) {
            aClass.splice(i, 1);
            obj.className = aClass.join(' ');
            break;
        }
    }
}
//为了加载图片结束后跳转(预加载)
function Load(){
	var iTime=new Date().getTime();//获取动画加载完所用的时间;
	var oW=id("one");
	var arr=[""];
	var bImgLoad=true;//图片预加载完了变成true;
	var bTime=false;//上一页动画加载完变成true;
	var oTime=0;
	bind(oW,"transitionend",end)
	oTime=setInterval(function(){
		if(new Date().getTime()-iTime>=5000){
			bTime=true;
		}
		if(bImgLoad&&bTime){
			clearInterval(oTime)
			oW.style.opacity=0;
		}
	},1000)
	function end(){
		removeClass(oW,"pageshow")
		fnTab();
	}
}
//图片切换
bind(document,"touchmove",function(ev){
	ev.preventDefault();
})
function fnTab(){
	var oTab=id("tabpic");
	var oList=id("piclist");
	var aNav=oTab.getElementsByTagName("nav")[0].children;
	var iNow=0;
	var iX=0;
	var iW=view().w;
	var oTimer=0;
	var iStartTouchX=0;
	var iStartX=0;
	
	bind(oTab,"touchstart",fnStart);
	bind(oTab,"touchmove",fnMove);
	bind(oTab,"touchend",fnEnd);
	auto();
	if(!window.BfnScore){
		fnScore();
		window.BfnScore=true;
	}
	
	function auto(){
		oTimer=setInterval(function(){
		iNow++;
		iNow=iNow%aNav.length;
		tab();
		},2000)
	}
	function fnStart(ev){
		oList.style.transition="none"
		ev=ev.changedTouches[0];
		iStartTouchX=ev.pageX;
		iStartX=iX;
		clearInterval(oTimer);
	}
	function fnMove(ev){
		ev=ev.changedTouches[0];
		var iDis=ev.pageX-iStartTouchX;
		iX=iStartX+iDis;
		oList.style.webkitTransform=oList.style.transform="translateX("+iX+"px)";
	}
	function fnEnd(){
		iNow=iX/iW;
		iNow=-Math.round(iNow);
		if(iNow<0){
			iNow=0;
		}
		if(iNow>aNav.length-1){
			iNow=aNav.length-1;
		}
		tab();
		auto();
	}
	function tab(){
		iX=-iNow*iW;
		oList.style.transition="0.5s"
		oList.style.webkitTransform=oList.style.transform="translateX("+iX+"px)";
		for(var i=0;i<aNav.length;i++){
			removeClass(aNav[i],"active")
		}
		addClass(aNav[iNow],"active")
	}
}
//给景点评分
function fnScore(){
	var oScore=id("score");
	var aLi=oScore.getElementsByTagName("li");
	var arr=["好失望","没有想象的那么差","很一般","良好","棒极了"];
	for(var i=0;i<aLi.length;i++){
		fn(aLi[i]);
	}
	function fn(oLi){
		var aNav=oLi.getElementsByTagName("a");
		var oInput=oLi.getElementsByTagName("input")[0];
		for(var i=0;i<aNav.length;i++){
			aNav[i].index=i;
			bind(aNav[i],"touchstart",function(){
				for(var i=0;i<aNav.length;i++){
					if(i<=this.index){
						addClass(aNav[i],"active");
					}else{
						removeClass(aNav[i],"active");
					}
				}
				oInput.value=arr[this.index]
			});
		}
	}
		fnIndex();
	}
	
function fnInfo(oInfo,sInfo){
	oInfo.innerHTML=sInfo;
	oInfo.style.WebkitTransform="scale(1)";
	oInfo.style.opacity=1;
	setTimeout(function(){
		oInfo.innerHTML=sInfo;
		oInfo.style.WebkitTransform="scale(0)";
		oInfo.style.opacity=0;
	},1000)
}
function fnIndex(){
	var oIndex=id("index")
	var oBtn=oIndex.getElementsByClassName("btn")[0];
	var oInfo=oIndex.getElementsByClassName("info")[0];
	var bScore=false;
	bind(oBtn,"touchend",fnEnd);
	function fnEnd(){
		bScore=fnScoreChecked();
		if(bScore){
			if(bTag()){
				fnIndexOut();
			}else{
				fnInfo(oInfo,"给景区添加标签 ");
			}
		}else{
			fnInfo(oInfo,"给景区评分");
		}
	}
	function fnScoreChecked(){
		var oScore=id("score");
		var aInput=oScore.getElementsByTagName("input");
		var bS=true;
		for(var i=0;i<aInput.length;i++){
			if(aInput.value==0){
				return  false;
			}
		}
		return true;
	} 
	function bTag(){
		var oTag=id("indexTags");
		var aInput=oTag.getElementsByTagName("input");
		for(var i=0;i<aInput.length;i++){
			if(aInput[i].checked){
				return true;
			}
		}
		return false;
	}
	
}
function fnIndexOut(){
  var oMask=id("mask");
  var oIndex=id("index")
  var oNews=id("news")
  
  addClass(oMask,"pageshow");
  addClass(oNews,"pageshow");
  fnNews();
  setTimeout(function(){
  	 oMask.style.opacity=1;
  	 oIndex.style.filter=oIndex.style.webkitFilter="blur(5px)"
  },14)
 setTimeout(function(){
 	 oNews.style.transition=".5s";
  	 oMask.style.opacity=0;
  	 oIndex.style.filter=oIndex.style.webkitFilter="blur(0px)"
  	 oNews.style.opacity=1;
  	 removeClass(oMask,"pageshow");
  },3000)
}
function fnNews(){
	var oNews=id("news");
	var oInfo=oNews.getElementsByClassName("info")[0];
	var aInput=oNews.getElementsByTagName("input");
	aInput[0].onchange=function(){
		if(this.files[0].type.split("/")[0]=="video"){
			fnNewsOut();
			this.value="";
		}else{
			fnInfo(oInfo,"请上传视频")
		}
	};
	aInput[1].onchange=function(){
		if(this.files[0].type.split("/")[0]=="image"){
			fnNewsOut()
			this.value="";
		}else{
			fnInfo(oInfo,"请上传图片")
		}
	}
}
function fnNewsOut(){
	 var oNews=id("news");
	 var oForm=id("form");
	 addClass(oForm,"pageshow");
	 oNews.style.cssText="";
	 removeClass(oNews,"pageshow");
	 	 formIn();
}
function formIn(){
	var oForm=id("form");
	var oVer=id("over");
	var aFormTag=id("formTags").getElementsByTagName("label");
	var oBtn=oForm.getElementsByClassName("btn")[0];
	var bOff=false;
	for(var i=0;i<aFormTag.length;i++){
		bind(aFormTag[i],"touchend",function(){
			bOff=true;
			addClass(oBtn,"submit");
		})
	}
	bind(oBtn,"touchend",function(){
		if(bOff){
			for(var i=0;i<aFormTag.length;i++){
				aFormTag[i].getElementsByClassName("input").checked=false;
			}
			bOff=false;
			addClass(oVer,"pageshow");
			removeClass(oForm,"pageshow");
			removeClass(oBtn,"submit");
			over()
		}
	})
	
}
function over(){
	var oVer=id("over");
	var oBtn=oVer.getElementsByClassName("btn")[0];
	bind(oVer,"touchend",function(){
		removeClass(oVer,"pageshow");
	})
	
}
