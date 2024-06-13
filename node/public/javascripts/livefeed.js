function formatTable(){
    let table = document.getElementById('report-table');
    for (var i = 1, row; row = table.rows[i]; i++) {
        if (row.cells[1].innerHTML === "erw"){
            row.cells[1].innerHTML = `<p>ERW <img class="fa-solid fa-bomb fa-fw fa-3x" src="erw.ico" alt="Icon" style="width: 50px; height: 50px;"></p>`;
        }
        else if (row.cells[1].innerHTML === "poaching"){
            row.cells[1].innerHTML = `<p>Poaching <img class="fa-solid fa-crosshairs fa-fw fa-3x" src="crosshair.ico" alt="Icon" style="width: 50px; height: 50px;"></p>`;
        }
        else if (row.cells[1].innerHTML === "mining"){
            row.cells[1].innerHTML = `<p>Mining <img class="fa-solid fa-helmet-safety fa-fw fa-3x" src="pickaxe.ico" alt="Icon" style="width: 50px; height: 50px;"></p>`;
        }
        else{
            row.cells[1].innerHTML = `<p>Logging <img class="fa-solid fa-tree fa-fw fa-3x" src="axe.ico" alt="Icon" style="width: 50px; height: 50px;"></p>`;
        }
        let severityWord = row.cells[2].innerHTML[0].toUpperCase() + row.cells[2].innerHTML.substring(1);
        let severityRank;
        if (severityWord === "Low"){
            severityRank = "*";
        } 
        else if (severityWord === "Moderate"){
            severityRank = "**";
        }
        else{
            severityRank = "***";
        }
        row.cells[2].innerHTML = `${severityWord} ${severityRank}`;
        row.cells[3].innerHTML = formatDateTime(row.cells[3].innerHTML);
        row.cells[4].innerHTML = parseFloat(row.cells[4].innerHTML).toFixed(5);
        row.cells[5].innerHTML = parseFloat(row.cells[5].innerHTML).toFixed(5);
        if (isLoggedIn){
            let id = row.cells[0].innerHTML;
            row.cells[7].innerHTML = 
                `
                    <form action="/livefeed/resolve-report" method='POST'>
                        <input type='hidden' name='id' value='${id}'></input>
                        <button id='livefeedResolveButton' type='submit'><i class="fa-solid fa-check"></i> Resolve </button>
                    </form>
                `;
        }
    }
}

function formatDateTime(isoString) {
    let date = new Date(isoString);
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    let hours = ('0' + date.getHours()).slice(-2);
    let minutes = ('0' + date.getMinutes()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

document.addEventListener("DOMContentLoaded",formatTable);

