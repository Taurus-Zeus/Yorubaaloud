const baseUrl = "https://accosmart.com.ng/yorubalearning/api";
let sub;


function signUp(event) {
  event.preventDefault();

  const getSpin = document.querySelector(".spin");
  getSpin.style.display = "inline-block";

  const getName = document.getElementById("name").value;
  const getEmail = document.getElementById("email").value;
  const getPassword = document.getElementById("password").value;
  const getConfirmPassword = document.getElementById("confirmPassword").value;

  if (
    getName === "" ||
    getEmail === "" ||
    getPassword === "" ||
    getConfirmPassword === ""
  ) {
    Swal.fire({
      icon: "info",
      text: "all fields are required",
      confirmButtonColor: "#2D85DE",
    });
    getSpin.style.display = "none";
  }

  if (getConfirmPassword !== getPassword) {
    Swal.fire({
      icon: "info",
      text: "passwords do not match",
      confirmButtonColor: "#2D85DE",
    });
    getSpin.style.display = "none";
  } else {
    const signData = new FormData();
    signData.append("name", getName);
    signData.append("email", getEmail);
    signData.append("password", getPassword);
    signData.append("password_confirmation", getConfirmPassword);

    const signMethod = {
      method: "POST",
      body: signData,
    };

    const url = `${baseUrl}/register_admin`;

    fetch(url, signMethod)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.status === "success") {
          Swal.fire({
            icon: "success",
            text: $`{result.message}`,
            confirmButtonColor: "#2D85DE",
          });
          setTimeout(() => {
            location.href = "index.html";
          }, 9000);
        }
      })
      .catch((error) => {
        console.log("error", error);

        Swal.fire({
          icon: "danger",
          text: $`{result.message}`,
          confirmButtonColor: "#2D85DE",
        });

        getSpin.style.display = "none";
      });
  }
}
function logIn(event) {
  event.preventDefault();

  const getSpin = document.querySelector(".spin");
  getSpin.style.display = "inline-block";

  const getEmail = document.getElementById("email").value;
  const getPassword = document.getElementById("password").value;

  if (getEmail === "" || getPassword === "") {
    Swal.fire({
      icon: "info",
      text: "all fields are required",
      confirmButtonColor: "#2D85DE",
    });
    getSpin.style.display = "none";
  } else {
    const logData = new FormData();
    logData.append("email", getEmail);
    logData.append("password", getPassword);

    const logMethod = {
      method: "POST",
      body: logData,
    };

    const url = `${baseUrl}/admin_login`;

    fetch(url, logMethod)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.hasOwnProperty("email")) {
          localStorage.setItem("admin", JSON.stringify(result));
          location.href = "dashboard.html";
        }

        if (result.message === "Invalid email or password") {
          Swal.fire({
            icon: "info",
            text: $`{result.message}`,
            confirmButtonColor: "#2D85DE",
          });
          getSpin.style.display = "none";
        }
      })
      .catch((error) => {
        console.log("error", error);

        Swal.fire({
          icon: "warning",
          text: "unsuccessful",
          confirmButtonColor: "#2D85DE",
        });

        getSpin.style.display = "none";
      });
  }
}

function getLocalData() {
  const category = document.getElementById("category");
  const lm = document.getElementById("learnmat");
  const sb = document.getElementById("subCat");
  const quiz = document.getElementById("quiz");
  const ts = document.getElementById("student");

  const getValue = document.getElementById("adminId");
  const getModal = document.querySelector(".pagemodal");
  getModal.style.display = "block";

  const getData = localStorage.getItem("admin");
  const myData = JSON.parse(getData);
  const getName = myData.name;

  getValue.innerHTML = getName;

  const token = myData.token;
  const adminHeader = new Headers();
  adminHeader.append("Authorization", `Bearer ${token}`);

  const adminMethod = {
    method: "GET",
    headers: adminHeader,
  };

  const url = `${baseUrl}/admin/admin_dashboardapi`;

  fetch(url, adminMethod)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      category.innerHTML = result.total_number_of_categories;
      lm.innerHTML = result.total_number_of_learningmaterial;
      sb.innerHTML = result.total_number_of_subcategories;
      quiz.innerHTML = result.total_number_of_quize;
      ts.innerHTML = result.total_number_of_students;
      getModal.style.display = "none";
    })
    .catch((error) => console.log("error", error));
}

