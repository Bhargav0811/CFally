


console.log("Hello There");
// $(window).load(function() {
//     $('#loading').hide();
//   });
var loader;

function loadNow(opacity) {
    if (opacity <= 0) {
        displayContent();
    } else {
        loader.style.opacity = opacity;
        window.setTimeout(function() {
            loadNow(opacity - 1);
        }, 2500);
    }
}

function displayContent() {
    loader.style.display = 'none';
    var con = document.getElementById('content');
    if(con===null)return null
    document.getElementById('content').style.display = 'block';
}

document.addEventListener("DOMContentLoaded", function() {
    loader = document.getElementById('loader');
    if(loader===null)return null
    loadNow(1);
});


// with urllib.request.urlopen("https://codeforces.com/api/user.info?handles=Bhargav0811") as url:
// 		var user_data = json.loads(url.read().decode())
//     console.log(user_data)
