import React, { useState, useEffect } from "react";
import Header from "../components/header";
import "../style/Confirmation.css";
import {
  Typography,
  FormControl,
  Button,
  Card,
  CardContent,
  Snackbar,
  IconButton,
  Input,
  InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
//import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";

const Confirmation = ({ baseUrl }) => {
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [originalTotalPrice, setOriginalTotalPrice] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log(location.state.bookingSummary);
    const unitPrice = parseInt(location.state.bookingSummary.unitPrice, 10);
    const ticketsCount = location.state.bookingSummary.tickets;
    const calculatedTotalPrice = unitPrice * ticketsCount;
    const showId = location.state.bookingSummary.showId;
    const selectedSeats=location.state.bookingSummary.selectedSeats;
    setTotalPrice(calculatedTotalPrice);
    setOriginalTotalPrice(calculatedTotalPrice);
  }, [location.state.bookingSummary]);

 
  const confirmBookingHandler = async () => {
    const uuid = sessionStorage.getItem("uuid");

    if (!uuid || uuid.trim() === "") {
      setSnackbarMessage("Please log in to confirm your booking.");
      setOpen(true);
      return;
    }
    console.log("tst"+location.state.bookingSummary.showId);
    console.log("Booking Summary:", location.state.bookingSummary);
    console.log("show_id:", location.state.bookingSummary.showId);
    console.log("tickets:", [location.state.bookingSummary.tickets]);
    console.log("coupon_code:", couponCode);
    console.log("seats",location.state.bookingSummary.selectedSeats);
    const seats=location.state.bookingSummary.selectedSeats;

    console.log('book_pay', {
      uuid,
        show_id: JSON.stringify(location.state.bookingSummary.showId),
   //  tickets: JSON.stringify(location.state.bookingSummary.selectedSeats),
     tickets: location.state.bookingSummary.selectedSeats,
      //tickets: location.state.bookingSummary.selectedSeats.map(seat => Number(seat)),
       coupon_code: couponCode,
     
  });
  console.log("Tickets array being sent:", JSON.stringify(location.state.bookingSummary.selectedSeats));
    try {
      const response = await axios.post(
        `${baseUrl}auth/bookings`,
        {
          uuid,
          bookingRequest: {
          show_id: location.state.bookingSummary.showId,
          tickets:seats,
            coupon_code: Number(couponCode),
          }    
          },
        
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access-token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("tst"+response);
      setBookingId(response.data.reference_number);
      setSnackbarMessage("Booking Confirmed!");
      setOpen(true);
    } catch (error) {
      console.error("Error confirming booking:", error);
      if (error.response) {
        // Server returned a response with status code 400 or other error
        console.log("Error response:", error.response.data);
        console.log("Error status:", error.response.status);
        console.log("Error headers:", error.response.headers);
      } else if (error.request) {
        // No response was received
        console.log("Error request:", error.request);
      } else {
        // Something else happened
        console.log("Error message:", error.message);
      }
    }
  };

  const snackBarCloseHandler = () => {
    setOpen(false);
  };

  const couponApplyHandler = async () => {
    try {
      //const response = await axios.get(`${baseUrl}auth/coupons`, {
        const response = await axios.get(`${baseUrl}auth/coupons/${couponCode}`, {
        
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access-token")}`,
          "Content-Type": "application/json",
        },
      });
      console.log("res_apply",response.data);
      const discountValue = response.data.discountValue || 0;
      setTotalPrice(
        discountValue > 0
          ? Math.max(originalTotalPrice - discountValue, 0)
          : originalTotalPrice
      );
    } catch (error) {
      console.error("Error applying coupon:", error);
    }
  };

  return (
    <div className="Details">
      <Header baseUrl={baseUrl} />

      <div className="confirmation marginTop16">
        <Link to={`/bookshow/${location.state.bookingSummary.id}`}>
          <Typography className="back">&#60; Back to Book Show</Typography>
        </Link>
        <br />

        <Card className="cardStyle">
          <CardContent>
            <Typography variant="h5" component="h2">
              SUMMARY
            </Typography>
            <br />

            <div className="coupon-container">
              <Typography>Location:</Typography>
              <Typography>{location.state.bookingSummary.location}</Typography>
            </div>

            <div className="coupon-container">
              <Typography>Theatre:</Typography>
              <Typography>{location.state.bookingSummary.theatre}</Typography>
            </div>

            <div className="coupon-container">
              <Typography>Language:</Typography>
              <Typography>{location.state.bookingSummary.language}</Typography>
            </div>

            <div className="coupon-container">
              <Typography>Show Date:</Typography>
              <Typography>{location.state.bookingSummary.showDate}</Typography>
            </div>

            <div className="coupon-container">
              <Typography>Tickets:</Typography>
              <Typography>
              
               {location.state.bookingSummary.tickets}
              </Typography>
            </div>

            <div className="coupon-container">
              <Typography>Unit Price:</Typography>
              <Typography>{location.state.bookingSummary.unitPrice}</Typography>
            </div>

            <FormControl className="formControl">
              <InputLabel htmlFor="coupon">Coupon Code</InputLabel>
              <Input
                id="coupon"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
            </FormControl>
            <Button
              variant="contained"
              onClick={couponApplyHandler}
              color="primary"
            >
              Apply
            </Button>

            <div className="coupon-container">
              <Typography className="bold">Total Price:</Typography>
              <Typography>{parseInt(totalPrice, 10)}</Typography>
            </div>

            <Button
              variant="contained"
              onClick={confirmBookingHandler}
              color="primary"
            >
              Confirm Booking
            </Button>
          </CardContent>
        </Card>
      </div>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        onClose={snackBarCloseHandler}
        message={snackbarMessage}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            onClick={snackBarCloseHandler}
          >
            <CloseIcon />
          </IconButton>
        }
      />
    </div>
  );
};

Confirmation.propTypes = {
  baseUrl: PropTypes.string.isRequired,
};

export default Confirmation;