function studentModal(event) {
  event.preventDefault();

  const getStudents = document.querySelector(".allstudent");

  const dModal = document.getElementById("dash-modal");

  const getData = localStorage.getItem("admin");
  const myData = JSON.parse(getData);

  const token = myData.token;
  const adminHeader = new Headers();
  adminHeader.append("Authorization", `Bearer ${token}`);

  const adminMethod = {
    method: "GET",
    headers: adminHeader,
  };

  let data = [];

  const url = `${baseUrl}/admin/top_three_students`;
  fetch(url, adminMethod)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      if (result.length === 0) {
        getStudents.innerHTML = "No Records Found!";
      } else {
        result.map((product) => {
          data += `
                 <div class="search-card">
                    <div class="d-flex justify-content-between">
                        <p>Name:</p>
                        <p>${product.name}</p>
                    </div>
                    <div class="d-flex justify-content-between">
                        <p>Email:</p>
                        <p>${product.email}</p>
                    </div>
                    <div class="d-flex justify-content-between">
                        <p>Phone Number:</p>
                        <p>${product.phone_number}</p>
                    </div>
                    <div class="d-flex justify-content-between">
                        <p>Position:</p>
                        <p>${product.position}</p>
                    </div>
                    <div class="d-flex justify-content-between">
                        <p>Total Score:</p>
                        <p>${product.total_score}</p>
                    </div>
                 </div>
                `;

          getStudents.innerHTML = data;
          dModal.style.display = "block";
        });
      }
    })
    .catch((error) => console.log("error", error));
}

function closeDashModal() {
  const dModal = document.getElementById("dash-modal");
  dModal.style.display = "none";
}

function getAllStudents() {
  const getTable = document.getElementById("table-id");
  const getData = localStorage.getItem("admin");
  const myData = JSON.parse(getData);

  const token = myData.token;
  const adminHeader = new Headers();
  adminHeader.append("Authorization", `Bearer ${token}`);

  const adminMethod = {
    method: "GET",
    headers: adminHeader,
  };

  const url = `${baseUrl}/admin/get_all_students`;

  let data = [];

  fetch(url, adminMethod)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      if (result.length === 0) {
        getTable.innerHTML = "<h1>No Records Found</h1>";
      } else {
        result.map((item) => {
          if (item.total_score < 60) {
            data += `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.email}</td>
                        <td>${item.phone_number}</td>
                        <td>${item.position}</td>
                        <td><button class="btn btn-danger" onclick="changeStatus(${item.id})">${item.total_score}</button></td>
                    </tr>
                  `;
          } else {
            data += `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.email}</td>
                        <td>${item.phone_number}</td>
                        <td>${item.position}</td>
                        <td><button class="btn btn-success" onclick="changeStatus(${item.id})">${item.total_score}</button></td>
                    </tr>
                  `;
          }

          getTable.innerHTML = data;
        });
      }
    })
    .catch((error) => console.log("error", error));
}

function changeStatus(id) {
  console.log(id);
}

