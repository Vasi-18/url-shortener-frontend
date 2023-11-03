import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./ContextProvider/Context";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { ToastContainer , toast } from 'react-toastify';


const Url = () => {
  const { logindata, setLoginData } = useContext(LoginContext);

  const [data, setData] = useState(false);

  const history = useNavigate();

  const [link, setlink] = useState("");
  const [shortLink, setShortLink] = useState("");

  function handleSubmit() {
    fetch("/api/shortUrls", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        url: link,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setShortLink(data.data);
        // alert(data.status);
        toast.success("Url Shorten Successfully Done!", {
          position: "top-center"
      });
      });
  }

  const DashboardValid = async () => {
    let token = localStorage.getItem("usersdatatoken");

    const res = await fetch("/api/validuser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await res.json();

    if (data.status === 401 || !data) {
      history("*");
    } else {
      console.log("user verify");
      setLoginData(data);
      history("/url-shortener");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      DashboardValid();
      setData(true);
    }, 2000);
  }, []);

  return (
    <>
      {data ? (
        <section>
          <div className="form_data">
            <div className="form_heading">
              <h1>Url Shortener</h1>
            </div>

            <form>
              <div className="form_input">
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter Your Url"
                  onChange={(e) => setlink(e.target.value)}
                />
              </div>
              

              <button className="btn" onClick={handleSubmit}>
                Shrink
              </button>
              
            </form>
            <h2 className="short_url">Shorten Url: <a href="{link}" target="_blank" rel="noreferrer">{shortLink}</a> </h2>
            <ToastContainer />
          </div>
        </section>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          Loading... &nbsp;
          <CircularProgress />
        </Box>
      )}
    </>
  );
};

export default Url;
