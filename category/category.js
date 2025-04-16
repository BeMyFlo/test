const API_BASE = "http://localhost:8000/api/booking/category/";

async function loadCategories() {
  try {
    const res = await fetch(API_BASE);
    const data = await res.json();
    const categories = data.data || [];

    const tableBody = document.getElementById("categoryTableBody");
    tableBody.innerHTML = "";

    categories.forEach((category) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${category._id}</td>
        <td contenteditable="true" onblur="updateCategory('${category._id}', this.innerText)">${category.name}</td>
        <td>
          <button class="delete-btn" onclick="deleteCategory('${category._id}')">Xoá</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    alert("Lỗi khi tải danh sách danh mục");
    console.error(err);
  }
}

// Tạo danh mục mới
async function createCategory() {
  const name = document.getElementById("newCategoryName").value;
  if (!name.trim()) return alert("Nhập tên danh mục");

  try {
    await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    document.getElementById("newCategoryName").value = "";
    loadCategories();
  } catch (err) {
    alert("Lỗi khi tạo danh mục");
    console.error(err);
  }
}

// Cập nhật tên danh mục
async function updateCategory(id, newName) {
  if (!newName.trim()) return;

  try {
    await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newName }),
    });

    loadCategories();
  } catch (err) {
    alert("Lỗi khi cập nhật danh mục");
    console.error(err);
  }
}

// Xoá danh mục
async function deleteCategory(id) {
  if (!confirm("Bạn có chắc muốn xoá danh mục này?")) return;

  try {
    await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
    });

    loadCategories();
  } catch (err) {
    alert("Lỗi khi xoá danh mục");
    console.error(err);
  }
}

// Gọi khi load trang
loadCategories();

function openModal() {
  document.getElementById("categoryModal").style.display = "block";
}

function closeModal() {
  document.getElementById("categoryModal").style.display = "none";
}
