'use client';

import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DownloadCloud, Loader2, Sparkles } from 'lucide-react';
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">TikTok URL</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative">
                      <Input
                        placeholder="https://www.tiktok.com/@user/video/..."
                        {...field}
                        className="h-14 pl-6 pr-36 text-lg bg-card border-transparent shadow-xl focus-visible:ring-2 focus-visible:ring-primary/50"
                      />
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="absolute top-1.5 right-1.5 h-11 px-6 shadow-md transition-all hover:scale-105 active:scale-95"
                      >
                        {isLoading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Sparkles className="h-5 w-5" />
                        )}
                        <span className="ml-2 font-semibold hidden sm:inline">{t('form.button')}</span>
                      </Button>
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="text-center font-medium" />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </motion.div>
  );
};
