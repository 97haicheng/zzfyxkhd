// tab切换
var $lHand = $(".l-hand");
var $iHand = $(".l-icon-hand");
var $tHand = $(".l-hand-text");

var $lSet = $(".l-set");
var $iSet = $(".l-icon-set");
var $tSet = $(".l-set-text");

var $lCount = $(".l-count");
var $iCount = $(".l-icon-count");
var $tCount = $(".l-count-text");

var $lStatus = $(".l-status");
var $iStatus = $(".l-icon-status");
var $tStatus = $(".l-status-text");

var $lContent1 = $(".l-content1");
var $lContent2 = $(".l-content2");
var $lContent3 = $(".l-content3");
var $lContent4 = $(".l-content4");

$lHand.click(function() {
  $iHand.addClass("l-this-sel");
  $tHand.addClass("l-this-sel");
  $iSet.removeClass("l-this-sel");
  $tSet.removeClass("l-this-sel");
  $iCount.removeClass("l-this-sel");
  $tCount.removeClass("l-this-sel");
  $iStatus.removeClass("l-this-sel");
  $tStatus.removeClass("l-this-sel");
  $lContent1.show();
  $lContent2.hide();
  $lContent3.hide();
  $lContent4.hide();
});
$lSet.click(function() {
  //身份验证
  adminCheck();
  $(".num").html(_arr.length);
  $iHand.removeClass("l-this-sel");
  $tHand.removeClass("l-this-sel");
  $iSet.addClass("l-this-sel");
  $tSet.addClass("l-this-sel");
  $iCount.removeClass("l-this-sel");
  $tCount.removeClass("l-this-sel");
  $iStatus.removeClass("l-this-sel");
  $tStatus.removeClass("l-this-sel");
  $lContent1.hide();
  $lContent2.show();
  $lContent3.hide();
  $lContent4.hide();
});
$lCount.click(function() {
  $iHand.removeClass("l-this-sel");
  $tHand.removeClass("l-this-sel");
  $iSet.removeClass("l-this-sel");
  $tSet.removeClass("l-this-sel");
  $iCount.addClass("l-this-sel");
  $tCount.addClass("l-this-sel");
  $iStatus.removeClass("l-this-sel");
  $tStatus.removeClass("l-this-sel");
  $lContent1.hide();
  $lContent2.hide();
  $lContent3.show();
  $lContent4.hide();
  // 执行函数渲染数据
  getData();
});
$lStatus.click(function() {
  adminCheck(); //身份验证
  $iHand.removeClass("l-this-sel");
  $tHand.removeClass("l-this-sel");
  $iSet.removeClass("l-this-sel");
  $tSet.removeClass("l-this-sel");
  $iCount.removeClass("l-this-sel");
  $tCount.removeClass("l-this-sel");
  $iStatus.addClass("l-this-sel");
  $tStatus.addClass("l-this-sel");
  $lContent1.hide();
  $lContent2.hide();
  $lContent3.hide();
  $lContent4.show();
});

// 动态获取时间
var rSpan = $(".r-nav span");
var lSpan = $(".l-nav span");
var upTime = "";
var ymd = "";
// 补0
function add0(m) {
  return m < 10 ? '0' + m : m
}
// 时间
time();

