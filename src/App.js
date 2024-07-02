// import logo from "./logo.svg";
import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primeicons/primeicons.css';
import "./App.css";
import "./index.css";
import "./styles/css/dataTable.css";
import LoginForm from "./components/LoginForm";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Home from "./components/Home";
import Error from "./components/Error";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isUserAuthenticated } from "./config/service";
import "react-datepicker/dist/react-datepicker.css";

import "./styles/css/vendors.bundle.css";
import "./styles/css/app.bundle.css";
import "./styles/css/themes/cust-theme-14.css";
import "./styles/css/skins/skin-master.css";

import "./styles/css/toggleswitch.css";
import "./styles/css/google/translate.css";
import "./styles/css/dragDrop.css";
import { ModalProvider } from "./config/modalContext";

import CreateFD from "./components/Treasury/Transaction/FDModule/CreateFD";
import UploadPanDetails from "./components/RPT/UploadPanDetails";
import RelationMaster from "./components/RPT/RelationMaster";
import AnalysisCodeMaster from "./components/RPT/AnalysisCodeMaster";
import PanDetailsMaster from "./components/RPT/PanDetailsMaster";
import RPTCompanyMaster from "./components/RPT/RPTCompanyMaster";
import { urlPath } from "./config/url";
import UploadRPTCompanyDetails from "./components/RPT/UploadRPTCompanyDetails";
import FdMaster from "./components/Treasury/Master/FDModule/FdMaster";
import PledgeWithMaster from "./components/Treasury/Master/MFModule/PledgeWithMaster";
import ISINMaster from "./components/Treasury/Master/MFModule/ISINMaster";
import MfCompanyMaster from "./components/Treasury/Master/MFModule/MfCompanyMaster";
import FDBankBranchMaster from "./components/Treasury/Master/FDModule/FDBankBranchMaster";
import FDCompanyMaster from "./components/Treasury/Master/FDModule/FDCompanyMaster";
import FDRenewLiquidation from "./components/Treasury/Transaction/FDModule/FDRenewLiquidation";
import EmployeeDetails from "./components/Admin/EmployeeDetails";

import { PrimeReactProvider } from 'primereact/api';
import MenuAccess from "./components/Admin/MenuAccess";
import CreateBG from './components/Treasury/Transaction/BGModule/CreateBG';
import { MenuProvider } from './config/menuContext';
import { CompanyProvider } from './config/contextAPI/companyContext';
import { UploadProvider } from "./config/contextAPI/uploadModalContext";
import FDReport from './components/Treasury/Reports/FD Module/FDReport';
import BGRenewLiquidation from './components/Treasury/Transaction/BGModule/BGRenewLiquidation';
import FDBulkUpload from './components/Treasury/Transaction/FDModule/FDBulkUpload';
import UpdateNavFromDate from './components/Treasury/Transaction/MFModule/UpdateNavFromDate';
import UpdateSchemeName from './components/Treasury/Transaction/MFModule/UpdateSchemeName';
import UpdateAifNav from './components/Treasury/Transaction/MFModule/UpdateAifNav';
import SellEntry from './components/Treasury/Transaction/MFModule/SellEntry';
import BuyEntry from './components/Treasury/Transaction/MFModule/BuyEntry';
import FDDailyInterestReport from './components/Treasury/Reports/FD Module/FDDailyInterestReport';
import FDOnScreenReport from './components/Treasury/Reports/FD Module/FDOnScreenReport';
import TDSEntriesReport from './components/Treasury/Reports/FD Module/TDSEntriesReport';
import FDInterestReport from './components/Treasury/Reports/FD Module/FDInterestReport';
import MFSummaryReport from './components/Treasury/Reports/MF Module/MFSummaryReport';
import MFPledgeDetailsReport from './components/Treasury/Reports/MF Module/MFPledgeDetailsReport';
import MFTransactionReport from './components/Treasury/Reports/MF Module/MFTransactionReport';
import MFTransactionSummeryReport from './components/Treasury/Reports/MF Module/MFTransactionSummeryReport';
import BGReport from './components/Treasury/Reports/BG Module/BGReport';
import BGCommissionReport from './components/Treasury/Reports/BG Module/BGCommissionReport';
import BuySellBulkUpload from './components/Treasury/Transaction/MFModule/BuySellBulkUpload';
import BGBulkUpload from './components/Treasury/Transaction/BGModule/BGBulkUpload';


// import { Provider } from "react-redux";
// import persistStore from "redux-persist/es/persistStore";
// import store from "./redux/store";
// import { PersistGate } from "redux-persist/integration/react";

// import Tailwind from "primereact/passthrough/tailwind";


