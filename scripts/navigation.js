function createHeader(){
    var myHeader = document.createElement("header");    
    myHeader.innerHTML = `
    <nav>
    <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/pages/comparar_fechas.html">Comparar fechas</a></li>
    <li><a href="/pages/gantt.html">Gantt</a></li>
    </ul>
    </nav>
    `;
    document.body.prepend(myHeader);
}

function createFooter(){
    var myFooter = document.createElement("footer");
    myFooter.innerHTML = `<p>App Version 260619</p>`;
    document.body.appendChild(myFooter);
}

document.addEventListener("DOMContentLoaded",createHeader);
document.addEventListener("DOMContentLoaded",createFooter);