import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";

import { useDispatch, useSelector } from "react-redux";
import { createPolicy, getAllPolicyDetails } from "../../../features/policy-detail-module/policyActions";
import { toast } from "react-hot-toast";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 2,
    padding: theme.spacing(3),
    background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
    boxShadow: theme.shadows[8],
    transition: "all 0.3s ease-in-out",
    transform: "scale(0.95)",
    "& .MuiDialogTitle-root": {
      padding: theme.spacing(2, 3),
    },
    "& .MuiDialogContent-root": {
      padding: theme.spacing(3),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(2, 3),
    },
    [theme.breakpoints.down("sm")]: {
      margin: theme.spacing(1),
      width: "100%",
      padding: theme.spacing(2),
    },
  },
  "&.MuiDialog-root": {
    backdropFilter: "blur(4px)",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    borderRadius: 1.5,
    background: theme.palette.background.default,
    transition: "all 0.3s ease",
    "&:hover": {
      background: theme.palette.grey[50],
      transform: "translateY(-2px)",
      boxShadow: theme.shadows[1],
    },
  },
  "& .MuiInputLabel-root": {
    color: theme.palette.text.secondary,
    fontWeight: 500,
    "&.Mui-focused": {
      color: theme.palette.primary.main,
    },
  },
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 8px ${theme.palette.primary.light}`,
    },
  },
  "& .MuiFormHelperText-root": {
    marginLeft: theme.spacing(1),
    color: theme.palette.error.main,
    fontWeight: 500,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  borderRadius: 1.5,
  padding: theme.spacing(1, 3),
  fontWeight: 600,
  boxShadow: theme.shadows[4],
  transition: "all 0.3s ease",
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.85rem",
    padding: theme.spacing(0.75, 2),
  },
}));

const CancelButton = styled(StyledButton)(({ theme }) => ({
  background: theme.palette.grey[100],
  color: theme.palette.text.primary,
  "&:hover": {
    background: theme.palette.grey[200],
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[6],
  },
}));

const SubmitButton = styled(StyledButton)(({ theme }) => ({
  background: `linear-gradient(45deg, #bf08fb 30%, #9c06c9 90%)`,
  color: theme.palette.common.white,
  "&:hover": {
    background: `linear-gradient(45deg, #9c06c9 30%, #bf08fb 90%)`,
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[6],
  },
}));

