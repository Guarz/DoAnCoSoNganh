<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task; // Dòng này cực kỳ quan trọng để kết nối với Database
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // Hàm lấy danh sách công việc để gửi cho React
    public function index()
    {
        return response()->json(Task::all());
    }

    // Hàm nhận dữ liệu từ React gửi lên và lưu vào Database
    public function store(Request $request)
    {
        // Kiểm tra xem dữ liệu gửi lên có trống không
        $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $task = Task::create([
            'title' => $request->title,
            'is_completed' => false
        ]);

        return response()->json($task);
    }
}