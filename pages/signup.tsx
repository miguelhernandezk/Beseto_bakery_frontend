import { DateValidationError } from '@mui/x-date-pickers';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { useSession } from 'next-auth/react';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Head from 'next/head';
import {
  Avatar,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  SelectChangeEvent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Container } from '@mui/system';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Role } from '../interfaces/Enums';
import { createUser } from '../services/users';
import { CreateUserDto } from '../interfaces/dtos/User.dto';

export default function SignIn() {
  const { data: session } = useSession();
  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [privileges, setPrivileges] = useState<
    'can add roles' | 'cannot add roles'
  >('can add roles');
  const [newUserRole, setNewUserRole] = useState<Role>(Role.CUSTOMER);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password1, setPassword1] = useState<string>();
  const [password2, setPassword2] = useState<string>();
  const [alertMessagePassword, setAlertMessagePassword] = useState<string>();
  const [alertMessageDate, setAlertMessageDate] = useState<string>();
  const [alertMessageForm, setAlertMessageForm] = useState<string>();
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [errorDate, setErrorDate] = useState<boolean>(false);

  /**
   *  Displays a success message if everything went right after logged in
   */
  const notifySuccess = (msg = 'Tarea realizada exitosamente') =>
    toast.success(msg);

  const onSetUserPrivileges = async () => {
    if (session) {
      if (
        session.user.role === 'admin' ||
        session.user.role === 'editor' ||
        session.user.role === 'superuser'
      )
        setPrivileges('can add roles');
    } else {
      setPrivileges('cannot add roles');
    }
  };

  /**
   * Displays an error message if something went wrong
   * @param {JSX.Element} msg - Message to be displayed
   */
  const notifyError = (msg = 'Oops, something went wrong') => toast.error(msg);

  const handleLoseFocusPassword = () => {
    password1 && password2 && password1 !== password2
      ? setAlertMessagePassword('Las contraseñas no coinciden')
      : setAlertMessagePassword(undefined);
  };

  const handleTypeChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    event.target.id === 'password'
      ? setPassword1(event.target.value)
      : setPassword2(event.target.value);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChangeDate = (newValue: Date | null) => {
    if (newValue) {
      setBirthday(newValue);
      setAlertMessageDate(undefined);
      if (newValue >= new Date(1950, 0, 1)) setErrorDate(false);
    } else {
      setBirthday(null);
      setAlertMessageDate('Por favor ingresa tu fecha de nacimiento');
    }
  };

  const handleErrorDateField = (error: DateValidationError) => {
    error ? setErrorDate(true) : setErrorDate(false);
  };
  const handleChangeNewUserRole = (event: SelectChangeEvent) => {
    setNewUserRole(event.target.value as Role);
  };
  const runValidations = () => {
    if (!birthday) {
      setAlertMessageDate('Por favor ingresa  tu fecha de nacimiento');
      return false;
    }
    if (errorDate) {
      setAlertMessageDate('Por favor verifica  tu fecha de nacimiento');
      return false;
    }
    if (alertMessageDate) return false;
    if (alertMessagePassword) return false;
    return true;
  };

  /**
   *  Gets data from form and connects with API in order to log in
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoadingState(true);
    if (runValidations() && birthday) {
      setAlertMessageForm(undefined);
      const data = new FormData(event.currentTarget);
      const payload: CreateUserDto = {
        name: String(data.get('name')),
        middleName: '',
        lastName: String(data.get('lastName')),
        birthday: birthday,
        role: newUserRole,
        email: String(data.get('email')),
        password: String(data.get('password')),
        phone: String(data.get('phone')),
        cart: [],
      };
      const createdUserResponse = await createUser(payload);
      if (createdUserResponse.error) {
        notifyError('No pudimos completar tu solicitud');
      } else {
        notifySuccess('Usuario creado con éxito');
      }
    } else {
      setAlertMessageForm('Por favor revisa los errores');
    }
    setLoadingState(false);
  };

  useEffect(() => {
    onSetUserPrivileges();
  }, [session]);

  return (
    <>
      <Head>
        <title>Crear cuenta - Beseto</title>
      </Head>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
      />

      <>
        <Container className="w-full h-screen flex flex-col items-center justify-center text-center home">
          <Box className={`flex flex-col items-center`}>
            <Avatar className="">
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Registro
            </Typography>
            <Box className="" component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Dirección de correo"
                name="email"
                autoComplete="email"
                autoFocus
                disabled={loadingState}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                disabled={loadingState}
                onBlur={handleLoseFocusPassword}
                onChange={handleTypeChangePassword}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="RepeatedPassword"
                label="Repite tu contraseña"
                type={showPassword ? 'text' : 'password'}
                id="repeatedPassword"
                autoComplete="repeatedPassword"
                disabled={loadingState}
                onBlur={handleLoseFocusPassword}
                onChange={handleTypeChangePassword}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  ),
                }}
              />
              {alertMessagePassword && (
                <Typography sx={{ color: 'red' }}>
                  {alertMessagePassword}
                </Typography>
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                name="name"
                label="Nombre"
                type="name"
                id="name"
                autoComplete="current-name"
                disabled={loadingState}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="lastName"
                label="Apellído"
                type="lastName"
                id="lastName"
                autoComplete="current-lastName"
                disabled={loadingState}
              />

              <DatePicker
                disableFuture
                label="Fecha de nacimiento"
                value={birthday}
                onChange={handleChangeDate}
                format="dd-MM-yyyy"
                minDate={new Date(1950, 0, 1)}
                onError={handleErrorDateField}
              />
              {alertMessageDate && (
                <Typography sx={{ color: 'red' }}>
                  {alertMessageDate}
                </Typography>
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                name="phone"
                label="Teléfono"
                type="number"
                id="phone"
                autoComplete="current-phone"
                disabled={loadingState}
              />
              {privileges === 'can add roles' && (
                <FormControl>
                  <InputLabel id="fill-label">Rol de usuario</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    value={newUserRole}
                    label="Rol de usuario"
                    onChange={handleChangeNewUserRole}
                  >
                    <MenuItem value="admin">Administrador</MenuItem>
                    <MenuItem value="editor">Editor</MenuItem>
                    <MenuItem value="customer">Cliente</MenuItem>
                    <MenuItem value="superuser">Superusuario</MenuItem>
                  </Select>
                  <FormHelperText>
                    Función que tendrá la persona. Este campo solo es visible
                    para superusuarios y administradores
                  </FormHelperText>
                </FormControl>
              )}
              {alertMessageForm && (
                <Typography sx={{ color: 'red' }}>
                  {alertMessageForm}
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loadingState}
              >
                Crear cuenta
              </Button>
            </Box>
          </Box>
        </Container>
      </>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<object> = async (
  context
) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (
    session &&
    (session.user.role === 'customer' || session.user.role === 'editor')
  ) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
};