function time() {
  var date = new Date();
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  var d = date.getDate();
  var h = date.getHours();
  var mm = date.getMinutes();
  var s = date.getSeconds();
  var week = "";
  switch (date.getDay()) {
    case 0:
      week = "星期天";
      break;
    case 1:
      week = "星期一";
      break;
    case 2:
      week = "星期二";
      break;
    case 3:
      week = "星期三";
      break;
    case 4:
      week = "星期四";
      break;
    case 5:
      week = "星期五";
      break;
    case 6:
      week = "星期六";
      break;
  }
  upTime = date.getTime();
  ymd = y + add0(m) + add0(d);
  return y + '-' + add0(m) + '-' + add0(d) + '&nbsp;&nbsp;&nbsp;' + week + '&nbsp;&nbsp;&nbsp;' + add0(h) + ':' + add0(mm) + ':' + add0(s);
}
// 时间渲染
setInterval(function() {
  var tim = time();
  lSpan.html(tim);
  rSpan.html(tim);
}, 500);
// 初始化
// 获取开机时间和ukey编号上传服务器
var uKey = GetUKeySN();
var dNumber = ""; //设备编号
uKey = uKey.split(":");
dNumber = uKey[1];
$.ajax({
  url: weburl + "/cupl-face/api/devoperate/insert",
  type: "post",
  data: {
    devNuber: uKey[1],
    openTime: upTime
  },
  dataType: "json",
  success: function(data) {
    if (data.code == "10200") {
      sessionStorage.setItem("sbId", data.msg);
    } else {
      alert(data.msg);
    }
  },
  error: function() {}
});
// 手动输入身份证
$lHand.dblclick(function() {
  idePhoto = 0;
  $("#_select").show().attr("src", "input.html")
})


//子页面执行对比的函数
function check() {
  App.CameraStart("OnCamera", aaa); //启动摄像头
  App.StartUKey("OnUKeyEvent", "F", g_apppath + "capphoto"); //启动UKey
  App.StartCard("OnCard", g_apppath + "cardphoto"); //开始读卡
  getDevMessage(); //获取id
  stuDataGet(); //获取文本信息
}
// 学生信息
var capImg = "";
var ideImg = ""

var stuNumber = ""; //学号、职工号 1

var collegeId = ""; //学院id
var selType = 1; //   读取方式：读身份证1,手输身份证2,手输准考证3
var Type = 1; //  核验类型 1学生2老师
var faceType = 2; // 比对方式(身份证照1,报名照2,身份证或报名照3,身份证和报名照4)
var precision = 500; // 核验精度
var score = ""; // 人像比分
var faceResult = ""; // 人像比对结果(通过1，不通过0)
var idePrecision = 500; //  身份证核验精度
var ideScore = ""; //  身份证比分
var ideFaceReasult = ""; //  身份证比对结果
var examPrecision = 500; // 报名照核验精度
var examScore = ""; // 报名照比分
var examFaceResult = ""; //报名照比对结果
var ideNumber = ""; // 身份证号
var ideName = ""; //身份证姓名
var ideValidity = ""; // 身份证有效期
var gmtSelect = ""; // 现场查询时间
var faceTimeLength = ""; //  首次人像识别时长
var resultTimeLength = ""; //是 比对完成时长
var faceTime = 3; //  比对次数
function stuDataGet() {
  stuData = App.ReadTextFile(g_apppath + '/data.txt');
}

function clearObj() {
  cardMsg = {};
}
//刷卡后对比
function f2f() {
  var returnTrue = false;
  // var stuData = App.ReadTextFile(g_apppath + '/data.txt');
  $.each($.parseJSON(stuData), function(index, item) {
    var abc = item.stuIdNumber.slice(-6);
    if (cardMsg.sIdNo == item.stuIdNumber || qiuNumber == abc) {
      returnTrue = true;
      $(".l-name").html(item.stuName);
      $(".l-sex").html(item.stuSex);
      $(".l-cardNumber").html(item.stuIdNumber);
      $(".l-school").html(item.stuCollegeName);

      $(".r-name").html(item.stuName);
      $(".r-sex").html(item.stuSex);
      $(".r-cardNumber").html(item.stuIdNumber);
      $(".r-school").html(item.stuCollegeName);
      $(".r-grade").html(item.stuGrade);
      $(".r-major").html(item.stuMajor);
      $(".r-class").html(item.stuClass);
      $(".r-state").html(item.stuSchoolRollState);
      $(".r-regTime").html(item.stuRegTime);
      // img
      console.log(item.stuPhotoId);
      if (idePhoto == "0") {
        $.ajax({
          url: weburl + "/cupl-face/client/getImgBase64",
          type: "get",
          data: {
            photoId: item.stuPhotoId
          },
          async: false,
          success: function(data) {
            if (data.code == 10200 && data.msg != "") {
              var string = data.msg;
              string = string.split(",")[1];
              console.log(string);
              App.Base64ToFile(string, g_apppath + "\serverphoto\\" + item.stuIdNumber + ".jpg");
              $(".r-photo1").attr("src", "http://appdir/serverphoto/" + item.stuIdNumber + ".jpg"); //
            } else {

            }
          },
          error: function() {

          }
        });
        // 对比
        App.BeginVerify("OnVerify", 3, 3000, g_apppath + "\serverphoto\\" + item.stuIdNumber + ".jpg", jingdu);
      } else {
        console.log(2222);
        console.log("idePhoto", idePhoto);
        $(".r-photo1").attr("src", "http://appdir/cardphoto/" + cardMsg.sIdPhoto);
        console.log(g_apppath + cardMsg.sIdPhoto);
        console.log(jingdu);
        App.BeginVerify("OnVerify", 3, 3000, g_apppath + "\cardphoto\\" + cardMsg.sIdPhoto, jingdu);
      }
      // 赋值
      stuNumber = item.stuNumber;
      collegeId = item.stuCollege;
      ideNumber = item.stuIdNumber;
      ideName = item.stuName;
      facePlaceId = item.stuFacePlaceId;
      //对比
      // App.BeginVerify("OnVerify", 3, 3000, "1.jpg", 500);

    } else {

    }
  });
  if (!returnTrue) {
    $(".l-msg-txt").html("查无此人");
    $(".r-msg").html("查无此人");
    setTimeout(function() {
      clear();
    }, 3000)
  }
}
// 贾哥给的函数
var cardMsg = {}; //身份证信息

