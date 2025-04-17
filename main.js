const categoryMap = {};
async function renderVx() {
  const row = document.querySelector(".row");

  row.innerHTML = `
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p>Đang tải danh sách vắc-xin...</p>
    </div>
  `;

  try {
    const response = await fetch(
      "https://be-bpool.vercel.app/api/booking/product/"
    );
    let vacxinList = await response.json();
    vacxinList = vacxinList.data;

    row.innerHTML = "";

    window.vacxinList = vacxinList;

    vacxinList.forEach((vacxin, index) => {
      row.innerHTML += `<div value="${vacxin._id}" class="vacxin_item">
          <div class="vacxin_item-label">
              <div class="vacxin_item_bg">
                <img src="${vacxin.image}" alt="${
        vacxin.name
      }" class="vacxin_img"/>
                  <div class="vacxin_item_info">
                      <p class="vacxin_name">${vacxin.name}</p>
                      <p class="vacxin_category">Loại: ${
                        categoryMap[vacxin.category] || "Chưa phân loại"
                      }</p>
                      <p class="vacxin_prevention">${vacxin.prevention}</p>
                      <div class="vacxin-tag-price">
                          <span>${formatCurrency(vacxin.price)}</span>
                      </div>
                      <div class='name_sick'>
                          <h5>Hỗ trợ :</h5>
                          <div class="describe">
                              ${vacxin.prevention}
                          </div>
                      </div>
                      <a href="${
                        vacxin.link
                      }" class="detail-link"  target="_blank">Link demo</a>
                  </div>
                  <button id="btn${index}" class="btn">CHỌN</button>
              </div>
          </div>
        </div>`;
    });

    vacxinList.forEach((vacxin, index) => {
      const btn = document.getElementById(`btn${index}`);
      btn.addEventListener("click", function () {
        let oder = document.querySelector(".vacxin-oder");
        if (btn.classList.contains("selected")) {
          btn.innerText = "CHỌN";
          btn.classList.remove("selected");
          let element = document.getElementById(`oder${index}`);
          if (element) {
            let heightElement = parseInt(getComputedStyle(element).height);
            cut_Height_divChoose(heightElement);
            element.remove();
          }
          total_pay -= vacxin.price;
        } else {
          btn.innerText = "ĐÃ CHỌN";
          btn.classList.add("selected");
          oder.innerHTML += `<div class="vacxin-oder-item" id="oder${index}">
                <div class="vacxin_item_oder-info">
                  <p class="vacxin_oder_name">${vacxin.name}
                    <i class="ti-close" id="close${index}"></i>
                  </p>
                  <p class="vacxin_category">Loại: ${
                    categoryMap[vacxin.category] || "Chưa phân loại"
                  }</p>
                  <h5>Hỗ trợ :
                    <div class="vacxin_oder_describe">${
                      vacxin.describe || vacxin.prevention
                    }</div>
                  </h5>
                  <p class="vacxin_oder_prevention">${vacxin.prevention}</p>
                  <div class="vacxin-oder-tag-price">
                    <span>${formatCurrency(vacxin.price)}</span>
                  </div>
                </div>
                <hr style="border-top: dotted 1px;" />
              </div>`;
          let element1 = document.getElementById(`oder${index}`);
          let heightElement = parseInt(getComputedStyle(element1).height);
          plus_Height_divChoose(heightElement);
          total_pay += vacxin.price;
        }
        document.getElementById("pay-money").innerText =
          formatCurrency(total_pay);
        updateNoSelectionMessage();
      });
    });
  } catch (error) {
    console.error("Error fetching vaccines:", error);
    row.innerHTML = `
      <div class="loading-container">
        <p style="color: #e53e3e">Có lỗi khi tải danh sách vắc-xin. Vui lòng thử lại sau.</p>
      </div>
    `;
  }
}

