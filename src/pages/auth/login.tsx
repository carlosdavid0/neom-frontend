import BgLogin from '@/assets/bg-login.svg';
import LogoSVG from '@/assets/svgs/Logo';
import TypoSVG from '@/assets/svgs/Typo';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { LockIcon, MailIcon } from 'lucide-react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
});

type FormValues = z.infer<typeof schema>;

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormValues) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(data);
  }

  return (
    <main
      style={{
        height: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
        backgroundImage: `url(${BgLogin})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <section className='flex justify-center items-center h-full w-full flex-col gap-5'>
        <div className='flex items-center gap-2'>
          <LogoSVG fill='white'  />
          <TypoSVG fill='white' />
        </div>
        <Card className='w-full max-w-md'>
          <form className='flex flex-col space-y-5 p-10' onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register('email')}
              errorMessage={errors.email?.message}
              leftIcon={<MailIcon className='h-5 w-5 text-gray-500' />}
              type='email'
              id='email'
              className='input'
              placeholder='E-Mail'
            />

            <Input
              {...register('password')}
              errorMessage={errors.password?.message}
              type='password'
              id='password'
              placeholder='Senha'
              className='input'
              leftIcon={<LockIcon className='h-5 w-5 text-gray-500' />}
            />

            <div className='flex items-center justify-between'>
              <Button variant={'link'} className='p-0 font-normal'>
                {' '}
                Esqueceu sua senha?
              </Button>
              <Button disabled={isSubmitting} type='submit'>
                Entrar
              </Button>
            </div>
          </form>
        </Card>
      </section>
    </main>
  );
}

export default Login;
