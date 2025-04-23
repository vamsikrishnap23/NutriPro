"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

// MUI imports
import {
  Box,
  Divider,
  TextareaAutosize,
  TextField,
  Container,
  AppBar,
} from "@mui/material";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import Grid from "@mui/joy/Grid";
import { Sheet } from "@mui/joy";

// Icons
import ArrowForward from "@mui/icons-material/ArrowForward";
import Star from "@mui/icons-material/Star";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import PlaceIcon from "@mui/icons-material/Place";
import CallIcon from "@mui/icons-material/Call";

//imgs
import bowl from "@/img/bowl.png";
import logo from "@/img/logo2.png";

//login page

// TypeScript interfaces
interface NavLinkProps {
  title: string;
  sectionId: string;
}

interface SideHelpProps {
  icon: React.ReactNode;
  main: string;
  sec: string;
  ter: string;
}

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const NavLink: React.FC<NavLinkProps> = ({ title, sectionId }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <a
      href={`#${sectionId}`}
      onClick={handleClick}
      style={{ textDecoration: "none" }}
    >
      <Typography
        sx={{
          color: "black",
          fontWeight: "light",
          fontSize: "1rem",
          transition: "all ease-in-out",
          "&:hover": {
            color: "#366e47",
          },
          "&:active": {
            color: "#366e47",
          },
          "&:focus": {
            color: "#366e47",
          },
        }}
      >
        {title}
      </Typography>
    </a>
  );
};

const NavBar: React.FC = () => {
  return (
    <Box
      sx={{
        maxHeight: "4rem",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AppBar
        sx={{
          marginTop: "1rem",
          padding: "1rem",
          background: "rgba(0,0,0,0.03)",
          backdropFilter: "blur(10px)",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: "2rem",
          boxShadow: "none",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0.2rem",
            width: "auto",
          }}
        >
          <Image src={logo} alt="NutriPro Logo" width={50} height={50} />
          <Typography
            sx={{
              color: "#366e47",
              fontWeight: "bolder",
              fontSize: "1.4rem",
            }}
          >
            NutriPro
          </Typography>
        </Box>

        <Box
          sx={{
            display: { md: "flex", xs: "none" },
            flexDirection: "row",
            justifyContent: "center",
            gap: "2rem",
            flexGrow: 1,
          }}
        >
          <NavLink title={"Home"} sectionId={"home"} />
          <NavLink title={"Services"} sectionId={"services"} />
          <NavLink title={"Contact Us"} sectionId={"contact"} />
        </Box>
        <Box sx={{ width: "auto", paddingRight: "1rem" }}>
          <Link href="/login">
            <Button
              variant="outlined"
              sx={{
                color: "white",
                textTransform: "none",
                borderRadius: "1rem",
                background: "black",
                border: "1px solid black",
                "&:hover": {
                  background: "white",
                  color: "black",
                  border: "1px solid black",
                },
              }}
            >
              Sign In
            </Button>
          </Link>
        </Box>
      </AppBar>
    </Box>
  );
};

const SideHelp: React.FC<SideHelpProps> = ({ icon, main, sec, ter }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "1rem",
        alignItems: "flex-start",
      }}
    >
      <Box sx={{ marginTop: "0.4rem" }}>{icon}</Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
        <Typography
          variant="h2"
          sx={{ color: "black", fontWeight: "bolder", fontSize: "1.3rem" }}
        >
          {main}
        </Typography>
        <Typography variant="body1" sx={{ color: "black" }}>
          {sec}
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "black", fontSize: "0.8rem", fontWeight: "bolder" }}
        >
          {ter}
        </Typography>
      </Box>
    </Box>
  );
};

const LeftContainer: React.FC = () => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          flexDirection: { xs: "row", md: "column" },
          gap: "2rem",
          margin: "1rem",
          flexGrow: 1,
        }}
      >
        <SideHelp
          icon={<QuestionAnswerIcon />}
          main={"Chat with us"}
          sec={"Our unfriendly team isn't here to help."}
          ter={"fanglessvamp69@gmail.com"}
        />

        <SideHelp
          icon={<PlaceIcon />}
          main={"Visit us"}
          sec={"Come say hello at our office HQ."}
          ter={
            "Room Number 309, D1 Block,Vellore Institute of Engineering Chennai, Tamil Nadu"
          }
        />

        <SideHelp
          icon={<CallIcon />}
          main={"Call us"}
          sec={"Mon-Fri from 8am to 5pm."}
          ter={"+91 9999988888"}
        />
      </Box>
      <Divider sx={{ display: { xs: "block", md: "none" } }} />
    </>
  );
};