GetAppPath(); //获取本地路径

// 拍照图片显示
function insertImg(url) {
  $(".r-photo2").attr("src", url);
}
//摄像头数量
function CapEnumCount() {
  var s;
  s = App.CapEnumCount();
  alert(s);
  return;
}
// 摄像头名称
function CapEnumName() {
  var s;
  s = App.CapEnumName(0);
  alert(s);
  return;
}
//启动摄像头
function CameraStart() {
  var s;
  s = App.CameraStart("OnCamera", 1);
  // alert(s);
  return;
}

function OnCamera(itype) {
  if (4 == itype) {
    alert("摄像头不兼容");
  }
  return;
}
// 停止摄像头
function CameraStop() {
  var s;
  s = App.CameraStop();
  alert(s);
  return;
}
// 启动ukey
function StartUKey() {
  var s;
  s = App.StartUKey("OnUKeyEvent", "H", g_apppath + "capphoto");
  // alert(s);
  return;
}

function OnUKeyEvent(itype, icode) {
  var s;
  s = itype + "|" + icode;
  if (itype == 1) {
    // $(".l-ukey").html("OnUKeyEvent:正在加载Ukey " + s);
    $(".l-process").show().css("width", icode + "%");
  } else if (itype == 2) {
    // $(".l-ukey").html("OnUKeyEvent:Ukey加载完成 " + s);
    $(".l-process").hide().css("width", 0 + "%");
  } else if (itype == 3) {
    alert("OnUKeyEvent:Ukey错误 " + s);
  }
}
// 开始对比
// 1.calllback, 2.最小比对次数(1-3),3.最小比对时间(1000-3000),4照片5,通过阈值
function BeginVerify() {
  var s;
  s = App.BeginVerify("OnVerify", 3, 3000, "1.jpg", 500);
  // alert("开始对比" + s);
  return;
}
// key==beginverify函数的返回值
// ipassed 1验证通过，2 验证失败
// iTick==实际比对耗时
// icount==实际比对次数
// capfile==抓拍的照片不带路径
// isore==比分
function OnVerify(key, iPassed, iTick, iCount, capfile, iScore) {
  console.log("iPassed", iPassed);
  // alert(iScore);
  var s;
  examScore = ideScore = score = iScore;
  examFaceResult = ideFaceReasult = faceResult = iPassed;
  gmtSelect = upTime;
  faceTimeLength = iTick;
  faceTime = iCount;
  s = key + "|" + iPassed + "|" + iTick + "|" + iCount + "|" + capfile + "|" + iScore;
  if (iPassed == 1) {
    App.PlayWav("wav\\1.wav");
    $(".l-msg-txt").html("验证通过").removeClass("l-checking").addClass("l-chenggong");
    $(".licon1").show();
    $(".licon2").hide();
    $(".licon3").hide();
    insertImg("http://appdir/capphoto/" + capfile);
    $(".ricon1").show();
    $(".ricon2").hide();
    $(".ricon3").hide();
    $(".r-msg").html("验证通过").removeClass("r-checking").addClass("r-cg");
  } else if (iPassed == 2) {
    App.PlayWav("wav\\2.wav");
    $(".l-msg-txt").html("验证失败").removeClass("l-checking").addClass("l-shibai");
    $(".licon1").hide();
    $(".licon2").show();
    $(".licon3").hide();
    insertImg("http://appdir/capphoto/" + capfile);
    $(".ricon1").hide();
    $(".ricon2").show();
    $(".ricon3").hide();
    $(".r-msg").html("验证失败").removeClass("r-checking").addClass("r-sb");
  }
  var lujing = "";
  if (idePhoto == "1") {
    lujing = "http://appdir/cardphoto/" + cardMsg.sIdPhoto;
  } else {
    lujing = "http://appdir/serverphoto/" + ideNumber + ".jpg";
  }
  img2base64_2(lujing, img2base64_1, "http://appdir/capphoto/" + capfile);
  // img2base64_1("http://appdir/capphoto/" + capfile);
  // 上传
  //  _time = setInterval(function() {
  //   if (base64_1 != "") {
  //     readImg();
  //   } 
  // }

}

