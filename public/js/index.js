


console.log("Hello There");
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
// function password_show_hide() {
//   var x = document.getElementById("password");
//   var show_eye = document.getElementById("show_eye");
//   var hide_eye = document.getElementById("hide_eye");
//   hide_eye.classList.remove("d-none");
//   if (x.type === "password") {
//     x.type = "text";
//     show_eye.style.display = "none";
//     hide_eye.style.display = "block";
//   } else {
//     x.type = "password";
//     show_eye.style.display = "block";
//     hide_eye.style.display = "none";
//   }
// }
// $(document).ready(function() {
//     $('.searchtab').submit(function(e) {
//         e.preventDefault();
//         toggle();
//     });
// });
 // module.exports = {
 //   toggle: toggle,
 //
 // }


// with urllib.request.urlopen("https://codeforces.com/api/user.info?handles=Bhargav0811") as url:
// 		var user_data = json.loads(url.read().decode())
//     console.log(user_data)
