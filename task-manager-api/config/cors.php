<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    // Cho phép CORS trên tất cả các đường dẫn bắt đầu bằng api/
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    // Cho phép tất cả các phương thức: GET, POST, PUT, DELETE, OPTIONS
    'allowed_methods' => ['*'],

    // QUAN TRỌNG: Cho phép tất cả các nguồn (Origin) gửi request tới
    // Điều này giúp bạn tránh lỗi khi Vite tự đổi cổng từ 5173 sang 5174
    'allowed_origins' => ['*'],

    'allowed_origins_patterns' => [],

    // Cho phép tất cả các Headers (Content-Type, Authorization, X-Requested-With,...)
    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Để true nếu bạn có dùng Cookie hoặc Session (như Laravel Sanctum)
    'supports_credentials' => true,

];