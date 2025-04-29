import { useState } from 'react';
import { Form, Input, Button, message as AntMessage } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  let API = import.meta.env.VITE_API;

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API}/api/register`, {
        name: values.name,
        phone: values.phone,
      });

      if (!response.data.success) {
        AntMessage.success(response.data.message);
        setLoading(false);
        return;
      }

      localStorage.setItem('id', response.data.user.id);
      AntMessage.success("Ma'lumotlar muvaffaqiyatli yuborildi!");
      navigate('/home'); 
    } catch (error) {
      if (error.response) {
        AntMessage.success(error.response.data.message);
      } else {
        AntMessage.success("Xatolik yuz berdi. Iltimos qayta urinib ko'ring.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#323437]">
      <div className="w-full max-w-md bg-[#363739] p-6 rounded-xl shadow-lg">
        <h1 className='font-semibold text-xl text-center mb-5 text-[#FDC700]'>Kirish</h1>

        <Form layout="vertical" onFinish={onFinish} requiredMark={false} className='flex flex-col gap-6'>
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Ismingizni kiriting" }]}
          >
            <Input
              placeholder="John Doe"
              style={{
                background: '#2E2E2E',
                color: '#FDC700',
                borderColor: '#FDC700',
                borderRadius: '8px',
                padding: '10px',
              }}
              className='inputs'
            />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[{ required: true, message: "Telefon raqamingizni kiriting" }]}
          >
            <Input
              placeholder="+998901234567"
              style={{
                background: '#2E2E2E',
                color: '#FDC700',
                borderColor: '#FDC700',
                borderRadius: '8px',
                padding: '10px',
              }}
              className='inputs'
            />
          </Form.Item>

          <Button
            style={{
              background: '#FDC700',
              color: 'black',
              borderRadius: '8px',
              padding: '18px 0',
            }}
            type='primary'
            htmlType="submit"
            block
            loading={loading}
          >
            Yuborish
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default SignUp;