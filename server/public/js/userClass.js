export default class UserClass {
  constructor(_parent, _item, _index, _doApi) {
    this.parent = _parent;
    this.name = _item.name;
    this.password = _item.password;
    this._id = _item._id;
    this.phone = _item.phone;
    this.email = _item.email;
    this.index = _index;
    this.doApi = _doApi;
  }

  render() {
    let myTr = document.createElement("tr");
    document.querySelector(this.parent).append(myTr);
    myTr.innerHTML += `
    <td>${this.index + 1}</td>
    <td>${this.name}</td>
    <td>${this.phone}</td>
    <td>${this.email}</td>
    <td><button class="badge bg-danger del-btn">Del Me</button></td>
    <td><button type="button" class="badge bg-success edit-btn" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit Me</button></td>
    `;

    let delBtn = myTr.querySelector(".del-btn");
    delBtn.addEventListener("click", () => {
      confirm("Are you sure you want to delete " + this.name + "?") &&
        this.delUser();
    });
    let editBtn = myTr.querySelector(".edit-btn");
    editBtn.addEventListener("click", () => {
      localStorage["editId"] = this._id
    });
  }

  async delUser() {
    let url = "http://localhost:3000/users/" + this._id;
    try {
      let resp = await axios({
        url,
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
      });
      if (resp.data.deletedCount == 1) {
        this.doApi();
      } else {
        alert("There is problem😣");
      }
    } catch (err) {
      console.log(err);
      alert("There is problem, come back later🙄");
    }
  }
}
