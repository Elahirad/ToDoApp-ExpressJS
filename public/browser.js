//Function that creates <li> Element with text and buttons
function listItemCreate(item) {
    return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${item.text}</span>
    <div>
      <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
      <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
  </li>`
}

// Rendering items for the first time
document.getElementById("item-list").insertAdjacentHTML("beforeend", items.map(item => listItemCreate(item)).join(''));

//Adding Item
document.getElementById("submit-form").addEventListener("submit", e => {
    e.preventDefault();
    const userInput = document.getElementById("userInput");
    axios.post("/create-item", { text: userInput.value }).then((res) => {
        document.getElementById("item-list").insertAdjacentHTML("beforeend", listItemCreate(res.data));
    userInput.value = ""
    userInput.focus();
    }).catch();
})
document.addEventListener("click", e => {
    //Update Item
    if (e.target.classList.contains("edit-me")) {
        const newValue = prompt("Enter the new value :", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML);
        if (newValue) {
            axios.post('/edit-item', { text: newValue, id: e.target.getAttribute("data-id") }).then(() => {
                e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = newValue;
            }
            ).catch(() => {
                console.log("Something went wrong !");
            }
            );
        }
    }
    // Delete Item
    if (e.target.classList.contains("delete-me")) {
        if (confirm("Do you really want to delete this item permenantly ?")) {
            axios.post('/delete-item', { id: e.target.getAttribute("data-id") }).then(() => {
                e.target.parentElement.parentElement.remove();
            }
            ).catch(() => {
                console.log("Something went wrong !");
            })
        }
    }
})