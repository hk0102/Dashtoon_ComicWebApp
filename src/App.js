import './App.css';
import ComicForm from './components/ComicForm'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Title from "antd/es/typography/Title";
function App() {
    return (
        <>
            <Title level={2} style={{ textAlign: 'center', color: '#1890ff', margin: '20px 0' }}>
                Dashtoon Comic Generator
            </Title>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<ComicForm />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}
export default App;