import { Button } from 'antd';
import type { ButtonProps } from 'antd';

interface CustomButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const CustomButton = ({ children, ...props }: CustomButtonProps) => {
  return (
    <Button
      {...props}
      className="bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md px-4 py-2 transition-colors duration-200"
    >
      {children}
    </Button>
  );
};

export default CustomButton;
