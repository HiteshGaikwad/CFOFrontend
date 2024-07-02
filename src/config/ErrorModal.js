import { Backdrop } from "@mui/material";

const ErrorModal = (errorText) => {
    console.log('errrormodal', errorText);
    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <div>
                    {/* <p>{errorText.toString()}</p> */}
                    <p>Errror Firlensfvnkjsfnvw</p>

                </div>
            </Backdrop>
        </>
    )
}

export default ErrorModal;