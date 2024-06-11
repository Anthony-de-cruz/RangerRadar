function addResolveButtons(){
    let table = document.getElementById('report-table');
    for (var i = 1, row; row = table.rows[i]; i++) {
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
    //iterate through rows
    //rows would be accessed using the "row" variable assigned in the for loop 
}
}

document.addEventListener("DOMContentLoaded",addResolveButtons);

