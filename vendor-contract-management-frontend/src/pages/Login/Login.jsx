import {
  Box,
  Paper,
  Typography,
  TextField,
  Button
} from "@mui/material";

import { useForm } from "react-hook-form";
import { loginService } from "../../services/auth.service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const Login = () => {
     const navigate = useNavigate();
     const {  register,handleSubmit, formState: { errors }} = useForm();


  //-------------Login submit handling  method ---------------------------\\
   const onSubmit = async (data) => {
    try {

      const response =
        await loginService(data);

      const userInfo =
        response.response.userInfo;

      localStorage.setItem(
        "accessToken",
        userInfo.accessToken
      );

      localStorage.setItem(
        "refreshToken",
        userInfo.refreshToken
      );

      localStorage.setItem(
        "user",
        JSON.stringify(userInfo.user)
      );

      toast.success(response.message);

      navigate("/dashboard");

    } catch (error) {
  console.log("LOGIN ERROR", error);
  console.log("RESPONSE", error.response);
  console.log("DATA", error.response?.data);
      toast.error(
        error?.response?.data?.message ||
        "Login Failed"
      );

    }

  };
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex"
      }}
    >
      {/* Left Section */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: "#0F172A",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 8
        }}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
        >
          Vendor Contract
        </Typography>

        <Typography
          variant="h3"
          fontWeight="bold"
          mb={3}
        >
          Management Portal
        </Typography>

        <Typography variant="h6">
          Procurement
        </Typography>

        <Typography variant="h6">
          Contracts
        </Typography>

        <Typography variant="h6">
          Finance Operations
        </Typography>
      </Box>

      {/* Right Section */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#F8FAFC"
        }}
      >
     <Paper
  elevation={4}
  sx={{
    width: 420,
    p: 4,
    borderRadius: 3
  }}
>
  <Typography
    variant="h4"
    mb={3}
    fontWeight="bold"
  >
    Sign In
  </Typography>

  <form onSubmit={handleSubmit(onSubmit)}>

    <TextField
      fullWidth
      label="Email"
      margin="normal"
      {...register("email", {
        required: "Email is required"
      })}
      error={!!errors.email}
      helperText={errors.email?.message}
    />

    <TextField
      fullWidth
      type="password"
      label="Password"
      margin="normal"
      {...register("password", {
        required: "Password is required"
      })}
      error={!!errors.password}
      helperText={errors.password?.message}
    />

    <Button
      type="submit"
      fullWidth
      variant="contained"
      sx={{
        mt: 3,
        py: 1.5
      }}
    >
      Login
    </Button>

  </form>

</Paper>
      </Box>
    </Box>
  );
};

export default Login;