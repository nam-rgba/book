import { Button } from 'antd';
import type { ButtonProps } from 'antd';

interface CustomButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const ButtonPrimary = ({ children, ...props }: CustomButtonProps) => {
  return (
    <Button
      {...props}
      className="bg-java-500 text-white hover:bg-java-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md px-4 py-2 transition-colors duration-200"
    >
      {children}
    </Button>
  );
};


const ButtonSecondary = ({ children, ...props }: CustomButtonProps) => {
  return (
    <Button
      {...props}
      className="bg-orange-500 text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md px-4 py-2 transition-colors duration-200"
    >
      {children}
    </Button>
  );
};




export { ButtonPrimary, ButtonSecondary };
