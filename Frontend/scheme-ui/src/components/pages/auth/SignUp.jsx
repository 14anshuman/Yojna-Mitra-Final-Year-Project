import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  InputAdornment,
  ThemeProvider,
  createTheme,
  MenuItem,
  Select,
  Chip,
  OutlinedInput,
} from "@mui/material";
import { styled } from "@mui/system";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Lock, User, Phone } from "lucide-react";
import toast from "react-hot-toast";

const theme = createTheme({
  palette: {
    primary: { main: "#74B83E" },
    background: { default: "#F5FBF4" },
  },
  typography: {
    fontFamily: "'Nunito', sans-serif",
  },
});

const INDIA_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman and Nicobar Islands","Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu","Delhi",
  "Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry",
];

const CATEGORIES = [
  "Women and Child",
  "Utility & Sanitation",
  "Travel & Tourism",
  "Transport & Infrastructure",
  "Sports & Culture",
  "Social Welfare & Empowerment",
  "Skills & Employment",
  "Science, IT & Communications",
  "Public Safety, Law & Justice",
  "Housing & Shelter",
  "Health & Wellness",
  "Education & Learning",
  "Business & Entrepreneurship",
  "Banking, Financial Services & Insurance",
  "Agriculture, Rural & Environment",
];

const Wrapper = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  paddingTop: "90px",
  paddingBottom: "40px",
  background: "#F5FBF4",
}));

const AuthCard = styled(Paper)(({ theme }) => ({
  width: "100%",
  maxWidth: 980,
  display: "flex",
  borderRadius: 22,
  overflow: "hidden",
  boxShadow: "0 25px 60px rgba(0,0,0,0.12)",

  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
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
    display: "none",
  },
}));

const RightPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  justifyContent: "center",
  padding: "48px",

  [theme.breakpoints.down("sm")]: {
    padding: "28px 20px",
  },
}));

const fieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "#F9FFF6",
  },
};

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    state: "",
    incomeGroup: "",
    interests: [],
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    for (const key in form) {
      if (!form[key] || (Array.isArray(form[key]) && !form[key].length))
        return setError("Please complete all fields");
    }

    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

      const res = await axios.post(
        `${BACKEND_URL}/api/v1/users/signup`,
        form
      );
      if (res.data.success) {
        toast.success("Signup successful! Please log in.");
      }
      if (res.data.success) navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Wrapper>
        <AuthCard elevation={0}>
          <LeftPanel />

          <RightPanel>
            <Box width="100%" maxWidth={420}>
              <Typography variant="h5" fontWeight={800}>
                ✨ Create Account
              </Typography>

              <Typography variant="body2" color="text.secondary" mb={2.5}>
                🚀 Enter your details to get started
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <TextField fullWidth margin="dense" label="Full Name" name="name"
                  value={form.name} onChange={handleChange}
                  InputProps={{ startAdornment: <InputAdornment position="start"><User size={18}/></InputAdornment> }}
                  sx={fieldStyle}
                />

                <TextField fullWidth margin="dense" label="Email" name="email"
                  value={form.email} onChange={handleChange}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Mail size={18}/></InputAdornment> }}
                  sx={fieldStyle}
                />

                <TextField fullWidth margin="dense" label="Phone" name="phone"
                  value={form.phone} onChange={handleChange}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Phone size={18}/></InputAdornment> }}
                  sx={fieldStyle}
                />

                <TextField fullWidth margin="dense" label="Age" name="age" type="number"
                  value={form.age} onChange={handleChange} sx={fieldStyle}
                />

                <TextField select fullWidth margin="dense" label="Gender" name="gender"
                  value={form.gender} onChange={handleChange} sx={fieldStyle}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>

                <TextField select fullWidth margin="dense" label="State" name="state"
                  value={form.state} onChange={handleChange} sx={fieldStyle}
                >
                  {INDIA_STATES.map((state) => (
                    <MenuItem key={state} value={state}>{state}</MenuItem>
                  ))}
                </TextField>

                <TextField select fullWidth margin="dense" label="Income Group" name="incomeGroup"
                  value={form.incomeGroup} onChange={handleChange} sx={fieldStyle}
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Middle">Middle</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </TextField>

                <Select
                  multiple
                  fullWidth
                  label="Interests"
                  name="interests"
                  value={form.interests}
                  onChange={(e) => setForm({ ...form, interests: e.target.value })}
                  input={<OutlinedInput />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => <Chip key={value} label={value} />)}
                    </Box>
                  )}
                  sx={{ mt: 1, borderRadius: "12px", backgroundColor: "#F9FFF6" }}
                >
                  {CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>

                <TextField fullWidth margin="dense" label="Password" type="password"
                  name="password" value={form.password} onChange={handleChange}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Lock size={18}/></InputAdornment> }}
                  sx={fieldStyle}
                />

                {error && (
                  <Typography color="error" variant="body2" mt={1}>
                    ⚠️ {error}
                  </Typography>
                )}

                <Button fullWidth type="submit" variant="contained"
                  sx={{ mt: 2.5, borderRadius: 2.5, textTransform: "none", fontWeight: 700 }}
                >
                  Sign up
                </Button>

                <Typography variant="body2" mt={2} textAlign="center">
                  Already have an account? <Link to="/login">Sign in</Link>
                </Typography>
              </Box>
            </Box>
          </RightPanel>
        </AuthCard>
      </Wrapper>
    </ThemeProvider>
  );
};

export default Signup;