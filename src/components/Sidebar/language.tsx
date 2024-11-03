'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const languages = [
  {
    value: 'en',
    label: 'English',
    flag: 'US',
  },
  {
    value: 'pt',
    label: 'Portuguese',
    flag: 'BR',
  },
  {
    value: 'it',
    label: 'Italian',
    flag: 'IT',
  },
  {
    value: 'nl',
    label: 'Dutch',
    flag: 'NL',
  },
];

export default function LanguageSelector() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('en');

  const selectedLanguage = languages.find((lang) => lang.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full min-w-[200px] justify-between'
        >
          <div className='flex items-center'>
            {selectedLanguage && (
              <img
                src={`https://flagsapi.com/${selectedLanguage.flag}/flat/24.png`}
                width={24}
                height={24}
                alt={`${selectedLanguage.label} flag`}
                className='mr-2 h-4 w-auto'
              />
            )}
            {selectedLanguage ? selectedLanguage.label : 'Select language...'}
          </div>
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandInput placeholder='Search language...' />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {languages.map((language) => (
                <CommandItem
                  key={language.value}
                  value={language.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  <div className='flex items-center'>
                    <img
                      src={`https://flagsapi.com/${language.flag}/flat/24.png`}
                      width={24}
                      height={24}
                      alt={`${language.label} flag`}
                      className='mr-2 h-4 w-auto'
                    />
                    {language.label}
                  </div>
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      value === language.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