const AddEditPolicyDialog = ({ open, onClose, policy }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Inside your component
  const { loading } = useSelector((state) => state.policy);

  const [formData, setFormData] = useState({
    dob: "",
    gender: "",
    sumAssured: "",
    modalPremium: "",
    premiumFrequency: "",
    pt: "",
    ppt: "",
  });

  const [errors, setErrors] = useState({
    dob: "",
    age: "",
    gender: "",
    sumAssured: "",
    modalPremium: "",
    premiumFrequency: "",
    pt: "",
    ppt: "",
  });

  useEffect(() => {
    if (policy) {
      setFormData({
        dob: policy.dob,
        gender: policy.gender,
        sumAssured: policy.sumAssured.replace("$", "").replace(",", ""),
        modalPremium: policy.modalPremium.replace("$", "").replace(",", ""),
        premiumFrequency: policy.premiumFrequency,
        pt: policy.pt.replace(" years", ""),
        ppt: policy.ppt.replace(" years", ""),
      });
    } else {
      setFormData({
        dob: "",
        gender: "",
        sumAssured: "",
        modalPremium: "",
        premiumFrequency: "",
        pt: "",
        ppt: "",
      });
    }
    setErrors({
      dob: "",
      age: "",
      gender: "",
      sumAssured: "",
      modalPremium: "",
      premiumFrequency: "",
      pt: "",
      ppt: "",
    });
  }, [policy, open]);

  const calculateAge = (dob) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const validateForm = () => {
    const newErrors = {
      dob: "",
      age: "",
      gender: "",
      sumAssured: "",
      modalPremium: "",
      premiumFrequency: "",
      pt: "",
      ppt: "",
    };
    let isValid = true;

    // DOB and Age validation
    if (!formData.dob) {
      newErrors.dob = "Date of Birth is required";
      isValid = false;
    } else {
      const age = calculateAge(formData.dob);
      if (age < 23 || age > 56) {
        newErrors.age = "Age must be between 23 and 56";
        isValid = false;
      }
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
      isValid = false;
    }

    // Modal Premium validation
    if (!formData.modalPremium.trim()) {
      newErrors.modalPremium = "Modal Premium is required";
      isValid = false;
    } else if (!/^\d+$/.test(formData.modalPremium)) {
      newErrors.modalPremium = "Modal Premium must be a valid number";
      isValid = false;
    } else {
      const modalPremium = parseInt(formData.modalPremium);
      if (modalPremium < 10000 || modalPremium > 50000) {
        newErrors.modalPremium =
          "Modal Premium must be between 10,000 and 50,000";
        isValid = false;
      }
    }

    // Sum Assured validation
    if (!formData.sumAssured.trim()) {
      newErrors.sumAssured = "Sum Assured is required";
      isValid = false;
    } else if (!/^\d+$/.test(formData.sumAssured)) {
      newErrors.sumAssured = "Sum Assured must be a valid number";
      isValid = false;
    } else {
      const modalPremium = parseInt(formData.modalPremium) || 0;
      const sumAssured = parseInt(formData.sumAssured);
      const minSumAssured = Math.max(modalPremium * 10, 5000000);
      if (sumAssured < minSumAssured) {
        newErrors.sumAssured = `Sum Assured must be at least ${minSumAssured.toLocaleString()}`;
        isValid = false;
      }
    }

    // Premium Frequency validation
    if (!formData.premiumFrequency) {
      newErrors.premiumFrequency = "Premium Frequency is required";
      isValid = false;
    }

    // PPT validation
    if (!formData.ppt.trim()) {
      newErrors.ppt = "Premium Paying Term is required";
      isValid = false;
    } else if (!/^\d+$/.test(formData.ppt)) {
      newErrors.ppt = "Premium Paying Term must be a valid number";
      isValid = false;
    } else {
      const ppt = parseInt(formData.ppt);
      if (ppt < 5 || ppt > 10) {
        newErrors.ppt = "Premium Paying Term must be between 5 and 10";
        isValid = false;
      }
    }

    // PT validation
    if (!formData.pt.trim()) {
      newErrors.pt = "Policy Term is required";
      isValid = false;
    } else if (!/^\d+$/.test(formData.pt)) {
      newErrors.pt = "Policy Term must be a valid number";
      isValid = false;
    } else {
      const pt = parseInt(formData.pt);
      const ppt = parseInt(formData.ppt) || 0;
      if (pt < 10 || pt > 20) {
        newErrors.pt = "Policy Term must be between 10 and 20";
        isValid = false;
      } else if (pt <= ppt) {
        newErrors.pt = "Policy Term must be greater than Premium Paying Term";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const policyData = {
        dob: formData.dob,
        gender: formData.gender,
        sumAssured: formData.sumAssured,
        modalPremium: formData.modalPremium,
        premiumFrequency: formData.premiumFrequency,
        pt: formData.pt,
        ppt: formData.ppt,
      };

      await dispatch(createPolicy(policyData)).unwrap();
      await dispatch(getAllPolicyDetails({ page: 1, limit: 10 })).unwrap();
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to create policy");
    }
  };

  const genders = ["Male", "Female", "Other"];
  const premiumFrequencies = ["Yearly", "Half-Yearly", "Monthly"];

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionProps={{
        onEntering: (node) => {
          node.style.transform = "scale(1)";
        },
      }}
    >
      <DialogTitle sx={{ position: "relative", pb: 3 }}>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          fontWeight={700}
          color="text.primary"
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.primary.light} 30%, ${theme.palette.primary.main} 90%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {policy ? "Edit Policy" : "Add Policy"}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: theme.spacing(2),
            top: theme.spacing(2),
            color: theme.palette.grey[500],
            background: theme.palette.grey[100],
            "&:hover": {
              color: theme.palette.grey[700],
              background: theme.palette.grey[200],
              transform: "rotate(90deg)",
              boxShadow: theme.shadows[2],
            },
            transition: "all 0.3s ease",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={isMobile ? 2 : 3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <StyledTextField
                fullWidth
                label="Date of Birth"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                error={!!errors.dob || !!errors.age}
                helperText={errors.dob || errors.age}
                size={isMobile ? "small" : "medium"}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  sx: { background: theme.palette.background.paper },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <StyledTextField
                select
                fullWidth
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                error={!!errors.gender}
                helperText={errors.gender}
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  sx: { background: theme.palette.background.paper },
                }}
              >
                {genders.map((gender) => (
                  <MenuItem
                    key={gender}
                    value={gender}
                    sx={{
                      "&:hover": {
                        background: theme.palette.action.hover,
                        transform: "translateX(4px)",
                        transition: "all 0.2s ease",
                      },
                    }}
                  >
                    {gender}
                  </MenuItem>
                ))}
              </StyledTextField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <StyledTextField
                fullWidth
                label="Sum Assured (USD)"
                name="sumAssured"
                value={formData.sumAssured}
                onChange={handleChange}
                error={!!errors.sumAssured}
                helperText={errors.sumAssured}
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  sx: { background: theme.palette.background.paper },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <StyledTextField
                fullWidth
                label="Modal Premium (USD)"
                name="modalPremium"
                value={formData.modalPremium}
                onChange={handleChange}
                error={!!errors.modalPremium}
                helperText={errors.modalPremium}
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  sx: { background: theme.palette.background.paper },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <StyledTextField
                select
                fullWidth
                label="Premium Frequency"
                name="premiumFrequency"
                value={formData.premiumFrequency}
                onChange={handleChange}
                error={!!errors.premiumFrequency}
                helperText={errors.premiumFrequency}
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  sx: { background: theme.palette.background.paper },
                }}
              >
                {premiumFrequencies.map((freq) => (
                  <MenuItem
                    key={freq}
                    value={freq}
                    sx={{
                      "&:hover": {
                        background: theme.palette.action.hover,
                        transform: "translateX(4px)",
                        transition: "all 0.2s ease",
                      },
                    }}
                  >
                    {freq}
                  </MenuItem>
                ))}
              </StyledTextField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <StyledTextField
                fullWidth
                label="Policy Term (Years)"
                name="pt"
                value={formData.pt}
                onChange={handleChange}
                error={!!errors.pt}
                helperText={errors.pt}
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  sx: { background: theme.palette.background.paper },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <StyledTextField
                fullWidth
                label="Premium Paying Term (Years)"
                name="ppt"
                value={formData.ppt}
                onChange={handleChange}
                error={!!errors.ppt}
                helperText={errors.ppt}
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  sx: { background: theme.palette.background.paper },
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ gap: 2, justifyContent: "flex-end" }}>
        <CancelButton
          variant="contained"
          onClick={onClose}
          fullWidth={isMobile}
        >
          Cancel
        </CancelButton>
        <SubmitButton
          variant="contained"
          onClick={handleSubmit}
          fullWidth={isMobile}
          disabled={loading}
        >
          {loading ? "Creating..." : policy ? "Update" : "Add"}
        </SubmitButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default AddEditPolicyDialog;