// img===base64
var base64_1 = "";
var base64_2 = "";

function img2base64_1(_img) {
  function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
    var dataURL = canvas.toDataURL("image/" + ext);
    return dataURL;
  }
  var image = new Image();
  image.src = _img;
  image.onload = function() {
    base64_1 = getBase64Image(image);
    // 调用上传
    readImg();
  };
}

function img2base64_2(_img, calllback, data) {
  function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
    var dataURL = canvas.toDataURL("image/" + ext);
    return dataURL;
  }
  var image = new Image();
  image.src = _img;
  image.onload = function() {
    if (idePhoto == "0") {
      base64_2 = "";
    } else {
      base64_2 = getBase64Image(image);
    }
    calllback(data);
  };
}
//传入图片路径，返回base64
function getBase64(img) {
  function getBase64Image(img, width, height) { //width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
    var canvas = document.createElement("canvas");
    canvas.width = width ? width : img.width;
    canvas.height = height ? height : img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    var dataURL = canvas.toDataURL();
    return dataURL;
  }
  var image = new Image();
  image.crossOrigin = '';
  image.src = img;
  var deferred = $.Deferred();
  if (img) {
    image.onload = function() {
      deferred.resolve(getBase64Image(image)); //将base64传给done上传处理
    }
    return deferred.promise(); //问题要让onload完成后再return sessionStorage['imgTest']
  }
}
// 读取文件并上传

