import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const StyledBox = styled(Box)(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(5),
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

const IllustrationTable = ({ policyId }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { policies } = useSelector((state) => state.policy);
  const [illustrationData, setIllustrationData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (policyId) {
      const policy = policies.find((p) => p.id === policyId);
      if (policy) {
        const data = calculateIllustration(policy);
        setIllustrationData(data);
      }
    }
  }, [policyId, policies]);

  const calculateIllustration = (policy) => {
    const { modalPremium, sumAssured, pt, ppt } = policy;
    const data = [];
    let totalBenefit = 0;

    for (let year = 1; year <= pt; year++) {
      const bonusRate = year <= ppt ? 0.025 : year <= 10 ? 0.03 : 0.05;
      const bonusAmount = parseInt(sumAssured) * bonusRate;
      totalBenefit += bonusAmount;
      const netCashflow =
        year <= ppt
          ? -parseInt(modalPremium)
          : totalBenefit > 0
          ? totalBenefit
          : 0;

      data.push({
        id: year,
        policyYear: year,
        premium:
          year <= ppt ? `$${parseInt(modalPremium).toLocaleString()}` : "0",
        sumAssured: `$${parseInt(sumAssured).toLocaleString()}`,
        bonusRate: `${(bonusRate * 100).toFixed(1)}%`,
        bonusAmount: `$${bonusAmount.toLocaleString()}`,
        totalBenefit: `$${totalBenefit.toLocaleString()}`,
        netCashflow: `$${netCashflow.toLocaleString()}`,
      });
    }
    return data;
  };

  const columns = [
    {
      field: "policyYear",
      headerName: "Policy Year",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body2" color="text.primary">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "premium",
      headerName: "Premium",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography variant="body2" color="text.primary">
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
        <Typography variant="body2" color="text.primary">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "bonusRate",
      headerName: "Bonus Rate",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="body2" color="text.primary">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "bonusAmount",
      headerName: "Bonus Amount",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography variant="body2" color="text.primary">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "totalBenefit",
      headerName: "Total Benefit",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography variant="body2" color="text.primary">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "netCashflow",
      headerName: "Net Cashflow",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography variant="body2" color="text.primary">
          {params.value}
        </Typography>
      ),
    },
  ];

  const handleExportClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = columns.map((col) => col.headerName);
    const tableRows = illustrationData.map((row) =>
      columns.map((col) => row[col.field])
    );

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [191, 8, 251], textColor: [255, 255, 255] },
    });
    doc.save("illustration.pdf");
    handleClose();
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      illustrationData.map((row) =>
        columns.reduce((obj, col) => {
          obj[col.headerName] = row[col.field];
          return obj;
        }, {})
      )
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Illustration");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    saveAs(
      new Blob([excelBuffer], { type: "application/octet-stream" }),
      "illustration.xlsx"
    );
    handleClose();
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
          Illustration
        </Typography>
        <div>
          <StyledButton
            variant="contained"
            disabled={!policyId}
            onClick={handleExportClick}
          >
            Export
          </StyledButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={exportToPDF}>Export to PDF</MenuItem>
            <MenuItem onClick={exportToExcel}>Export to Excel</MenuItem>
          </Menu>
        </div>
      </Stack>
      <ScrollableContainer>
        <DataGrid
          autoHeight
          rows={illustrationData}
          columns={columns}
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
              padding: theme.spacing(2),
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
            [theme.breakpoints.down("sm")]: {
              "& .MuiDataGrid-cell": {
                fontSize: "0.85rem",
              },
            },
          }}
        />
      </ScrollableContainer>
    </StyledBox>
  );
};

export default IllustrationTable;
