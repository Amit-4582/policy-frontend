import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-hot-toast";

import AddEditPolicyDialog from "./AddEditPolicyDialog";
import IllustrationTable from "../illustration-management/IllustrationTable";
import { getAllPolicyDetails } from "../../../features/policy-detail-module/policyActions";

const StyledBox = styled(Box)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(1),
  background: theme.palette.background.paper,
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  borderRadius: 1.5,
  padding: theme.spacing(1, 3),
  background: `linear-gradient(45deg, #bf08fb 30%, #9c06c9 90%)`,
  color: theme.palette.common.white,
  fontWeight: 600,
  boxShadow: theme.shadows[4],
  "&:hover": {
    background: `linear-gradient(45deg, #9c06c9 30%, #bf08fb 90%)`,
    boxShadow: theme.shadows[6],
    transform: "translateY(-2px)",
  },
  transition: "all 0.3s ease",
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.85rem",
    padding: theme.spacing(0.75, 2),
  },
}));

const ScrollableContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  overflowX: "auto",
  overflowY: "hidden",
  "-webkit-overflow-scrolling": "touch",
  scrollbarWidth: "thin",
  scrollbarColor: `${theme.palette.grey[400]} ${theme.palette.grey[100]}`,
  "&::-webkit-scrollbar": {
    height: "10px",
    display: "block",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.grey[500],
    borderRadius: "5px",
    border: `2px solid ${theme.palette.grey[100]}`,
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: theme.palette.grey[100],
    borderRadius: "5px",
  },
  [theme.breakpoints.down("sm")]: {
    "-ms-overflow-style": "scrollbar",
    "&::-webkit-scrollbar": {
      height: "12px",
    },
  },
  [theme.breakpoints.up("md")]: {
    overflowX: "auto",
  },
}));

const PolicyManagementTable = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const { policies: apiPolicies, loading, pagination } = useSelector(
    (state) => state.policy
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [page, setPage] = useState(pagination?.currentPage || 1);
  const [pageSize, setPageSize] = useState(pagination?.itemsPerPage || 5);
  const [selectedPolicyId, setSelectedPolicyId] = useState(null); // State to track selected policy

  // Fetch policies when component mounts or page changes
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        await dispatch(getAllPolicyDetails({ page, limit: pageSize })).unwrap();
      } catch (error) {
        toast.error(error.message || "Failed to fetch policies");
      }
    };
    fetchPolicies();
  }, [dispatch, page, pageSize]);

  // Format the policies for display in DataGrid
  const formatPolicies = (policies) => {
    return policies.map((policy) => ({
      id: policy.id,
      dob: policy.dob,
      gender: policy.gender,
      sumAssured: `$${parseFloat(policy.sumAssured).toLocaleString()}`,
      modalPremium: `$${parseFloat(policy.modalPremium).toLocaleString()}`,
      premiumFrequency: policy.premiumFrequency,
      pt: `${policy.pt} years`,
      ppt: `${policy.ppt} years`,
    }));
  };

  const columns = [
    {
      field: "dob",
      headerName: "DOB",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="body2" color="text.primary" mt={2}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "gender",
      headerName: "Gender",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body2" color="text.primary" mt={2}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "sumAssured",
      headerName: "Sum Assured",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography variant="body2" color="text.primary" mt={2}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "modalPremium",
      headerName: "Modal Premium",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography variant="body2" color="text.primary" mt={2}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "premiumFrequency",
      headerName: "Premium Frequency",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography variant="body2" color="text.primary" mt={2}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "pt",
      headerName: "PT",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body2" color="text.primary" mt={2}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "ppt",
      headerName: "PPT",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body2" color="text.primary" mt={2}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <StyledButton
          variant="contained"
          size="small"
          onClick={() => setSelectedPolicyId(params.id)}
        >
          Illustrate
        </StyledButton>
      ),
    },
  ];

  const handleAddPolicy = () => {
    setOpenDialog(true);
  };

  const handlePageChange = (params) => {
    setPage(params.page + 1);
    setPageSize(params.pageSize);
  };

  return (
    <StyledBox>
      <Stack
        direction={isMobile ? "column" : "row"}
        justifyContent="space-between"
        alignItems={isMobile ? "flex-start" : "center"}
        sx={{ mb: 4, gap: isMobile ? 2 : 0 }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          fontWeight={700}
          color="text.primary"
        >
          Policy Management
        </Typography>
        <StyledButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddPolicy}
          fullWidth={isMobile}
        >
          Add Policy
        </StyledButton>
      </Stack>
      <ScrollableContainer>
        <DataGrid
          autoHeight
          rows={formatPolicies(apiPolicies)}
          columns={columns}
          pageSizeOptions={[5, 10, 20]}
          pagination
          paginationMode="server"
          rowCount={pagination?.totalItems || 0}
          loading={loading}
          initialState={{
            pagination: {
              paginationModel: { page: page - 1, pageSize },
            },
          }}
          onPaginationModelChange={handlePageChange}
          disableRowSelectionOnClick
          sx={{
            border: "none",
            background: theme.palette.background.paper,
            "& .MuiDataGrid-columnHeaders": {
              background: `linear-gradient(180deg, ${theme.palette.grey[100]} 0%, ${theme.palette.grey[200]} 100%)`,
              borderBottom: `2px solid ${theme.palette.divider}`,
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 700,
                color: theme.palette.text.primary,
                fontSize: isMobile ? "0.9rem" : "1rem",
              },
              position: "sticky",
              top: 0,
              zIndex: 1,
            },
            "& .MuiDataGrid-cell": {
              padding: theme.spacing(),
              borderBottom: `1px solid ${theme.palette.grey[100]}`,
              color: theme.palette.text.primary,
              whiteSpace: "nowrap",
            },
            "& .MuiDataGrid-row": {
              transition: "all 0.3s ease",
              "&:hover": {
                background: theme.palette.action.hover,
                transform: "translateY(-1px)",
                boxShadow: theme.shadows[3],
              },
            },
            "& .MuiDataGrid-footerContainer": {
              background: `linear-gradient(180deg, ${theme.palette.grey[100]} 0%, ${theme.palette.grey[200]} 100%)`,
              borderTop: `2px solid ${theme.palette.divider}`,
              "& .MuiDataGrid-pagination": {
                color: theme.palette.text.secondary,
                fontSize: isMobile ? "0.85rem" : "0.9rem",
              },
            },
            "& .MuiDataGrid-toolbarContainer": {
              padding: theme.spacing(3),
            },
            [theme.breakpoints.down("sm")]: {
              "& .MuiDataGrid-cell": {
                fontSize: "0.85rem",
              },
            },
          }}
        />
      </ScrollableContainer>
      <AddEditPolicyDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />
      {selectedPolicyId && <IllustrationTable policyId={selectedPolicyId} />}{" "}
    </StyledBox>
  );
};

export default PolicyManagementTable;
