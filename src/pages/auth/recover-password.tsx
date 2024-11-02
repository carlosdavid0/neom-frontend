import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { MailIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email address'),
});

type FormData = z.infer<typeof schema>;

interface RecoverPasswordModalProps {
  emailByDefault?: string;
}

function RecoverPasswordModal({ emailByDefault }: RecoverPasswordModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: emailByDefault,
    },
  });


  useEffect(() => {
    setValue('email', emailByDefault ?? '');
  }, [emailByDefault, setValue]);


  const [searchParams,setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  const onSubmit = (data: FormData) => {
    console.log(data);
    navigate('/auth/login');
  };


  function closeModal() {
    searchParams.delete('recoverPassword');
    setSearchParams(searchParams);
  }

  const isModalOpen = searchParams.has('recoverPassword');

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Enter your email address and we'll send you instructions to reset your password.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
          <Input
            {...register('email')}
            errorMessage={errors.email?.message}
            leftIcon={<MailIcon className='h-5 w-5 text-gray-500' />}
            type='email'
            className='input'
            placeholder='E-Mail'
          />

          <Button type='submit' className='btn-primary'>
            Send
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default RecoverPasswordModal;
