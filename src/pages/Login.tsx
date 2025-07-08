import { useState } from "react";

import Logo from "../assets/logo.png";
import Banner from "../assets/banner.png";
import SuccessAnimation from "../components/SuccessAnimation";

import { Input, Tooltip, Modal } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

import useLocalStorage from "../hooks/useLocalStorage";
import useCookie from "../hooks/useCookie";
import login from "../auth/login";
import getProfile from "../auth/getProfile"
import { userStore } from "../store/user.mobx";


const Login = () => {
  // Using local storage to manage language preference
  const [language, setLanguage] = useLocalStorage<string>("language", "vi");
  // use cookie
  const { setCookie } = useCookie("access_token");
  //   State for phone and password
  const [phone, setphone] = useState<string>("");
  const [password, setPassword] = useState<string>("");


  //   state for login
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  

  const navigate = useNavigate();

  // Handle Login function
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);

    try {
      const response = await login(phone, password);
      setIsLoading(false);
      setCookie( response.token, 7); // Set cookie for 7 days
      // get p5
      const userProfile = await getProfile(response.token)
      userStore.setUser(userProfile); 

      setIsSuccess(true);
      console.log("Login successful:", response.token);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setLoginError(error.message);
      } else {
        setLoginError("Login failed. Please try again.");
      }
      setIsLoading(false);
    }
  };



  // Handle when success login, modal up and redirect to home page
  if (isSuccess) {
    setTimeout(() => {
      navigate("/");
    }, 3000); // Redirect after 1 second
  }



  return (
    <div className="w-full h-screen flex flex-row   ">

      {/* Modal if success login */}
      <Modal
        open={isSuccess}
        title={language === "vi" ? "Đăng nhập thành công" : "Login Successful"}
        footer={null}
        centered
        closable={false}
      >
        <div className="text-center">

          <SuccessAnimation size={100} duration={1} className="mx-auto mb-4" />
          <p className="text-lg">
            {language === "vi"
              ? "Bạn sẽ đến trang chủ sau giây lát."
              : " We will redirect you to the home page."}
          </p>
        </div>
      </Modal>

      {/* Banner section */}
      <div className="w-[60%] h-full bg-[#eff5ff] flex flex-col items-center justify-center relative">
        <div className="w-[131px] h-[44px] top-[64px] left-[64px] absolute">
          <img src={Logo} alt="logo" className="w-full" />
        </div>

        <div className="w-full h-auto flex flex-col items-center justify-center ">
          <img src={Banner} alt="banner" className="w-[55%]" />
        </div>
      </div>

      {/* Login section */}
      <div className="w-[40%] h-full bg-[#fff] flex items-center justify-center py-16 px-16">
        {/* after padding */}
        <div className=" h-full w-full flex flex-col gap-6 justify-between ">
          {/* language */}
          <div className="top-1 right-1 relative flex items-center justify-end mb-4">
            {/* text */}
            <label className="text-[14px] text-[#5D6A83] mr-2">
              {language === "vi" ? "Thay đổi ngôn ngữ" : "Change Language"}
            </label>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border-none focus:outline-none rounded-md p-2"
            >
              <option value="vi"> Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* main */}
          <div className="w-[460px] h-[500px] bg-white flex flex-col gap-6">
            {/* welcome */}
            <div className="text-left h-9 flex flex-col items-start justify-center gap-2 mb-4">
              <div className="font-semibold font-sans text-[30px] text-[##2A3547] leading-[120%]">
                {language === "vi"
                  ? "Chào mừng bạn đến với RIVI"
                  : "Welcome to RIVI"}
              </div>
              <div>
                <span className="text-[16px] font-bold  text-[#5A6A85] leading-[120%]">
                  {language === "vi"
                    ? "Vui lòng đăng nhập để sử dụng dịch vụ của chúng tôi"
                    : "Please login to continue using our services"}
                </span>
              </div>
            </div>

            {/* form */}
            {/* button login google */}
            <div className="w-full h-[50px] flex items-center justify-center">
              <button className="w-full h-full shadow-[1px_0px_4px_0px_rgba(0,_0,_0,_0.1)]  text-[#344054] rounded-md font-semibold text-[16px] flex flex-row items-center justify-center gap-2">
                {language === "vi"
                  ? "Đăng nhập bằng Google"
                  : "Login with Google"}
                <span>
                  <FcGoogle className="w-6 h-6" />
                </span>
              </button>
            </div>

            {/* or */}
            <div className="w-full h-[50px] flex items-center justify-center">
              <div className="w-full text-center solid border-b border-[#BDC7D5] leading-[0.1em]">
                <span className=" bg-white px-2 text-[#BDC7D5] font-semibold">
                  {language === "vi" ? "Hoặc đăng nhập với" : "Or login with"}
                </span>
              </div>
            </div>

            {/* input for phone */}
            <div className="w-full h-[70px] flex flex-col justify-between gap-0.5">
              <div>
                <span className="text-[16px] font-bold  text-[#2A3547] leading-[120%]">
                  {language === "vi"
                    ? "Nhập phone của bạn"
                    : "Enter your phone"}
                  <span className="text-red-600">*</span>
                </span>
              </div>
              <Tooltip
                title={
                  language === "vi" ? "Nhập phone của bạn" : "Enter your phone"
                }
              >
                <Input
                  className="w-full h-[50px] bg-white rounded-md border border-[#BDC7D5] focus:border-[#344054]"
                  value={phone}
                  onChange={(e) => setphone(e.target.value)}
                />
              </Tooltip>
            </div>

            {/* input for password */}
            <div className="w-full h-[70px] flex flex-col justify-between gap-0.5">
              <div>
                <span className="text-[16px] font-bold  text-[#2A3547] leading-[120%]">
                  {language === "vi"
                    ? "Nhập mật khẩu của bạn"
                    : "Enter your password"}
                  <span className="text-red-600">*</span>
                </span>
              </div>
              <Tooltip
                title={
                  language === "vi" ? "Nhập phone của bạn" : "Enter your phone"
                }
              >
                <Input.Password
                  placeholder="input password"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[50px] bg-white rounded-md border border-[#BDC7D5] focus:border-[#344054]"
                />
              </Tooltip>
            </div>

            {/* remember me */}
            <div className="w-full h-[50px] flex flex-row items-center gap-2">
              <div className="flex flex-row items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-blue-600 pr-4"
                />
                <span className="text-[14px] ml-2 text-[#2A3547] leading-[120%]">
                  {language === "vi" ? "Ghi nhớ đăng nhập" : "Remember me"}
                </span>
              </div>

              <div className="ml-auto">
                <span className="text-[14px]  text-[#1A73E8] leading-[120%]">
                  {language === "vi" ? "Quên mật khẩu?" : "Forgot password?"}
                </span>
              </div>
            </div>

            {/* Error message */}
            {loginError && (
              <div className="text-red-600 text-center">
                <span className="text-[16px] font-bold">
                  {loginError || "Login failed. Please try again."}
                </span>
              </div>
            )}

            {/* Login */}
            <div>
              <button
                onClick={handleLogin}
                className="w-full h-[50px] bg-[#1A73E8] text-white rounded-md font-semibold text-[16px]"
              >
                {isLoading ? (
                  <span className="animate-spin">Loading...</span>
                ) : (
                  <span>{language === "vi" ? "Đăng nhập" : "Login"}</span>
                )}
              </button>
            </div>

            {/* create account */}
            <div>
              <span className="text-[16px] font-bold text-[#2A3547] leading-[120%]">
                {language === "vi"
                  ? "Chưa có tài khoản? "
                  : "Don't have an account? "}
                <span className="text-[#1A73E8]">
                  {language === "vi" ? "Tạo tài khoản ngay" : "Create account"}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-12 left-16 absolute weight-400 text-[14px] text-[##5D6A83]">
        @ 2025 RIVI. All Right Reserved.
      </div>
    </div>
  );
};

export default Login;
