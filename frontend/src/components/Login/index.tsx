import { useForm } from "react-hook-form";
import { useState } from "react";
import { API_URL } from "@/lib/config";
import { TokenService } from "@/utils/auth";

type LoginFormValues = {
  username: string;
  password: string;
};

type Props = {
  onLoginSuccess: () => void;
  onClose: () => void;
};

const Login = ({ onLoginSuccess, onClose }: Props) => {
  const inputStyles = `mb-5 w-full rounded-lg bg-primary-300 px-5 py-3 placeholder-white text-black text-base`;
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormValues>();

  const onSubmit = async (data: LoginFormValues) => {
    setError("");
    try {
      const response = await fetch(`${API_URL}/users/api/login-jwt/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      });

      if (!response.ok) {
        let errorMessage = "Login failed";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          errorMessage = `Server error: ${response.status}`;
        }
        setError(errorMessage);
        return;
      }

      const result = await response.json();

      if (result.success) {
        TokenService.setTokens(result.access, result.refresh);
        TokenService.setUser(result.user);
        reset();
        window.location.reload();
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setError("Network error. Please check your connection.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md">

        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Sign In</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-3xl leading-none transition"
            type="button"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            className={inputStyles}
            type="text"
            placeholder="Username"
            autoComplete="username"
            {...register("username", { required: true, minLength: 3 })}
          />
          {errors.username && (
            <p className="mt-1 mb-3 text-sm text-primary-500">
              {errors.username.type === "required" && "Username is required."}
              {errors.username.type === "minLength" && "Username must be at least 3 characters."}
            </p>
          )}

          <input
            className={inputStyles}
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            {...register("password", { required: true, minLength: 1 })}
          />
          {errors.password && (
            <p className="mt-1 mb-3 text-sm text-primary-500">
              {errors.password.type === "required" && "Password is required."}
            </p>
          )}

          {error && (
            <div className="mt-2 p-3 rounded-lg bg-red-100 text-red-800 text-sm">
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="mt-5 w-full rounded-lg bg-secondary-500 text-white py-3 font-bold transition duration-300 hover:bg-secondary-600 active:scale-95 text-base"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;