function createCategory(event) {
  event.preventDefault();

  const getSpin = document.querySelector(".spin");
  getSpin.style.display = "inline-block";

  const getName = document.getElementById("cat").value;
  const getImage = document.getElementById("imcat").files[0];

  if (getName === "" || getImage === "") {
    Swal.fire({
      icon: "info",
      text: "all fields are required",
      confirmButtonColor: "#2D85DE",
    });
    getSpin.style.display = "none";
  } else {
    const getToken = localStorage.getItem("admin");
    const myToken = JSON.parse(getToken);
    const token = myToken.token;
    const adminHeader = new Headers();
    adminHeader.append("Authorization", `Bearer ${token}`);
    const createCat = new FormData();
    createCat.append("name", getName);
    createCat.append("image", getImage);

    const createMethod = {
      method: "POST",
      headers: adminHeader,
      body: createCat,
    };

    const url = `${baseUrl}/admin/create_category`;
    fetch(url, createMethod)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);

        if (result.status === "success") {
          Swal.fire({
            icon: "success",
            text: "Category created successfully",
            confirmButtonColor: "#2D85DE",
          });
          setTimeout(() => {
            location.reload();
          }, 3000);
        } else {
          Swal.fire({
            icon: "error",
            text: `${result.message}`,
            confirmButtonColor: "#2D85DE",
          });
        }
      })
      .catch((error) => console.log("error", error));
  }
}

function getCategoryList() {
  const getSpin = document.querySelector(".pagemodal");
  getSpin.style.display = "block";

  const showItem = document.querySelector(".scroll-object");
  const getToken = localStorage.getItem("admin");
  const myToken = JSON.parse(getToken);
  const token = myToken.token;
  console.log(token);

  const adminHeader = new Headers();
  adminHeader.append("Authorization", `Bearer ${token}`);

  const adminMethod = {
    method: "GET",
    headers: adminHeader,
  };
  const url = `${baseUrl}/admin/category_list`;

  let data = [];

  fetch(url, adminMethod)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      if (result.length === 0) {
        showItem.innerHTML = "No category found";
        getSpin.style.display = "none";
      } else {
        result.map((item) => {
          data += `
                <div class="search-card">
                <p class="mt-3">${item.name}</p>
                <a href="details.html?id=${item.id}&name=${item.name}"><img src="${item.image}" alt="image" ></a>
                <div class="text-right">
                <button class="update-button" onclick="modalBox(${item.id})">update</button>
                <button class="delete-button" onclick="delcat(${item.id})">delete</button>
                </div>
                </div>
               `
          showItem.innerHTML = data;
          getSpin.style.display = "none"; 

        });
      }
    })
    .catch((error) => console.log("error", error));
}

function modalBox(id) {
  const modal = document.querySelector("#my-modal3");
  const inputValue = document.getElementById("updateName");
  const getToken = localStorage.getItem("admin");
  const myToken = JSON.parse(getToken);
  const token = myToken.token;

  localStorage.setItem("catId", id)

  const adminHeader = new Headers();
  adminHeader.append("Authorization", `Bearer ${token}`);

  const adminMethod = {
    method: "GET",
    headers: adminHeader,
  };
  const url = `${baseUrl}/admin/get_details?category_id=${id}`;

  fetch(url, adminMethod)
  .then(response => response.json())
  .then(result => {
    console.log(result)

    inputValue.setAttribute("value", result.name);
    modal.style.display = "block";


  })
  .catch(error => console.log('error', error));
}


function updateCategory(event) {
  event.preventDefault();

  const getSpin = document.querySelector(".spin2");
  getSpin.style.display = "inline-block";



  const getName = document.getElementById("updateName").value;
  const getImage = document.getElementById("updateImage").files[0];
  const getId = localStorage.getItem("catId")

  if (getName === "" || getImage === "") {
    Swal.fire({
      icon: "info",
      text: "all fields are required",
      confirmButtonColor: "#2D85DE",
    });
    getSpin.style.display = "none";
  } 
  else {
    const getToken = localStorage.getItem("admin");
    const myToken = JSON.parse(getToken);
    const token = myToken.token;
    const adminHeader = new Headers();
    adminHeader.append("Authorization", `Bearer ${token}`);
    const updateCat = new FormData();
    updateCat.append("name", getName);
    updateCat.append("image", getImage);
    updateCat.append("category_id", getId )

    const updateMethod = {
      method: "POST",
      headers: adminHeader,
      body: updateCat,
    };

    const url = `${baseUrl}/admin/update_category`;
    fetch(url, updateMethod)
      .then(response => response.json())
      .then(result => {
        console.log(result);

        if (result.status === "success") {
          Swal.fire({
            icon: "success",
            text: "Category updated successfully",
            confirmButtonColor: "#2D85DE",
          });
          setTimeout(() => {
            location.reload();
          }, 3000);
        } else {
          Swal.fire({
            icon: "error",
            text: `${result.message}`,
            confirmButtonColor: "#2D85DE",
          });
          getSpin.style.display = "none";
        }
      })
      .catch((error) => console.log("error", error));
  }
}

