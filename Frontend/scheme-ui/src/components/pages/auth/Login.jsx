import React, { useState, useContext } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  InputAdornment,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { styled } from "@mui/system";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../../context/UserContext";
import { Mail, Lock, LogIn } from "lucide-react";
import toast  from "react-hot-toast";

const theme = createTheme({
  palette: {
    primary: { main: "#74B83E" },
    background: { default: "#F5FBF4" },
  },
  typography: {
    fontFamily: "'Nunito', sans-serif",
  },
});

const Wrapper = styled(Box)(({ theme }) => ({
  minHeight: "70vh",
  display: "flex",
  justifyContent: "center",
  paddingTop: "60px",          // navbar clearance
  paddingBottom: "40px",
  background: "#F5FBF4",
}));

const AuthCard = styled(Paper)(({ theme }) => ({
  width: "100%",
  maxWidth: 960,
  display: "flex",
  borderRadius: 22,
  overflow: "hidden",
  boxShadow: "0 25px 60px rgba(0,0,0,0.12)",

  [theme.breakpoints.down("md")]: {
    flexDirection: "column",   // stack layout
  },
}));

const LeftPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  minHeight: 260,
  backgroundImage:
    "url('https://claritydeskhub.com/wp-content/uploads/2025/09/5.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",

  [theme.breakpoints.down("md")]: {
    display: "none",           // hide on small screens
  },
}));

const RightPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  justifyContent: "center",
  padding: "48px",

  [theme.breakpoints.down("sm")]: {
    padding: "28px 20px",      // mobile padding
  },
}));
const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { email, password } = form;

    if (!email || !password)
      return setError("Enter email and password");

    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

      const res = await axios.post(
        `${BACKEND_URL}/api/v1/users/login`,
        { email, password },
        { withCredentials: true }
      );
    //  console.log(`${BACKEND_URL}/api/v1/users/login`);
     
      if (res.data.success) {
        
        login(res.data.user, res.data.user.token);
        toast.success("Login successful! Redirecting...");
        navigate("/");
      } else {
        setError(res.data.message);
        
      }
    } catch (error) {
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      // This is a generic network error, could include ERR_INTERNET_DISCONNECTED
      console.error('Network Error: Please check your internet connection.');
      toast.error(error.message || 'Network Error: Please check your internet connection.');
      // You might want to set a state to display this message to the user
      // setErrorMessage('Please check your internet connection and try again.');
    } else {
      // Handle other types of errors (e.g., server-side validation errors)
      console.error('Login error:', error.response ? error.response.data : error.message);
      toast.error(error.response?.data?.message || 'An error occurred during login. Please try again.');
    }
  }}

  return (
    <ThemeProvider theme={theme}>
      <Wrapper>
        <AuthCard elevation={0}>
          <LeftPanel />

          <RightPanel>
            <Box width="100%" maxWidth={360}>
              <Typography variant="h5" fontWeight={800} mb={1}>
                👋 Welcome Back
              </Typography>

              <Typography variant="body2" color="text.secondary" mb={3}>
                🔐 Login to continue
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  margin="dense"
                  placeholder="Enter your Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={18} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "#F9FFF6",
                    },
                  }}
                />

                <TextField
                  fullWidth
                  margin="dense"
                  placeholder="Enter your Password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={18} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "#F9FFF6",
                    },
                  }}
                />

                {error && (
                  <Typography color="error" variant="body2" mt={1}>
                    ⚠️ {error}
                  </Typography>
                )}

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{
                    mt: 2.5,
                    borderRadius: 2.5,
                    textTransform: "none",
                    fontWeight: 700,
                    padding: "10px",
                    backgroundColor: "#74B83E",
                    ":hover": {
                      backgroundColor: "#5CA32F",
                    },
                  }}
                >
                  <LogIn size={18} style={{ marginRight: 6 }} />
                  Login
                </Button>

                <Typography variant="body2" mt={2} textAlign="center">
                  Don’t have an account?{" "}
                  <Link
                    to="/signup"
                    style={{
                      color: "#74B83E",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    Create Account
                  </Link>
                </Typography>
              </Box>
            </Box>
          </RightPanel>
        </AuthCard>
      </Wrapper>
    </ThemeProvider>
  );
}

export default Login;