const SideInputs: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        textAlign: "center",
        flexGrow: 1,
        maxWidth: "auto",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "2rem",
          color: "black",
        }}
      >
        Got any queries?
      </Typography>
      <Typography variant="body1" sx={{ color: "black" }}>
        We'd love to hear from you! Feel free to reach out with any questions or
        feedback.
      </Typography>
      <TextField type="text" label="First Name" />
      <TextField type="text" label="Last Name" />
      <TextField type="email" label="Enter your email" />
      <TextField type="tel" label="Phone Number" />
      <TextareaAutosize
        placeholder="Leave us a message..."
        minRows={4}
        style={{
          width: "100%",
          maxWidth: "600px",
          padding: "12px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          outline: "none",
          background: "transparent",
          transition: "border-color 0.3s ease-in-out",
          fontFamily: "Helvetica",
          color: "black",
        }}
      />

      <Button
        variant="outlined"
        sx={{
          color: "white",
          textTransform: "none",
          borderRadius: "100px",
          background: "black",
          transition: "all",
          transitionDuration: "0.5s",
          "&:hover": {
            background: "white",
            color: "black",
            border: "1px solid black",
            fontWeight: "bold",
          },
        }}
      >
        Send Message
      </Button>
    </Box>
  );
};

const Feature: React.FC<FeatureProps> = ({ icon, title, desc }) => {
  return (
    <Grid xs={12} sm={6} md={4}>
      <Box
        sx={{
          border: "1px solid #ededed",
          boxShadow: "0px 4px 8px rgba(0,0,0,0.3)",
          p: 2,
          borderRadius: "1rem",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box
          sx={{
            height: "60px",
            width: "60px",
            borderRadius: "3rem",
            background: "#ededed",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {icon}
        </Box>

        <Box>
          <Typography
            sx={{
              color: "#408001",
              fontSize: "1rem",
              fontWeight: "bolder",
              mt: 2,
            }}
          >
            {title}
          </Typography>

          <Typography sx={{ color: "black", mt: 1 }}>{desc}</Typography>
        </Box>
      </Box>
    </Grid>
  );
};

const WelcomePage: React.FC = () => {
  const [animated, setAnimated] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);

  useEffect(() => {
    setTimeout(() => {
      setAnimated(true);
    }, 500);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setRotation(scrollPosition / 8);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const router = useRouter();

  return (
    <Sheet id="home" sx={{ maxWidth: "1500px", overflowX: "hidden" }}>
      <NavBar />
      <Sheet
        id="home1"
        sx={{
          margin: "3rem 1rem",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: { xs: "flex-start", md: "center" },
          minHeight: { xs: "60vh", md: "100vh" },
          maxWidth: "100%",
          marginTop: { xs: "8rem", md: "3rem" },
        }}
      >
        <Box
          sx={{
            flexGrow: 2,
            maxWidth: { xs: "25rem", md: "100%" },
          }}
        >
          <Typography sx={{ fontSize: "lg", fontWeight: "lg" }}>
            Unlock Your Health Potential with NutriPro.
          </Typography>

          <Typography
            level="h2"
            sx={{
              fontWeight: "xl",
              fontSize: "clamp(1.875rem, 1.3636rem + 2.1818vw, 3rem)",
              maxWidth: "40rem",
            }}
          >
            Personalized{" "}
            <span className={`underline-text ${animated ? "animate" : ""}`}>
              Nutrition
            </span>{" "}
            Plans That Deliver Results.
          </Typography>

          <Typography
            textColor="text.secondary"
            sx={{ fontSize: "lg", lineHeight: "lg" }}
          >
            Browse profiles, compare qualifications, book appointments easily,
            and receive expert guidance – all from the comfort of your own home.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              my: 2,
              flexWrap: "wrap",
              "& > *": { flex: "auto" },
            }}
          >
            <Link href="/login">
              <Button
                size="lg"
                style={{ maxWidth: "200px", background: "#408001" }}
                endDecorator={
                  <ArrowForward
                    fontSize="medium"
                    // onclick={() => router.push("/login")}
                  />
                }
              >
                Get Started
              </Button>
            </Link>
          </Box>

          <Box
            sx={(theme) => ({
              display: "flex",
              textAlign: "center",
              alignSelf: "stretch",
              columnGap: 4.5,
              "& > *": {
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                flex: 1,
              },
              [theme.breakpoints.up(834)]: {
                textAlign: "left",
                "& > *": {
                  flexDirection: "row",
                  gap: 1.5,
                  justifyContent: "initial",
                  flexWrap: "nowrap",
                  flex: "none",
                },
              },
            })}
          >
            <div>
              <Typography
                endDecorator={
                  <Star fontSize="medium" sx={{ color: "warning.300" }} />
                }
                sx={{ fontSize: "xl4", fontWeight: "lg" }}
              >
                4.9
              </Typography>
              <Typography textColor="text.secondary">
                Over <b>5k</b> positive <br /> customer reviews.
              </Typography>
            </div>
            <div>
              <Typography sx={{ fontSize: "xl4", fontWeight: "lg" }}>
                200k
              </Typography>
              <Typography textColor="text.secondary">
                Global <br /> Users.
              </Typography>
            </div>
          </Box>
        </Box>
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            flexGrow: 1,
            padding: "2rem",
            transform: `scale(1.5) rotate(${rotation}deg)`,
            transition: `transform 0.2s ease-out`,
          }}
        >
          <Image
            src={bowl}
            alt="Food bowl"
            width={320}
            height={320}
            style={{
              maxWidth: "20rem",
              height: "auto",
            }}
          />
        </Box>
      </Sheet>

      <Sheet id="services" sx={{ margin: "1rem" }}>
        <div
          style={{
            height: "6rem",
            width: "100%",
          }}
        ></div>
        <Grid container spacing={2}>
          <Feature
            icon={<PersonSearchOutlinedIcon sx={{ color: "#408001" }} />}
            title={"Find Your Perfect Nutritionist"}
            desc="Browse a diverse network of qualified and certified nutritionists
            specializing in various dietary needs and health goals."
          />
          <Feature
            icon={<AssignmentOutlinedIcon sx={{ color: "#408001" }} />}
            title={"Personalized Nutrition Plans"}
            desc="Receive tailored meal plans, recipes, and lifestyle guidance
                  designed to help you achieve your specific health
                  objectives."
          />
          <Feature
            icon={<EventAvailableOutlinedIcon sx={{ color: "#408001" }} />}
            title={"Easy Online Booking"}
            desc="Schedule consultations and appointments with your chosen
                  nutritionist quickly and conveniently, all from one
                  platform."
          />
          <Feature
            icon={<PersonOutlineOutlinedIcon sx={{ color: "#408001" }} />}
            title={"Nutritionist Profiles"}
            desc="Detailed profiles for each nutritionist, including their
                  qualifications, experience, areas of expertise, approach to
                  nutrition, photos, and potentially videos."
          />
          <Feature
            icon={<AccountBoxOutlinedIcon sx={{ color: "#408001" }} />}
            title={"User Profiles"}
            desc="Personalized profiles for users to manage their information,
                  track progress, and store relevant health data."
          />
          <Feature
            icon={<StarOutlineOutlinedIcon sx={{ color: "#408001" }} />}
            title={"Trusted Reviews & Ratings"}
            desc="Read genuine reviews and ratings from other users to find
                  the best nutritionist for your needs."
          />
        </Grid>
        <div style={{ height: "6rem", width: "100%" }}></div>
      </Sheet>

      <Sheet id="contact" sx={{ padding: "1rem" }}>
        <div style={{ height: "6rem", width: "100%" }}></div>
        <Container
          maxWidth={false}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "auto",
            width: "100%",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
            border: "2px solid rgba(0, 0, 0, 0.1)",
            borderRadius: "1rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: { md: "space-between", xs: "center" },
              alignItems: { ms: "center", xs: "space-between" },
              padding: "1rem",
              gap: "4rem",
              width: "auto",
              margin: "auto",
            }}
          >
            <LeftContainer />
            <SideInputs />
          </Box>
        </Container>
      </Sheet>
    </Sheet>
  );
};

export default WelcomePage;