const appLayout = createBrowserRouter([
  {
    path: `${urlPath}Home`,
    element: (
      <PrivateRoute>
        <Home />
      </PrivateRoute>
    ),
    children: [

      // Admin
      {
        path: "Admin/EmployeeDetails",
        element: <EmployeeDetails />,
      },

      {
        path: "Admin/MenuAccess",
        element: <MenuAccess />,
      },

      // treasury/Master/FDModule
      {
        path: "FdMaster",
        element: <FdMaster />,
      },
      {
        path: "FDBankBranchMaster",
        element: <FDBankBranchMaster />,
      },
      {
        path: "FDCompanyMaster",
        element: <FDCompanyMaster />,
      },

      // treasury/Master/MFModule
      {
        path: "PledgeWithMaster",
        element: <PledgeWithMaster />,
      },
      {
        path: "ISINMaster",
        element: <ISINMaster />,
      },
      {
        path: "MfCompanyMaster",
        element: <MfCompanyMaster />,
      },

      // Treasury/Transcation/FD module
      {
        path: "Treasury/Transcations/CreateFD",
        element: <CreateFD />,
      },
      {
        path: "Treasury/Transcations/FDRenewLiquidation",
        element: <FDRenewLiquidation />,
      },
      {
        path: "Treasury/Transcations/FDBulkUpload",
        element: <FDBulkUpload />,
      },

      // Treasury/Transcation/BG module
      {
        path: "Treasury/Transcations/CreateBG",
        element: <CreateBG />,
      },
      {
        path: "Treasury/Transcations/BGRenewLiquidation",
        element: <BGRenewLiquidation />,
      },
      {
        path: "Treasury/Transcations/BGBulkUpload",
        element: <BGBulkUpload />,
      },

      // Treasury/Transcation/MF module
      {
        path: "Treasury/Transcations/UpdateFromDate",
        element: <UpdateNavFromDate />,
      },
      {
        path: "Treasury/Transcations/UpdateScheme",
        element: <UpdateSchemeName />,
      },
      {
        path: "Treasury/Transcations/UpdateAIFNav",
        element: <UpdateAifNav />,
      },
      {
        path: "Treasury/Transcations/BuyEntry",
        element: <BuyEntry />,
      },
      {
        path: "Treasury/Transcations/SellEntry",
        element: <SellEntry />,
      },
      {
        path: "Treasury/Transcations/MFBuySellBulkUpload",
        element: <BuySellBulkUpload />,
      },

      // Treasury/Transcation/Report FD
      {
        path: "Treasury/Reports/FDReport",
        element: <FDReport />,
      },
      {
        path: "Treasury/Reports/FDDailyInterestReport",
        element: <FDDailyInterestReport />,
      },
      {
        path: "Treasury/Reports/FDInterestReport",
        element: <FDInterestReport />,
      },
      {
        path: "Treasury/Reports/FDOnScreenReport",
        element: <FDOnScreenReport />,
      },
      {
        path: "Treasury/Reports/TDSEntriesReport",
        element: <TDSEntriesReport />,
      },

      // Treasury/Transcation/Report BG
      {
        path: "Treasury/Reports/BGReport",
        element: <BGReport />,
      },
      {
        path: "Treasury/Reports/BGCommissionReport",
        element: <BGCommissionReport />,
      },

      // Treasury/Transcation/Report MF
      {
        path: "Treasury/Reports/MFSummeryReport",
        element: <MFSummaryReport />,
      },
      {
        path: "Treasury/Reports/MFPledgeDetailsReport",
        element: <MFPledgeDetailsReport />,
      },
      {
        path: "Treasury/Reports/MFTransactionReport",
        element: <MFTransactionReport />,
      },
      {
        path: "Treasury/Reports/MFTransactionSummeryReport",
        element: <MFTransactionSummeryReport />,
      },
      // RPT
      {
        path: "RPTCompanyMaster",
        element: <RPTCompanyMaster />,
      },
      {
        path: "RPTPanMaster",
        element: <PanDetailsMaster />,
      },
      {
        path: "RPTAnalysisCodeMaster",
        element: <AnalysisCodeMaster />,
      },
      {
        path: "RPTRelationMaster",
        element: <RelationMaster />,
      },
      {
        path: "RPTUploadPanDetails",
        element: <UploadPanDetails />,
      },
      {
        path: "RPTUploadCompanyDetails",
        element: <UploadRPTCompanyDetails />,
      },
    ],
  },
  {
    path: `${urlPath}`,
    element: <LoginForm />,
  },
  {
    path: "*",
    element: <Error />,
  },
]);
function PrivateRoute({ children }) {
  const isUserAuthenticatedUser = isUserAuthenticated();
  return isUserAuthenticatedUser ? children : <Navigate to={urlPath} />;
}
function App() {
  // let persistor = persistStore(store);
  return (
    <>
      {/* <Provider store={store}>
        <PersistGate persistor={persistor}> */}
      {/* <Suspense fallback={<Loader />}> */}
      <CompanyProvider>
        <MenuProvider>
          <UploadProvider>
            <ModalProvider>
              <ToastContainer />
              <PrimeReactProvider>
                <RouterProvider router={appLayout} />
              </PrimeReactProvider>
            </ModalProvider>
          </UploadProvider>
        </MenuProvider>
      </CompanyProvider>
      {/* </Suspense> */}
      {/* </PersistGate>
      </Provider> */}
    </>
  );
}

function Loader() {
  return (
    <div className="loader-container">
      <div className="loader">
        <h1>...Loading</h1>
      </div>
    </div>
  );
}
export default App;