function formatCurrency(number) {
  return number.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

const btns = document.querySelectorAll(".btn");
let oder = document.querySelector(".vacxin-oder");
let total_pay = 0;
btns.forEach((btn, index) => {
  btn.addEventListener("click", function () {
    if (btn.classList.contains("selected")) {
      btn.innerText = "CHỌN";
      btn.classList.remove("selected");
      let element = document.getElementById(`oder${index}`);
      let css_oder = getComputedStyle(element);
      let heightElement = parseInt(css_oder.height);
      cut_Height_divChoose(heightElement);
      element.parentNode.removeChild(element);

      total_pay -= vacxinList[index].price_vc;
      document.getElementById("pay-money").innerText =
        formatCurrency(total_pay);
      updateNoSelectionMessage();
    } else {
      btn.innerText = "ĐÃ CHỌN";
      btn.classList.add("selected");
      oder.innerHTML += `<div class="vacxin-oder-item" id="oder${index}">
                            <div class="vacxin_item_oder-info">
                                <p class="vacxin_oder_name">${
                                  vacxinList[index].name
                                }
                                <i class="ti-close" id="close${index}"></i>
                                </p>
                                <h5>Hỗ trợ :
                                    <div class="vacxin_oder_describe">
                                    ${vacxinList[index].describe}
                                    </div>
                                </h5>
                                <p class="vacxin_oder_prevention">${
                                  vacxinList[index].preven_vx
                                }</p>
                                <div class="vacxin-oder-tag-price">

                                    <span>${formatCurrency(
                                      vacxinList[index].price_vc
                                    )}</span>

                                </div>
                            </div>
                            <hr style="border-top: dotted 1px;" />
                        </div>`;
      // Thêm oder và tăng chiều cao thẻ choose
      let element1 = document.getElementById(`oder${index}`);
      let css_oder = getComputedStyle(element1);
      let heightElement = parseInt(css_oder.height);
      plus_Height_divChoose(heightElement);

      // Tính tổng tiền thanh toán
      total_pay += vacxinList[index].price_vc;
      document.getElementById("pay-money").innerText =
        formatCurrency(total_pay);
      updateNoSelectionMessage();
    }
  });
});
// Xử lý sự kiện click vào nút CLOSE X
oder.addEventListener("click", function (event) {
  if (event.target.matches(".ti-close")) {
    const item = event.target.closest(".vacxin-oder-item");
    item.parentNode.removeChild(item);
    // Lấy giá trị index của id close và chọn nút button tương ứng
    const index = event.target.getAttribute("id").replace("close", "");
    const btn = document.getElementById(`btn${index}`);
    btn.innerText = "CHỌN";
    btn.classList.remove("selected");

    // Khi xóa 1 oder thì tổng tiền giảm theo
    cut_Height_divChoose(160);
    total_pay -= vacxinList[index].price_vc;
    document.getElementById("pay-money").innerText = formatCurrency(total_pay);
    updateNoSelectionMessage();
  }
});

// Hàm xử lý khi thêm hoặc xóa oder thì tăng giảm kích thước ô hiển thị
function plus_Height_divChoose(value) {
  let c = document.getElementById("vxchoose");
  let css = getComputedStyle(c);
  vxchoose.style.height = parseInt(css.height) + value + 20 + "px";
}

function cut_Height_divChoose(value) {
  let c = document.getElementById("vxchoose");
  let css = getComputedStyle(c);
  vxchoose.style.height = parseInt(css.height) - value - 20 + "px";
}

function closeFloating() {
  document.getElementById("floatingWorkingHours").style.display = "none";
}

function searchItemVx() {
  const inputSearch = document.getElementById("search").value.toLowerCase();
  // console.log(inputSearch);
  const vacxinListItems = document.querySelectorAll(".vacxin_item");

  vacxinListItems.forEach(function (vacxin) {
    vacxinName = vacxin.querySelector(".vacxin_name").textContent.toLowerCase();

    if (vacxinName.includes(inputSearch)) {
      vacxin.style.display = "block";
    } else {
      vacxin.style.display = "none";
    }
  });
}

// Xử lý nút Quản lý Sản phẩm

const btnvx = document.querySelector(".btnvx");
const model = document.querySelector(".model");
const containermd = document.querySelector(".container-md");
const home = document.querySelector(".ti-home");
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

menuToggle.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");
});

btnvx.addEventListener("click", function () {
  model.classList.add("open");
  renderVx_Manager();
});

model.addEventListener("click", function () {
  model.classList.remove("open");
});

containermd.addEventListener("click", function (event) {
  event.stopPropagation();
});

