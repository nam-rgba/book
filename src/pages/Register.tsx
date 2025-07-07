import { useState } from "react";

import Logo from "../assets/logo.png";
import Banner from "../assets/banner.png";

import { Input, Tooltip } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Link } from "react-router-dom";

import useLocalStorage from "../hooks/useLocalStorage";
import register from "../auth/register"; // Assuming you have a register function in utils
import passwordCheck from "../utils/passwordCheck";

const Register = () => {
  // Using local storage to manage language preference
  const [language, setLanguage] = useLocalStorage<string>("language", "vi");

  //   State for phone and password
  const [phone, setphone] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");


  //   state for login
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  

  // Handle Login function
  const handleRegister = async (e: React.FormEvent) => {
    // Prevent default form submission behavior
    e.preventDefault();
    setSignUpError(""); // Reset error state before validation

    // validate inputs
    if (!phone || !password || !email || !name) {
      setSignUpError("Please fill in all required fields.");
      return;
    }

    // check phone number format and length, shout be 10
    const phoneRegex = /^[0-9]{10,15}$/; // Adjust regex as
    if (!phoneRegex.test(phone)|| phone.length !== 10) {
      setSignUpError("Invalid phone number format.");
      return;
    }

    // check password strength
    const passwordError = passwordCheck(password);
    if (passwordError !== "Password is valid") {
      setSignUpError(passwordError);
      return;
    }

    setIsLoading(true);
    try {
      await register(phone, password, email, name);
      // Handle successful registration, e.g., redirect to login page or home page
      setIsLoading(false);
    } catch (error: unknown) {
      if (error && typeof error === "object" && "message" in error) {
        setSignUpError((error as { message: string }).message);
      } else {
        setSignUpError("An unknown error occurred.");
      }
      setIsLoading(false);
    }
    
  };

  return (
    <div className="w-full h-screen flex flex-row   ">
      <div className="w-[60%] h-full bg-[#eff5ff] flex flex-col items-center justify-center relative">
        <div className="w-[131px] h-[44px] top-[64px] left-[64px] absolute">
          <img src={Logo} alt="logo" className="w-full" />
        </div>

        <div className="w-full h-auto flex flex-col items-center justify-center ">
          <img src={Banner} alt="banner" className="w-[55%]" />
        </div>
      </div>

      {/* Login section */}

      <div className="w-[40%] h-full bg-[#fff] flex items-center justify-center py-6 px-20">
        {/* after padding */}
        <div className=" h-full w-full flex flex-col gap-6  ">
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
          <div className="w-[400px] h-[500px] bg-white flex flex-col gap-6">
            {/* welcome */}
            <div className="text-left h-9 flex flex-col items-start justify-center gap-2 mb-4">
              <div className="font-semibold font-sans text-[30px] text-[##2A3547] leading-[120%]">
                {language === "vi"
                  ? "Chào mừng bạn đến với RIVI"
                  : "Welcome to RIVI"}
              </div>
              <div>
                <span className="text-[14px] font-bold  text-[#5A6A85] leading-[120%]">
                  {language === "vi"
                    ? "Vui lòng đăng nhập để sử dụng dịch vụ của chúng tôi"
                    : "Please login to continue using our services"}
                </span>
              </div>
            </div>

            {/* form */}

            {/* input for email */}
            <div className="w-full h-[70px] flex flex-col justify-between gap-0.5">
              <div>
                <span className="text-[16px] font-bold  text-[#2A3547] leading-[120%]">
                  {language === "vi"
                    ? "Nhập email của bạn"
                    : "Enter your email"}
                  <span className="text-red-600">*</span>
                </span>
              </div>
              <Tooltip
                title={
                  language === "vi" ? "Nhập email của bạn" : "Enter your email"
                }
              >
                <Input
                  className="w-full h-[40px] bg-white rounded-md border border-[#BDC7D5] focus:border-[#344054]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Tooltip>
            </div>

            {/* input for name */}
            <div className="w-full h-[70px] flex flex-col justify-between gap-0.5">
              <div>
                <span className="text-[16px] font-bold  text-[#2A3547] leading-[120%]">
                  {language === "vi" ? "Nhập tên của bạn" : "Enter your name"}
                  <span className="text-red-600">*</span>
                </span>
              </div>
              <Tooltip
                title={
                  language === "vi" ? "Nhập tên của bạn" : "Enter your name"
                }
              >
                <Input
                  className="w-full h-[40px] bg-white rounded-md border border-[#BDC7D5] focus:border-[#344054]"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Tooltip>
            </div>

            {/* input for phone */}
            <div className="w-full h-[70px] flex flex-col justify-between gap-0.5">
              <div>
                <span className="text-[16px] font-bold  text-[#2A3547] leading-[120%]">
                  {language === "vi"
                    ? "Nhập Số điện thoại của bạn"
                    : "Enter your phone"}
                  <span className="text-red-600">*</span>
                </span>
              </div>
              <Tooltip
                title={
                  language === "vi" ? "Nhập SĐT của bạn" : "Enter your phone"
                }
              >
                <Input
                  className="w-full h-[40px] bg-white rounded-md border border-[#BDC7D5] focus:border-[#344054]"
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
                  className="w-full h-[40px] bg-white rounded-md border border-[#BDC7D5] focus:border-[#344054]"
                />
              </Tooltip>
            </div>

            {/* Error message */}
            {signUpError && (
              <div className="text-red-600 text-center">
                <span className="text-[16px] font-bold">
                  {signUpError || "Login failed. Please try again."}
                </span>
              </div>
            )}

            {/* Login */}
            <div>
              <button
                onClick={handleRegister}
                className="w-full h-[40px] bg-[#1A73E8] text-white rounded-md font-semibold text-[16px]"
              >
                {isLoading ? (
                  <span className="animate-spin">Loading...</span>
                ) : (
                  <span>{language === "vi" ? "Đăng kí" : "Register"}</span>
                )}
              </button>
            </div>

            {/* create account */}
            <div>
              <span className="text-[16px] font-bold text-[#2A3547] leading-[120%]">
                {language === "vi"
                  ? "Đã có tài khoản? "
                  : "Already here? "}
                <Link className="text-[#1A73E8]" to={"/login"}>
                  {language === "vi" ? "Đăng Nhập" : "Register"}
                </Link>
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

export default Register;