function delcat(id) {
  const getSpin = document.querySelector(".pagemodal");
  getSpin.style.display = "block";
  const getToken = localStorage.getItem("admin");
  const myToken = JSON.parse(getToken);
  const token = myToken.token;
  console.log(token);

  const adminHeader = new Headers();
  adminHeader.append("Authorization", `Bearer ${token}`);

  const adminMethod = {
    method: "GET",
    headers: adminHeader,
  };
  const url = `${baseUrl}/admin/delete_category/${id}`;

  fetch(url, adminMethod)
  .then(response => response.json())
  .then(result => {
    console.log(result)
    if (result.status === "success") {
      Swal.fire({
        icon: 'success',
        text: `${result.message}`,
        confirmButtonColor: "#2D85DE"
      })

      setTimeout(() => {
        location.reload();
      }, 3000)
    }
    else {
      Swal.fire({
        icon: 'info',
        text: `${result.message}`,
        confirmButtonColor: "#2D85DE"
      })
        getSpin.style.display = "none";
    }
  })
  .catch(error => console.log('error', error));
}

function closeModal3() {
  const modal = document.querySelector("#my-modal3");
  modal.style.display = "none";
}

function ShowCategoryName() {
  const showName = document.querySelector(".det");
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get("name");
  showName.innerHTML = name;
};


function showId() {
  const urlParamsid = new URLSearchParams(window.location.search);
  sub = urlParamsid.get("id");
}
showId();

console.log(sub)




function subCategory(event) {
  event.preventDefault();

  const getSpin = document.querySelector(".spin");
  getSpin.style.display = "inline-block";
  const getName = document.getElementById("subCatName").value;
  const getImage = document.getElementById("subCatImg").files[0];
  const urlParams = new URLSearchParams(window.location.search);
  sub = urlParams.get("id");

  localStorage.setItem('getId', sub);

  

if (getName === "" || getImage === "") {
  Swal.fire({
    icon: "info",
    text: "all fields are required",
    confirmButtonColor: "#2D85DE",
  });
  getSpin.style.display = "none";
} else {
  const getToken = localStorage.getItem("admin");
  const myToken = JSON.parse(getToken);
  const token = myToken.token;
  const adminHeader = new Headers();
  adminHeader.append("Authorization", `Bearer ${token}`);
  const createSubCategory = new FormData();
  createSubCategory.append("name", getName);
  createSubCategory.append("image", getImage);
  createSubCategory.append("category_id", sub);

  const createMethod = {
    method: "POST",
    headers: adminHeader,
    body: createSubCategory,
  };

  const url = `${baseUrl}/admin/create_subcategory`;
  fetch(url, createMethod)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      

      if (result.status === "success") {
        Swal.fire({
          icon: "success",
          text: "sub Category created successfully",
          confirmButtonColor: "#2D85DE",
        });
        setTimeout(() => {
          location.reload();
        }, 3000);
      } else {
        Swal.fire({
          icon: "error",
          text: `${result.message}`,
          confirmButtonColor: "#2D85DE",
        });
      }
    })
    .catch((error) => console.log("error", error));
}
};