// Hiển thị danh mục quản lý Vx

async function renderVx_Manager() {
  let tbVendor = document.querySelector("#tbVendor");
  const response = await fetch(
    "https://be-bpool.vercel.app/api/booking/product/"
  );
  let vacxinList = await response.json();
  vacxinList = vacxinList.data;

  for (let i = 0; i < vacxinList.length; i++) {
    tbVendor.innerHTML += `
            <tr>
                <td>${vacxinList[i]._id}</td>
                <td>${vacxinList[i].name}</td>
                <td class="text-right">${vacxinList[i].origin}</td>
                <td class="text-right">${formatCurrency(
                  vacxinList[i].price
                )}</td>
                <td class="text-right">${vacxinList[i].prevention}</td>
                <td class="text-center">
                    <button class="btn-danger" onclick="removeVendor(${
                      vacxinList[i]._id
                    })">Delete</button>
                    <button class="btn-dark" onclick="editVendor(${
                      vacxinList[i]._id
                    })" >Edit</button>
                </td>
            </tr>
        `;
  }
}

function findVacxinById(id) {
  for (let i = 0; i < vacxinList.length; i++) {
    if (vacxinList[i].id === id) {
      return vacxinList[i];
    }
  }
  return null;
}

function findMaxId() {
  let max = 0;
  for (let i = 0; i < vacxinList.length; i++) {
    if (vacxinList[i].id > max) {
      max = vacxinList[i].id;
    }
  }
  return max;
}

