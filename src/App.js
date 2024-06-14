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

import BuyEntry from "./components/BuyEntry";
import SellEntry from "./components/SellEntry";
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

      // Treasury/Transaction/MF module
      {
        path: "BuyEntry",
        element: <BuyEntry />,
      },
      {
        path: "SellEntry",
        element: <SellEntry />,
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

      // Treasury/Transcation/BG module
      {
        path: "Treasury/Transcations/CreateBG",
        element: <CreateBG />,
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