function getSubCatDetails() {
  const getSpin = document.querySelector(".pagemodal");
  getSpin.style.display = "block";
  

 
  const subCatItem = document.querySelector(".subCatItem");
  const getToken = localStorage.getItem("admin");
  const myToken = JSON.parse(getToken);
  const token = myToken.token;
  console.log(token);

  const adminHeader = new Headers();
  adminHeader.append("Authorization", `Bearer ${token}`);

  const adminMethod = {
    method: "GET",
    headers: adminHeader,
  };
const url = `${baseUrl}/admin/category_details/${sub}`;

  let data = [];

  fetch(url, adminMethod)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      if (result.length === 0) {
        subCatItem.innerHTML = `<div class="col-sm-12 col-md-12 offset-lg-4 col-lg-6">No Records Found</div>`;
        getSpin.style.display = "none";
      } else {
        result.map((item) => {
          data += `
                <div class="col-sm-12 col-md-12 col-lg-4">
                  <div class="search-card">
                  <p class="mt-3">${item.name}</p>
                  <img src="${item.image}" alt="image" >
                  <div class="text-right">
                  <button class="update-button" onclick="modalBox2(${item.id})">update</button>
                  </div>
                  </div>
                </div>
               `
          subCatItem.innerHTML = data;
          getSpin.style.display = "none";
        
        });
      }
    })
    .catch((error) => console.log("error", error));
}

getSubCatDetails();

function reveal(event) {
  event.preventDefault();

  const getDiv = document.querySelector(".myimg");
  const getDiv2 = document.querySelector(".img-show");

  getDiv.style.display = "block";
  getDiv2.style.display = "none";


}

function modalBox2(id) {
  const modal = document.querySelector("#my-modal-mode");
  const inputValue = document.getElementById("updateSubName");

  const getToken = localStorage.getItem("admin");
  const myToken = JSON.parse(getToken);
  const token = myToken.token;
  localStorage.setItem("subid", id)
  

  const adminHeader = new Headers();
  adminHeader.append("Authorization", `Bearer ${token}`);

  const adminMethod = {
    method: "GET",
    headers: adminHeader,
  };
  const url = `${baseUrl}/admin/get_details?subcategory_id=${id}`;

  fetch(url, adminMethod)
  .then(response => response.json())
  .then(result => {
    console.log(result)

    inputValue.setAttribute("value", result.name);
    modal.style.display = "block";


  })
  .catch(error => console.log('error', error));
}
function closeModal4() {
  const modal = document.querySelector("#my-modal-mode");
  modal.style.display = "none";
}

function updateSubCategory(event) {
  event.preventDefault();

  const getSpin = document.querySelector(".spin2");
  getSpin.style.display = "inline-block";



  const getName = document.getElementById("updateSubName").value;
  const getImage = document.getElementById("updateSubImage").files[0];
  const subId = localStorage.getItem("subid")

  if (getName === "") {
    Swal.fire({
      icon: "info",
      text: "all fields are required",
      confirmButtonColor: "#2D85DE",
    });
    getSpin.style.display = "none";
  } else {
    const getToken = localStorage.getItem("admin");
    const myToken = JSON.parse(getToken);
    const token = myToken.token;
    const adminHeader = new Headers();
    adminHeader.append("Authorization", `Bearer ${token}`);
    const updateSubCat = new FormData();
    updateSubCat.append("name", getName);
    updateSubCat.append("image", getImage);
    updateSubCat.append("subcategory_id", subId );

    const updateMethod = {
      method: "POST",
      headers: adminHeader,
      body: updateSubCat,
    };

    const url = `${baseUrl}/admin/update_subcategory`;
    fetch(url, updateMethod)
      .then(response => response.json())
      .then(result => {
        console.log(result);

        if (result.status === "success") {
          Swal.fire({
            icon: "success",
            text: "SubCategory updated successfully",
            confirmButtonColor: "#2D85DE",
          });
          setTimeout(() => {
            location.reload();
          }, 3000);
        } else {
          Swal.fire({
            icon: "error",
            text: `${result.message}`,
            confirmButtonColor: "#2D85DE",
          });
          getSpin.style.display = "none";
        }
      })
      .catch((error) => console.log("error", error));
  }
}