async function createVendor() {
  const name = document.getElementById("item").value;
  const origin = document.getElementById("quantity").value;
  const price = document.getElementById("price").value;
  const prevention = document.getElementById("prevention").value;
  const image = document.getElementById("product-image").files[0];
  const category = document.getElementById("category").value;
  const link = document.getElementById("link").value;

  if (!name || !origin || !price || !prevention || !image || !category) {
    alert("Vui lòng điền đầy đủ thông tin!");
    return;
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("origin", origin);
  formData.append("price", price);
  formData.append("prevention", prevention);
  formData.append("image", image);
  formData.append("category", category);
  formData.append("link", link);

  try {
    const response = await fetch(
      "http://localhost:8000/api/booking/product/create",
      //   "https://be-bpool.vercel.app/api/booking/product/create",
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();

    if (result.success) {
      alert("Sản phẩm đã được tạo thành công!");
    } else {
      alert("Có lỗi xảy ra: " + result.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Có lỗi xảy ra khi tạo sản phẩm!");
  }
}

window.onload = async function () {
  await loadCategoriesToMap();
  await renderVx();
  await loadCategoriesToSelect();
  updateLoginUI();
};

function editVendor(id) {
  let vacxin = findVacxinById(id);

  document.getElementById("item").value = vacxin.name;
  document.getElementById("quantity").value = vacxin.preven_vx;
  document.getElementById("price").value = vacxin.price_vc;
  document.getElementById("vendorId").value = vacxin.id;

  document.getElementById("btnCreate").classList.add("d-none");
  document.getElementById("btnSave").classList.remove("d-none");
  document.getElementById("btnCancel").classList.remove("d-none");
}

function clearForm() {
  document.getElementById("item").value = null;
  document.getElementById("quantity").value = null;
  document.getElementById("price").value = null;

  document.getElementById("btnCreate").classList.remove("d-none");
  document.getElementById("btnSave").classList.add("d-none");
  document.getElementById("btnCancel").classList.add("d-none");
}

function cancel() {
  clearForm();
}

function save() {
  let name = document.getElementById("item").value;
  let preven_vx = document.getElementById("quantity").value;
  let price_vc = Number(document.getElementById("price").value);
  let id = Number(document.getElementById("vendorId").value);
  if (name == "" || preven_vx == "" || price_vc == "") {
    alert("Vui lòng nhập đầy đủ dữ liệu");
  } else {
    let vacxin = findVacxinById(id);
    vacxin.name = name;
    vacxin.price_vc = price_vc;
    vacxin.preven_vx = preven_vx;
    let tbVendor = document.querySelector("#tbVendor");
    tbVendor.innerHTML = "";
    renderVx_Manager();
    clearForm();
  }
}

function removeVendor(id) {
  let confirm = window.confirm("Bạn có muốn xóa Sản phẩm này không?");
  if (confirm == true) {
    vacxinList = vacxinList.filter(function (vacxin) {
      return vacxin.id != id;
    });
    let tbVendor = document.querySelector("#tbVendor");
    tbVendor.innerHTML = "";
    renderVx_Manager();
    clearForm();
  }
}

function updateNoSelectionMessage() {
  const oderItems = document.querySelectorAll(".vacxin-oder-item");
  const message = document.getElementById("no-selection");
  if (oderItems.length === 0) {
    message.style.display = "block";
  } else {
    message.style.display = "none";
  }
}

function order() {
  const oderItems = document.querySelectorAll(".vacxin-oder-item");
  if (oderItems.length === 0) {
    alert("Bạn chưa chọn sản phẩm nào!");
    return;
  }

  document.getElementById("modal-payment-confirm").style.display = "flex";
}

function closeModalPayment() {
  document.getElementById("modal-payment-confirm").style.display = "none";
  document.getElementById("payment-proof-file").value = "";
  document.getElementById("payment-final-message").style.display = "none";
}

function finishPayment() {
  const fileInput = document.getElementById("payment-proof-file");
  const file = fileInput.files[0];

  if (!file) {
    alert("Vui lòng tải lên ảnh minh chứng trước khi hoàn thành.");
    return;
  }

  // Show final message
  document.getElementById("payment-final-message").style.display = "block";

  // Optional: scroll xuống để khách thấy thông báo
  document.getElementById("modal-payment-confirm").scrollTo({
    top: 9999,
    behavior: "smooth",
  });
}

document
  .getElementById("payment-proof-file")
  .addEventListener("change", function () {
    const fileName = this.files[0]?.name || "Chưa chọn tệp nào";
    document.getElementById("file-name-preview").innerText = fileName;
  });

function loadCategoriesToDropdown() {
  fetch("https://be-bpool.vercel.app/api/booking/category")
    .then((response) => response.json())
    .then((data) => {
      const dropdown = document.getElementById("categoryDropdown");
      dropdown.innerHTML = ""; // Clear cũ
      const list = data.data;
      list.forEach((category) => {
        const a = document.createElement("a");
        a.textContent = category.name;
        a.setAttribute("value", category._id);
        a.onclick = () => showCatelogy(a);
        dropdown.appendChild(a);
      });
    })
    .catch((err) => {
      console.error("Lỗi khi load danh mục:", err);
    });
}

async function loadCategoriesToSelect() {
  try {
    const response = await fetch(
      "https://be-bpool.vercel.app/api/booking/category"
    );
    const data = await response.json();
    const categories = data.data;

    const select = document.getElementById("category");
    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat._id;
      option.textContent = cat.name;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Lỗi khi load danh mục:", err);
  }
}

function showCatelogy(element) {
  const selectedCategory = element.getAttribute("value");
  renderVxByCategory(selectedCategory);
}

loadCategoriesToDropdown();

async function renderVxByCategory(selectedCategory) {
  const row = document.querySelector(".row");
  try {
    const response = await fetch(
      "https://be-bpool.vercel.app/api/booking/product/" + selectedCategory
    );
    let vacxinList = await response.json();
    vacxinList = vacxinList.data;

    // Clear danh sách cũ trước khi render mới
    row.innerHTML = "";
    window.vacxinList = vacxinList;

    // Render sản phẩm mới
    vacxinList.forEach((vacxin, index) => {
      row.innerHTML += `
          <div value="${vacxin._id}" class="vacxin_item">
            <div class="vacxin_item-label">
              <div class="vacxin_item_bg">
                <img src="${vacxin.image}" alt="${
        vacxin.name
      }" class="vacxin_img"/>
                <div class="vacxin_item_info">
                  <p class="vacxin_name">${vacxin.name}</p>
                  <p class="vacxin_category">Loại: ${
                    categoryMap[vacxin.category] || "Chưa phân loại"
                  }</p>
                  <p class="vacxin_prevention">${vacxin.prevention}</p>
                  <div class="vacxin-tag-price">
                    <span>${formatCurrency(vacxin.price)}</span>
                  </div>
                  <div class='name_sick'>
                    <h5>Hỗ trợ :</h5>
                    <div class="describe">${vacxin.prevention}</div>
                  </div>
                </div>
                <a href="${
                  vacxin.link
                }" class="detail-link"  target="_blank">Link demo</a>
                <button id="btn${index}" class="btn">CHỌN</button>
              </div>
            </div>
          </div>`;
    });

    // Add event click CHỌN cho từng sản phẩm
    vacxinList.forEach((vacxin, index) => {
      const btn = document.getElementById(`btn${index}`);
      btn.addEventListener("click", function () {
        let oder = document.querySelector(".vacxin-oder");
        if (btn.classList.contains("selected")) {
          btn.innerText = "CHỌN";
          btn.classList.remove("selected");
          let element = document.getElementById(`oder${index}`);
          if (element) {
            let heightElement = parseInt(getComputedStyle(element).height);
            cut_Height_divChoose(heightElement);
            element.remove();
          }
          total_pay -= vacxin.price;
        } else {
          btn.innerText = "ĐÃ CHỌN";
          btn.classList.add("selected");
          oder.innerHTML += `<div class="vacxin-oder-item" id="oder${index}">
                <div class="vacxin_item_oder-info">
                  <p class="vacxin_oder_name">${vacxin.name}
                    <i class="ti-close" id="close${index}"></i>
                  </p>
                  <p class="vacxin_category">Loại: ${
                    categoryMap[vacxin.category] || "Chưa phân loại"
                  }</p>
                  <h5>Hỗ trợ :
                    <div class="vacxin_oder_describe">${
                      vacxin.describe || vacxin.prevention
                    }</div>
                  </h5>
                  <p class="vacxin_oder_prevention">${vacxin.prevention}</p>
                  <div class="vacxin-oder-tag-price">
                    <span>${formatCurrency(vacxin.price)}</span>
                  </div>
                </div>
                <hr style="border-top: dotted 1px;" />
              </div>`;
          let element1 = document.getElementById(`oder${index}`);
          let heightElement = parseInt(getComputedStyle(element1).height);
          plus_Height_divChoose(heightElement);
          total_pay += vacxin.price;
        }
        document.getElementById("pay-money").innerText =
          formatCurrency(total_pay);
        updateNoSelectionMessage();
      });
    });
  } catch (error) {
    console.error("Error fetching vaccines:", error);
  }
}
async function loadCategoriesToMap() {
  try {
    const response = await fetch(
      "https://be-bpool.vercel.app/api/booking/category"
    );
    const data = await response.json();
    const categories = data.data;

    window.categoryMap = {}; // global
    categories.forEach((cat) => {
      categoryMap[cat._id] = cat.name;
    });
  } catch (err) {
    console.error("Lỗi khi load danh mục:", err);
  }
}

function toggleLoginPopup() {
  const popup = document.getElementById("login-popup");

  if (popup) {
    if (popup.style.display === "flex") {
      popup.style.display = "none";
    } else {
      popup.style.display = "flex";
    }
  }
}

document
  .getElementById("login-popup")
  .addEventListener("click", function (event) {
    event.stopPropagation();
  });

document
  .querySelector(".user-icon")
  .addEventListener("click", toggleLoginPopup);

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === "admin" && password === "123") {
    localStorage.setItem("isAdmin", "true");
    alert("Đăng nhập thành công!");
    toggleLoginPopup();
    updateLoginUI();
  } else {
    alert("Sai tài khoản hoặc mật khẩu!");
  }
}

function logout() {
  localStorage.removeItem("isAdmin");
  updateLoginUI();
}

function updateLoginUI() {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const userIcon = document.querySelector(".user-icon");

  if (isAdmin) {
    userIcon.innerHTML = `<span onclick="logout()" style="cursor:pointer">Logout</span>`;
    document.querySelector(".btnvx").style.display = "inline-block";
    document.querySelector(".manage-prodct").style.display = "inline-block";
  } else {
    userIcon.innerHTML = `<i class="fas fa-user" onclick="toggleLoginPopup()"></i>`;
    document.querySelector(".btnvx").style.display = "none";
    document.querySelector(".manage-prodct").style.display = "none";
  }
}
