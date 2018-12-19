const sendRequest = function (user, callback) {

    var params = 'user=' + encodeURIComponent(user);
    var xhr = new XMLHttpRequest();

    xhr.open('GET', '/?' + params, true);
    xhr.send(params);

    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;

        if (xhr.status != 200) {
            console.log(xhr.status + ': ' + xhr.statusText);
        } else {
            console.log(xhr.responseText);
        }
        if (callback)
            return callback(xhr.responseText);
    }
    
};