function readImg() {
  var dataTotal = {};
  dataTotal["facePhotoFile"] = base64_1;
  dataTotal["identityPhotoFile"] = base64_2;
  dataTotal["fdfFacePlaceId"] = facePlaceId;
  dataTotal["fdfStudentNumber"] = stuNumber;
  dataTotal["fdfDevNumber"] = dNumber;
  dataTotal["fdfCollegeId"] = collegeId;
  dataTotal["fdfSelectType"] = selType;
  dataTotal["fdfType"] = Type;
  dataTotal["fdfFaceType"] = faceType;
  dataTotal["fdfPrecision"] = precision;
  dataTotal["fdfScore"] = score;
  dataTotal["fdfFaceReasult"] = faceResult;
  dataTotal["fdfIdentityPrecision"] = idePrecision;
  dataTotal["fdfIdentityScore"] = ideScore;
  dataTotal["fdfIdentityFaceReasult"] = ideFaceReasult;
  dataTotal["fdfExamPrecision"] = examPrecision;
  dataTotal["fdfExamScore"] = examScore;
  dataTotal["fdfExamFaceReasult"] = examFaceResult;
  dataTotal["fdfIdentityNumber"] = ideNumber;
  dataTotal["fdfIdentityName"] = ideName;
  dataTotal["fdfIdentityValidity"] = ideValidity;
  dataTotal["fdfGmtSelect"] = gmtSelect;
  dataTotal["fdfFaceTimeLenght"] = faceTimeLength;
  dataTotal["fdfFaceTimes"] = faceTime;
  console.log(dataTotal);
  var writeData = "";
  // for (var a = 1; a < 100000; a++) {
  //   writeData += a;
  // }
  writeData = JSON.stringify(dataTotal);
  // 上传
  $.ajax({
    url: weburl + "cupl-face/client/upload/data/base",
    data: JSON.stringify(dataTotal),
    dataType: "json",
    type: "post",
    contentType: "application/json;charset=UTF-8",
    success: function(data) {
      if (data.code == "10200") {
        // 上传成功
        qiuNumber = "";
        clear();
      } else {
        // 上传失败
        console.log("上传失败");
        _arr.push(ideNumber);
        WriteTextFile(g_apppath + "\missed\\" + ideNumber + ".txt", writeData);
        qiuNumber = "";
        clear();
      }
    },
    error: function() {}
  })
}
//上传成功后清空数据
function clear() {
  base64_1 = "";
  base64_2 = "";
  idePhoto = "1";
  // 清空页面数据
  $(".l-name").html("");
  $(".l-sex").html("");
  $(".l-cardNumber").html("");
  $(".l-school").html("");
  $(".r-name").html("");
  $(".r-sex").html("");
  $(".r-cardNumber").html("");
  $(".r-school").html("");
  $(".r-grade").html("");
  $(".r-major").html("");
  $(".r-class").html("");
  $(".r-state").html("");
  $(".r-regTime").html("");
  // img
  $(".r-photo1").attr("src", "./img/images/photo.jpg");
  $(".r-photo2").attr("src", "./img/images/photo.jpg");
  // icon状态
  $(".l-msg-txt").html("等待验证").removeClass("l-chenggong").addClass("l-checking");
  $(".licon3").show("");
  $(".licon1").hide("");
  $(".licon2").hide("");
  $(".ricon3").show("");
  $(".ricon1").hide("");
  $(".ricon2").hide("");
  $(".r-msg").html("等待验证").removeClass("r-cg").addClass("r-checking");
}


// 读卡
function StartCard() {
  var s;
  s = App.StartCard("OnCard", g_apppath + "cardphoto");
  // alert("读卡" + s);
  return;
}

