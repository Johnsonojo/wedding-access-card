import axios from "axios";
import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import { ScanOverlay } from "../../components/ScanOverlay";
import "./style.css";

const QRCodeScanner = () => {
  const [qrCodeData, setQrCodeData] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [qrCodeError, setQrCodeError] = useState("");
  const [codeResponse, setCodeResponse] = useState(null);
  const [error, setError] = useState("");

  const verifyQRCode = async (codeData) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/guest/verify`,
        { qrCodeData: codeData }
      );
      setCodeResponse(data?.data);
      return data?.data;
    } catch (error) {
      setError(error.response?.data.message);
    }
  };

  const handleScanResult = (result, error) => {
    if (!!result) {
      console.log("result?.text", result?.text);
      setQrCodeData(result?.text);
    }

    if (!!error) {
      setQrCodeError(error);
    }
  };

  return (
    <div className="qrcode_scanner">
      <h1 className="qrcode_scanner_title">Access Code Scanner</h1>
      <QrReader
        onResult={handleScanResult}
        className="qrcode_scanner_reader"
        constraints={{
          facingMode: "environment",
        }}
        ViewFinder={ScanOverlay}
        scanDelay={500}
      />
      <button
        className="qrcode_scanner_button"
        onClick={() => verifyQRCode(qrCodeData)}
      >
        Verify Code
      </button>
      {codeResponse ? (
        <div className="qrcode_scanner_result">
          <h1>{codeResponse.guestNumber}</h1>
          {codeResponse.isScanned && (
            <p className="qrcode_scanner_success">QR Code is valid</p>
          )}
        </div>
      ) : null}

      {error ? <h2 className="qrcode_scanner_error">{error}</h2> : null}
    </div>
  );
};

export default QRCodeScanner;
