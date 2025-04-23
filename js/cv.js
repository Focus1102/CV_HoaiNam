// Chức năng chính của CV
document.addEventListener('DOMContentLoaded', function() {
    // Thêm nút chuyển đổi chế độ tối sau khi header được tải
    addDarkModeToggle();

    // Chức năng xuất file Word
    const exportButton = document.getElementById('exportfile');
    if (exportButton) {
        exportButton.addEventListener('click', async function() {
            // Vô hiệu hóa nút và hiển thị biểu tượng tải (spinner)
            exportButton.disabled = true;
            const spinner = document.createElement('div');
            spinner.className = 'spinner';
            exportButton.parentNode.insertBefore(spinner, exportButton.nextSibling);
            spinner.style.display = 'block';

            try {
                // Lấy nội dung từ các phần tử HTML
                const name = document.querySelector('h1').textContent;
                const title = document.querySelector('#contact p').textContent;
                const contactInfo = Array.from(document.querySelectorAll('.contact-info p')).map(p => p.textContent);
                const education = document.querySelector('#education').innerText;
                const skills = document.querySelector('#skills').innerText;
                const careerObjective = document.querySelector('#career-objective').innerText;
                const projects = document.querySelector('#personal-projects').innerText;
                const experience = document.querySelector('#external-work-experience').innerText;

                // Lấy hình ảnh đại diện
                const img = document.querySelector('.profile-picture img');
                const response = await fetch(img.src);
                const blob = await response.blob();
                const imageBase64 = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result.split(',')[1]);
                    reader.readAsDataURL(blob);
                });

                // Tạo tài liệu Word
                const doc = new docx.Document({
                    sections: [{
                        properties: {},
                        children: [
                            new docx.Paragraph({
                                children: [
                                    // Thêm hình ảnh vào tài liệu
                                    new docx.ImageRun({
                                        data: imageBase64,
                                        transformation: {
                                            width: 150,
                                            height: 150
                                        }
                                    }),
                                    // Thêm tên, tiêu đề và các thông tin khác
                                    new docx.TextRun({ text: name, bold: true, size: 28, break: 1 }),
                                    new docx.TextRun({ text: title, break: 1, size: 24 }),
                                    ...contactInfo.map(info => new docx.TextRun({ text: info, break: 1 })),
                                    new docx.TextRun({ text: education, break: 2 }),
                                    new docx.TextRun({ text: skills, break: 2 }),
                                    new docx.TextRun({ text: careerObjective, break: 2 }),
                                    new docx.TextRun({ text: projects, break: 2 }),
                                    new docx.TextRun({ text: experience, break: 2 })
                                ]
                            })
                        ]
                    }]
                });

                // Tạo và tải xuống file Word
                await docx.Packer.toBlob(doc).then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'CV.docx';
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                });
            } catch (error) {
                // Xử lý lỗi khi xuất file
                console.error('Error exporting to Word:', error);
                alert('Có lỗi xảy ra khi xuất file. Vui lòng thử lại.');
            } finally {
                // Bật lại nút và ẩn biểu tượng tải
                exportButton.disabled = false;
                spinner.style.display = 'none';
            }
        });
    }
});

// Chức năng chế độ tối
function addDarkModeToggle() {
    // Tạo nút chuyển đổi chế độ tối
    const darkModeToggle = document.createElement('button');
    darkModeToggle.id = 'darkModeToggle';
    darkModeToggle.className = 'btn';
    darkModeToggle.innerHTML = '🌙';
    darkModeToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #2c3e50;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;

    // Thêm nút vào trang
    document.body.appendChild(darkModeToggle);

    // Kiểm tra chế độ tối đã được lưu trong localStorage
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '☀️';
    }

    // Xử lý sự kiện click để chuyển đổi chế độ
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        darkModeToggle.innerHTML = isDark ? '☀️' : '🌙';
        localStorage.setItem('darkMode', isDark);
    });
}

