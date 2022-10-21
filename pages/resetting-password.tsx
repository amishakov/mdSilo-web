import { FormEvent, useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { toast } from 'react-toastify';
import LogoWithText from 'components/LogoWithText';
import MainView from 'components/landing/MainView';
import apiClient from 'api/apiClient';

export default function ResettingPassword() {
  const [hash, setHash] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);

  useEffect(() => {
    setHash(window.location.hash);
  }, []);

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!hash) {
        toast.error('Invalid access token or type');
        return;
      }

      // Format is #access_token=x&refresh_token=y&expires_in=z&token_type=bearer&type=recovery
      const hashArr = hash
        .substring(1)
        .split('&')
        .map((param) => param.split('='));

      let type;
      let accessToken;
      for (const [key, value] of hashArr) {
        if (key === 'type') {
          type = value;
        } else if (key === 'access_token') {
          accessToken = value;
        }
      }

      if (
        type !== 'recovery' ||
        !accessToken ||
        typeof accessToken === 'object'
      ) {
        toast.error('Invalid access token or type');
        return;
      }

      setIsLoading(true);

      const { error } = await apiClient.auth.api.updateUser(accessToken, {
        password: newPassword,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setShowConfirmationMessage(true);
      }

      setIsLoading(false);
    },
    [newPassword, hash]
  );

  return (
    <MainView showNavbar={false} showFooter={false}>
      <Head>
        <title>Reset password | mdSilo</title>
      </Head>
      <div className="min-h-screen">
        <div className="container p-8 md:p-24">
          <div className="flex items-center justify-center mb-6">
            <LogoWithText />
          </div>
          <div className="mx-auto card md:p-12">
            <p className="pb-6 -mt-2 text-xl text-center">
              Reset password
            </p>
            <form onSubmit={onSubmit}>
              <div>
                <label htmlFor="password" className="block text-gray-700">
                  New password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="w-full py-2 mt-2 input"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  required
                />
              </div>
              <button
                className={`w-full mt-6 btn ${
                  isLoading && 'opacity-50 cursor-wait'
                }`}
                disabled={isLoading}
              >
                Set new password
              </button>
              {showConfirmationMessage ? (
                <div className="mt-4 text-primary-500">
                  Your new password has been successfully set.
                </div>
              ) : null}
            </form>
          </div>
          <p className="mt-4 text-sm text-center text-gray-700">
            <Link href="/signin">
              <a className="text-primary-600 hover:text-primary-700">
                Return to sign in
              </a>
            </Link>
          </p>
        </div>
      </div>
    </MainView>
  );
}
