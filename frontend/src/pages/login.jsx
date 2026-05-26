import {
  useState,
  useEffect
} from "react";

import {
  useNavigate
} from "react-router-dom";

import API from "../services/api";

export default function Login() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");


  useEffect(() => {

    import("./Dashboard");
    import("./ManagerDashboard");

  }, []);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleLogin = async (e) => {

    e.preventDefault();

    setLoading(true);

    setError("");

    try {

      const res = await API.post(
        "/api/login",
        formData
      );


      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );


      if (res.data.access_token) {

        localStorage.setItem(
          "token",
          res.data.access_token
        );

      }


      if (res.data.user.role === "manager") {

        navigate("/manager");

      } else {

        navigate("/dashboard");

      }

    } catch (err) {

      setError(
        "Invalid Email or Password"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">



      <div className="flex items-center justify-center bg-white px-10">

        <form
          className="flex flex-col items-center justify-center w-full max-w-md"
          onSubmit={handleLogin}
        >

          <h1 className="text-4xl font-bold mb-2">
            Welcome Back
          </h1>

          <p className="text-gray-500 mb-8">
            Login to Import Export AI
          </p>

          {error && (

            <div className="bg-red-100 text-red-500 p-3 rounded mb-4 w-full text-center">

              {error}

            </div>

          )}

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            onChange={handleChange}
            className="w-full border p-4 rounded-lg mb-6 outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={handleChange}
            className="w-full border p-4 rounded-lg mb-6 outline-none focus:ring-2 focus:ring-black"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white p-4 rounded-lg hover:bg-gray-800 transition-all duration-200 disabled:bg-gray-400"
          >

            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>
      </div>
      <div className="hidden md:flex items-center justify-center bg-black">

        <img
          src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200&q=70&fm=webp"
          alt="Import Export"
          className="w-full h-full object-cover"
          fetchPriority="high"
        />

      </div>

    </div>

  );

}