function OnCard(itype, sIdName, sIdNo, sIdExp2, sIdPhoto) {
  var s;
  idePhoto = "1";
  ideValidity = sIdExp2;
  s = itype + "|" + sIdName + "|" + sIdNo + "|" + sIdExp2 + "|" + sIdPhoto;
  console.log(s); //2|邱源|420683199110300534|20220829|XXXX.jpg
  if (itype == "2") {
    cardMsg["sIdName"] = sIdName;
    cardMsg["sIdNo"] = sIdNo;
    cardMsg["sIdName"] = sIdName;
    cardMsg["sIdExp2"] = sIdExp2;
    cardMsg["sIdPhoto"] = sIdPhoto;
    f2f(); //执行对比照片
  }
  if (ymd > sIdExp2 && sIdExp2 != "") {
    $(".ideDate").html("身份证过期了").css("color", "red");
  } else {
    $(".ideDate").html("正常").css("color", "#fff");
  }
  if (itype == 0) {
    $(".p3").html("OnCard:" + "未连接");
  } else if (itype == 1) {
    $(".p3").html("OnCard:" + "已连接");
  } else if (itype == 2) {
    $(".p3").html("OnCard:读卡 " + s);
    // insertImg("http://appdir/cardphoto/" + sIdPhoto);
    // App.BeginVerify("OnVerify", 3, 3, 3000, sIdPhoto, 600, "sig\\1645010100014.sig", 200);
  }
  return s;
}
// 播放声音
function PlayWav() {
  var s;
  s = App.PlayWav(g_apppath + "wav\\1.wav");
  alert(s);
  return;
}
// 结束进程
function TerminateMe() {
  var s;
  s = App.TerminateMe();
  // alert(s);
  return;
}
// 读取文件
function ReadIniFile() {
  var s;
  s = App.ReadIniFile("conf.ini", "test1", "test2");
  alert(s);
  return;
}
// 写文件
function WriteIniFile() {
  var s;
  s = App.WriteIniFile("conf.ini", "test1", "test2", "test3");
  alert(s);
  return;
}
// 获取本地路径
function GetAppPath() {
  var s;
  g_apppath = App.GetAppPath();
  console.log("本地路径" + g_apppath);
  return;
}
// 获取ukey编号
function GetUKeySN() {
  var character = new Array("C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "X", "Y", "Z");
  var i;
  var s;
  for (i = 0; i < 23; i++) {
    s = App.GetUKeySN(character[i]);
    if ("" != s) {
      s = character[i] + ":" + s;
      break;
    };
  }
  // alert(s)
  return s;
}
// 判断，目录是否存在
function DirExists() {
  var s;
  s = App.DirExists(g_apppath + "test\\test");
  alert(s);
  return;
}
// 创建多级目录
function ForceDirs() {
  var s;
  s = App.ForceDirs(g_apppath + "test\\test");
  alert(s);
  return;
}
// 删除文件
function RemoveFile() {
  var s;
  s = App.RemoveFile(g_apppath + "aaa.txt");
  alert(s);
  return;
}
// 读取文本文件
function ReadTextFile() {
  var s;
  s = App.ReadTextFile(g_apppath + "aaa.txt");
  alert(s);
  return;
}
// 写入文本文件
function WriteTextFile(data, url) {
  var s;
  s = App.WriteTextFile(data, url);
  if (s) {
    clear();
  }
  return;
}
// 读取文本文件
function FileToBase64(url) {
  var s;
  s = App.FileToBase64(url);
  return;
}
// 写入文本文件
function Base64ToFile(name, text) {
  var s;
  s = App.Base64ToFile(name, text);
  return;
}
// 页面2函数执行代码页面2函数执行代码页面2函数执行代码22222222222222
$(".l2-ipIcon_1").click(function() {
  $("#_select").show().attr("src", "twoOne.html");
})
$(".l2-ipIcon_2").click(function() {
  $("#_select").show().attr("src", "twoTwo.html");
})
$(".l2-ipIcon_3").click(function() {
  $("#_select").show().attr("src", "twoThree.html");
})
$(".l2-ipIcon_4").click(function() {
  $("#_select").show().attr("src", "twoFour.html");
})
$(".l2-ipIcon_5").click(function() {
  $("#_select").show().attr("src", "twoFive.html");
})

// 身份证有效期校验
ide();

function ide() {
  if (idePhoto == "1") {
    $(".l2-qy1").addClass("l2-qiyong1").html("启用");
  } else {
    $(".l2-qy1").addClass("l2-tingyong1").html("停用");
  }
}
// 身份证照片对比
idepic();

function idepic() {
  if (idePhoto == "1") {
    $(".l2-qiyong2").html("身份照片对比");
  } else {
    $(".l2-qiyong2").html("报名照对比");
  }
}

// 扫描枪开启
gun();

function gun() {
  if (qiang == "1") {

  }
};

//第三页面获取数据
function getData() {
  var _data = {};
  _data["devNumber"] = dNumber;
  _data["facePlaceId"] = facePlaceId;
  console.log(_data);
  $.ajax({
    url: weburl + "cupl-face/client/count",
    data: _data,
    dataType: "json",
    type: "get",
    contentType: "application/json;charset=UTF-8",
    success: function(data) {
      console.log(data);
      if (data.code == "10200") {
        var dudu = [];
        var da = data.msg[0];
        for (var item in da) {
          var _dudu = {};
          _dudu["name"] = item == "faceFail" ? "验证失败" : (item == "faceTotal" ? "总计" : (item == "faceSuccess" ? "验证成功" : "验证成功率"));
          _dudu["value"] = da[item];
          dudu.push(_dudu);
        }
        console.log(dudu);
        dataMap(dudu);
      } else {
        alert("error");
      }
    },
    error: function() {

    }

  })
};

// 第三页图形页面
function dataMap(_DATA) {
  var myChart = echarts.init(document.getElementById('main'));
  option = {
    // backgroundColor: '#2c343c',

    title: {
      text: '数据统计',
      left: 'center',
      top: 20,
      textStyle: {
        color: '#ccc'
      }
    },

    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },

    visualMap: {
      show: true,
      min: 0,
      max: 100,
      inRange: {
        colorLightness: [0, 1]
      }
    },
    series: [{
      name: '数据占比',
      type: 'pie',
      radius: '55%',
      center: ['50%', '50%'],
      data: _DATA.sort(function(a, b) {
        return a.value - b.value;
      }),
      roseType: 'radius',
      label: {
        normal: {
          textStyle: {
            color: 'rgba(255, 255, 255, 0.3)'
          }
        }
      },
      labelLine: {
        normal: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.3)'
          },
          smooth: 0.2,
          length: 10,
          length2: 20
        }
      },
      itemStyle: {
        normal: {
          color: '#c23531',
          shadowBlur: 200,
          shadowColor: 'rgba(255, 255, 255, 0.5)'
        }
      },

      animationType: 'scale',
      animationEasing: 'elasticOut',
      animationDelay: function(idx) {
        return Math.random() * 200;
      }
    }]
  };
  myChart.setOption(option);
};

