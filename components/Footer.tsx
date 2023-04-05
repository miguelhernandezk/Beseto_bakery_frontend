import { Box, Typography } from '@mui/material';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';

export default function Footer() {
  return (
    <Box
      component="footer"
      className="bg-beseto-midnight-blue text-white p-4 text-center font-semibold flex flex-col gap-4 items-center justify-between mt-2"
    >
      <Box className="icons-container text-2xl flex gap-4">
        <Typography component="span" variant="inherit">
          <a href="https://www.facebook.com/besetomx">
            <FaFacebookF />
          </a>
        </Typography>
        <Typography component="span" variant="inherit">
          <a href="https://www.instagram.com/besetomx">
            <FaInstagram />
          </a>
        </Typography>
        <Typography component="span" variant="inherit">
          <a href="https://www.tiktok.com/@besetomx">
            <FaTiktok />
          </a>
        </Typography>
      </Box>
      <Box className="footer-text-container text-xs">
        <Typography component="p">Todos los derechos reservados</Typography>
        <Typography component="p">
          © 2022 Copyright - Pastelería Beseto
        </Typography>
      </Box>
    </Box>
  );
}
