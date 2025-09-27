'use client';

import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DownloadCloud, Loader2 } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface InputFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export const InputForm: FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const { t } = useLanguage();
  
  const FormSchema = z.object({
    url: z.string().url({ message: t('form.error.url') }).regex(/tiktok\.com/, {
      message: t('form.error.tiktokUrl'),
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: '',
    },
  });

  function handleFormSubmit(data: z.infer<typeof FormSchema>) {
    onSubmit(data.url);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">TikTok URL</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    placeholder="https://www.tiktok.com/@user/video/12345..." 
                    {...field} 
                    className="h-12 pl-4 pr-32 text-base"
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="absolute top-1/2 right-2 -translate-y-1/2"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <DownloadCloud className="h-5 w-5" />
                    )}
                    <span className="ml-2 hidden sm:inline">{t('form.button')}</span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
