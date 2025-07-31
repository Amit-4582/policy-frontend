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
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { signUpUser } from "../../features/authentication-module/authActions";

// Styled container for the signup page
const SignUpContainer = styled(Container)(({ theme }) => ({
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

const LoginPage = () => {
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
      const result = await dispatch(signUpUser(data)).unwrap();
      if (result.success) {
        toast.success("Sign up successful!");
        reset();
        navigate("/policy-management");
      }
    } catch (error) {
      console.log("Error ", error);
      toast.error("Sign up failed. Please try again.");
    }
  };

  return (
    <SignUpContainer>
      <FormWrapper>
        <Typography
          variant="h4"
          align="center"
          sx={{ fontWeight: "bold", color: "#1e293b", mb: 4 }}
        >
          Create Account
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
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
              Sign Up
            </Button>
          </ButtonContainer>
        </Box>
      </FormWrapper>
    </SignUpContainer>
  );
};

export default LoginPage;