// 身份验证函数
function adminCheck() {
  $("#_select").show().attr("src", "checkAdmin.html");
};

// 客户端信息获取


function getDevMessage() {
  $.ajax({
    url: weburl + "/cupl-face/client/dev/info",
    data: {
      devNumber: dNumber
    },
    type: "get",
    dataType: 'json',
    success: function(data) {
      if (data.code == "10200") {
        console.log("userID", userID);
        userID = data.msg
      } else {

      }
    },
    error: function() {}
  })
};

// 返回首页的函数
function toFirst() {
  $iHand.addClass("l-this-sel");
  $tHand.addClass("l-this-sel");
  $iSet.removeClass("l-this-sel");
  $tSet.removeClass("l-this-sel");
  $iCount.removeClass("l-this-sel");
  $tCount.removeClass("l-this-sel");
  $iStatus.removeClass("l-this-sel");
  $tStatus.removeClass("l-this-sel");
  $lContent1.show();
  $lContent2.hide();
  $lContent3.hide();
  $lContent4.hide();
};
// 退出程序

$(".l4-quit-btn").click(function() {
  $.ajax({
    url: weburl + "/cupl-face/api/devoperate/update",
    data: {
      operId: dNumber,
      offTime: upTime
    },
    type: "post",
    dataType: "json",
    success: function() {

    },
    error: function() {

    }
  })
  App.userinit();
  App.TerminateMe();
});

$(".numbtn").click(function() {
  var newarr = [];
  $.each(_arr, function(index, item) {
    var str = App.ReadTextFile(g_apppath + "\missed\\" + item + ".txt");
    $.ajax({
      url: weburl + "cupl-face/client/upload/data/base",
      data: str,
      dataType: "json",
      type: "post",
      contentType: "application/json;charset=UTF-8",
      success: function(data) {
        if (data.code == "10200") {
          // 上传成功
          App.RemoveFile(g_apppath + "\missed\\" + item + ".txt");
        } else {
          // 上传失败
          newarr.push(item);
        }
      },
      error: function() {}
    })
  });
  // 未上传的二次赋值
  _arr = newarr;
});
var fff = true;
$(".l2-btn").click(function() {
  if (fff) {
    App.CameraStart2("OnCamera", 0)
    $(".l2-btn").html("关闭红外摄像头").css("backgroundColor", "#CC3300");
    fff = false;
  } else {
    App.CameraStop2();
    $(".l2-btn").html("开启红外摄像头").css("backgroundColor", "#33CC66");
    fff = true;
  }
});
$(".l5-quit-btn").click(function() {
  App.PowerOFF();
});