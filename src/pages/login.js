import Layout from 'components/Layout';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
// Let's implement validation in the client site when we click on logging it, refresh the page.
// But what we're going to do is to show error message to the user.
// For this purpose, we are going to use React hook form.
// It's a simple form validation with React Hook.
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getError } from 'utils/error';

export default function LoginScreen() {
  // session hook from nextAuth and get the data and rename to session
  const { data: session } = useSession();

  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    /**
     * If it does exist, it means that user logged in already.
     * So when we do the sign in here automatically sign session that user will get new value.
     */
    if (session?.user) {
      // And then here we need to redirect user to another page.
      router.push(redirect || '/');
    }
  }, [router, session, redirect]);

  const {
    // check onSubmit which accepts params
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const submitHandler = async ({ email, password }) => {
    try {
      // So what we do is to pass email and pass four to the sign in function.
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <Layout title="Login">
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        {/* xl -extra small */}
        <h1 className="mb-4 text-xl">Login</h1>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            // to register email and password in the input boxes.
            // To do that, we use the register function from use form hook, go to the input box.
            {...register('email', {
              required: 'Please enter email',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: 'Please enter valid email',
              },
            })}
            className="w-full"
            id="email"
            autoFocus
          ></input>
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            {...register('password', {
              required: 'Please enter password',
              minLength: { value: 6, message: 'password is more than 5 chars' },
            })}
            className="w-full"
            id="password"
            autoFocus
          ></input>
          {errors.password && (
            <div className="text-red-500 ">{errors.password.message}</div>
          )}
        </div>
        <div className="mb-4 ">
          <button className="primary-button">Login</button>
        </div>
        <div className="mb-4 ">
          Don&apos;t have an account? &nbsp;
          <Link href="register">Register</Link>
        </div>
      </form>
    </Layout>
  );
}
