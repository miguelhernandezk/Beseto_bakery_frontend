import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { verify } from '../services/auth';
import { VerificationRta } from '../interfaces/Responses';
import { signIn, useSession } from 'next-auth/react';

export default function SignIn() {
  const router = useRouter();
  const { status } = useSession();

  /**
   *  Displays a success message if everything went right after logged in
   */
  const notifySuccess = (msg = 'Tarea realizada exitosamente') =>
    toast.success(msg);

  /**
   * Displays an error message if something went wrong
   * @param {JSX.Element} msg - Message to be displayed
   */
  const notifyError = (msg = 'Oops, something went wrong') => toast.error(msg);

  const onVerifyEmail = async (code: string) => {
    const userVerifiedResponse = await verify(code);
    if (userVerifiedResponse.error) {
      notifyError('No pudimos verificar');
    } else {
      const userVerified: VerificationRta = userVerifiedResponse.data;
      if (userVerified.alreadyVerified)
        notifySuccess('Correo previamente verificado.');
      else notifySuccess('Correo verificado exitosamente.');
      signIn(undefined, { callbackUrl: '/' });
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated' && typeof router.query.code === 'string') {
      onVerifyEmail(router.query.code);
    } else if (status === 'authenticated') {
      router.push('/');
    }
  }, [router, status]);

  return (
    <>
      <Head>
        <title>Verify Your account</title>
      </Head>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
      />
    </>
  );
}