function upDateAdmin(event) {
  event.preventDefault();

  const getSpin = document.querySelector(".spin");
  getSpin.style.display = "inline-block";

  const getName = document.getElementById("updateName").value;
  const getEmail = document.getElementById("updateEmail").value;

  if (getName === "" || getEmail === "") {
    Swal.fire({
      icon: "info",
      text: "all fields are required",
      confirmButtonColor: "#2D85DE",
    });
    getSpin.style.display = "none";
  } else {
    const getToken = localStorage.getItem("admin");
    const myToken = JSON.parse(getToken);
    const token = myToken.token;
    const adminHeader = new Headers();
    adminHeader.append("Authorization", `Bearer ${token}`);
    const updateInfo = new FormData();
    updateInfo.append("name", getName);
    updateInfo.append("email", getEmail);

    const updateMethod = {
      method: "POST",
      headers: adminHeader,
      body: updateInfo,
    };

    const url = `${baseUrl}/admin/admin_update_profile`;
    fetch(url, updateMethod)
      .then(response => response.json())
      .then(result => {
        console.log(result);

        if (result.status === "success") {
          Swal.fire({
            icon: "success",
            text: " updated successfully",
            confirmButtonColor: "#2D85DE",
          });
          setTimeout(() => {
            localStorage.clear();
            location.href = "index.html"
          }, 3000);
          
        } else {
          Swal.fire({
            icon: "error",
            text: `${result.message}`,
            confirmButtonColor: "#2D85DE",
          });
          getSpin.style.display = "none";
        }
      })
      .catch((error) => console.log("error", error));
  }

}

function upDatePassword(event) {
  event.preventDefault();
  
  const getSpin = document.querySelector(".spin2");
  getSpin.style.display = "inline-block";

  const getEmail = document.getElementById("updatePassEmail").value;
  const getPassword = document.getElementById("updatePassword").value;
  const getConfirmPassword = document.getElementById("confirmPassword").value;



  if (getEmail === "" || getPassword === "" || getConfirmPassword === "") {
    Swal.fire({
      icon: "info",
      text: "all fields are required",
      confirmButtonColor: "#2D85DE",
    });
    getSpin.style.display = "none";
  }
  else if (getConfirmPassword !== getPassword) {
    Swal.fire({
      icon: "info",
      text: "passwords do not match",
      confirmButtonColor: "#2D85DE",
    });
    getSpin.style.display = "none";
  }
  else {
    const getToken = localStorage.getItem("admin");
    const myToken = JSON.parse(getToken);
    const token = myToken.token;
    const adminHeader = new Headers();
    adminHeader.append("Authorization", `Bearer ${token}`);
    const updateInfo = new FormData();
    updateInfo.append("email", getEmail);
    updateInfo.append("password", getPassword);
    updateInfo.append("password_confirmation", getConfirmPassword);

    const updateMethod = {
      method: "POST",
      headers: adminHeader,
      body: updateInfo,
    };

    const url = `${baseUrl}/admin/admin_update_password`;
    fetch(url, updateMethod)
      .then(response => response.json())
      .then(result => {
        console.log(result);

        if (result.status === "success") {
          Swal.fire({
            icon: "success",
            text: " updated successfully",
            confirmButtonColor: "#2D85DE",
          });
          setTimeout(() => {
            localStorage.clear();
            location.href = "index.html"
          }, 3000);
          
        } else {
          Swal.fire({
            icon: "error",
            text: `${result.message}`,
            confirmButtonColor: "#2D85DE",
          });
          getSpin.style.display = "none";
        }
      })
      .catch((error) => console.log("error", error));
  }
}

function gotoLoginPage(event) {
  event.preventDefault();
  location.href = "index.html"
 };

function logout() {
  localStorage.clear();
  location.href = "index.html"
};