<a id="readme-top"></a>

# 📋 Trellon - Trello Clone Web API

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/YourUsername/Trellon">
    <img src="https://github.com/YourUsername/Trellon/blob/main/Images/logo.png" alt="Logo" width="350 px" height="120 px">
  </a>

  <h2 align="center">Trellon - Task Management System</h2>

  <p align="center">
    Trellon là một hệ thống quản lý công việc hoàn chỉnh, giúp tổ chức boards, lists, cards và tasks một cách hiệu quả và dễ dàng!
    <br />
    <a href="https://github.com/YourUsername/Trellon"><strong>Khám phá tài liệu »</strong></a>
    <br />
    <br />
    <a href="https://github.com/YourUsername/Trellon">Xem Demo</a>
    &middot;
    <a href="https://github.com/YourUsername/Trellon/issues/new?labels=bug&template=bug-report---.md">Báo lỗi</a>
    &middot;
    <a href="https://github.com/YourUsername/Trellon/issues/new?labels=enhancement&template=feature-request---.md">Yêu cầu tính năng</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Mục lục</summary>
  <ol>
    <li>
      <a href="#about-the-project">Về dự án</a>
      <ul>
        <li><a href="#built-with">Công nghệ sử dụng</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Bắt đầu</a>
      <ul>
        <li><a href="#prerequisites">Yêu cầu</a></li>
        <li><a href="#installation">Cài đặt</a></li>
      </ul>
    </li>
    <li><a href="#usage">Sử dụng</a></li>
    <li><a href="#contributing">Đóng góp</a></li>
    <li><a href="#license">Giấy phép</a></li>
    <li><a href="#contact">Liên hệ</a></li>
    <li><a href="#acknowledgments">Lời cảm ơn</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## 🎯 Về dự án

