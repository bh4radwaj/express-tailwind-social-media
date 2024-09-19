window.onload = function () {
    document.getElementById('acc').addEventListener('onclick', log);
}

function fetch() {
    document.getElementById('cont').innerHTML = '';
    t = document.getElementById('bar').value;
    document.getElementById('sp').innerHTML = 'Loading ...';
    xhr = new XMLHttpRequest();
    xhr.open('POST', '/search/' + t, true);
    xhr.onload = function () {
        document.getElementById('cont').innerHTML = '';
        usr = JSON.parse(xhr.responseText);
        if (usr.length < 1) {
            document.getElementById('sp').innerHTML = 'no users found!!';
        }
        else {
            document.getElementById('sp').innerHTML = '';
        }
        console.log(usr);
        for (i = 0; i < usr.length; i++) {
            console.log(usr[i].uid);
            cont = `
                <div class="mb-4 lg:ml-64 lg:mr-64 ml-2 mr-2 flex justify-start p-2 bg-opacity-25">
                    <a href="/profiles/${usr[i].uid}" class="flex justify-start">
                        <img src=/other_imgs/${usr[i].prof_img} class="rounded-l-full rounded-r-full h-16 w-16" style="border:.25px dotted black">
                        <div class="ml-4">
                            <div>
                                <div class="text-md text-gray-800">${usr[i].uid}</div>
                                <div class="text-sm text-gray-600">${usr[i].email}</div>
                            </div>
                        </div>
                    </a>
                </div>
            `;
            document.getElementById('cont').innerHTML += cont;
        }
    };
    xhr.send();
}

function remove() {
    document.getElementById('flash').remove()
}

function log() {
    // console.log('hi');
    if (document.getElementById('sign').style.display == 'none') {
        document.getElementById('sign').style.display = 'block';
    } else {
        document.getElementById('sign').style.display = 'none';
    }
}
function show() {
    // console.log(document.getElementById('u').style.left);
    var ul = document.getElementById('u');
    document.getElementById("u").style.top = '-5%';
    if (ul.style.left == '-100%') {
        document.getElementById("u").style.left = '-15%';
    }
    else {
        document.getElementById("u").style.left = '-100%';
    }
}
function lk(id) {
    var tag = document.getElementById('lk').attributes.src.nodeValue;
    if (tag == './love.png')
        document.getElementById('lk').attributes.src.nodeValue = './unlove.png';
    else
        document.getElementById('lk').attributes.src.nodeValue = './love.png';
}
