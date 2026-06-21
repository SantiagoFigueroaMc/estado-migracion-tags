function createHeader(){
    var myHeader = document.createElement("header");    
    myHeader.innerHTML = `
    <nav>
    <ul>
    <li><a href="./index.html">Home</a></li>
    <li><a href="./comparar_fechas.html">Comparar fechas</a></li>
    <li><a href="./gantt.html">Gantt</a></li>
    <li><a href="./configuraciones.html">Configuraciones</a></li>
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