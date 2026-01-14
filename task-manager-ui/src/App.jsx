import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]); // Lưu danh sách công việc từ database
  const [title, setTitle] = useState(""); // Lưu chữ bạn đang nhập trong ô input

  // 1. Hàm lấy dữ liệu từ Laravel API
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error("Lỗi kết nối API:", error);
    }
  };

  // Tự động lấy dữ liệu khi vừa mở trang web
  useEffect(() => {
    fetchTasks();
  }, []);

  // 2. Hàm thêm công việc mới
  const addTask = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      await axios.post('http://127.0.0.1:8000/api/tasks', { title: title });
      setTitle(""); // Xóa chữ trong ô input sau khi thêm thành công
      fetchTasks(); // Load lại danh sách mới
    } catch (error) {
      alert("Lỗi! Bạn đã bật Laravel chưa?");
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Quản lý công việc (React + Laravel)</h1>
      <form onSubmit={addTask}>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Nhập việc cần làm..."
          style={{ padding: '10px', width: '250px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>Thêm</button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
        {tasks.map((task) => (
          <li key={task.id} style={{ background: '#f4f4f4', margin: '5px auto', padding: '10px', width: '300px', borderRadius: '5px' }}>
            {task.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;