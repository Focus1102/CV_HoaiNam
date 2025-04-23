// Chức năng điều hướng
document.addEventListener("DOMContentLoaded", function() {
    // Tải thanh điều hướng
    fetch('components/nav.html')
        .then(response => response.text())
        .then(data => {
            const navContainer = document.getElementById('nav-container');
            if (navContainer) {
                navContainer.innerHTML = data;
                // Thêm lớp "active" cho trang hiện tại
                setActiveNavItem();
                // Cài đặt sự kiện click cho logo
                setupLogoClickHandler();
                // Cài đặt menu di động
                setupMobileMenu();
                // Cài đặt nút quay lại đầu trang
                setupScrollToTopButton();
                // Cài đặt hiệu ứng cuộn cho header
                setupScrollHeader();
            }
        })
        .catch(error => {
            console.error('Lỗi khi tải thanh điều hướng:', error);
        });

    // Xử lý sự kiện click vào các liên kết điều hướng
    document.addEventListener('click', function(e) {
        if (e.target.matches('.nav-link')) {
            e.preventDefault();
            const href = e.target.getAttribute('href');
            navigateTo(href);
            
            // Đóng menu di động sau khi click
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        }
    });
});

// Cài đặt hiệu ứng cuộn cho header
function setupScrollHeader() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Cài đặt nút quay lại đầu trang
function setupScrollToTopButton() {
    // Tạo nút quay lại đầu trang
    const scrollButton = document.createElement('div');
    scrollButton.className = 'scroll-to-top';
    scrollButton.innerHTML = '<i class="bi bi-arrow-up"></i>';
    document.body.appendChild(scrollButton);
    
    // Hiển thị nút khi cuộn xuống đủ xa
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    });
    
    // Xử lý sự kiện click vào nút
    scrollButton.addEventListener('click', function() {
        // Cuộn mượt lên đầu trang
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Cài đặt chức năng menu di động
function setupMobileMenu() {
    // Thêm thao tác vuốt xuống để đóng menu trên thiết bị di động
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarCollapse) {
        let touchstartY = 0;
        let touchendY = 0;
        
        navbarCollapse.addEventListener('touchstart', function(e) {
            touchstartY = e.changedTouches[0].screenY;
        });
        
        navbarCollapse.addEventListener('touchend', function(e) {
            touchendY = e.changedTouches[0].screenY;
            handleSwipeGesture();
        });
        
        function handleSwipeGesture() {
            if (touchendY > touchstartY && navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        }
        
        // Đóng menu khi click ra ngoài
        document.addEventListener('click', function(e) {
            if (navbarCollapse.classList.contains('show') && 
                !e.target.closest('.navbar-collapse') && 
                !e.target.closest('.navbar-toggler')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    }
}

// Cài đặt sự kiện click cho logo
function setupLogoClickHandler() {
    const logoLink = document.querySelector('.nav-brand-link');
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Thêm hiệu ứng chuyển trang
            document.body.classList.add('page-transition');
            
            // Kiểm tra xem đang ở trang chính hay trang con
            const isMainPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
            
            if (isMainPage) {
                // Nếu đang ở trang chính, tải lại trang
                window.location.reload();
            } else {
                // Điều hướng về trang chính
                window.location.href = isMainPage ? 'index.html' : '../index.html';
            }
        });
    }
}

// Chức năng điều hướng
function navigateTo(path) {
    // Thêm hiệu ứng chuyển trang
    document.body.classList.add('page-transition');
    
    // Kiểm tra xem đang ở trang chính hay trang con
    const isMainPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
    
    if (path === 'index.html' || path === '/index.html' || path === '/') {
        // Nếu điều hướng đến trang chính, tải lại toàn bộ trang
        window.location.href = isMainPage ? 'index.html' : '../index.html';
        return;
    }
    
    // Với các trang con, sử dụng AJAX để tải nội dung
    const fullPath = isMainPage ? path : path.replace('../', '');
    
    // Tạo bộ nhớ đệm để chuyển trang mượt mà hơn
    const pageCache = sessionStorage.getItem(fullPath);
    
    const loadContent = (html) => {
        // Lấy container chính để chèn nội dung
        const mainContainer = document.querySelector('main');
        
        // Trích xuất nội dung phần section từ HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const sectionContent = tempDiv.querySelector('section');
        
        if (sectionContent) {
            mainContainer.innerHTML = '';
            mainContainer.appendChild(sectionContent);
            
            // Cập nhật URL mà không tải lại trang
            const newUrl = isMainPage ? path : path.substring(path.lastIndexOf('/') + 1);
            window.history.pushState({}, '', newUrl);
            
            // Cập nhật mục điều hướng đang hoạt động
            setActiveNavItem();
            
            // Lưu nội dung vào bộ nhớ đệm
            sessionStorage.setItem(fullPath, sectionContent.outerHTML);
        } else {
            console.error('Không tìm thấy nội dung section trong trang');
            // Dự phòng: tải lại toàn bộ trang
            window.location.href = path;
        }
        
        // Loại bỏ hiệu ứng chuyển trang sau một khoảng thời gian ngắn
        setTimeout(() => {
            document.body.classList.remove('page-transition');
        }, 300);
    };
    
    if (pageCache) {
        // Sử dụng nội dung đã lưu trong bộ nhớ đệm
        const mainContainer = document.querySelector('main');
        mainContainer.innerHTML = pageCache;
        
        // Cập nhật URL mà không tải lại trang
        const newUrl = isMainPage ? path : path.substring(path.lastIndexOf('/') + 1);
        window.history.pushState({}, '', newUrl);
        
        // Cập nhật mục điều hướng đang hoạt động
        setActiveNavItem();
        
        // Loại bỏ hiệu ứng chuyển trang sau một khoảng thời gian ngắn
        setTimeout(() => {
            document.body.classList.remove('page-transition');
        }, 300);
    } else {
        // Tải nội dung mới
        fetch(path)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Phản hồi mạng không thành công');
                }
                return response.text();
            })
            .then(html => {
                loadContent(html);
            })
            .catch(error => {
                console.error('Lỗi khi tải trang:', error);
                // Dự phòng: tải lại toàn bộ trang
                window.location.href = path;
            });
    }
}

// Xử lý nút quay lại/trước trên trình duyệt
window.addEventListener('popstate', function() {
    const currentPath = window.location.pathname;
    const isMainPage = currentPath.endsWith('index.html') || currentPath.endsWith('/');
    
    if (isMainPage) {
        // Nếu đang ở trang chính, tải lại toàn bộ CV
        window.location.reload();
    } else {
        // Nếu không, điều hướng đến đường dẫn hiện tại
        const pathParts = currentPath.split('/');
        const pageName = pathParts[pathParts.length - 1];
        navigateTo(`views/${pageName}`);
    }
});

// Cập nhật mục điều hướng đang hoạt động
function setActiveNavItem() {
    const navItems = document.querySelectorAll('.nav-link');
    // Lấy tên trang hiện tại từ URL
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        // Trích xuất tên tệp từ href
        const hrefPage = href.split('/').pop();
        
        if (hrefPage === currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}
