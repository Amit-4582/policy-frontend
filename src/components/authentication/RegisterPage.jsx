import { useState } from "react";
import { useForm } from "react-hook-form";
import { styled } from "@mui/material/styles";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useNavigate, Link as RouterLink, Link } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { registerUser } from "../../features/authentication-module/authActions";

// Styled container for the register page
const RegisterContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  padding: theme.spacing(2),
}));

// Styled form wrapper with enhanced visuals
const FormWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  width: "100%",
  maxWidth: "400px",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 48px rgba(0, 0, 0, 0.15)",
  },
}));

// Styled button container for layout
const ButtonContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
  justifyContent: "center",
}));

// Styled error message
const ErrorMessage = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: "0.875rem",
  marginTop: theme.spacing(0.5),
}));

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onBlur",
  });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleReset = () => {
    reset();
  };

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(registerUser(data)).unwrap();
      if (result.success) {
        toast.success("Registration successful!");
        reset();
        navigate("/login");
      }
    } catch (error) {
      console.log("Error ", error);
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <RegisterContainer>
      <FormWrapper>
        <Typography
          variant="h4"
          align="center"
          sx={{ fontWeight: "bold", color: "#1e293b", mb: 4 }}
        >
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            margin="normal"
            error={!!errors.name}
            {...register("name", {
              required: "Name is required",
              pattern: {
                value: /^[A-Za-z\s]{2,}$/,
                message:
                  "Name must contain only letters and be at least 2 characters",
              },
            })}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "&:hover fieldset": {
                  borderColor: "#3b82f6",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#3b82f6",
                },
              },
            }}
          />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}

          <TextField
            fullWidth
            label="Date of Birth"
            variant="outlined"
            margin="normal"
            type="date"
            InputLabelProps={{ shrink: true }}
            error={!!errors.dob}
            {...register("dob", {
              required: "Date of Birth is required",
              validate: {
                validDate: (value) => {
                  const today = new Date();
                  const inputDate = new Date(value);
                  return (
                    inputDate < today || "Date of Birth cannot be in the future"
                  );
                },
                oldEnough: (value) => {
                  const minAgeDate = new Date();
                  minAgeDate.setFullYear(minAgeDate.getFullYear() - 13);
                  return (
                    new Date(value) <= minAgeDate ||
                    "You must be at least 13 years old"
                  );
                },
              },
            })}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "&:hover fieldset": {
                  borderColor: "#3b82f6",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#3b82f6",
                },
              },
            }}
          />
          {errors.dob && <ErrorMessage>{errors.dob.message}</ErrorMessage>}

          <TextField
            fullWidth
            label="Contact Number"
            variant="outlined"
            margin="normal"
            type="tel"
            error={!!errors.contactNo}
            {...register("contactNo", {
              required: "Contact Number is required",
              pattern: {
                value: /^\+?[1-9]\d{1,14}$/,
                message: "Invalid phone number format",
              },
            })}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "&:hover fieldset": {
                  borderColor: "#3b82f6",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#3b82f6",
                },
              },
            }}
          />
          {errors.contactNo && (
            <ErrorMessage>{errors.contactNo.message}</ErrorMessage>
          )}

          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            type="email"
            error={!!errors.emailId}
            {...register("emailId", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "&:hover fieldset": {
                  borderColor: "#3b82f6",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#3b82f6",
                },
              },
            }}
          />
          {errors.emailId && (
            <ErrorMessage>{errors.emailId.message}</ErrorMessage>
          )}

          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            margin="normal"
            type={showPassword ? "text" : "password"}
            error={!!errors.password}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  "Password must include uppercase, lowercase, number, and special character",
              },
            })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePassword}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "&:hover fieldset": {
                  borderColor: "#3b82f6",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#3b82f6",
                },
              },
            }}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}

          <ButtonContainer>
            <Button
              variant="outlined"
              color="secondary"
              type="button"
              onClick={handleReset}
              sx={{
                minWidth: "120px",
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: "medium",
                "&:hover": {
                  backgroundColor: "#f1f5f9",
                },
              }}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{
                minWidth: "120px",
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: "medium",
                backgroundColor: "#3b82f6",
                "&:hover": {
                  backgroundColor: "#2563eb",
                },
              }}
            >
              Submit
            </Button>
          </ButtonContainer>
          <Typography align="center" sx={{ mt: 2 }}>
            Already have an account?{" "}
            <Link component={RouterLink} to="/login" sx={{ color: "#3b82f6" }}>
              Login
            </Link>
          </Typography>
        </Box>
      </FormWrapper>
    </RegisterContainer>
  );
};

export default RegisterPage;
