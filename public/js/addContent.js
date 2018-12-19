function addContent(obj) {
    // console.log(obj);
    let body = document.body;
    let p = document.createElement('p');
    p.innerText = JSON.parse(obj).user;
    body.appendChild(p);
}