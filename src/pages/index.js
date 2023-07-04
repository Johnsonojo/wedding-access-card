import axios from "axios";
import React, { useState } from "react";
import { QrReader } from "react-qr-reader";

const QRCodeScanner = () => {
  const [qrCodeData, setQrCodeData] = useState("");
  const [codeResponse, setCodeResponse] = useState({});
  const [error, setError] = useState("");

  const verifyQRCode = async (codeData) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/verify`,
        { qrCodeData: codeData }
      );
      setCodeResponse(data?.data);
      return data?.data;
    } catch (error) {
      setError(error.response?.data.message);
    }
  };

  return (
    <>
      <QrReader
        onResult={(result, error) => {
          if (!!result) {
            setQrCodeData(result?.text);
          }

          if (!!error) {
            console.info(error);
          }
        }}
        style={{ width: "12.5rem", height: "12.5rem" }}
      />
      <button onClick={() => verifyQRCode(qrCodeData)}>Verify</button>
      {codeResponse ? (
        <>
          <h1>{codeResponse.guestNumber}</h1>
          {codeResponse?.isScanned && <p>QrCode is valid</p>}
        </>
      ) : null}

      {error ? <h2>{error}</h2> : null}
    </>
  );
};

export default QRCodeScanner;