[![Product Name Screen Shot][product-screenshot]](https://example.com)

Trellon là **Web API** mô phỏng hệ thống Trello, được thiết kế để quản lý dự án và công việc theo mô hình **Board → List → Card → TodoItem**.
API hỗ trợ xác thực người dùng (JWT), phân quyền, và quản lý cộng tác theo **Workspace**.
Mục tiêu của dự án là cung cấp một backend API linh hoạt, dễ tích hợp với frontend React, hỗ trợ các chức năng chính như:

* **Auth:** Đăng ký, đăng nhập, xác thực JWT.
* **Workspace:** Tạo, cập nhật, xóa workspace, mời và phân quyền thành viên.
* **Board:** Quản lý bảng (board) — tạo, xem, sửa, xóa.
* **BoardMember:** Quản lý vai trò và quyền trong từng board.
* **List:** Tạo và chỉnh sửa danh sách công việc.
* **Card / Todo:** Quản lý thẻ công việc (card), cập nhật list, trạng thái, mô tả.
* **TodoItem:** Quản lý các mục nhỏ (subtasks) trong card.
* **Comment:** Thêm, sửa, xóa bình luận trên card.
* **UserInbox:** Quản lý thẻ công việc được gán cho người dùng.
* **UserRecent:** Ghi lại boards gần đây đã truy cập.

API được mô tả chi tiết bằng **Swagger UI**.

Ứng dụng nhằm giảm thiểu các tác vụ lặp đi lặp lại, cho phép người dùng tập trung vào việc tạo ra giá trị trong khi vẫn giữ cho hệ thống dễ dàng mở rộng với các tính năng trong tương lai.

Được cấp phép theo **MIT**, dự án này mở cho bạn fork, đóng góp và điều chỉnh theo nhu cầu của riêng bạn.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- BUILT WITH -->
## 🧱 Công nghệ sử dụng

Dự án này được phát triển sử dụng các framework, thư viện và công nghệ sau:

**Frontend:**
* [![React][react]][react-url]  
* [![HTML5][html]][html-url]  
* [![TailwindCSS][tailwind]][tailwind-url]  
* [![Bootstrap][bootstrap]][bootstrap-url]

**Backend (Web API):**
* [![.NET][dotnet]][dotnet-url]  
* [![C#][csharp]][csharp-url]
* [![API][api]][api-url]
* [![ASP.NET Core][aspnet]][aspnet-url]

**Database:**
* [![SQL Server][sqlserver]][sqlserver-url]  
* [![Entity Framework][ef]][ef-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## 🚀 Bắt đầu

Làm theo các bước sau để thiết lập dự án trên máy local.

### Yêu cầu

Đảm bảo bạn đã cài đặt các phần mềm sau:

* [.NET Desktop Runtime / SDK](https://dotnet.microsoft.com/en-us/download/dotnet) (Bắt buộc 8.0 hoặc mới hơn)  
* [SQL Server](https://www.microsoft.com/sql-server) hoặc SQL Server Express

### Cài đặt

_Dưới đây là hướng dẫn cài đặt và thiết lập ứng dụng._

1. **Clone repository**
   ```sh
   git clone https://github.com/KayPham05/TrelloClone_v2.git
   ```
2. Mở solution trong Visual Studio
   ```sh
   Trellon.sln
   ```
3. Khôi phục NuGet packages trong Package Manager Console
   ```sh
   dotnet restore
   ```
4. Cài đặt các NuGet dependencies cần thiết trên Package Manager Console (nếu chúng không được khôi phục tự động)
   ```sh
   Install-Package BCrypt.Net-Next -Version 4.0.3
   Install-Package Microsoft.AspNetCore.Authentication.JwtBearer -Version 8.0.2
   Install-Package Microsoft.EntityFrameworkCore -Version 9.0.8
   Install-Package Microsoft.EntityFrameworkCore.Design -Version 9.0.8
   Install-Package Microsoft.EntityFrameworkCore.Proxies -Version 9.0.8
   Install-Package Microsoft.EntityFrameworkCore.SqlServer -Version 9.0.8
   Install-Package Microsoft.EntityFrameworkCore.Tools -Version 9.0.8
   Install-Package Microsoft.Extensions.Configuration.FileExtensions -Version 9.0.8
   Install-Package Microsoft.Extensions.Configuration.Json -Version 9.0.8
   Install-Package Swashbuckle.AspNetCore -Version 6.6.2
   Install-Package System.IdentityModel.Tokens.Jwt -Version 8.0.1
   ```
5. Cấu hình connection string trong `appsettings.json` 
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server={Your server's name};Database={Database's name};Trusted_Connection=True;"
   }
   ```
6. Chạy migrations để tạo database trong Package Manager Console
   ```sh
   update-database
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## 🖥️ Sử dụng

Sau khi cài đặt dự án và thiết lập database, bạn có thể bắt đầu sử dụng API:

**API Endpoints chính:**

### 🔐 Auth
| Method | Endpoint | Mô tả |
|--------|-----------|-------|
| POST | `/v1/api/login/register` | Đăng ký người dùng |
| POST | `/v1/api/login/login` | Đăng nhập |

---

### 🧩 Workspace
| Method | Endpoint | Mô tả |
|--------|-----------|-------|
| POST | `/v1/api/workspace/create` | Tạo workspace |
| PUT | `/v1/api/workspace/update` | Cập nhật thông tin workspace |
| DELETE | `/v1/api/workspace/delete` | Xóa workspace |
| GET | `/v1/api/workspace` | Lấy danh sách tất cả workspaces |
| POST | `/v1/api/workspace/{workspaceId}/invite` | Mời thành viên vào workspace |
| PUT | `/v1/api/workspace/{workspaceUid}/update-role` | Cập nhật vai trò của thành viên |
| DELETE | `/v1/api/workspace/{workspaceId}/members/{userId}` | Xóa thành viên khỏi workspace |
| GET | `/v1/api/workspace/{id}/boards` | Lấy danh sách boards thuộc workspace |

---

### 🗂 Board
| Method | Endpoint | Mô tả |
|--------|-----------|-------|
| GET | `/v1/api/boards` | Lấy danh sách boards |
| POST | `/v1/api/boards` | Tạo board mới |
| GET | `/v1/api/boards/{uid}` | Lấy chi tiết board |
| PUT | `/v1/api/boards/{uid}` | Cập nhật thông tin board |
| DELETE | `/v1/api/boards/{uid}` | Xóa board |

---

### 👥 Board Member
| Method | Endpoint | Mô tả |
|--------|-----------|-------|
| POST | `/v1/api/boardMember/{boardUid}/add` | Thêm thành viên vào board |
| PUT | `/v1/api/boardMember/{boardUid}/update-role` | Cập nhật vai trò thành viên |
| DELETE | `/v1/api/boardMember/{boardUid}/remove/{userUid}` | Xóa thành viên khỏi board |
| GET | `/v1/api/boardMember/{boardUid}/members` | Lấy danh sách thành viên của board |
| GET | `/v1/api/boardMember/{boardUid}/role` | Lấy vai trò hiện tại của người dùng |

---

### 📋 List & Card
| Method | Endpoint | Mô tả |
|--------|-----------|-------|
| GET | `/v1/api/lists` | Lấy danh sách các list |
| POST | `/v1/api/lists` | Tạo list mới |
| PUT | `/v1/api/lists/{listUid}` | Cập nhật list |
| POST | `/v1/api/cards` | Tạo card mới |
| PUT | `/v1/api/cards/{cardUid}/update-status` | Cập nhật trạng thái card |
| PUT | `/v1/api/cards/{cardUid}/update-list` | Di chuyển card sang list khác |
| DELETE | `/v1/api/cards/{id}` | Xóa card |

---

### 💬 Comments
| Method | Endpoint | Mô tả |
|--------|-----------|-------|
| GET | `/v1/api/comments/card/{cardUid}` | Lấy comment theo card |
| POST | `/v1/api/comments` | Thêm comment mới |
| PUT | `/v1/api/comments/{id}` | Chỉnh sửa comment |
| DELETE | `/v1/api/comments/{id}` | Xóa comment |

---

### ✅ Todo Item
| Method | Endpoint | Mô tả |
|--------|-----------|-------|
| POST | `/v1/api/todoItem/add` | Thêm task con (subtask) |
| GET | `/v1/api/todoItem/{cardUid}` | Lấy danh sách các task con |
| PUT | `/v1/api/todoItem/{todoItemUid}/update-status` | Cập nhật trạng thái task |
| DELETE | `/v1/api/todoItem/{todoItemUid}` | Xóa task con |

---

### 📬 User Inbox
| Method | Endpoint | Mô tả |
|--------|-----------|-------|
| GET | `/v1/api/user-inbox/{userUid}` | Lấy danh sách inbox của người dùng |
| POST | `/v1/api/user-inbox/{userUid}` | Thêm item vào inbox |

---

### 🕓 User Recent
| Method | Endpoint | Mô tả |
|--------|-----------|-------|
| GET | `/v1/api/RecentBoard` | Lấy danh sách board gần đây |
| POST | `/v1/api/RecentBoard/{boardUid}` | Ghi lại board vừa truy cập |

---

### 🧾 Các API khác
| Nhóm | Ví dụ endpoint | Mô tả |
|------|----------------|-------|
| AddInboxCard | `/v1/api/add-inbox-card` | Thêm card nhanh vào inbox |
| CardMember | `/v1/api/CardMember/add` | Gán thành viên cho card |
| User | `/v1/api/users/get-by-email` | Tìm người dùng theo email |

---

**Sử dụng Swagger UI:**
1. Chạy API và truy cập `https://localhost:{port}/swagger`
2. Test các endpoints trực tiếp từ Swagger UI
3. Xem request/response models và schemas

**Sử dụng với Postman:**
1. Import Postman collection (nếu có)
2. Đăng nhập để lấy JWT token
3. Thêm token vào Authorization header: `Bearer {your-token}`
4. Test các endpoints

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## 🤝 Đóng góp

Đóng góp là điều làm cho cộng đồng open source trở thành một nơi tuyệt vời để học hỏi, truyền cảm hứng và sáng tạo. Mọi đóng góp từ các thành viên đều được đánh giá cao!

Nếu bạn có đề xuất để làm cho dự án này tốt hơn, vui lòng fork repo và tạo pull request. Bạn cũng có thể mở một issue với tag "enhancement". Đừng quên cho dự án một star! Cảm ơn bạn!

1. Fork dự án
2. Tạo Feature Branch (`git checkout -b feature/TrellonFeature`)
3. Commit thay đổi của bạn (`git commit -m 'Add some TrellonFeature'`)
4. Push lên Branch (`git push origin feature/TrellonFeature`)
5. Mở Pull Request

### Top contributors:

<a href="https://github.com/YourUsername/Trellon/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=YourUsername/Trellon" alt="contrib.rocks image" />
</a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## 📜 Giấy phép

Được phân phối theo giấy phép MIT. Xem `LICENSE.txt` để biết thêm thông tin.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## 📬 Liên hệ

Tên của bạn - [Phạm Tấn Kha](https://github.com/YourUsername)  

[![Email](https://img.shields.io/badge/Email-youremail%40gmail.com-red?style=for-the-badge&logo=gmail&logoColor=white)](mailto:youremail@gmail.com) 

Link dự án: [Trellon trên GitHub](https://github.com/KayPham05/TrelloClone_v2)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## 🙌 Lời cảm ơn

Các tài nguyên và công cụ hữu ích trong quá trình phát triển dự án:

* [Microsoft Docs](https://learn.microsoft.com/) – Tài liệu chính thức .NET và SQL Server  
* [Entity Framework Core Documentation](https://learn.microsoft.com/ef/core/) – Hướng dẫn và tham khảo EF Core  
* [React Documentation](https://react.dev/) – Tài liệu chính thức React
* [Tailwind CSS](https://tailwindcss.com/) – Framework CSS utility-first
* [Bootstrap](https://getbootstrap.com/) – Framework CSS responsive
* [SQL Server Management Studio (SSMS)](https://aka.ms/ssmsfullsetup) – Công cụ quản lý database SQL Server  
* [Visual Studio Code](https://code.visualstudio.com/) – Code editor cho frontend development
* [Visual Studio 2022](https://visualstudio.microsoft.com/) – IDE sử dụng để phát triển backend
* [Shields.io](https://shields.io) – Badges cho README  
* [Choose an Open Source License](https://choosealicense.com) – Hướng dẫn chọn license
* [Trello](https://trello.com/) – Nguồn cảm hứng cho dự án

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
[dotnet]: https://img.shields.io/badge/.NET-512BD4?style=for-the-badge&logo=dotnet&logoColor=white  
[dotnet-url]: https://dotnet.microsoft.com/  

[csharp]: https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=csharp&logoColor=white  
[csharp-url]: https://learn.microsoft.com/dotnet/csharp/  

[sqlserver]: https://img.shields.io/badge/SQL%20Server-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white  
[sqlserver-url]: https://www.microsoft.com/sql-server  

[ef]: https://img.shields.io/badge/Entity%20Framework-512BD4?style=for-the-badge&logo=dotnet&logoColor=white  
[ef-url]: https://learn.microsoft.com/ef/  

[react]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://reactjs.org/

[html]: https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white
[html-url]: https://developer.mozilla.org/en-US/docs/Web/HTML

[tailwind]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[tailwind-url]: https://tailwindcss.com/

[bootstrap]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[bootstrap-url]: https://getbootstrap.com/

[api]: https://img.shields.io/badge/REST_API-FF6C37?style=for-the-badge&logo=postman&logoColor=white
[api-url]: https://restfulapi.net/

[aspnet]: https://img.shields.io/badge/ASP.NET_Core-512BD4?style=for-the-badge&logo=dotnet&logoColor=white
[aspnet-url]: https://learn.microsoft.com/aspnet/core/

[contributors-shield]: https://img.shields.io/github/contributors/YourUsername/Trellon.svg?style=for-the-badge
[contributors-url]: https://github.com/YourUsername/Trellon/graphs/contributors

[forks-shield]: https://img.shields.io/github/forks/YourUsername/Trellon.svg?style=for-the-badge
[forks-url]: https://github.com/YourUsername/Trellon/network/members

[stars-shield]: https://img.shields.io/github/stars/YourUsername/Trellon.svg?style=for-the-badge
[stars-url]: https://github.com/YourUsername/Trellon/stargazers

[issues-shield]: https://img.shields.io/github/issues/YourUsername/Trellon.svg?style=for-the-badge
[issues-url]: https://github.com/YourUsername/Trellon/issues

[license-shield]: https://img.shields.io/github/license/YourUsername/Trellon.svg?style=for-the-badge
[license-url]: https://github.com/YourUsername/Trellon/blob/master/LICENSE

[product-screenshot]: images/screenshot.png
