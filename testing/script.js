function updateOptions() {
  var webCheckbox = document.getElementById("web");
  var androidCheckbox = document.getElementById("android");
  var limoWebCheckbox = document.getElementById("limoWeb");
  var limoGamesCheckbox = document.getElementById("limoGames");
  var version1Radio = document.getElementById("version1");
  var version2Radio = document.getElementById("version2");
  var version3Radio = document.getElementById("version3");


  if (webCheckbox.checked) {
    androidCheckbox.disabled = false;
    limoWebCheckbox.disabled = true;
    limoGamesCheckbox.disabled = true;
    version1Radio.disabled = true;
    version2Radio.disabled = true;
    version3Radio.disabled = true;
  } else {
    androidCheckbox.disabled = false;
    limoWebCheckbox.disabled = false;
    limoGamesCheckbox.disabled = false;
    version1Radio.disabled = false;
    version2Radio.disabled = false;
    version3Radio.disabled = false;

    if (limoWebCheckbox.checked || limoGamesCheckbox.checked) {
      version1Radio.disabled = false;
      version2Radio.disabled = false;
      version3Radio.disabled = false;
    } else {
      version1Radio.disabled = true;
      version2Radio.disabled = true;
      version3Radio.disabled = true;
    }
  }
}

function download() {
  var platform;
  var app;
  var version;

  if (document.getElementById("web").checked) {
    platform = "web";
  } else if (document.getElementById("android").checked) {
    platform = "android";
  }

  if (document.getElementById("limoWeb").checked) {
    app = "limoWeb";
  } else if (document.getElementById("limoGames").checked) {
    app = "limoGames";
  }

  if (document.getElementById("version1").checked) {
    version = "1.0";
  } else if (document.getElementById("version2").checked) {
    version = "2.0";
  } else if (document.getElementById("version3").checked) {
    version = "3.0";
  }

  if (platform === "web") {
    window.location.href = "http://limo";
  } else {
    var url = "http://limo/downloads/service/" + platform + "/" + app + "/" + version + "/app.apk";
    window.location.href = url;
  }
}
