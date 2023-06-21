import UserClass from "./userClass.js";

const init = () => {
  doApi();
  declareEvents()
}

const declareEvents =() =>{
  document.querySelector(".save-btn").addEventListener("click", () => {
    let userIdToEdit = localStorage["editId"]
    console.log(userIdToEdit + "  LLLLLLLLLLLL");
    let name = document.querySelector("#input-name").value
    let email = document.querySelector("#input-email").value
    let phone = document.querySelector("#input-phone").value
    let password = document.querySelector("#input-password").value
    let user = {name:name, email:email, phone:phone, password:password}
    editUser(userIdToEdit, user)
    
  });
}

 const editUser = async (id, user) => {
  let url = "http://localhost:3000/users/" + id;
  try {
    let resp = await axios({
      url,
      data:JSON.stringify(user),
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
    });
    if (resp.data.modifiedCount == 1) {
      doApi();
    } else {
      alert("There is no changes😣");
    }
  } catch (err) {
    console.log(err);
    alert("There is problem, come back later🙄");
  }
}

const doApi = async() => {

  let url = "http://localhost:3000/users";
  let resp = await axios.get(url);
  console.log(resp.data);
  createTable(resp.data);
}

const createTable = (_ar) => {
  document.querySelector("#id_tbody").innerHTML = ""
  _ar.forEach((item,i) => {
    let user = new UserClass("#id_tbody",item,i,doApi);
    user.render();
  })
}

init();